import { useState, useMemo, useCallback } from 'react';
import {
  InterestMode,
  RupeeInterestBase,
  DurationUnit,
  CalculationResult,
  calculateInterest,
} from '../lib/interest';
import { parseRawNumber, formatIndianNumber } from '../lib/format';
import {
  validatePrincipal,
  validatePercentageRate,
  validateRupeeAmount,
  validateDuration,
  ValidationErrors,
} from '../lib/validate';

export interface UseInterestCalculatorReturn {
  // Mode
  mode: InterestMode;
  setMode: (mode: InterestMode) => void;

  // Principal
  principalRaw: string;
  principalNum: number;
  principalError?: string;
  setPrincipal: (value: string) => void;
  selectPrincipalPreset: (amount: number) => void;

  // Percentage Mode State
  percentageRateRaw: string;
  percentageRateNum: number;
  percentageRateError?: string;
  setPercentageRate: (rate: string) => void;
  selectPercentagePreset: (rate: number) => void;

  // Rupee Mode State
  rupeeAmountRaw: string;
  rupeeAmountNum: number;
  rupeeAmountError?: string;
  rupeeBase: RupeeInterestBase;
  setRupeeAmount: (amount: string) => void;
  setRupeeBase: (base: RupeeInterestBase) => void;
  selectRupeePreset: (amount: number) => void;

  // Duration
  durationRaw: string;
  durationNum: number;
  durationUnit: DurationUnit;
  durationError?: string;
  setDuration: (duration: string) => void;
  setDurationUnit: (unit: DurationUnit) => void;
  selectDurationPreset: (value: number, unit: DurationUnit) => void;

  // Computed / Results
  errors: ValidationErrors;
  isValid: boolean;
  result: CalculationResult;
  resetAll: () => void;
  loadSampleData: () => void;
}

