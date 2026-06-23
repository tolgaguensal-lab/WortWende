"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full font-medium whitespace-nowrap transition-all select-none hover:scale-[1.02] active:scale-[0.97] transition-transform duration-150 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-border bg-transparent text-foreground hover:bg-muted",
        ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        gold: "bg-accent text-accent-foreground hover:bg-accent/90",
        accent: "bg-accent text-accent-foreground hover:bg-accent-hover shadow-lg shadow-accent/25 font-extrabold",
      },
      size: {
        sm: "h-9 px-4 text-[13px] font-medium min-h-[44px]",
        md: "h-[44px] px-5 text-[15px] font-semibold",
        lg: "h-[52px] px-7 text-base font-semibold",
        xl: "h-[60px] px-9 text-lg font-bold",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  success?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, success, children, ...props }, ref) => {
    const [isSuccess, setIsSuccess] = React.useState(false)

    React.useEffect(() => {
      if (success) {
        setIsSuccess(true)
        const timer = setTimeout(() => setIsSuccess(false), 1500)
        return () => clearTimeout(timer)
      }
    }, [success])

    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, className }),
          isSuccess && "bg-success text-success-foreground"
        )}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin size-[18px]"
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
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.291z"
            />
          </svg>
        ) : isSuccess ? (
          <svg
            className="size-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
