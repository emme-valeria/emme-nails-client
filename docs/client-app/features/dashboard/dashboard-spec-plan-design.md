# Feature Spec, Design, and Execution Plan

---

## Metadata

| Field | Value |
| --- | --- |
| Feature | Business Analytics & Dashboard |
| Product/app | client-app |
| Owner | Emme Analytics Team |
| Status | Active / Verified |
| Date | 2026-08-10 |
| Requirements | REQ-DASH-01, REQ-DASH-02 |
| Related API contract | Recharts Data Visualization |
| Related ADR | ADR-003-Analytics-Recharts |

---

## 1. Objective

### Problem

Salon managers need real-time clarity on revenue progress, monthly financial targets, daily appointment velocity, and AI-driven design trend recommendations.

### Objective

An executive dashboard (`DashboardPage`) featuring key metrics KPI cards, interactive Recharts revenue charts (`AppointmentAnalyticsWidget`), and an AI Nail Art Design Advisor (`AiDesignAdvisorWidget`).

### Success criteria

- [x] Live KPI cards for Monthly Sales, Monthly Goal percentage, Today's Appointments, and Client Retention.
- [x] Responsive Recharts visual analytics.
- [x] AI Design Advisor widget offering seasonal trend insights.

---

## 2. Scope

### In scope

- Dashboard page (`DashboardPage`).
- Main Dashboard component (`Dashboard`).
- Analytics chart widget (`AppointmentAnalyticsWidget`).
- AI Design Advisor (`AiDesignAdvisorWidget`).

---

## 3. Requirements and acceptance criteria

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| REQ-DASH-01 | KPI Calculation | Given appointments and services state, when calculated, then displays total revenue vs goal accurately. |
| REQ-DASH-02 | Visual Analytics | Given monthly history, when rendered, displays smooth line and bar charts. |

---

## 4. Architecture placement

```text
src/features/dashboard/
├── pages/                         # DashboardPage.tsx
├── components/                    # Dashboard.tsx, AppointmentAnalyticsWidget.tsx, AiDesignAdvisorWidget.tsx
└── index.ts                       # Public feature boundary export
```

---

## 5. Verification commands

```bash
npm run lint
npm run build
```

---

## 6. Definition of done

- [x] Dashboard analytics and AI design advisor are fully verified.
- [x] `npm run lint` and `npm run build` pass without errors.
