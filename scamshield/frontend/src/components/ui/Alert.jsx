import React from 'react'
import { cn } from '../../utils/cn.js'
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

const Alert = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
  const variantClasses = {
    default: 'border-white/10 bg-white/5 text-white/80',
    destructive: 'border-red-500/30 bg-red-500/10 text-red-400',
    success: 'border-green-500/30 bg-green-500/10 text-green-400',
    warning: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
    info: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
  }

  return (
    <div
      ref={ref}
      role="alert"
      className={cn('relative w-full rounded-lg border p-4', variantClasses[variant], className)}
      {...props}
    />
  )
})
Alert.displayName = 'Alert'

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5 ref={ref} className={cn('mb-1 font-medium leading-none tracking-tight', className)} {...props} />
))
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
))
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription }

