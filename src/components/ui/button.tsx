import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 rounded-2xl",
  {
    variants: {
      variant: {
        default: "bg-craft-teal text-white hover:bg-craft-teal-dark shadow-lg hover:shadow-xl transform hover:scale-105 text-lg",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-2 border-craft-teal text-craft-teal bg-white hover:bg-craft-teal hover:text-white text-lg",
        secondary:
          "bg-craft-cream text-foreground hover:bg-gray-100 border border-gray-200 text-lg",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-craft-teal underline-offset-4 hover:underline font-medium text-lg",
        "craft-outline": "border-2 border-craft-teal text-craft-teal bg-white hover:bg-craft-teal hover:text-white text-lg",
        "craft-warm": "bg-craft-orange text-white hover:bg-craft-brown shadow-lg hover:shadow-xl transform hover:scale-105 text-lg",
      },
      size: {
        default: "px-8 py-4",
        sm: "px-6 py-3 text-sm",
        lg: "px-10 py-5 text-xl",
        xl: "px-12 py-6 text-2xl",
        icon: "h-12 w-12",
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
