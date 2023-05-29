'use client'
import Button from '@/app/components/Button';
import Input from '@/app/components/inputs/Input';
import { FC, useCallback, useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import AuthSocialButton from './AuthSocialButton';
import { BsGithub, BsGoogle } from 'react-icons/bs'
import registerAction from '../actions/registerAction';
import { toast } from 'react-hot-toast';
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';

interface AuthFormProps { }

type Variant = 'LOGIN' | 'REGISTER'
const AuthForm: FC<AuthFormProps> = () => {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session.status == 'authenticated') {
      router.push('/users')
    }
  }, [session.status, router])
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [loading, setLoading] = useState(false);

  const toggleVariant = useCallback(() => {
    if (variant == 'LOGIN') {
      setVariant('REGISTER')
    } else {
      setVariant('LOGIN')
    }
  }, [variant])

  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setLoading(true)
    if (variant == 'REGISTER') {
      registerAction(data as any).then(res => {
        signIn("credentials", data)
        console.log(res)
      }).catch(err => {
        console.error(err + "")
        toast.error(err + '')
      }).finally(() => {
        setLoading(false)
      })
    }

    if (variant == 'LOGIN') {
      signIn('credentials', {
        ...data,
        redirect: false
      }).then(callback => {
        if (callback?.error) {
          toast.error(callback.error)
        } else if (callback?.ok) {
          toast.success('Logeed in!')
          router.push('/users')
        }
      }).catch(err => {
        toast.error(err + '')
      }).finally(() => {
        setLoading(false)
      })
    }

  }

  const socialAction = (action: string) => {
    setLoading(true)
    signIn(action, {
      redirect: false
    }).then(callback => {
      if (callback?.error) {
        toast.error(callback.error)
      } else if (callback?.ok) {
        toast.success('Logeed in!')
      }
    }).finally(() => {
      setLoading(false)
    })
  }
  return (
    <div className='
    mt-8 sm:mx-auto sm:w-full sm:max-w-md
    '>
      <div className='
      bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10
      '>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant == "REGISTER" && <Input
            id="name"
            label='Name'
            register={register}
            errors={errors}
            disabled={loading}
          />}
          <Input
            id="email"
            label="Email"
            type='email'
            register={register}
            errors={errors}
            disabled={loading}
          />
          <Input
            id="password"
            label="Password"
            type='password'
            register={register}
            errors={errors}
            disabled={loading}
          />
          <Button disabled={loading} fullWidth type="submit">
            {variant == "LOGIN"
              ? "Sign in"
              : "Register"}
          </Button>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <AuthSocialButton icon={BsGithub} onClick={() => {
              socialAction('github')
            }} />
            <AuthSocialButton icon={BsGoogle} onClick={() => {
              socialAction('google')
            }} />
          </div>
        </div>
        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>
            {variant == 'LOGIN'
              ? 'New to Messenger?'
              : 'Already have an account?'}
          </div>
          <div onClick={toggleVariant} className='underline cursor-pointer'>
            {variant == 'LOGIN'
              ? 'Create an account'
              : 'Login'}
          </div>
        </div>
      </div>
    </div>);
}

export default AuthForm;
