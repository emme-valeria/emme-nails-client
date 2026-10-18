import React from 'react';
import { AppProvider } from '@/app/AppContext';
import { ThemeProvider } from '@/app/ThemeProvider';
import { SidebarProvider } from '@/features/navigation';
import { TooltipProvider } from '@emme/ui';
import { Toaster } from '@emme/ui';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="rose">
      <AppProvider>
        <SidebarProvider>
          <TooltipProvider>
            {children}
            <Toaster position="top-center" richColors />
          </TooltipProvider>
        </SidebarProvider>
      </AppProvider>
    </ThemeProvider>
  );
}


