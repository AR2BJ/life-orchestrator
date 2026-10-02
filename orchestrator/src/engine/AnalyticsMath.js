/**
 * @file AnalyticsMath.js
 * @description Advanced mathematical, statistical, and telemetry analytical engine.
 * Serves as the core computational base for evaluating all 26 Behavioral & Strategic Principles.
 */

export const AnalyticsMath = {
  /**
   * Sums an array of numbers safely.
   * @param {number[]} values
   * @returns {number}
   */
  sum(values) {
    if (!Array.isArray(values) || values.length === 0) return 0;
    return values.reduce((acc, val) => acc + (Number(val) || 0), 0);
  },

  /**
   * Calculates the arithmetic mean.
   * @param {number[]} values
   * @returns {number}
   */
  mean(values) {
    if (!Array.isArray(values) || values.length === 0) return 0;
    return this.sum(values) / values.length;
  },

  /**
   * Calculates population variance.
   * @param {number[]} values
   * @returns {number}
   */
  variance(values) {
    if (!Array.isArray(values) || values.length < 2) return 0;
    const avg = this.mean(values);
    const squareDiffs = values.map((val) =>
      Math.pow((Number(val) || 0) - avg, 2),
    );
    return this.sum(squareDiffs) / values.length;
  },

  /**
   * Calculates standard deviation.
   * @param {number[]} values
   * @returns {number}
   */
  standardDeviation(values) {
    return Math.sqrt(this.variance(values));
  },

  /**
   * Coefficient of Variation (CV = SD / Mean * 100)
   * Measures dispersion independent of scale.
   * @param {number[]} values
   * @returns {number}
   */
  coefficientOfVariation(values) {
    const avg = this.mean(values);
    if (avg === 0) return 0;
    const sd = this.standardDeviation(values);
    return Number(((sd / avg) * 100).toFixed(2));
  },

  /**
   * Calculates Median Value.
   * @param {number[]} values
   * @returns {number}
   */
  median(values) {
    if (!Array.isArray(values) || values.length === 0) return 0;
    const sorted = [...values].map(Number).sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;
  },

  /**
   * Calculates Interquartile Range (IQR = Q3 - Q1) and identifies outliers.
   * @param {number[]} values
   * @returns {{ q1: number, q3: number, iqr: number, outliers: number[] }}
   */
  iqrAnalysis(values) {
    if (!Array.isArray(values) || values.length < 4) {
      return { q1: 0, q3: 0, iqr: 0, outliers: [] };
    }
    const sorted = [...values].map(Number).sort((a, b) => a - b);
    const q1 = this.median(sorted.slice(0, Math.floor(sorted.length / 2)));
    const q3 = this.median(sorted.slice(Math.ceil(sorted.length / 2)));
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    const outliers = sorted.filter((v) => v < lowerBound || v > upperBound);
    return { q1, q3, iqr, outliers };
  },

  /**
   * Pearson Product-Moment Correlation Coefficient (r)
   * Range: [-1.0, +1.0]
   * @param {number[]} xValues
   * @param {number[]} yValues
   * @returns {number}
   */
  pearsonCorrelation(xValues, yValues) {
    const n = Math.min(xValues.length, yValues.length);
    if (n < 2) return 0;

    const meanX = this.mean(xValues.slice(0, n));
    const meanY = this.mean(yValues.slice(0, n));

    let num = 0;
    let denX = 0;
    let denY = 0;

    for (let i = 0; i < n; i++) {
      const xDiff = (Number(xValues[i]) || 0) - meanX;
      const yDiff = (Number(yValues[i]) || 0) - meanY;
      num += xDiff * yDiff;
      denX += xDiff * xDiff;
      denY += yDiff * yDiff;
    }

    const denominator = Math.sqrt(denX * denY);
    if (denominator === 0) return 0;
    return Number((num / denominator).toFixed(3));
  },

  /**
   * Ordinary Least Squares (OLS) Linear Regression
   * Returns y = mx + b and R^2 metric.
   * @param {number[]} yValues
   * @returns {{ slope: number, intercept: number, r2: number }}
   */
  linearRegression(yValues) {
    const n = yValues.length;
    if (n < 2) return { slope: 0, intercept: this.mean(yValues), r2: 0 };

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;
    let sumYY = 0;

    for (let x = 0; x < n; x++) {
      const y = Number(yValues[x]) || 0;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
      sumYY += y * y;
    }

    const denominator = n * sumXX - sumX * sumX;
    if (denominator === 0) return { slope: 0, intercept: sumY / n, r2: 0 };

    const slope = (n * sumXY - sumX * sumY) / denominator;
    const intercept = (sumY - slope * sumX) / n;

    const yMean = sumY / n;
    let ssTot = 0;
    let ssRes = 0;

    for (let x = 0; x < n; x++) {
      const y = Number(yValues[x]) || 0;
      const yPred = slope * x + intercept;
      ssTot += Math.pow(y - yMean, 2);
      ssRes += Math.pow(y - yPred, 2);
    }

    const r2 = ssTot === 0 ? 1 : Math.max(0, 1 - ssRes / ssTot);

    return {
      slope: Number(slope.toFixed(4)),
      intercept: Number(intercept.toFixed(4)),
      r2: Number(r2.toFixed(4)),
    };
  },

  /**
   * Exponential Weighted Moving Average (EWMA)
   * Smooths volatile time-series data.
   * @param {number[]} values
   * @param {number} alpha Smoothing factor [0..1]
   * @returns {number[]}
   */
  ewma(values, alpha = 0.3) {
    if (!Array.isArray(values) || values.length === 0) return [];
    const smoothed = [Number(values[0]) || 0];

    for (let i = 1; i < values.length; i++) {
      const prev = smoothed[i - 1];
      const curr = Number(values[i]) || 0;
      const next = alpha * curr + (1 - alpha) * prev;
      smoothed.push(Number(next.toFixed(2)));
    }

    return smoothed;
  },

  /**
   * Z-Score Normalization
   * @param {number[]} values
   * @returns {number[]}
   */
  zScoreNormalize(values) {
    if (!Array.isArray(values) || values.length === 0) return [];
    const mean = this.mean(values);
    const sd = this.standardDeviation(values);
    if (sd === 0) return values.map(() => 0);

    return values.map((val) =>
      Number((((Number(val) || 0) - mean) / sd).toFixed(3)),
    );
  },

  /**
   * Min-Max Normalization (Rescale to [minBound, maxBound])
   * @param {number[]} values
   * @param {number} minBound
   * @param {number} maxBound
   * @returns {number[]}
   */
  minMaxScale(values, minBound = 0, maxBound = 100) {
    if (!Array.isArray(values) || values.length === 0) return [];
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal;

    if (range === 0) return values.map(() => minBound);

    return values.map((val) => {
      const normalized = (val - minVal) / range;
      const scaled = minBound + normalized * (maxBound - minBound);
      return Number(scaled.toFixed(2));
    });
  },
};
