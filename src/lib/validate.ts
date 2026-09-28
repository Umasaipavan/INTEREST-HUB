/**
 * Form validation rules for financial inputs.
 */

export interface ValidationErrors {
  principal?: string;
  interestRate?: string;
  interestAmount?: string;
  duration?: string;
}

export const LIMITS = {
  MAX_PRINCIPAL: 1000000000, // ₹100 Crore
  MAX_PERCENT_RATE: 200,      // 200% p.a.
  MAX_RUPEE_AMOUNT: 1000,     // ₹1,000 per base
  MAX_DURATION_YEARS: 100,    // 100 years
  MAX_DURATION_MONTHS: 1200,  // 100 years = 1200 months
};

export function validatePrincipal(raw: string, num: number): string | undefined {
  const trimmed = raw.trim();
  if (!trimmed) {
    return 'Principal amount is required';
  }
  if (num < 0) {
    return 'Amount cannot be negative';
  }
  if (num === 0) {
    return 'Principal amount must be greater than ₹0';
  }
  if (num > LIMITS.MAX_PRINCIPAL) {
    return 'Amount exceeds maximum limit of ₹100 Crore';
  }
  return undefined;
}

export function validatePercentageRate(raw: string, num: number): string | undefined {
  const trimmed = raw.trim();
  if (!trimmed) {
    return 'Interest rate is required';
  }
  if (num < 0) {
    return 'Interest rate cannot be negative';
  }
  if (num === 0) {
    return 'Rate cannot be 0%';
  }
  if (num > LIMITS.MAX_PERCENT_RATE) {
    return `Interest rate cannot exceed ${LIMITS.MAX_PERCENT_RATE}% p.a.`;
  }
  return undefined;
}

export function validateRupeeAmount(raw: string, num: number): string | undefined {
  const trimmed = raw.trim();
  if (!trimmed) {
    return 'Interest amount is required';
  }
  if (num < 0) {
    return 'Interest amount cannot be negative';
  }
  if (num === 0) {
    return 'Interest amount must be greater than ₹0';
  }
  if (num > LIMITS.MAX_RUPEE_AMOUNT) {
    return `Interest cannot exceed ₹${LIMITS.MAX_RUPEE_AMOUNT}`;
  }
  return undefined;
}

export function validateDuration(raw: string, num: number, unit: 'months' | 'years'): string | undefined {
  const trimmed = raw.trim();
  if (!trimmed) {
    return 'Duration is required';
  }
  if (num <= 0) {
    return `Duration must be at least 1 ${unit === 'years' ? 'year' : 'month'}`;
  }
  if (unit === 'years' && num > LIMITS.MAX_DURATION_YEARS) {
    return `Duration cannot exceed ${LIMITS.MAX_DURATION_YEARS} years`;
  }
  if (unit === 'months' && num > LIMITS.MAX_DURATION_MONTHS) {
    return `Duration cannot exceed ${LIMITS.MAX_DURATION_MONTHS} months (100 years)`;
  }
  return undefined;
}
