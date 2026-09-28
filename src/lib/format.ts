/**
 * Indian currency and number formatting utilities.
 */

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const TENS = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertBelowThousand(n: number): string {
  let str = '';
  if (n >= 100) {
    str += ONES[Math.floor(n / 100)] + ' Hundred ';
    n %= 100;
  }
  if (n >= 20) {
    str += TENS[Math.floor(n / 10)] + ' ';
    n %= 10;
  }
  if (n > 0) {
    str += ONES[n] + ' ';
  }
  return str.trim();
}

/**
 * Converts a positive number to Indian denomination words (Crore, Lakh, Thousand, Hundred, Rupees).
 * Example: 100000 -> "One Lakh Rupees"
 * Example: 2500000 -> "Twenty Five Lakh Rupees"
 */
export function numberToIndianWords(num: number): string {
  if (!num || isNaN(num) || num <= 0) return '';
  const integerPart = Math.floor(num);

  if (integerPart === 0) return 'Zero Rupees';
  if (integerPart > 10000000000) {
    return 'Over One Thousand Crore Rupees';
  }

  let n = integerPart;
  const parts: string[] = [];

  const crores = Math.floor(n / 10000000);
  n %= 10000000;

  const lakhs = Math.floor(n / 100000);
  n %= 100000;

  const thousands = Math.floor(n / 1000);
  n %= 1000;

  const remainder = n;

  if (crores > 0) {
    parts.push(`${convertBelowThousand(crores)} Crore`);
  }
  if (lakhs > 0) {
    parts.push(`${convertBelowThousand(lakhs)} Lakh`);
  }
  if (thousands > 0) {
    parts.push(`${convertBelowThousand(thousands)} Thousand`);
  }
  if (remainder > 0) {
    parts.push(convertBelowThousand(remainder));
  }

  const result = parts.join(' ').trim();
  return result ? `${result} Rupees` : '';
}

/**
 * Formats a number with Indian commas:
 * e.g., 1000000 -> 10,00,000
 */
export function formatIndianNumber(value: number | string | undefined | null): string {
  if (value === undefined || value === null || value === '') return '';
  const cleanStr = String(value).replace(/[^0-9.]/g, '');
  if (!cleanStr) return '';

  const [integerPart, decimalPart] = cleanStr.split('.');
  
  if (!integerPart) return decimalPart !== undefined ? `0.${decimalPart}` : '';

  // Indian numbering system: rightmost 3 digits, then groups of 2 digits
  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);

  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formattedInteger = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  return decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger;
}

/**
 * Formats a currency value with the Indian Rupee symbol:
 * e.g. 12400 -> "₹12,400"
 */
export function formatCurrency(amount: number, compact = false): string {
  if (!Number.isFinite(amount)) return '₹0';

  if (compact) {
    if (Math.abs(amount) >= 10000000) {
      const cr = amount / 10000000;
      return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2)} Cr`;
    }
    if (Math.abs(amount) >= 100000) {
      const lk = amount / 100000;
      return `₹${lk % 1 === 0 ? lk.toFixed(0) : lk.toFixed(2)} L`;
    }
    if (Math.abs(amount) >= 1000) {
      const k = amount / 1000;
      return `₹${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)} K`;
    }
  }

  const rounded = Math.round(amount);
  return `₹${formatIndianNumber(rounded)}`;
}

/**
 * Strips non-numeric characters and parses input to a clean number.
 */
export function parseRawNumber(raw: string): number {
  if (!raw) return 0;
  const cleaned = raw.replace(/,/g, '').trim();
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}
