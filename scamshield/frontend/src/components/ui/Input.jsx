import React from 'react'
import { cn } from '../../utils/cn.js'

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-lg border border-[#E5EDF5] bg-white px-3.5 py-2 text-sm text-[#172B4D] placeholder:text-[#94A3B8] shadow-sm transition-colors focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15 disabled:cursor-not-allowed disabled:bg-[#F4F9FF] disabled:opacity-60',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = 'Input'

export { Input }
