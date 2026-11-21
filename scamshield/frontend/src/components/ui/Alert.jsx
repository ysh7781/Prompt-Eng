import React from 'react'
import { cn } from '../../utils/cn.js'

const Alert = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
  const variantClasses = {
    default: 'border-[#E5EDF5] bg-[#F4F9FF] text-[#172B4D]',
    destructive: 'border-rose-200 bg-rose-50 text-rose-800',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    warning: 'border-amber-200 bg-amber-50 text-amber-800',
    info: 'border-[#E5EDF5] bg-[#EAF3FF] text-[#172B4D]',
  }

  return (
    <div
      ref={ref}
      role="alert"
      className={cn('relative w-full rounded-lg border p-4 text-sm', variantClasses[variant], className)}
      {...props}
    />
  )
})
Alert.displayName = 'Alert'

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5 ref={ref} className={cn('mb-1 font-semibold leading-none tracking-tight text-[#172B4D]', className)} {...props} />
))
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-sm text-[#64748B] [&_p]:leading-relaxed', className)} {...props} />
))
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription }
