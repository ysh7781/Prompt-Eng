import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '../hooks/useAuth.js'
import { Button } from '../components/ui/Button.jsx'
import { Input } from '../components/ui/Input.jsx'
import { Label } from '../components/ui/Label.jsx'
import { Alert, AlertDescription } from '../components/ui/Alert.jsx'
import { Spinner } from '../components/ui/Spinner.jsx'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [apiError, setApiError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const passwordValue = watch('password', '')

  const onSubmit = async (data) => {
    setApiError(null)
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Registration failed. Please try again.'
      setApiError(message)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#172B4D] tracking-tight">Create Account</h2>
        <p className="text-sm text-[#64748B] mt-1.5">Start safeguarding your digital communications</p>
      </div>

      {apiError && (
        <Alert variant="destructive" className="mb-5">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      )}

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="Jane Doe"
            {...register('name')}
            className={errors.name ? 'border-rose-300' : ''}
            autoComplete="name"
          />
          {errors.name && (
            <p className="text-xs text-rose-600">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="jane@example.com"
            {...register('email')}
            className={errors.email ? 'border-rose-300' : ''}
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-xs text-rose-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password')}
              className={errors.password ? 'border-rose-300 pr-10' : 'pr-10'}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#172B4D] transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-[11px] text-[#64748B]">Use 8+ characters with uppercase letter and number.</p>
          {errors.password && (
            <p className="text-xs text-rose-600">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            {...register('confirmPassword')}
            className={errors.confirmPassword ? 'border-rose-300' : ''}
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <p className="text-xs text-rose-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-11 text-sm font-semibold shadow-sm mt-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Spinner size="sm" />
              Creating account...
            </span>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-[#64748B]">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-[#2563EB] hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  )
}

export default RegisterPage
