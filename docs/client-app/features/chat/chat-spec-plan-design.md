# Feature Spec, Design, and Execution Plan

---

## Metadata

| Field | Value |
| --- | --- |
| Feature | EMME AI Assistant Chat & Style Advisor |
| Product/app | client-app |
| Owner | Emme AI Engineering |
| Status | Active / Verified |
| Date | 2026-08-10 |
| Requirements | REQ-CHAT-01, REQ-CHAT-02 |
| Related API contract | `@google/genai` |
| Related ADR | ADR-002-Gemini-AI-Chat-Integration |

---

## 1. Objective

### Problem

Clients and salon managers require intelligent consultation, instant nail style recommendations, photo quote estimates, aftercare guidance, and automated booking widgets.

### Objective

An AI-powered conversational assistant widget (`EmmeAiChatWidget`) equipped with specialized interactive chat widgets (Photo Quote, Booking Flow, Loyalty Perks, Style Advisor, Aftercare Guide, Deposit Checkout).

### Success criteria

- [x] Responsive floating and dedicated full-page AI chat widget.
- [x] Context-aware conversation stream with Gemini model integration.
- [x] Interactive widgets embedded inline within chat messages.

---

## 2. Scope

### In scope

- Full page chat view (`ChatPage`).
- Floating AI widget trigger button and modal drawer (`EmmeAiChatWidget`).
- Interactive chat widgets (AftercareGuide, AppointmentBookingFlow, AppointmentWizard, ConfirmedBookingPass, LoyaltyPerks, PhotoQuote, ProposalAppointment, SecureDepositCheckout, ServiceCatalog, StaffSelector, StyleAdvisor).
- Zustand chat store (`useChatStore`).

### Out of scope

- Multi-language voice synthesize models (text-based conversational AI only).

---

## 3. Requirements and acceptance criteria

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| REQ-CHAT-01 | AI Conversation | Given user prompt, when sent to Gemini, then returning response is streamed into chat UI with markdown support. |
| REQ-CHAT-02 | Interactive Widgets | Given intent triggers (e.g. "quote", "booking", "catalog"), when recognized, inline interactive widget component is rendered. |

---

## 4. Architecture placement

### Pattern scope

- [x] FSD-inspired vertical feature slice — app workflow and presentation.
- [x] Feature-local state management via Zustand (`useChatStore`).
- [x] Component-Driven Development — generic UI in `@emme/ui`.

---

## 5. Proposed structure

```text
src/features/chat/
├── pages/                         # ChatPage.tsx
├── components/                    # EmmeAiChatWidget.tsx & chat-widgets/
├── state/                         # useChatStore.ts
└── index.ts                       # Public feature boundary export
```

---

## 6. Feature workflow design

```text
User Message / Action
  → EmmeAiChatWidget / ChatPage
  → useChatStore.addMessage()
  → Gemini AI Service Call (@google/genai)
  → Response parsing + Widget trigger
  → State update & UI re-render
```

---

## 7. State ownership

| State | Owner | Persistence/cache rule |
| --- | --- | --- |
| Chat messages & active thread | useChatStore | In-memory Zustand store with local session support |
| Floating chat toggle | AppRouter | Local React state |

---

## 8. Verification commands

```bash
npm run lint
npm run build
```

---

## 9. Definition of done

- [x] EMME AI chat and interactive widgets are fully functional.
- [x] `npm run lint` and `npm run build` execute cleanly with 0 errors.
