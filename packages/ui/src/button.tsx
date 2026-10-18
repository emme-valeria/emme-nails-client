import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@emme/ui/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding text-[14px] font-semibold tracking-tight whitespace-nowrap transition-all duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] outline-none select-none focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 cursor-pointer [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4.5",
  {
    variants: {
      variant: {
        default: "bg-primary text-white shadow-[0_8px_24px_rgba(0,113,227,0.25)] border border-white/20 hover:brightness-105 hover:shadow-[0_12px_28px_rgba(0,113,227,0.32)]",
        outline:
          "border border-white/40 dark:border-white/10 bg-white/80 dark:bg-white/[0.08] text-[#1D1D1F] dark:text-white shadow-[0_4px_16px_rgba(0,0,0,0.04)] backdrop-blur-md hover:bg-white dark:hover:bg-white/[0.12]",
        secondary:
          "bg-black/[0.04] dark:bg-white/[0.08] text-[#1D1D1F] dark:text-white border border-white/30 dark:border-white/10 hover:bg-black/[0.07] dark:hover:bg-white/[0.12] backdrop-blur-sm",
        ghost:
          "hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-[#1D1D1F] dark:text-white",
        glass:
          "backdrop-blur-[20px] bg-white/70 dark:bg-white/10 text-foreground border border-white/40 dark:border-white/15 shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:bg-white/90 dark:hover:bg-white/20",
        destructive:
          "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 shadow-2xs",
        link: "text-primary underline-offset-4 hover:underline !min-h-0 !p-0 !h-auto",
      },
      size: {
        default:
          "min-h-[44px] h-12 gap-2.5 px-6 rounded-full text-sm",
        xs: "min-h-[36px] h-9 gap-1.5 px-3.5 text-xs rounded-full font-bold",
        sm: "min-h-[44px] h-11 gap-2 px-4.5 text-xs rounded-full font-semibold",
        lg: "min-h-[48px] h-14 gap-3 px-8 text-base rounded-full font-bold",
        icon: "min-h-[44px] min-w-[44px] size-11 rounded-full",
        "icon-xs": "min-h-[36px] min-w-[36px] size-9 rounded-full",
        "icon-sm": "min-h-[44px] min-w-[44px] size-10 rounded-full",
        "icon-lg": "min-h-[48px] min-w-[48px] size-14 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
