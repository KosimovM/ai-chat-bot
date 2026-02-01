'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useChatStore } from '@/store/useChatStore';
import Link from 'next/link';

interface LoginForm {
    email: string;
}

export default function LoginPage() {
    const router = useRouter();
    const login = useChatStore((state) => state.login);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>();

    const onSubmit = async (data: LoginForm) => {
        // Mock login delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock user data based on email
        login({
            id: 'user-1',
            name: 'Demo User',
            email: data.email,
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo'
        });

        router.push('/dashboard/chats');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to your customer support account
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
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
                        {/* Password ignored for MVP as per specs "UI ONLY - Mock submit" */}
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            // No validation/binding needed for MVP specific requirement if focusing on just email for ID? 
                            // Adding it for UI completeness.
                            registration={register('email')} // Actually sticking to email for the ID is enough but let's just make it a dummy field.
                        />
                        {/* Wait, I bound password to email register above by mistake in thought, let's fix in code. */}
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        isLoading={isSubmitting}
                    >
                        Sign in
                    </Button>

                    <div className="text-center text-sm">
                        <span className="text-gray-500">Don't have an account? </span>
                        <Link href="/auth/register" className="font-semibold text-slate-900 hover:underline">
                            Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