export function useInterestCalculator(): UseInterestCalculatorReturn {
  const [mode, setMode] = useState<InterestMode>('percentage');

  // Start with clean, empty inputs so user isn't confused by preloaded dummy data
  const [principalRaw, setPrincipalRaw] = useState<string>('');
  const [percentageRateRaw, setPercentageRateRaw] = useState<string>('');
  const [rupeeAmountRaw, setRupeeAmountRaw] = useState<string>('');
  const [rupeeBase, setRupeeBase] = useState<RupeeInterestBase>(100);
  const [durationRaw, setDurationRaw] = useState<string>('');
  const [durationUnit, setDurationUnit] = useState<DurationUnit>('years');

  // Track if fields have been touched by the user to avoid premature validation errors on empty fields
  const [touched, setTouched] = useState<{
    principal?: boolean;
    interestRate?: boolean;
    interestAmount?: boolean;
    duration?: boolean;
  }>({});

  // Handlers
  const handlePrincipalChange = useCallback((value: string) => {
    setTouched((prev) => ({ ...prev, principal: true }));
    const cleanNumbers = value.replace(/[^0-9]/g, '');
    if (!cleanNumbers) {
      setPrincipalRaw('');
      return;
    }
    const formatted = formatIndianNumber(cleanNumbers);
    setPrincipalRaw(formatted);
  }, []);

  const selectPrincipalPreset = useCallback((amount: number) => {
    setTouched((prev) => ({ ...prev, principal: true }));
    setPrincipalRaw(formatIndianNumber(amount));
  }, []);

  const handlePercentageChange = useCallback((val: string) => {
    setTouched((prev) => ({ ...prev, interestRate: true }));
    const sanitized = val.replace(/[^0-9.]/g, '');
    const parts = sanitized.split('.');
    if (parts.length > 2) return;
    setPercentageRateRaw(sanitized);
  }, []);

  const selectPercentagePreset = useCallback((rate: number) => {
    setTouched((prev) => ({ ...prev, interestRate: true }));
    setPercentageRateRaw(String(rate));
  }, []);

  const handleRupeeAmountChange = useCallback((val: string) => {
    setTouched((prev) => ({ ...prev, interestAmount: true }));
    const sanitized = val.replace(/[^0-9.]/g, '');
    const parts = sanitized.split('.');
    if (parts.length > 2) return;
    setRupeeAmountRaw(sanitized);
  }, []);

  const selectRupeePreset = useCallback((amount: number) => {
    setTouched((prev) => ({ ...prev, interestAmount: true }));
    setRupeeAmountRaw(String(amount));
  }, []);

  const handleDurationChange = useCallback((val: string) => {
    setTouched((prev) => ({ ...prev, duration: true }));
    const sanitized = val.replace(/[^0-9]/g, '');
    setDurationRaw(sanitized);
  }, []);

  const selectDurationPreset = useCallback((val: number, unit: DurationUnit) => {
    setTouched((prev) => ({ ...prev, duration: true }));
    setDurationRaw(String(val));
    setDurationUnit(unit);
  }, []);

  // Complete clean reset of all fields
  const resetAll = useCallback(() => {
    setPrincipalRaw('');
    setPercentageRateRaw('');
    setRupeeAmountRaw('');
    setRupeeBase(100);
    setDurationRaw('');
    setDurationUnit('years');
    setTouched({});
  }, []);

  // Quick helper to populate a realistic sample calculation if user wants
  const loadSampleData = useCallback(() => {
    setPrincipalRaw('1,00,000');
    if (mode === 'percentage') {
      setPercentageRateRaw('12');
    } else {
      setRupeeAmountRaw('2');
    }
    setDurationRaw('1');
    setDurationUnit('years');
    setTouched({
      principal: true,
      interestRate: true,
      interestAmount: true,
      duration: true,
    });
  }, [mode]);

  // Parsed Numbers
  const principalNum = useMemo(() => parseRawNumber(principalRaw), [principalRaw]);
  const percentageRateNum = useMemo(() => parseRawNumber(percentageRateRaw), [percentageRateRaw]);
  const rupeeAmountNum = useMemo(() => parseRawNumber(rupeeAmountRaw), [rupeeAmountRaw]);
  const durationNum = useMemo(() => parseRawNumber(durationRaw), [durationRaw]);

  // Total Duration in Months
  const durationInMonths = useMemo(() => {
    if (durationUnit === 'years') {
      return durationNum * 12;
    }
    return durationNum;
  }, [durationNum, durationUnit]);

  // Raw validation calculation
  const rawErrors = useMemo<ValidationErrors>(() => {
    const principalErr = validatePrincipal(principalRaw, principalNum);
    const durationErr = validateDuration(durationRaw, durationNum, durationUnit);

    let rateErr: string | undefined;
    let rupeeErr: string | undefined;

    if (mode === 'percentage') {
      rateErr = validatePercentageRate(percentageRateRaw, percentageRateNum);
    } else {
      rupeeErr = validateRupeeAmount(rupeeAmountRaw, rupeeAmountNum);
    }

    return {
      principal: principalErr,
      interestRate: rateErr,
      interestAmount: rupeeErr,
      duration: durationErr,
    };
  }, [
    mode,
    principalRaw,
    principalNum,
    percentageRateRaw,
    percentageRateNum,
    rupeeAmountRaw,
    rupeeAmountNum,
    durationRaw,
    durationNum,
    durationUnit,
  ]);

  // Only display errors to the user if field has content or was touched
  const errors = useMemo<ValidationErrors>(() => {
    return {
      principal: (touched.principal || principalRaw !== '') ? rawErrors.principal : undefined,
      interestRate: (touched.interestRate || percentageRateRaw !== '') ? rawErrors.interestRate : undefined,
      interestAmount: (touched.interestAmount || rupeeAmountRaw !== '') ? rawErrors.interestAmount : undefined,
      duration: (touched.duration || durationRaw !== '') ? rawErrors.duration : undefined,
    };
  }, [rawErrors, touched, principalRaw, percentageRateRaw, rupeeAmountRaw, durationRaw]);

  // Form is valid when all required numeric fields are filled and valid
  const isValid = useMemo(() => {
    if (rawErrors.principal || rawErrors.duration) return false;
    if (mode === 'percentage' && rawErrors.interestRate) return false;
    if (mode === 'rupees' && rawErrors.interestAmount) return false;
    return principalNum > 0 && durationInMonths > 0;
  }, [rawErrors, mode, principalNum, durationInMonths]);

  // Calculation Result
  const result = useMemo<CalculationResult>(() => {
    if (!isValid) {
      if (mode === 'percentage') {
        return calculateInterest({
          type: 'percentage',
          principal: 0,
          durationMonths: 0,
          annualRate: 0,
        });
      } else {
        return calculateInterest({
          type: 'rupees',
          principal: 0,
          durationMonths: 0,
          interestAmount: 0,
          base: rupeeBase,
        });
      }
    }

    if (mode === 'percentage') {
      return calculateInterest({
        type: 'percentage',
        principal: principalNum,
        annualRate: percentageRateNum,
        durationMonths: durationInMonths,
      });
    } else {
      return calculateInterest({
        type: 'rupees',
        principal: principalNum,
        interestAmount: rupeeAmountNum,
        base: rupeeBase,
        durationMonths: durationInMonths,
      });
    }
  }, [
    isValid,
    mode,
    principalNum,
    durationInMonths,
    percentageRateNum,
    rupeeAmountNum,
    rupeeBase,
  ]);

  return {
    mode,
    setMode,
    principalRaw,
    principalNum,
    principalError: errors.principal,
    setPrincipal: handlePrincipalChange,
    selectPrincipalPreset,
    percentageRateRaw,
    percentageRateNum,
    percentageRateError: errors.interestRate,
    setPercentageRate: handlePercentageChange,
    selectPercentagePreset,
    rupeeAmountRaw,
    rupeeAmountNum,
    rupeeAmountError: errors.interestAmount,
    rupeeBase,
    setRupeeAmount: handleRupeeAmountChange,
    setRupeeBase,
    selectRupeePreset,
    durationRaw,
    durationNum,
    durationUnit,
    durationError: errors.duration,
    setDuration: handleDurationChange,
    setDurationUnit,
    selectDurationPreset,
    errors,
    isValid,
    result,
    resetAll,
    loadSampleData,
  };
}
