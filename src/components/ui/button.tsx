import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl",
        outline:
          "border-2 border-primary bg-background text-primary hover:bg-primary hover:text-primary-foreground rounded-xl craft-hover",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl",
        ghost: "hover:bg-accent hover:text-accent-foreground rounded-xl",
        link: "text-primary underline-offset-4 hover:underline",
        
        // Craft-inspired variants
        "craft-teal": "craft-teal text-white shadow-craft hover:shadow-warm rounded-2xl font-semibold craft-hover",
        "craft-orange": "craft-orange text-white shadow-warm hover:shadow-craft rounded-2xl font-semibold craft-hover",
        "craft-warm": "craft-warm text-white shadow-warm hover:shadow-craft rounded-2xl font-semibold craft-hover",
        "craft-outline": "border-2 border-craft-teal bg-background text-craft-teal hover:craft-teal hover:text-white rounded-2xl font-semibold craft-hover",
        "craft-paper": "paper-bg text-foreground border border-border shadow-paper hover:shadow-craft rounded-2xl font-medium craft-hover",
        
        // Premium variants with craft styling
        premium: "craft-warm text-white shadow-warm hover:shadow-craft font-semibold rounded-2xl craft-hover",
        glow: "craft-teal text-white shadow-craft hover:shadow-warm font-semibold rounded-2xl animate-gentle-pulse",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 px-4 py-2 text-sm",
        lg: "h-12 px-8 py-3 text-base",
        xl: "h-16 px-12 py-4 text-lg font-semibold",
        icon: "h-11 w-11",
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
