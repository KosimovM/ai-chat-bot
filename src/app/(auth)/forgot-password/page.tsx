"use client";

import { ThemeToggle } from "@/components/ThemeToggle";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, Mail, Sparkles } from "lucide-react";

type ForgotPasswordFormValues = {
    email: string;
};

export default function ForgotPasswordPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsSubmitted(true);
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 -mt-24 -ml-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute bottom-0 right-0 -mb-24 -mr-24 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8 flex flex-col items-center">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 dark:bg-slate-100 shadow-xl shadow-slate-900/20 mb-4">
                        <Sparkles className="text-white dark:text-slate-900 h-6 w-6" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter text-foreground">Reset Password</h1>
                    <p className="text-muted-foreground font-medium mt-2">No worries, we'll help you get back in</p>
                    <div className="mt-2">
                        <ThemeToggle />
                    </div>
                </div>

                <Card className="border-none shadow-2xl shadow-black/10 bg-card/80 backdrop-blur-xl">
                    <AnimatePresence mode="wait">
                        {!isSubmitted ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <CardHeader className="space-y-1 pb-4">
                                    <CardTitle className="text-xl font-bold">Forgot Password?</CardTitle>
                                    <CardDescription>
                                        Enter your email and we'll send you a recovery link.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-11 h-4 w-4 text-muted-foreground z-10" />
                                            <Input
                                                label="Email Address"
                                                type="email"
                                                placeholder="name@example.com"
                                                error={errors.email?.message}
                                                {...register("email", { required: "Email is required" })}
                                                className="pl-10 rounded-2xl"
                                            />
                                        </div>
                                        <Button className="w-full h-12 rounded-2xl font-bold shadow-lg shadow-primary/20" type="submit" isLoading={isLoading}>
                                            Send Reset Link
                                        </Button>
                                    </form>
                                </CardContent>
                                <CardFooter className="pt-2 pb-8">
                                    <Link
                                        href="/auth/login"
                                        className="flex items-center justify-center w-full text-sm text-muted-foreground hover:text-primary font-bold transition-all"
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to Login
                                    </Link>
                                </CardFooter>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-8 text-center"
                            >
                                <div className="inline-flex h-20 w-20 items-center justify-center rounded-[2rem] bg-green-50 text-green-500 mb-6 border-2 border-green-100 shadow-inner">
                                    <CheckCircle2 className="h-10 w-10" />
                                </div>
                                <CardTitle className="text-2xl font-black mb-2 tracking-tight">Check Your Inbox</CardTitle>
                                <CardDescription className="text-base font-medium mb-8">
                                    We've sent a secure link to your email address. Please follow the instructions to reset your password.
                                </CardDescription>
                                <Button variant="secondary" className="w-full h-12 rounded-2xl font-bold" asChild>
                                    <Link href="/auth/login">Return to Sign In</Link>
                                </Button>
                                <p className="text-xs text-muted-foreground mt-6 font-medium">
                                    Didn't receive the email? <span className="text-primary cursor-pointer hover:underline">Resend link</span>
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>
            </motion.div>
        </div>
    );
}
