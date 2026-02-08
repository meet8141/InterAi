import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[28px] text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-[#2d5f5f] text-white hover:bg-[#1a4d4d] shadow-soft hover:shadow-lg transform hover:-translate-y-0.5",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-soft hover:shadow-lg active:scale-95",
        outline:
          "border-2 border-[#e5d5c8] bg-white/80 backdrop-blur-sm hover:bg-[#f5ebe0] hover:border-[#4a6b5b] text-[#1f2937] hover:text-[#2d5f5f] shadow-sm hover:shadow-soft",
        secondary:
          "bg-[#f5ebe0]/80 backdrop-blur-sm text-[#1f2937] hover:bg-[#f4cdb8] border border-[#e5d5c8] shadow-sm hover:shadow-soft",
        ghost: "hover:bg-[#f5ebe0] text-[#4b5563] hover:text-[#1f2937]",
        link: "text-[#2d5f5f] underline-offset-4 hover:underline hover:text-[#1a4d4d]",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-[20px] px-4 text-sm",
        lg: "h-14 rounded-[40px] px-10 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />)
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
