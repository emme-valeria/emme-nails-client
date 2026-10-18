import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@emme/ui/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "min-h-[44px] h-12 w-full min-w-0 rounded-2xl border border-white/40 dark:border-white/10 bg-white/70 dark:bg-white/[0.05] backdrop-blur-md px-4.5 py-2.5 text-base sm:text-sm transition-all duration-200 outline-none placeholder:text-[#86868B]/40 focus-visible:ring-4 focus-visible:ring-primary/15 focus-visible:border-primary/40 disabled:pointer-events-none disabled:opacity-40 aria-invalid:ring-3 aria-invalid:ring-destructive/20 font-medium text-[#1D1D1F] dark:text-white shadow-xs",
        className
      )}
      {...props}
    />
  )
}

export { Input }
