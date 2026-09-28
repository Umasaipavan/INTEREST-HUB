# InterestHub — Money Interest Calculator

A polished, production-ready **Money Interest Calculator** built with **React 19 + TypeScript + Tailwind CSS**. Designed specifically for everyday Indian users to calculate simple interest in both standard bank annual percentage (`% p.a.`) and Indian monthly informal rupee rate (`₹ per ₹100 / ₹1,000 / ₹10,000 per month`).

---

## ✨ Features

- **Two Calculation Modes**:
  1. **Percentage (%)**: Rate per year (`% p.a.`) with standard Simple Interest $(P \times R \times T) / 100$.
  2. **Rupees (₹)**: "₹X per ₹100 / ₹1,000 / ₹10,000 per month" informal Indian lending rate.
- **Equivalent Rate Insight Chip**:
  - Automatically translates market rates (e.g., *"₹2 per ₹100 per month ≈ 24% per year"*), demystifying informal lending costs.
- **Hero Results Section**:
  - Live count-up animation on value changes (respects `prefers-reduced-motion`).
  - Stat cards: **Total Interest**, **Monthly Interest Cost**, **Principal Amount**.
  - Principal vs. Interest share stacked bar.
- **Step-by-Step Breakdown**:
  - Plain-language numbered timeline card showing exact calculation steps.
  - Collapsible on mobile viewports.
- **Indian Financial Ergonomics**:
  - Live Indian number formatting (`1,00,000` style comma separation).
  - Live conversion to Indian words (`One Lakh Rupees`, etc.).
  - Quick-pick chips for amounts (`₹10K`, `₹50K`, `₹1L`, `₹5L`, `₹10L`), rates, and durations.
- **Fintech Aesthetic**:
  - Modern typography (Plus Jakarta Sans).
  - Dark mode and light mode with persistent toggle.
  - Sticky mobile summary bar for instant glanceability.
- **Robust Input Validation & Accessibility**:
  - Inline error warnings with icons and `aria-invalid` / `aria-describedby`.
  - Radio-group semantics for toggles, keyboard navigation, and WCAG AA contrast.

---

## 🚀 Quick Start Commands

Run the following commands in your terminal:

```bash
# 1. Start the local development server
npm run dev
```

Open the URL displayed in your terminal (usually `http://localhost:5173`) in your browser.

### Other Useful Commands

```bash
# Run unit tests
npm run test

# Type-check and build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Architecture

```
src/
├── lib/
│   ├── interest.ts        # Pure calculation logic, types & discriminated union
│   ├── format.ts          # Indian comma grouping, currency & number-to-words
│   ├── validate.ts        # Validation rules and boundary limits
│   └── interest.test.ts   # 16 Unit tests covering both modes & edge cases
├── components/
│   ├── AmountInput.tsx           # Principal input with live words & chips
│   ├── InterestTypeSelector.tsx  # Accessible segmented mode toggle
│   ├── InterestInput.tsx         # Percentage & Rupee inputs + base selector
│   ├── DurationInput.tsx         # Tenure input with months/years toggle
│   ├── ResultCard.tsx            # Animated hero results, stat cards & bar
│   ├── CalculationBreakdown.tsx  # Step-by-step plain language timeline
│   ├── ChipGroup.tsx             # Reusable quick-pick chips
│   └── ThemeToggle.tsx           # Light/dark mode toggle with persistence
├── hooks/
│   └── useInterestCalculator.ts  # State management & derived calculations
├── App.tsx                       # Main layout and responsive page assembly
├── main.tsx                      # React root entry point
└── index.css                     # Tailwind directives & typography
```
