# InterestHub

A modern, fintech-style money interest calculator built for India. InterestHub helps users compare and understand interest in both traditional percentage-based simple interest and informal rupee-rate lending formats commonly used in everyday Indian financial conversations.

Whether you are planning a personal loan, evaluating a business borrowing cost, or simply trying to understand the true annual cost of a monthly rate, InterestHub makes the math clear, fast, and accessible.

## Why this project exists

Many people understand a rate like “₹2 per ₹100 per month,” but few know the equivalent annual percentage. InterestHub translates this into clear, actionable insights using a clean interface, instant calculations, and human-friendly explanations.

## Key features

- Two calculation modes:
  - Percentage-based simple interest for standard bank-style calculations
  - Rupee-based monthly interest model for Indian informal lending contexts
- Instant conversion of informal monthly rates into annualized percentages
- Real-time financial summaries for:
  - total interest
  - monthly interest cost
  - principal amount
  - principal vs. interest share
- Step-by-step calculation breakdown in plain language
- Indian-format number styling such as 1,00,000 and rupee outputs
- Quick preset chips for common amounts, rates, and durations
- Light and dark theme support
- Accessible forms, validation messages, and keyboard-friendly controls
- Responsive design for desktop, tablet, and mobile screens

## Example use cases

- Compare a market rate of “₹2 per ₹100 per month” with a standard annual rate
- Estimate how much interest accrues over a chosen time period
- Understand the real cost of informal borrowing or lending
- Evaluate principal and interest split before making a financial decision

## How it works

InterestHub supports standard simple interest calculations:

```text
Simple Interest = (P × R × T) / 100
```

It also translates rupee-based rates into annual equivalents, helping users understand what a seemingly small monthly number actually means over a year.

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Vitest
- Lucide Icons

## Getting started

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

The app will start in development mode and usually open at:

```text
http://localhost:5173
```

### Run tests

```bash
npm run test
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Project structure

```text
src/
├── App.tsx
├── main.tsx
├── index.css
├── assets/
├── components/
│   ├── AmountInput.tsx
│   ├── CalculationBreakdown.tsx
│   ├── ChipGroup.tsx
│   ├── DurationInput.tsx
│   ├── InterestInput.tsx
│   ├── InterestTypeSelector.tsx
│   ├── ResultCard.tsx
│   └── ThemeToggle.tsx
├── hooks/
│   └── useInterestCalculator.ts
├── lib/
│   ├── format.ts
│   ├── interest.test.ts
│   ├── interest.ts
│   └── validate.ts
└── vite-env.d.ts
```

## Design philosophy

InterestHub is built around clarity and trust. Instead of overwhelming users with raw numbers, the interface focuses on:

- understandable calculations
- clean visual hierarchy
- practical Indian money formatting
- trustworthy comparisons between common financial rates

## License

This project is for educational and personal use. If you are using it in a production or commercial setting, please review the licensing terms applicable to your deployment environment.

## Contributing

Contributions are welcome. You can help by:

- improving calculation logic
- refining accessibility and UX
- adding more finance-oriented presets
- enhancing validation and edge-case handling

## Status

InterestHub is actively developed as a practical financial calculator with a strong focus on clarity, usability, and India-specific money understanding.

---

Built to make interest easier to understand, compare, and act on.
