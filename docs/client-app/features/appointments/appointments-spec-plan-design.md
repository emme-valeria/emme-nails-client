# Feature Spec, Design, and Execution Plan

---

## Metadata

| Field | Value |
| --- | --- |
| Feature | Appointments & Booking Management |
| Product/app | client-app |
| Owner | Emme Studio Engineering |
| Status | Active / Verified |
| Date | 2026-08-10 |
| Requirements | REQ-APT-01, REQ-APT-02 |
| Related API contract | `@emme/infrastructure/googleWorkspace` |
| Related ADR | ADR-001-Google-Calendar-Sync |

---

## 1. Objective

### Problem

Manicurists and salon managers lose time coordinating appointment slots, tracking client nail art preferences, and manually syncing bookings with Google Calendar.

### Objective

A seamless, intuitive scheduling engine and appointment wizard that enables single-click appointment creation, instant status transitions (pending, confirmed, completed, cancelled), client/service matching, and automatic Google Calendar synchronization.

### Success criteria

- [x] Complete appointment creation wizard with client selection, service selection, date-time picker, and custom nail notes.
- [x] Instant bidirectional status update and calendar event sync via `@emme/infrastructure`.
- [x] Filterable agenda timeline and day view.

---

## 2. Scope

### In scope

- Interactive appointment wizard modal (`AppointmentWizardModal`).
- Manual appointment creation & editing form (`AppointmentForm`).
- Calendar agenda list view (`AppointmentsPage`, `Appointments`).
- Auto-synchronization with Google Calendar via OAuth tokens.

### Out of scope

- Automated SMS or external phone call gateways (handled via WhatsApp deep link placeholders).
- Multi-salon franchise resource allocation.

---

## 3. Requirements and acceptance criteria

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| REQ-APT-01 | Create Appointment | Given valid client, service, date, and time, when submitted, then appointment is persisted and synced to Google Calendar if enabled. |
| REQ-APT-02 | Change Status | Given an existing appointment, when status is set to 'completed' or 'cancelled', then status updates in state and calendar event is updated/deleted. |

### Edge and failure cases

- Empty state: Displays "No appointments scheduled" empty illustration card with quick "Book Appointment" CTA button.
- Invalid input: Form validation flags missing required client or service fields.
- Offline/timeout/provider failure: Gracefully falls back to local cache storage (`cacheService.ts`) and alerts user via toast notification.
- Stale response or route/session change: Cancels pending sync and maintains local source of truth.

---

## 4. Architecture placement

### Pattern scope

- [x] FSD-inspired vertical feature slice — app workflow and presentation.
- [x] Hexagonal/Clean — ports, use cases, adapters, and dependency direction.
- [x] Capability-oriented DDD — rules, invariants, domain types, and use cases.
- [x] Component-Driven Development — generic reusable UI in `@emme/ui`.

### Ownership decision

| Responsibility | Owner | Reason |
| --- | --- | --- |
| Route/page/workflow | `src/features/appointments` | Feature owns user scheduling outcome. |
| Domain types & rules | `src/features/appointments/domain` | Feature-specific appointment structures and invariants. |
| Calendar adapter | `@emme/infrastructure` | Concrete Google Calendar REST client. |
| Generic UI primitives | `@emme/ui` | Shared buttons, modals, badges, inputs. |

---

## 5. Proposed structure

```text
src/features/appointments/
├── pages/                         # AppointmentsPage.tsx
├── components/                    # Appointments.tsx, AppointmentForm.tsx, AppointmentWizardModal.tsx
├── domain/                        # types/appointment.types.ts
└── index.ts                       # Public feature boundary export
```

### Current structure

```text
src/features/appointments/
├── components/
│   ├── AppointmentForm.tsx
│   ├── AppointmentWizardModal.tsx
│   ├── Appointments.tsx
│   └── index.ts
├── domain/
│   ├── types/
│   │   └── appointment.types.ts
│   └── index.ts
├── pages/
│   ├── AppointmentsPage.tsx
│   └── index.ts
└── index.ts
```

