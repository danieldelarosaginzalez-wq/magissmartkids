import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00368F] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[#00368F] text-white hover:bg-[#2E5BFF]",
        secondary: "border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200",
        destructive: "border-transparent bg-red-600 text-white hover:bg-red-700",
        outline: "text-gray-900 border-gray-200 hover:bg-gray-50",
        success: "border-transparent bg-[#00C764] text-white hover:bg-green-600",
        warning: "border-transparent bg-[#F5A623] text-gray-900 hover:bg-yellow-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }