import React from 'react'
import { cn } from '../../utils/cn.js'

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[120px] w-full rounded-lg border border-[#E5EDF5] bg-white px-3.5 py-2.5 text-sm text-[#172B4D] placeholder:text-[#94A3B8] shadow-sm transition-colors focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15 disabled:cursor-not-allowed disabled:bg-[#F4F9FF] disabled:opacity-60 resize-y',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = 'Textarea'

export { Textarea }

