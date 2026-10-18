#!/bin/bash
set -e

# Create packages structure
mkdir -p packages/ui/src
mkdir -p packages/api/src
mkdir -p packages/core/src
mkdir -p packages/business/src
mkdir -p packages/infrastructure/src
mkdir -p packages/auth/src

# Move UI to packages/ui
if [ -d "src/shared/ui" ]; then
  mv src/shared/ui packages/ui/src/components
fi
if [ -f "src/shared/lib/utils.ts" ]; then
  mkdir -p packages/ui/src/lib
  mv src/shared/lib/utils.ts packages/ui/src/lib/utils.ts
fi
echo "export * from './components';" > packages/ui/src/index.ts

# Move API to packages/api and packages/infrastructure
if [ -d "src/shared/api" ]; then
  mv src/shared/api/* packages/infrastructure/src/
fi
echo "export {};" > packages/api/src/index.ts
echo "export * from './googleAuth';" > packages/infrastructure/src/index.ts

# Restructure features
mkdir -p src/features/appointments/pages src/features/appointments/components src/features/appointments/domain
mkdir -p src/features/auth/pages src/features/auth/components
mkdir -p src/features/onboarding/pages src/features/onboarding/components
mkdir -p src/features/chat/pages src/features/chat/components src/features/chat/state
mkdir -p src/features/dashboard/pages src/features/dashboard/components
mkdir -p src/features/services/pages src/features/services/components src/features/services/domain
mkdir -p src/features/profile/pages src/features/profile/components src/features/profile/domain
mkdir -p src/features/staff/components src/features/staff/domain
mkdir -p src/features/navigation/components

# Appointments
[ -d "src/pages/appointments" ] && mv src/pages/appointments/* src/features/appointments/pages/ || true
[ -d "src/features/agenda/ui" ] && mv src/features/agenda/ui/* src/features/appointments/components/ || true
[ -d "src/widgets/booking" ] && mv src/widgets/booking/* src/features/appointments/components/ || true
[ -d "src/entities/appointment" ] && mv src/entities/appointment/* src/features/appointments/domain/ || true

# Auth
[ -d "src/pages/auth" ] && mv src/pages/auth/* src/features/auth/pages/ || true

# Onboarding
[ -d "src/pages/onboarding" ] && mv src/pages/onboarding/* src/features/onboarding/pages/ || true

# Chat
[ -d "src/pages/chat" ] && mv src/pages/chat/* src/features/chat/pages/ || true
[ -d "src/features/chat/ui" ] && mv src/features/chat/ui/* src/features/chat/components/ || true
[ -d "src/features/chat/model" ] && mv src/features/chat/model/* src/features/chat/state/ || true

# Dashboard
[ -d "src/pages/dashboard" ] && mv src/pages/dashboard/* src/features/dashboard/pages/ || true
[ -d "src/features/dashboard/ui" ] && mv src/features/dashboard/ui/* src/features/dashboard/components/ || true
[ -d "src/widgets/analytics" ] && mv src/widgets/analytics/* src/features/dashboard/components/ || true
[ -d "src/widgets/ai-advisor" ] && mv src/widgets/ai-advisor/* src/features/dashboard/components/ || true

# Services & History
[ -d "src/pages/services" ] && mv src/pages/services/* src/features/services/pages/ || true
[ -d "src/features/history/ui" ] && mv src/features/history/ui/* src/features/services/components/ || true
[ -d "src/entities/service" ] && mv src/entities/service/* src/features/services/domain/ || true

# Profile / Settings
[ -d "src/pages/profile" ] && mv src/pages/profile/* src/features/profile/pages/ || true
[ -d "src/features/profile/ui" ] && mv src/features/profile/ui/* src/features/profile/components/ || true
[ -d "src/entities/user" ] && mv src/entities/user/* src/features/profile/domain/ || true
[ -d "src/entities/client" ] && mv src/entities/client/* src/features/profile/domain/ || true

# Staff
[ -d "src/widgets/staff" ] && mv src/widgets/staff/* src/features/staff/components/ || true
[ -d "src/entities/staff" ] && mv src/entities/staff/* src/features/staff/domain/ || true

# Navigation
[ -d "src/shared/layout" ] && mv src/shared/layout/* src/features/navigation/components/ || true
[ -d "src/widgets/navigation" ] && mv src/widgets/navigation/* src/features/navigation/components/ || true

# Clean up empty directories
rm -rf src/pages src/widgets src/entities src/shared src/features/agenda src/features/history

# Create feature barrels
for d in src/features/*; do
  if [ -d "$d" ]; then
    echo "export * from './components';" > "$d/index.ts"
    if [ -d "$d/pages" ]; then
      echo "export * from './pages';" >> "$d/index.ts"
    fi
  fi
done

# Move theme
mkdir -p src/theme
[ -f "src/index.css" ] && mv src/index.css src/theme/globals.css || true

