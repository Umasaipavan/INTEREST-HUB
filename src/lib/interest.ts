/**
 * Pure interest calculation logic and domain types.
 * Zero UI dependencies.
 */

export type InterestMode = 'percentage' | 'rupees';

export type DurationUnit = 'months' | 'years';

export type RupeeInterestBase = 100 | 1000 | 10000;

export interface BaseInterestParams {
  principal: number;
  durationMonths: number;
}

export interface PercentageInterestParams extends BaseInterestParams {
  type: 'percentage';
  annualRate: number; // in percentage per year (e.g. 12 for 12% p.a.)
}

export interface RupeeInterestParams extends BaseInterestParams {
  type: 'rupees';
  interestAmount: number; // e.g. ₹2
  base: RupeeInterestBase; // e.g. 100, 1000, 10000
}

export type InterestCalculationParams = PercentageInterestParams | RupeeInterestParams;

export interface CalculationStep {
  id: string;
  stepNumber: number;
  title: string;
  formula: string;
  explanation: string;
  resultDisplay: string;
}

export interface CalculationResult {
  principal: number;
  totalInterest: number;
  totalAmount: number;
  monthlyInterest: number;
  durationMonths: number;
  effectiveAnnualRate: number; // e.g. 24%
  effectiveMonthlyRate: number; // e.g. 2%
  principalSharePercent: number; // e.g. 80.65%
  interestSharePercent: number; // e.g. 19.35%
  equivalentRateInsight: string;
  mode: InterestMode;
  steps: CalculationStep[];
}

/**
 * Calculates interest, shares, equivalent rates, and structured breakdown steps.
 */
