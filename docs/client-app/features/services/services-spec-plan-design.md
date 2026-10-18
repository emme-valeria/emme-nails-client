# Feature Spec, Design, and Execution Plan

---

## Metadata

| Field | Value |
| --- | --- |
| Feature | Service Catalog & Treatment History |
| Product/app | client-app |
| Owner | Emme Catalog Team |
| Status | Active / Verified |
| Date | 2026-08-10 |
| Requirements | REQ-SRV-01, REQ-SRV-02 |
| Related API contract | Local Cache / Firebase |
| Related ADR | ADR-004-Service-Catalog-Schema |

---

## 1. Objective

### Problem

Salons need a flexible way to showcase nail art, gels, acrylics, and pedicure treatments with customizable pricing, duration, and active status switches.

### Objective

A service catalog management module (`ServicesPage`, `Services`, `ServiceHistoryList`) categorized by treatment type, supporting creation, price/duration edits, and status toggles.

### Success criteria

- [x] Categorized service catalog tabs.
- [x] Toggle active/inactive status switch.
- [x] Historical service activity view.

---

## 2. Scope

### In scope

- Services management page (`ServicesPage`).
- Catalog component (`Services`).
- Service history component (`ServiceHistoryList`).
- Service domain types (`types/service.types.ts`).

---

## 3. Architecture placement

```text
src/features/services/
├── pages/                         # ServicesPage.tsx
├── components/                    # Services.tsx, ServiceHistoryList.tsx
├── domain/                        # types/service.types.ts
└── index.ts                       # Public feature boundary export
```

---

## 4. Verification commands

```bash
npm run lint
npm run build
```

---

## 5. Definition of done

- [x] Service catalog & history verified and passing build.
