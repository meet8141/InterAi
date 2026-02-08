import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    (<textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-[20px] border-2 border-[#e5d5c8] bg-white/90 backdrop-blur-sm px-4 py-3 text-sm text-[#1f2937] transition-all duration-300 placeholder:text-[#9ca3af] font-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6b5b] focus-visible:border-[#4a6b5b] focus-visible:shadow-soft disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#f5ebe0] hover:border-[#4a6b5b] hover:bg-white resize-y shadow-sm hover:shadow-soft",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Textarea.displayName = "Textarea"

export { Textarea }
