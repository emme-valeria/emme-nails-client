# Feature Spec, Design, and Execution Plan

---

## Metadata

| Field | Value |
| --- | --- |
| Feature | Salon Onboarding Wizard |
| Product/app | client-app |
| Owner | Emme Onboarding Team |
| Status | Active / Verified |
| Date | 2026-08-10 |
| Requirements | REQ-ONB-01 |
| Related API contract | Local State / AppContext |
| Related ADR | ADR-007-Onboarding-Flow |

---

## 1. Objective

### Problem

First-time users need quick configuration of salon business name, default currency, operating hours, and initial service catalog setup.

### Objective

An onboarding flow (`OnboardingPage`) that guides users through initial setup and marks `isFirstTime` flag as false upon completion.

### Success criteria

- [x] Step-by-step setup modal wizard.
- [x] Initial seed data generation for services and studio profile.

---

## 2. Architecture placement

```text
src/features/onboarding/
├── pages/                         # OnboardingPage.tsx
├── components/                    # Wizard steps
└── index.ts                       # Public feature boundary export
```

---

## 3. Verification commands

```bash
npm run lint
npm run build
```

---

## 4. Definition of done

- [x] Onboarding feature verified and passing build.
