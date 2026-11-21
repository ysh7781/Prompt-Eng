import React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../utils/cn.js'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-white/20 bg-white/10 text-white',
        low: 'border-green-500/30 bg-green-500/10 text-green-400',
        moderate: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
        high: 'border-orange-500/30 bg-orange-500/10 text-orange-400',
        critical: 'border-red-500/30 bg-red-500/10 text-red-400',
        blue: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
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

