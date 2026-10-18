# Feature Module Structure

Every feature module in Emme Studio resides in `src/features/<feature-name>` and follows a strict layout:

```text
src/features/<feature>/
├── pages/                         # Route-level screen components
├── components/                    # Feature-specific presentation components
├── hooks/                         # React custom hooks and workflow state
├── api/                           # Data fetching, query composition, mapping
├── domain/                        # Feature-local domain types, invariants, rules
├── state/                         # Feature-local state management (e.g., Zustand)
├── validation/                    # Zod schemas for forms and filters
├── shared/                        # Local feature utilities
└── index.ts                       # Public barrel file / boundary export
```

## Boundary Rules

- **Public Exports Only**: External features must only import from `@/features/<feature>` (the barrel file `index.ts`), never private internal paths.
- **No Direct Sibling Imports**: Feature A must not import private internal modules from Feature B.
- **Shared Extraction**: Code shared across multiple features or applications belongs in `@emme/ui`, `@emme/infrastructure`, or `@emme/core`.
