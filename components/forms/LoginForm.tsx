'use client'
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRef, useState } from 'react'
import { loginSchema, LoginFormData } from '@/validations/loginSchema'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
// import ReCAPTCHA from 'react-google-recaptcha'
import { useAuthStore } from '@/stores/authStore'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner';

// const SITE_KEY = '6LeFgMgrAAAAAGehIUtOK_vcQntvFc_wE_Vvzsja'

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  // const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const setUser = useAuthStore((state) => state.setUser)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  // const recaptchaRef = useRef<ReCAPTCHA>(null)
  const onSubmit = async (data: LoginFormData) => {
    if (submitting || redirecting) return
    setError("")
    // if (!captchaToken) {
    //   setError('Please complete the reCAPTCHA')
    //   return
    // }
    setSubmitting(true)
    try {
      const json = await api("/login", {
        method: "POST",
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      })
      toast.success("Voila! You Have Logged in Successfully...🎉")
      localStorage.setItem("token", json.accessToken)
      setUser(json.user)
      setRedirecting(true)
      router.replace('/events')
    } catch (err: any) {
      setError(err.message || "Login failed")
      setSubmitting(false)
    }
  }


  return (
    <div className={cn('flex flex-col gap-6')}>
      <Card className="overflow-hidden p-0 bg-linear-to-r from-[#D8E8FB] to-white ">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold text-black">App Admin Login</h1>
                <p className="text-muted-foreground text-balance">
                  Welcome back! Login to continue.
                </p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email" className='text-black'>Email</Label>
                <Input
                  disabled={submitting || redirecting}
                  type="email"
                  className="w-full text-black !bg-gray-100"
                  placeholder="Enter your email"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="grid gap-3 relative">
                <div className="flex items-center">
                  <Label htmlFor="password" className='text-black'>Password</Label>
                  <a
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline text-black"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  disabled={submitting || redirecting}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pr-10 text-black !bg-gray-100"
                  placeholder="Enter your password"
                  {...register('password')}
                />
                <button
                  disabled={submitting || redirecting}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Google reCAPTCHA */}
              {/* <div>
                <ReCAPTCHA
                  sitekey={SITE_KEY}
                  ref={recaptchaRef}
                  onChange={(token) => setCaptchaToken(token)}
                  onExpired={() => setCaptchaToken(null)}
                />
              </div> */}

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button
                type="submit"
                disabled={submitting || redirecting}
                className="
                  w-full px-4 py-2 rounded-lg
                  bg-sky-800 text-white font-semibold
                  transition duration-200 ease-in-out
                  hover:bg-sky-900 active:scale-95
                  flex items-center justify-center gap-2
                  disabled:opacity-60 disabled:cursor-not-allowed
                  shadow-md hover:shadow-lg
                "
              >
                {redirecting
                  ? 'Redirecting...'
                  : submitting
                    ? 'Authenticating...'
                    : 'Login'}
              </Button>
            </div>
          </form>

          <div className="bg-muted relative hidden md:block">
            <Image
              src="/aig_login.jpg"
              alt="AIG Hospital"
              className="object-cover h-full w-full"
              width={500}
              height={500}
              priority
              loading="eager"
              unoptimized
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
