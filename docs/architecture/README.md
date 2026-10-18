# Architecture Handbook

Welcome to the Emme Studio Client Application Architecture Handbook. This handbook defines the standards, principles, and guidelines for feature development, boundary management, and system architecture.

## Table of Contents

- [Feature Module Structure](./00-project/feature-module-structure.md)
- [Architecture Patterns](./00-project/architecture-patterns.md)
- [Boundary Verification](./00-project/boundary-verification.md)

## Core Principles

1. **Strict Feature Boundaries**: Every feature encapsulates its own pages, UI components, hooks, state, domain models, and API logic. Deep cross-feature internal imports are prohibited.
2. **Layered Decoupling**: Generic UI primitives live in `@emme/ui`, technical side effects in `@emme/infrastructure`, and shared runtime utilities in `@emme/core`.
3. **Type Safety & TDD**: All domain contracts, view models, and API interfaces are strongly typed with TypeScript.
