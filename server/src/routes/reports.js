const express = require('express');
const router = express.Router();
const MilkRecord = require('../models/MilkRecord');
const Animal = require('../models/Animal');
const VetRecord = require('../models/VetRecord');
const FeedLog = require('../models/FeedLog');
const { protect, requireApproved, requireRole } = require('../middleware/auth');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

const auth = [protect, requireApproved];

// Helper
const getFilterDates = (startDate, endDate) => {
  const filter = {};
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(new Date(endDate).setHours(23, 59, 59));
  }
  return filter;
};

// GET /api/reports/pdf
router.get('/pdf', ...auth, async (req, res) => {
  try {
    const { type = 'milk', startDate, endDate, animalId } = req.query;
    const baseFilter = { farmerId: req.user._id, ...getFilterDates(startDate, endDate) };
    if (animalId) baseFilter.animalId = animalId;

    let data = [];
    let title = '';

    if (type === 'milk') {
      data = await MilkRecord.find(baseFilter).populate('animalId', 'tagId name').sort({ date: -1 }).limit(200);
      title = 'Milk Production Report';
    } else if (type === 'vet') {
      data = await VetRecord.find(baseFilter).populate('animalId', 'tagId name').sort({ date: -1 }).limit(200);
      title = 'Veterinary Records Report';
    } else if (type === 'feed') {
      data = await FeedLog.find(baseFilter).populate('animalId', 'tagId name').sort({ date: -1 }).limit(200);
      title = 'Feed & Water Log Report';
    }

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${type}_report.pdf"`);
    doc.pipe(res);

    // Header
    doc.fontSize(22).fillColor('#2E7D32').text('TrackaFarm', { align: 'center' });
    doc.fontSize(14).fillColor('#333').text(title, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor('#666').text(`Farmer: ${req.user.name} | Farm: ${req.user.farmName || 'N/A'}`, { align: 'center' });
    doc.text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown(1);

    // Table header styles
    const col = type === 'milk'
      ? ['Animal', 'Date', 'Session', 'Qty (L)', 'Price/L']
      : type === 'vet'
      ? ['Animal', 'Date', 'Type', 'Medicine', 'Next Due']
      : ['Animal', 'Date', 'Feed Type', 'Qty (kg)', 'Water (L)'];

    doc.fontSize(10).fillColor('#fff');
    let y = doc.y;
    doc.rect(40, y, 520, 18).fill('#2E7D32');
    col.forEach((h, i) => doc.fillColor('#fff').text(h, 48 + i * 104, y + 4, { width: 100 }));
    doc.moveDown(0.1);

    let rowColor = false;
    data.forEach((item) => {
      y = doc.y + 2;
      if (y > 700) { doc.addPage(); y = 50; }
      if (rowColor) doc.rect(40, y - 2, 520, 16).fill('#f1f8f1');
      rowColor = !rowColor;

      const cols = type === 'milk'
        ? [item.animalId?.tagId || '-', new Date(item.date).toLocaleDateString(), item.session, item.quantity, item.pricePerLiter]
        : type === 'vet'
        ? [item.animalId?.tagId || '-', new Date(item.date).toLocaleDateString(), item.type, item.medicine || '-', item.nextDueDate ? new Date(item.nextDueDate).toLocaleDateString() : '-']
        : [item.animalId?.tagId || '-', new Date(item.date).toLocaleDateString(), item.feedType, item.feedQuantityKg, item.waterLiters];

      cols.forEach((v, i) => doc.fillColor('#333').fontSize(9).text(String(v), 48 + i * 104, y, { width: 100 }));
      doc.moveDown(0.35);
    });

    doc.moveDown(1);
    doc.fontSize(8).fillColor('#aaa').text('© TrackaFarm — Smart Dairy Management', { align: 'center' });
    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/reports/excel
router.get('/excel', ...auth, async (req, res) => {
  try {
    const { type = 'milk', startDate, endDate, animalId } = req.query;
    const baseFilter = { farmerId: req.user._id, ...getFilterDates(startDate, endDate) };
    if (animalId) baseFilter.animalId = animalId;

    let data = [];
    let sheetName = 'Report';

    if (type === 'milk') {
      data = await MilkRecord.find(baseFilter).populate('animalId', 'tagId name').sort({ date: -1 }).limit(500);
      sheetName = 'Milk Production';
    } else if (type === 'vet') {
      data = await VetRecord.find(baseFilter).populate('animalId', 'tagId name').sort({ date: -1 }).limit(500);
      sheetName = 'Vet Records';
    } else if (type === 'feed') {
      data = await FeedLog.find(baseFilter).populate('animalId', 'tagId name').sort({ date: -1 }).limit(500);
      sheetName = 'Feed Logs';
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'TrackaFarm';
    const sheet = workbook.addWorksheet(sheetName);

    const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2E7D32' } };
    const headerFont = { color: { argb: 'FFFFFFFF' }, bold: true };

    if (type === 'milk') {
      sheet.columns = [
        { header: 'Animal Tag', key: 'tag', width: 15 },
        { header: 'Animal Name', key: 'name', width: 15 },
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Session', key: 'session', width: 12 },
        { header: 'Quantity (L)', key: 'qty', width: 14 },
        { header: 'Price/L', key: 'price', width: 12 },
        { header: 'Revenue', key: 'revenue', width: 14 },
      ];
      data.forEach((r) => sheet.addRow({
        tag: r.animalId?.tagId || '-', name: r.animalId?.name || '-',
        date: new Date(r.date).toLocaleDateString(), session: r.session,
        qty: r.quantity, price: r.pricePerLiter, revenue: r.quantity * r.pricePerLiter,
      }));
    } else if (type === 'vet') {
      sheet.columns = [
        { header: 'Animal Tag', key: 'tag', width: 15 },
        { header: 'Type', key: 'type', width: 14 },
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Medicine', key: 'medicine', width: 18 },
        { header: 'Dosage', key: 'dosage', width: 12 },
        { header: 'Cost', key: 'cost', width: 10 },
        { header: 'Next Due', key: 'next', width: 15 },
        { header: 'Vet Name', key: 'vet', width: 18 },
      ];
      data.forEach((r) => sheet.addRow({
        tag: r.animalId?.tagId || '-', type: r.type,
        date: new Date(r.date).toLocaleDateString(), medicine: r.medicine || '-',
        dosage: r.dosage || '-', cost: r.cost,
        next: r.nextDueDate ? new Date(r.nextDueDate).toLocaleDateString() : '-',
        vet: r.veterinarianName || '-',
      }));
    } else {
      sheet.columns = [
        { header: 'Animal Tag', key: 'tag', width: 15 },
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Feed Type', key: 'type', width: 15 },
        { header: 'Qty (kg)', key: 'qty', width: 12 },
        { header: 'Water (L)', key: 'water', width: 12 },
        { header: 'Cost', key: 'cost', width: 10 },
      ];
      data.forEach((r) => sheet.addRow({
        tag: r.animalId?.tagId || '-', date: new Date(r.date).toLocaleDateString(),
        type: r.feedType, qty: r.feedQuantityKg, water: r.waterLiters, cost: r.cost,
      }));
    }

    // Style header row
    sheet.getRow(1).eachCell((cell) => {
      cell.fill = headerFill;
      cell.font = headerFont;
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${type}_report.xlsx"`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