export function calculateInterest(params: InterestCalculationParams): CalculationResult {
  const { principal, durationMonths } = params;

  // Handle zero or invalid principal/duration safely
  if (principal <= 0 || durationMonths <= 0 || !Number.isFinite(principal) || !Number.isFinite(durationMonths)) {
    return {
      principal: Math.max(0, principal || 0),
      totalInterest: 0,
      totalAmount: Math.max(0, principal || 0),
      monthlyInterest: 0,
      durationMonths: Math.max(0, durationMonths || 0),
      effectiveAnnualRate: 0,
      effectiveMonthlyRate: 0,
      principalSharePercent: 100,
      interestSharePercent: 0,
      equivalentRateInsight: 'Enter values above to see equivalent rate comparison.',
      mode: params.type,
      steps: [],
    };
  }

  if (params.type === 'percentage') {
    const rate = Math.max(0, params.annualRate || 0);
    const years = durationMonths / 12;

    // Standard Simple Interest: (P * R * T) / 100
    const totalInterest = (principal * rate * years) / 100;
    const monthlyInterest = durationMonths > 0 ? totalInterest / durationMonths : 0;
    const totalAmount = principal + totalInterest;

    const effectiveAnnualRate = rate;
    const effectiveMonthlyRate = rate / 12;
    // Equivalent in ₹ per ₹100 per month
    const equivalentRupeePerHundred = effectiveMonthlyRate; // (rate / 12)% of ₹100 is ₹(rate / 12)

    const principalSharePercent = totalAmount > 0 ? (principal / totalAmount) * 100 : 100;
    const interestSharePercent = totalAmount > 0 ? (totalInterest / totalAmount) * 100 : 0;

    const formattedRupeePer100 = equivalentRupeePerHundred % 1 === 0 
      ? equivalentRupeePerHundred.toFixed(0) 
      : equivalentRupeePerHundred.toFixed(2);

    const equivalentRateInsight = `${rate}% p.a. ≈ ₹${formattedRupeePer100} per ₹100 per month`;

    const steps: CalculationStep[] = [
      {
        id: 'principal',
        stepNumber: 1,
        title: 'Principal Amount',
        formula: 'P',
        explanation: 'Initial borrowed / invested amount',
        resultDisplay: `₹${principal.toLocaleString('en-IN')}`,
      },
      {
        id: 'duration',
        stepNumber: 2,
        title: 'Duration Conversion',
        formula: `${durationMonths} months ÷ 12`,
        explanation: 'Converting duration in months to years (T)',
        resultDisplay: `${years % 1 === 0 ? years : years.toFixed(2)} year${years === 1 ? '' : 's'}`,
      },
      {
        id: 'rate',
        stepNumber: 3,
        title: 'Annual Interest Rate',
        formula: `${rate}% p.a.`,
        explanation: 'Interest charged per year',
        resultDisplay: `${rate}% per year`,
      },
      {
        id: 'total_interest',
        stepNumber: 4,
        title: 'Simple Interest Formula',
        formula: `(₹${principal.toLocaleString('en-IN')} × ${rate} × ${years % 1 === 0 ? years : years.toFixed(2)}) ÷ 100`,
        explanation: 'Total interest calculated using I = (P × R × T) / 100',
        resultDisplay: `₹${Math.round(totalInterest).toLocaleString('en-IN')}`,
      },
      {
        id: 'monthly_interest',
        stepNumber: 5,
        title: 'Monthly Interest Cost',
        formula: `₹${Math.round(totalInterest).toLocaleString('en-IN')} ÷ ${durationMonths} months`,
        explanation: 'Interest incurred per calendar month',
        resultDisplay: `₹${Math.round(monthlyInterest).toLocaleString('en-IN')} / month`,
      },
      {
        id: 'total_amount',
        stepNumber: 6,
        title: 'Total Repayment Amount',
        formula: `₹${principal.toLocaleString('en-IN')} + ₹${Math.round(totalInterest).toLocaleString('en-IN')}`,
        explanation: 'Principal + Total Interest',
        resultDisplay: `₹${Math.round(totalAmount).toLocaleString('en-IN')}`,
      },
    ];

    return {
      principal,
      totalInterest,
      totalAmount,
      monthlyInterest,
      durationMonths,
      effectiveAnnualRate,
      effectiveMonthlyRate,
      principalSharePercent,
      interestSharePercent,
      equivalentRateInsight,
      mode: 'percentage',
      steps,
    };
  } else {
    const interestAmount = Math.max(0, params.interestAmount || 0);
    const base = params.base;

    // Rupee mode logic
    const units = principal / base;
    const monthlyInterest = units * interestAmount;
    const totalInterest = monthlyInterest * durationMonths;
    const totalAmount = principal + totalInterest;

    // Equivalent annual interest percentage:
    // monthly percentage = (interestAmount / base) * 100
    // annual percentage = monthly percentage * 12
    const effectiveMonthlyRate = (interestAmount / base) * 100;
    const effectiveAnnualRate = effectiveMonthlyRate * 12;

    const principalSharePercent = totalAmount > 0 ? (principal / totalAmount) * 100 : 100;
    const interestSharePercent = totalAmount > 0 ? (totalInterest / totalAmount) * 100 : 0;

    const formattedAnnualRate = effectiveAnnualRate % 1 === 0 
      ? effectiveAnnualRate.toFixed(0) 
      : effectiveAnnualRate.toFixed(2);

    const equivalentRateInsight = `₹${interestAmount} per ₹${base.toLocaleString('en-IN')} per month ≈ ${formattedAnnualRate}% per year`;

    const steps: CalculationStep[] = [
      {
        id: 'principal',
        stepNumber: 1,
        title: 'Principal Amount & Base',
        formula: `₹${principal.toLocaleString('en-IN')} (Base: ₹${base.toLocaleString('en-IN')})`,
        explanation: 'Initial principal and rate reference base unit',
        resultDisplay: `₹${principal.toLocaleString('en-IN')}`,
      },
      {
        id: 'units',
        stepNumber: 2,
        title: 'Base Units Calculation',
        formula: `₹${principal.toLocaleString('en-IN')} ÷ ₹${base.toLocaleString('en-IN')}`,
        explanation: `Number of ₹${base.toLocaleString('en-IN')} units in principal`,
        resultDisplay: `${units.toLocaleString('en-IN')} unit${units === 1 ? '' : 's'}`,
      },
      {
        id: 'monthly_interest',
        stepNumber: 3,
        title: 'Monthly Interest',
        formula: `${units.toLocaleString('en-IN')} units × ₹${interestAmount}`,
        explanation: `Interest accrued per month at ₹${interestAmount} per unit`,
        resultDisplay: `₹${Math.round(monthlyInterest).toLocaleString('en-IN')} / month`,
      },
      {
        id: 'total_interest',
        stepNumber: 4,
        title: 'Total Interest for Duration',
        formula: `₹${Math.round(monthlyInterest).toLocaleString('en-IN')} × ${durationMonths} months`,
        explanation: `Accrued interest across full period of ${durationMonths} months`,
        resultDisplay: `₹${Math.round(totalInterest).toLocaleString('en-IN')}`,
      },
      {
        id: 'total_amount',
        stepNumber: 5,
        title: 'Total Repayment Amount',
        formula: `₹${principal.toLocaleString('en-IN')} + ₹${Math.round(totalInterest).toLocaleString('en-IN')}`,
        explanation: 'Principal + Total Interest',
        resultDisplay: `₹${Math.round(totalAmount).toLocaleString('en-IN')}`,
      },
    ];

    return {
      principal,
      totalInterest,
      totalAmount,
      monthlyInterest,
      durationMonths,
      effectiveAnnualRate,
      effectiveMonthlyRate,
      principalSharePercent,
      interestSharePercent,
      equivalentRateInsight,
      mode: 'rupees',
      steps,
    };
  }
}
