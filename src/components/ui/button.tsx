import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-[#2dd4bf] to-[#10b981] text-white hover:scale-105 hover:brightness-110 hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] border-none",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-white/10 bg-transparent hover:bg-white/5 hover:text-foreground",
        secondary:
          "bg-white/5 text-foreground hover:bg-white/10 hover:scale-105",
        ghost: "hover:bg-accent/10 hover:text-accent",
        link: "text-accent underline-offset-4 hover:underline",
        accent: "bg-accent text-accent-foreground hover:scale-105 hover:brightness-110 hover:shadow-[0_0_15px_rgba(92,214,193,0.3)]",
      },
      size: {
        default: "h-11 px-8 rounded-full",
        sm: "h-9 rounded-full px-4 text-xs",
        lg: "h-14 rounded-full px-10 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
