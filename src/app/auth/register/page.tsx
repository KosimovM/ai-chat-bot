'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useChatStore } from '@/store/useChatStore';
import Link from 'next/link';

interface RegisterForm {
    email: string;
    name: string;
}

export default function RegisterPage() {
    const router = useRouter();
    const login = useChatStore((state) => state.login);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>();

    const onSubmit = async (data: RegisterForm) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        login({
            id: `user-${Date.now()}`,
            name: data.name,
            email: data.email,
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`
        });
        router.push('/dashboard/chats');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        Create an account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Get started with AI Customer Support
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            error={errors.name}
                            registration={register('name', { required: 'Name is required' })}
                        />
                        <Input
                            label="Email address"
                            type="email"
                            placeholder="demo@example.com"
                            error={errors.email}
                            registration={register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address'
                                }
                            })}
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        isLoading={isSubmitting}
                    >
                        Create account
                    </Button>

                    <div className="text-center text-sm">
                        <span className="text-gray-500">Already have an account? </span>
                        <Link href="/auth/login" className="font-semibold text-slate-900 hover:underline">
                            Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
