import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-magic text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-target-magic",
  {
    variants: {
      variant: {
        // Primary MagicSmartKids variants
        default: "bg-primary text-white hover:bg-primary-700 focus-visible:ring-primary-500 shadow-magic hover:shadow-magic-lg active:transform active:scale-95",
        primary: "bg-primary text-white hover:bg-primary-700 focus-visible:ring-primary-500 shadow-magic hover:shadow-magic-lg active:transform active:scale-95",
        secondary: "bg-secondary text-white hover:bg-secondary-700 focus-visible:ring-secondary-500 shadow-magic hover:shadow-magic-lg active:transform active:scale-95",
        
        // Magic color variants
        magic: "bg-magic-gradient text-white hover:opacity-90 focus-visible:ring-primary-500 shadow-magic-lg hover:shadow-magic-glow active:transform active:scale-95",
        "magic-warm": "bg-magic-gradient-warm text-white hover:opacity-90 focus-visible:ring-magic-orange-500 shadow-magic hover:shadow-magic-lg active:transform active:scale-95",
        "magic-cool": "bg-magic-gradient-cool text-white hover:opacity-90 focus-visible:ring-magic-blue-500 shadow-magic hover:shadow-magic-lg active:transform active:scale-95",
        
        // Semantic variants
        success: "bg-success text-white hover:bg-success-600 focus-visible:ring-success-500 shadow-magic hover:shadow-magic-lg active:transform active:scale-95",
        warning: "bg-warning text-magic-gray-900 hover:bg-warning-600 focus-visible:ring-warning-500 shadow-magic hover:shadow-magic-lg active:transform active:scale-95",
        error: "bg-error text-white hover:bg-error-600 focus-visible:ring-error-500 shadow-magic hover:shadow-magic-lg active:transform active:scale-95",
        info: "bg-info text-white hover:bg-info-600 focus-visible:ring-info-500 shadow-magic hover:shadow-magic-lg active:transform active:scale-95",
        
        // Outline variants
        outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-white focus-visible:ring-primary-500 transition-all duration-200",
        "outline-secondary": "border-2 border-secondary bg-transparent text-secondary hover:bg-secondary hover:text-white focus-visible:ring-secondary-500 transition-all duration-200",
        "outline-success": "border-2 border-success bg-transparent text-success hover:bg-success hover:text-white focus-visible:ring-success-500 transition-all duration-200",
        "outline-warning": "border-2 border-warning bg-transparent text-warning-700 hover:bg-warning hover:text-magic-gray-900 focus-visible:ring-warning-500 transition-all duration-200",
        "outline-error": "border-2 border-error bg-transparent text-error hover:bg-error hover:text-white focus-visible:ring-error-500 transition-all duration-200",
        
        // Ghost variants
        ghost: "bg-transparent text-primary hover:bg-primary-50 hover:text-primary-700 focus-visible:ring-primary-500",
        "ghost-secondary": "bg-transparent text-secondary hover:bg-secondary-50 hover:text-secondary-700 focus-visible:ring-secondary-500",
        "ghost-success": "bg-transparent text-success hover:bg-success-50 hover:text-success-700 focus-visible:ring-success-500",
        "ghost-warning": "bg-transparent text-warning-700 hover:bg-warning-50 hover:text-warning-800 focus-visible:ring-warning-500",
        "ghost-error": "bg-transparent text-error hover:bg-error-50 hover:text-error-700 focus-visible:ring-error-500",
        
        // Special variants
        link: "bg-transparent text-primary underline-offset-4 hover:underline hover:text-primary-700 focus-visible:ring-primary-500 shadow-none",
        sparkle: "bg-magic-gradient text-white hover:opacity-90 focus-visible:ring-primary-500 shadow-magic-glow animate-magic-sparkle",
        
        // Legacy support (for gradual migration)
        destructive: "bg-error text-white hover:bg-error-600 focus-visible:ring-error-500 shadow-magic hover:shadow-magic-lg active:transform active:scale-95",
      },
      size: {
        xs: "h-7 px-2 text-xs rounded-magic",
        sm: "h-8 px-3 text-xs rounded-magic",
        default: "h-10 px-4 py-2 rounded-magic",
        lg: "h-12 px-6 text-base rounded-magic-lg",
        xl: "h-14 px-8 text-lg rounded-magic-lg",
        icon: "h-10 w-10 rounded-magic",
        "icon-sm": "h-8 w-8 rounded-magic",
        "icon-lg": "h-12 w-12 rounded-magic-lg",
      },
      animation: {
        none: "",
        bounce: "hover:animate-magic-bounce",
        pulse: "hover:animate-magic-pulse",
        float: "animate-magic-float",
        wiggle: "hover:animate-magic-wiggle",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    animation,
    asChild = false, 
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const isDisabled = disabled || loading;
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, animation, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && (
          <span className="mr-2 flex items-center">
            {leftIcon}
          </span>
        )}
        {children}
        {!loading && rightIcon && (
          <span className="ml-2 flex items-center">
            {rightIcon}
          </span>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }