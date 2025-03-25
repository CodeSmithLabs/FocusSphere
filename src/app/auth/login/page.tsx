// app/auth/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useUserProfile } from '@/context/UserProfileContext';
import siteConfig from '@/lib/config/site';

import { authFormSchema, authFormValues } from '@/lib/types/validations';
import config from '@/lib/config/auth';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/Card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/Form';
import { Icons } from '@/components/Icons';
import { ProfileCreationLoader } from '@/components/ProfileCreationLoader';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { refreshUserProfile } = useUserProfile();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const form = useForm<authFormValues>({
    resolver: zodResolver(authFormSchema),
    defaultValues: { email: '', password: '' }
  });

  const { register, handleSubmit, setError, reset, formState } = form;
  const isSubmitting = formState.isSubmitting;

  const onSubmit = async (values: authFormValues) => {
    setErrorMessage(null);
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values)
      });

      const data = await response.json();

      if (!response.ok) {
        reset({ email: values.email, password: '' });
        setError('email', { type: 'root.serverError', message: data.error });
        return;
      }

      if (data.profile) {
        await refreshUserProfile();
        router.push(config.redirects.toDashboard);
      } else {
        setIsCreatingProfile(true);

        const profileResponse = await fetch('/api/auth/create-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ userId: data.user.id, email: data.user.email })
        });

        if (profileResponse.ok) {
          await refreshUserProfile();
          router.push(config.redirects.toDashboard);
        } else {
          setIsCreatingProfile(false);
          setErrorMessage('Profile creation failed. Please tryy again later')
        }
      }
    } catch (error: any) {
      setIsCreatingProfile(false);
      console.error('Login error;',error)
      setErrorMessage('An error occured. Please try again later')
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="bg-background-light dark:bg-background-dark">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Login to {siteConfig.name}
          </CardTitle>
          <CardDescription>Enter your email and password below</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email"
                        className="bg-background-light dark:bg-background-dark"
                        {...field}
                        {...register('email')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password"
                          className="bg-background-light dark:bg-background-dark"
                          {...field}
                          {...register('password')}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 cursor-pointer">
                          {showPassword ? (
                            <Icons.EyeOffIcon
                              className="h-6 w-6"
                              onClick={togglePasswordVisibility}
                            />
                          ) : (
                            <Icons.EyeIcon className="h-6 w-6" onClick={togglePasswordVisibility} />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
                <Icons.Lock className="mr-2 h-4 w-4" />
                Sign In
              </Button>

              {errorMessage && <p className='text-red text-center'>errorMessage</p>}
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col">
            <div className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/signup"
                className="leading-7 text-focussphere-blue hover:text-focussphere-blue-dark"
              >
                Sign up here.
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Show the loader when profile is being created */}
      {isCreatingProfile && <ProfileCreationLoader />}
    </div>
  );
}
