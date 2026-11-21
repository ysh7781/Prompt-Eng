import React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../utils/cn.js'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-[#E5EDF5] bg-[#F4F9FF] text-[#172B4D]',
        secondary: 'border-[#E5EDF5] bg-white text-[#64748B]',
        low: 'border-emerald-200 bg-emerald-50 text-emerald-800',
        moderate: 'border-amber-200 bg-amber-50 text-amber-800',
        high: 'border-orange-200 bg-orange-50 text-orange-800',
        critical: 'border-rose-200 bg-rose-50 text-rose-800',
        neutral: 'border-[#E5EDF5] bg-[#EAF3FF] text-[#172B4D]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
