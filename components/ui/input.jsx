import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-[20px] border-2 border-[#e5d5c8] bg-white/90 backdrop-blur-sm px-4 py-2 text-sm text-[#1f2937] ring-offset-background transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#9ca3af] font-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6b5b] focus-visible:border-[#4a6b5b] focus-visible:shadow-soft disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#f5ebe0] hover:border-[#4a6b5b] hover:bg-white shadow-sm hover:shadow-soft",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }
