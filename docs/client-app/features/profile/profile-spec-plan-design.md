# Feature Spec, Design, and Execution Plan

---

## Metadata

| Field | Value |
| --- | --- |
| Feature | Business Profile & Salon Settings |
| Product/app | client-app |
| Owner | Emme Core Team |
| Status | Active / Verified |
| Date | 2026-08-10 |
| Requirements | REQ-PRF-01, REQ-PRF-02 |
| Related API contract | `@emme/infrastructure/googleAuth` |
| Related ADR | ADR-005-Profile-Settings |

---

## 1. Objective

### Problem

Salon managers need a central hub to manage business contact info, monthly revenue targets, operating hours, notification preferences, and Google Workspace integrations.

### Objective

A comprehensive settings and profile page (`ProfilePage`, `Settings`) enabling salon configuration and Google Calendar / Sheets auto-export controls.

### Success criteria

- [x] Profile management form with salon details and financial goal configuration.
- [x] Google Workspace auth connection controls.
- [x] WhatsApp automated template editor.

---

## 2. Scope

### In scope

- Profile and Settings page (`ProfilePage`).
- Settings component (`Settings`).
- User profile domain types (`types/user.types.ts`).

---

## 3. Architecture placement

```text
src/features/profile/
├── pages/                         # ProfilePage.tsx
├── components/                    # Settings.tsx
├── domain/                        # types/user.types.ts
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

- [x] Settings and profile module verified and passing build.
