'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import { authFormSchema, authFormValues } from '@/lib/types/validations';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/Form';
import { Input } from '@/components/ui/Input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/Card';
import Link from 'next/link';
import config from '@/lib/config/auth';
import { Icons } from '@/components/Icons';

export default function AuthForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<authFormValues>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const {
    register,
    reset,
    setError,
    formState: { isSubmitting }
  } = form;

  const onSubmit = async (values: authFormValues) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      const data = await res.json();

      if (!res.ok) {
        reset({ email: values.email, password: '' });
        setError('email', { type: 'root.serverError', message: data.error });
        setError('password', { type: 'root.serverError', message: '' });
        toast.error(data.error);
        return;
      }

      toast.success('Signup successful! Check your email for verification.');
      router.push(config.routes.checkEmail.link);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="md:w-96">
      <Card className="bg-background-light dark:bg-background-dark">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your email and password below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormMessage />
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...register('email')}
                        placeholder="Email"
                        {...field}
                        className="bg-background-light dark:bg-background-dark"
                      />
                    </FormControl>
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
                          className="bg-background-light dark:bg-background-dark"
                          {...register('password')}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password"
                          {...field}
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
                Create account
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col">
            <div className="text-center text-sm text-gray-500">
              Already a member?{' '}
              <Link href="/auth/login" className="leading-7 text-indigo-600 hover:text-indigo-500">
                Login here.
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
