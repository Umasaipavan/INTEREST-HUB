import { describe, it, expect } from 'vitest';
import { calculateInterest } from './interest';
import { formatIndianNumber, numberToIndianWords, formatCurrency } from './format';
import { validatePrincipal, validatePercentageRate, validateRupeeAmount, validateDuration } from './validate';

describe('Interest Calculation Logic (Pure Functions)', () => {
  describe('Percentage Mode', () => {
    it('calculates standard simple interest correctly for ₹10,000 @ 12% for 2 years (24 months)', () => {
      const result = calculateInterest({
        type: 'percentage',
        principal: 10000,
        annualRate: 12,
        durationMonths: 24,
      });

      expect(result.principal).toBe(10000);
      expect(result.totalInterest).toBe(2400);
      expect(result.totalAmount).toBe(12400);
      expect(result.monthlyInterest).toBe(100);
      expect(result.effectiveAnnualRate).toBe(12);
      expect(result.steps.length).toBeGreaterThan(0);
      expect(result.equivalentRateInsight).toContain('12% p.a.');
    });

    it('calculates correctly for fractional years (e.g. 6 months @ 10%)', () => {
      const result = calculateInterest({
        type: 'percentage',
        principal: 50000,
        annualRate: 10,
        durationMonths: 6,
      });

      // 50,000 * 10 * 0.5 / 100 = 2,500
      expect(result.totalInterest).toBe(2500);
      expect(result.totalAmount).toBe(52500);
      expect(result.monthlyInterest).toBeCloseTo(2500 / 6);
    });
  });

  describe('Rupees Mode', () => {
    it('calculates rupee interest correctly: ₹10,000 with ₹2 per ₹100 for 12 months', () => {
      const result = calculateInterest({
        type: 'rupees',
        principal: 10000,
        interestAmount: 2,
        base: 100,
        durationMonths: 12,
      });

      // 100 units * ₹2 = ₹200/mo * 12 = ₹2,400
      expect(result.principal).toBe(10000);
      expect(result.monthlyInterest).toBe(200);
      expect(result.totalInterest).toBe(2400);
      expect(result.totalAmount).toBe(12400);
      // Effective annual: (2/100)*100*12 = 24%
      expect(result.effectiveAnnualRate).toBe(24);
      expect(result.equivalentRateInsight).toContain('24% per year');
    });

    it('calculates rupee interest correctly with base ₹1,000', () => {
      const result = calculateInterest({
        type: 'rupees',
        principal: 50000,
        interestAmount: 20, // ₹20 per ₹1000
        base: 1000,
        durationMonths: 6,
      });

      // 50 units * 20 = 1000/mo * 6 = 6000
      expect(result.monthlyInterest).toBe(1000);
      expect(result.totalInterest).toBe(6000);
      expect(result.totalAmount).toBe(56000);
      expect(result.effectiveAnnualRate).toBe(24);
    });

    it('calculates rupee interest correctly with base ₹10,000', () => {
      const result = calculateInterest({
        type: 'rupees',
        principal: 100000,
        interestAmount: 150, // ₹150 per ₹10,000 = 1.5% per month = 18% p.a.
        base: 10000,
        durationMonths: 12,
      });

      // 10 units * 150 = 1500/mo * 12 = 18,000
      expect(result.monthlyInterest).toBe(1500);
      expect(result.totalInterest).toBe(18000);
      expect(result.totalAmount).toBe(118000);
      expect(result.effectiveAnnualRate).toBe(18);
    });
  });

  describe('Edge cases (zero, negative, huge, empty values)', () => {
    it('handles zero principal without NaN or throwing', () => {
      const result = calculateInterest({
        type: 'percentage',
        principal: 0,
        annualRate: 10,
        durationMonths: 12,
      });

      expect(result.totalInterest).toBe(0);
      expect(result.totalAmount).toBe(0);
      expect(result.monthlyInterest).toBe(0);
      expect(Number.isNaN(result.totalInterest)).toBe(false);
    });

    it('handles negative principal safely', () => {
      const result = calculateInterest({
        type: 'rupees',
        principal: -5000,
        interestAmount: 2,
        base: 100,
        durationMonths: 12,
      });

      expect(result.totalInterest).toBe(0);
      expect(result.totalAmount).toBe(0);
      expect(Number.isNaN(result.totalInterest)).toBe(false);
    });

    it('handles zero or negative duration safely', () => {
      const result = calculateInterest({
        type: 'percentage',
        principal: 10000,
        annualRate: 12,
        durationMonths: 0,
      });

      expect(result.totalInterest).toBe(0);
      expect(result.monthlyInterest).toBe(0);
    });

    it('handles huge principal without crash (e.g. ₹100 Crore)', () => {
      const hundredCrore = 1000000000;
      const result = calculateInterest({
        type: 'percentage',
        principal: hundredCrore,
        annualRate: 10,
        durationMonths: 12,
      });

      expect(result.totalInterest).toBe(100000000);
      expect(result.totalAmount).toBe(1100000000);
    });
  });

  describe('Indian Number & Currency Formatting', () => {
    it('formats Indian comma groupings correctly', () => {
      expect(formatIndianNumber('100000')).toBe('1,00,000');
      expect(formatIndianNumber('10000000')).toBe('1,00,00,000');
      expect(formatIndianNumber('500')).toBe('500');
      expect(formatIndianNumber('1000')).toBe('1,000');
    });

    it('formats currency correctly', () => {
      expect(formatCurrency(12400)).toBe('₹12,400');
      expect(formatCurrency(100000, true)).toBe('₹1 L');
      expect(formatCurrency(10000000, true)).toBe('₹1 Cr');
    });

    it('converts numbers to Indian words', () => {
      expect(numberToIndianWords(100000)).toBe('One Lakh Rupees');
      expect(numberToIndianWords(50000)).toBe('Fifty Thousand Rupees');
      expect(numberToIndianWords(10000000)).toBe('One Crore Rupees');
      expect(numberToIndianWords(2500)).toBe('Two Thousand Five Hundred Rupees');
    });
  });

  describe('Validation Functions', () => {
    it('validates principal boundaries', () => {
      expect(validatePrincipal('', 0)).toBe('Principal amount is required');
      expect(validatePrincipal('0', 0)).toBe('Principal amount must be greater than ₹0');
      expect(validatePrincipal('-500', -500)).toBe('Amount cannot be negative');
      expect(validatePrincipal('2000000000', 2000000000)).toContain('₹100 Crore');
      expect(validatePrincipal('100000', 100000)).toBeUndefined();
    });

    it('validates percentage rate', () => {
      expect(validatePercentageRate('', 0)).toBe('Interest rate is required');
      expect(validatePercentageRate('0', 0)).toBe('Rate cannot be 0%');
      expect(validatePercentageRate('-2', -2)).toBe('Interest rate cannot be negative');
      expect(validatePercentageRate('250', 250)).toContain('cannot exceed 200%');
      expect(validatePercentageRate('12', 12)).toBeUndefined();
    });

    it('validates rupee amount', () => {
      expect(validateRupeeAmount('', 0)).toBe('Interest amount is required');
      expect(validateRupeeAmount('0', 0)).toBe('Interest amount must be greater than ₹0');
      expect(validateRupeeAmount('2', 2)).toBeUndefined();
    });

    it('validates duration', () => {
      expect(validateDuration('', 0, 'months')).toBe('Duration is required');
      expect(validateDuration('0', 0, 'years')).toContain('at least 1');
      expect(validateDuration('150', 150, 'years')).toContain('100 years');
      expect(validateDuration('12', 12, 'months')).toBeUndefined();
    });
  });
});
