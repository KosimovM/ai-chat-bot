'use client';

import { ThemeToggle } from "../../../../components/ThemeToggle";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Eye, EyeOff, Lock, Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

import { Button } from "../../../../components/Button";
import { Input } from "../../../../components/Input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../../../components/ui/Card";

type ResetPasswordFormValues = {
    password: string;
    confirmPassword: string;
};

export default function ResetPasswordPage() {
    const router = useRouter();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordFormValues>();
    const [isLoading, setIsLoading] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data: ResetPasswordFormValues) => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsCompleted(true);
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 -mt-24 -mr-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-24 -ml-24 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl" />

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
                    <h1 className="text-3xl font-black tracking-tighter text-foreground">New Password</h1>
                    <p className="text-muted-foreground font-medium mt-2">Create a secure password for your account</p>
                    <div className="mt-2">
                        <ThemeToggle />
                    </div>
                </div>

                <Card className="border-none shadow-2xl shadow-black/10 bg-card/80 backdrop-blur-xl">
                    <AnimatePresence mode="wait">
                        {!isCompleted ? (
                            <motion.div
                                key="reset-form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <CardHeader className="space-y-1 pb-4">
                                    <CardTitle className="text-xl font-bold">Secure Your Access</CardTitle>
                                    <CardDescription>
                                        Enter a new password that you haven't used before.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <Lock className="absolute left-3.5 top-11 h-4 w-4 text-muted-foreground z-10" />
                                                <Input
                                                    label="New Password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    error={errors.password?.message}
                                                    {...register("password", {
                                                        required: "Password is required",
                                                        minLength: { value: 8, message: "At least 8 characters" }
                                                    })}
                                                    className="pl-10 rounded-2xl"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword((prev) => !prev)}
                                                    className="absolute right-3 top-11 text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                            <div className="relative">
                                                <Lock className="absolute left-3.5 top-11 h-4 w-4 text-muted-foreground z-10" />
                                                <Input
                                                    label="Confirm New Password"
                                                    type="password"
                                                    placeholder="••••••••"
                                                    error={errors.confirmPassword?.message}
                                                    {...register("confirmPassword", {
                                                        required: "Please confirm your password",
                                                        validate: (value) => value === watch("password") || "Passwords do not match"
                                                    })}
                                                    className="pl-10 rounded-2xl"
                                                />
                                            </div>
                                        </div>
                                        <Button className="w-full h-12 rounded-2xl font-bold shadow-lg shadow-primary/20" type="submit" isLoading={isLoading}>
                                            Update Password
                                        </Button>
                                    </form>
                                </CardContent>
                                <CardFooter className="pt-2 pb-8">
                                    <div className="text-sm text-center w-full text-muted-foreground font-medium">
                                        Remembered your password?{" "}
                                        <Link href="/login" className="text-primary hover:underline font-bold transition-all">
                                            Sign In
                                        </Link>
                                    </div>
                                </CardFooter>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="reset-success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-8 text-center"
                            >
                                <div className="inline-flex h-20 w-20 items-center justify-center rounded-[2rem] bg-green-50 text-green-500 mb-6 border-2 border-green-100 shadow-inner">
                                    <CheckCircle2 className="h-10 w-10" />
                                </div>
                                <CardTitle className="text-2xl font-black mb-2 tracking-tight">All Set!</CardTitle>
                                <CardDescription className="text-base font-medium mb-8">
                                    Your account security has been updated successfully. You can now use your new password to sign in to your workspace.
                                </CardDescription>
                                <Button className="w-full h-14 rounded-[1.25rem] font-black tracking-tight shadow-xl shadow-primary/20 transition-all active:scale-95" asChild>
                                    <Link href="/login">
                                        Continue to Login <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>
            </motion.div>
        </div>
    );
}