### Target structure

```text
src/features/appointments/
├── components/
│   ├── AppointmentForm.tsx
│   ├── AppointmentWizardModal.tsx
│   ├── Appointments.tsx
│   └── index.ts
├── domain/
│   ├── types/
│   │   └── appointment.types.ts
│   └── index.ts
├── pages/
│   ├── AppointmentsPage.tsx
│   └── index.ts
└── index.ts
```

### Route and module registration

```text
src/app/router.tsx
  → /agenda (AppointmentsPage)
  → AppointmentWizardModal / AppointmentForm
  → AppContext (syncAppointmentToCalendar)
  → @emme/infrastructure
```

---

## 6. Feature workflow design

```text
User action (Click "Nueva Cita")
  → AppointmentWizardModal / AppointmentForm
  → Form Validation
  → AppContext.addAppointment()
  → cacheService.set('appointments')
  → syncAppointmentToCalendar() (@emme/infrastructure)
  → Toast Notification (Sonner)
```

### Feature owns

- [x] Appointments page composition and agenda timeline view.
- [x] Appointment wizard modal step-by-step state.
- [x] Local appointment filtering and date selection.

### Feature does not own

- [x] Global user auth or token management.
- [x] Raw Google Calendar HTTP fetch client implementation.

---

## 7. Contracts and protocols

### Inputs

```ts
export interface CreateAppointmentInput {
  clientId: string;
  serviceId: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
}
```

### Outputs/view model

```ts
export interface AppointmentViewModel {
  id: string;
  clientName: string;
  serviceName: string;
  price: number;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  googleEventId?: string;
}
```

---

## 8. State ownership

| State | Owner | Persistence/cache rule |
| --- | --- | --- |
| Appointments collection | AppContext | Cached via `cacheService` under key `'appointments'` |
| Selected date | AppointmentsPage | Local component state |
| Wizard modal state | AppointmentsPage | Local component state |

---

## 9. Error and recovery design

| Scenario | Detection | User behavior | Logging/telemetry |
| --- | --- | --- | --- |
| Validation | Form submit | Inline form warnings | Console warning |
| Calendar sync error | Fetch error catch | Toast alert, retains local appointment | Console log |

---

## 10. Accessibility, security, and i18n

### Accessibility

- [x] Accessible modal dialog focus trap and ARIA labels via Radix UI / `@emme/ui`.
- [x] Keyboard navigation support for date picker and form fields.

### Security and tenancy

- [x] Google OAuth access tokens stored securely in memory/sessionStorage, never hardcoded.

### Internationalization

- [x] Spanish locale formatting for dates and currency ($ USD / EUR).

---

## 11. Test strategy

| Test level | Test location | Coverage |
| --- | --- | --- |
| Domain types | `src/features/appointments/domain` | Appointment status and schema invariants |
| Component compilation | `npm run lint` | Full type check and export verification |

---

## 12. Execution plan

| # | Task | Test first | Source/docs | Status |
| --- | --- | --- | --- | --- |
| 1 | Create appointment domain types | `appointment.types.ts` | `domain/` | ✅ Done |
| 2 | Build appointment form and wizard | `AppointmentForm.tsx` | `components/` | ✅ Done |
| 3 | Connect Google Calendar sync adapter | `googleWorkspace.ts` | `@emme/infrastructure` | ✅ Done |

---

## 13. Verification commands

```bash
npm run lint
npm run build
```

---

## 14. Decisions and open questions

### Decisions

- Used `cacheService.ts` for instant offline persistence so appointment bookings work smoothly even without active internet.

---

## 15. Definition of done

- [x] Appointment scheduling and agenda management are fully functional.
- [x] `npm run lint` and `npm run build` execute cleanly with 0 errors.
