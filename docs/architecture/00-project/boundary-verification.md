# Boundary Verification

Boundary verification ensures architectural integrity over time through strict automated linting, compilation checks, and import checks.

## Checks & Commands

- **Type Safety**: `npm run lint` / `tsc --noEmit` verifies strict TypeScript compilation.
- **Production Build Verification**: `npm run build` verifies full bundling without circular dependencies or unresolvable imports.
- **Import Rules**: No deep imports into private feature folders (e.g. `@/features/appointments/components/AppointmentForm` from outside appointments). All imports must go through `@/features/appointments`.
