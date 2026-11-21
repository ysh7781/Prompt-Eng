import React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '../../utils/cn.js'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.99]',
  {
    variants: {
      variant: {
        default: 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-sm',
        destructive: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm',
        outline: 'border border-[#E5EDF5] bg-white text-[#172B4D] hover:bg-[#F4F9FF] hover:border-[#CBD5E1] shadow-sm',
        ghost: 'text-[#64748B] hover:bg-[#F4F9FF] hover:text-[#172B4D]',
        secondary: 'bg-[#EAF3FF] text-[#172B4D] hover:bg-[#DCEBFF]',
        link: 'text-[#2563EB] underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-lg px-6 text-base font-semibold',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = 'Button'

export { Button, buttonVariants }
