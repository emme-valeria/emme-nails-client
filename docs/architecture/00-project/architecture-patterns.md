# Architecture Patterns

Emme Studio leverages modern architectural patterns to ensure scalability, maintainability, and testability.

## Key Patterns

1. **Feature-Sliced Design (FSD)**: Vertical feature slicing groups code by business domain capabilities rather than technical layer alone.
2. **Hexagonal / Clean Architecture**: Core domain logic and business rules are kept framework-agnostic. External services (Firebase, Google Workspace, LocalStorage) act as concrete infrastructure adapters behind clean interface ports.
3. **Component-Driven Development (CDD)**: Generic UI primitives are isolated in `@emme/ui` with Tailwind CSS styling and zero business vocabulary.
4. **Reactive Single State Orchestration**: Application-wide persistent state is managed through React Context (`AppContext.tsx`) combined with local infrastructure caching (`cacheService.ts`).
