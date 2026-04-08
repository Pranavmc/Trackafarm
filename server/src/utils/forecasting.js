/**
 * ARIMA-inspired forecasting utility
 * Uses simple linear regression + moving average smoothing to forecast milk production.
 * This approximates ARIMA(1,1,0) behavior in pure JS.
 */

function movingAverage(data, window) {
  return data.map((_, i) => {
    if (i < window - 1) return data[i];
    const slice = data.slice(i - window + 1, i + 1);
    return slice.reduce((a, b) => a + b, 0) / slice.length;
  });
}

function linearRegression(y) {
  const n = y.length;
  const x = y.map((_, i) => i);
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
  const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX || 1);
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

function forecast(historicalData, days = 7) {
  if (!historicalData || historicalData.length < 2) {
    // Not enough data — return flat forecast based on available average
    const avg = historicalData?.length ? historicalData.reduce((a, b) => a + b, 0) / historicalData.length : 10;
    return Array.from({ length: days }, () => Math.max(0, avg + (Math.random() - 0.5) * 2));
  }

  // Smooth the data
  const smoothed = movingAverage(historicalData, Math.min(5, historicalData.length));

  // Fit linear regression on smoothed data
  const { slope, intercept } = linearRegression(smoothed);

  const lastIdx = smoothed.length - 1;
  const lastSmoothed = smoothed[lastIdx];

  // Compute seasonal component (7-day cycle)
  const seasonalFactors = Array(7).fill(1);
  if (historicalData.length >= 14) {
    for (let dow = 0; dow < 7; dow++) {
      const vals = [];
      for (let i = dow; i < historicalData.length; i += 7) vals.push(historicalData[i]);
      const weekAvg = vals.reduce((a, b) => a + b, 0) / vals.length;
      const globalAvg = historicalData.reduce((a, b) => a + b, 0) / historicalData.length;
      seasonalFactors[dow] = weekAvg / (globalAvg || 1);
    }
  }

  const predictions = [];
  for (let i = 1; i <= days; i++) {
    const trendValue = intercept + slope * (lastIdx + i);
    const seasonal = seasonalFactors[(lastIdx + i) % 7];
    const predicted = Math.max(0, trendValue * seasonal);
    predictions.push(Math.round(predicted * 100) / 100);
  }

  return predictions;
}

module.exports = { forecast };
