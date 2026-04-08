/**
 * Seed script — creates default admin + sample farmer accounts
 * Run: node src/seed.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Animal = require('./models/Animal');
const MilkRecord = require('./models/MilkRecord');
const VetRecord = require('./models/VetRecord');
const FeedLog = require('./models/FeedLog');
const Product = require('./models/Product');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear all collections
    await Promise.all([
      User.deleteMany({}),
      Animal.deleteMany({}),
      MilkRecord.deleteMany({}),
      VetRecord.deleteMany({}),
      FeedLog.deleteMany({}),
    ]);
    console.log('Collections cleared');

    // Create admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@trackafarm.com',
      password: 'admin123',
      role: 'admin',
      status: 'approved',
      farmName: 'TrackaFarm HQ',
      phone: '9876543210',
    });
    console.log(`✅ Admin created: admin@trackafarm.com / admin123`);

    // Create sample farmer
    const farmer = await User.create({
      name: 'Ravi Kumar',
      email: 'farmer@trackafarm.com',
      password: 'farmer123',
      role: 'farmer',
      status: 'approved',
      farmName: 'Green Meadows Farm',
      phone: '9876543211',
      location: 'Karnataka, India',
    });
    console.log(`✅ Farmer created: farmer@trackafarm.com / farmer123`);

    // Create sample animals
    const breeds = ['Jersey', 'Holstein', 'Gir', 'Sahiwal', 'HF Cross'];
    const statuses = ['Healthy', 'Vaccinated', 'Under Treatment', 'Healthy', 'Healthy'];
    const animals = [];
    for (let i = 0; i < 5; i++) {
      const animal = await Animal.create({
        tagId: `COW${String(i + 1).padStart(3, '0')}`,
        name: `Cow ${i + 1}`,
        breed: breeds[i],
        dob: new Date(`202${i}-01-15`),
        color: ['Black & White', 'Brown', 'Tawny', 'White', 'Grey'][i],
        healthStatus: statuses[i],
        gender: 'Female',
        farmerId: farmer._id,
      });
      animals.push(animal);
    }
    console.log(`✅ ${animals.length} animals created`);

    // Create milk records for last 60 days
    const milkRecords = [];
    for (let day = 59; day >= 0; day--) {
      const date = new Date();
      date.setDate(date.getDate() - day);
      for (const animal of animals) {
        const baseYield = 10 + Math.random() * 8;
        milkRecords.push({
          animalId: animal._id,
          farmerId: farmer._id,
          date,
          quantity: Math.round(baseYield * 10) / 10,
          session: 'Morning',
          pricePerLiter: 35,
        });
        milkRecords.push({
          animalId: animal._id,
          farmerId: farmer._id,
          date,
          quantity: Math.round((baseYield * 0.7) * 10) / 10,
          session: 'Evening',
          pricePerLiter: 35,
        });
      }
    }
    await MilkRecord.insertMany(milkRecords);
    console.log(`✅ ${milkRecords.length} milk records created`);

    // Create vet records
    const vetTypes = ['Vaccination', 'Deworming', 'Checkup'];
    for (const animal of animals) {
      await VetRecord.create({
        animalId: animal._id,
        farmerId: farmer._id,
        type: vetTypes[Math.floor(Math.random() * vetTypes.length)],
        medicine: 'Ivermectin',
        dosage: '10ml',
        cost: 250,
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        nextDueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        veterinarianName: 'Dr. Priya Sharma',
        status: 'Completed',
      });
    }
    console.log(`✅ Vet records created`);

    // Create feed logs
    const feedTypes = ['Silage', 'Hay', 'Dairy Meal', 'Concentrate'];
    for (const animal of animals) {
      for (let day = 0; day < 7; day++) {
        const date = new Date();
        date.setDate(date.getDate() - day);
        await FeedLog.create({
          animalId: animal._id,
          farmerId: farmer._id,
          feedType: feedTypes[Math.floor(Math.random() * feedTypes.length)],
          feedQuantityKg: 5 + Math.random() * 5,
          waterLiters: 30 + Math.random() * 20,
          cost: 50 + Math.random() * 50,
          date,
        });
      }
    }
    console.log(`✅ Feed logs created`);

    // Create seller
    const seller = await User.create({
      name: 'Agri Supplies Co.',
      email: 'seller@trackafarm.com',
      password: 'seller123',
      role: 'seller',
      status: 'approved',
      farmName: 'Agri Supplies Co.',
      phone: '9876543213',
    });
    console.log(`✅ Seller created: seller@trackafarm.com / seller123`);

    // Create products
    await Product.deleteMany({});
    
    // Core templates to randomize from
    const categories = ['Agriculture', 'Animal Husbandry', 'Farm Equipment', 'Fertilizers', 'Seeds'];
    const subcategoriesMap = {
      'Agriculture': ['Pesticides', 'Herbicides', 'Soil Enhancers'],
      'Animal Husbandry': ['Feed', 'Supplements', 'Veterinary Supplies', 'Dairy Equipment'],
      'Farm Equipment': ['Hand Tools', 'Machinery Attachments', 'Irrigation'],
      'Fertilizers': ['Organic', 'Chemical', 'Liquid'],
      'Seeds': ['Vegetables', 'Fruits', 'Grains']
    };
    const imagesMap = {
      'Agriculture': 'https://images.unsplash.com/photo-1592982537447-6f2c3c13ebd2?auto=format&fit=crop&q=80&w=700',
      'Animal Husbandry': 'https://images.unsplash.com/photo-1596434451740-4965cbdab4c4?auto=format&fit=crop&q=80&w=700',
      'Farm Equipment': 'https://images.unsplash.com/photo-1416879598555-081837136015?auto=format&fit=crop&q=80&w=700',
      'Fertilizers': 'https://images.unsplash.com/photo-1628183236082-8bcfe021fd8e?auto=format&fit=crop&q=80&w=700',
      'Seeds': 'https://images.unsplash.com/photo-1586208958839-06c17cacdf08?auto=format&fit=crop&q=80&w=700'
    };
    const adjectiveList = ['Premium', 'Organic', 'High-Yield', 'Durable', 'Professional', 'Eco-Friendly', 'Heavy Duty', 'Essential', 'Advanced', 'Nutrient-Rich'];
    const brandList = ['AgriPro', 'GreenEarth', 'NutriBull', 'FarmTools', 'EcoHarvest', 'GrowBetter', 'DairyTech', 'SunSeed'];

    const products = [];
    for (let i = 1; i <= 100; i++) {
        const cat = categories[Math.floor(Math.random() * categories.length)];
        const subCatList = subcategoriesMap[cat];
        const subcategory = subCatList[Math.floor(Math.random() * subCatList.length)];
        const brand = brandList[Math.floor(Math.random() * brandList.length)];
        const adj = adjectiveList[Math.floor(Math.random() * adjectiveList.length)];
        
        products.push({
            seller: seller._id,
            name: `${adj} ${subcategory} Supply V${Math.floor(Math.random()*100)}`,
            image: imagesMap[cat],
            brand: brand,
            category: cat,
            subcategory: subcategory,
            description: `This is a high quality ${cat.toLowerCase()} product. Essential for modern farming and guaranteed to improve results.`,
            price: Number((Math.random() * 100 + 5).toFixed(2)),
            countInStock: Math.floor(Math.random() * 500) + 10,
            rating: Number((Math.random() * 2 + 3).toFixed(1)), // between 3.0 and 5.0
            numReviews: Math.floor(Math.random() * 200)
        });
    }

    await Product.insertMany(products);
    console.log(`✅ ${products.length} products created`);

    // Create pending farmer for demo
    await User.create({
      name: 'Suresh Patil',
      email: 'pending@trackafarm.com',
      password: 'pending123',
      role: 'farmer',
      status: 'pending',
      farmName: 'Sunrise Dairy',
      phone: '9876543212',
    });
    console.log(`✅ Pending farmer created: pending@trackafarm.com`);

    console.log('\n🌱 Seed complete!');
    console.log('  Admin:   admin@trackafarm.com / admin123');
    console.log('  Farmer:  farmer@trackafarm.com / farmer123');
    console.log('  Pending: pending@trackafarm.com / pending123 (needs approval)');

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
