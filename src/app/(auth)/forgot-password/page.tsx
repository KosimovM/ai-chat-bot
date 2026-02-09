"use client";

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
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Mail } from "lucide-react";

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
        console.log("Reset link sent to:", data.email);
        setIsSubmitted(true);
        setIsLoading(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <Card className="w-[380px] shadow-xl backdrop-blur-md bg-card/80 border-white/20 dark:border-white/10 dark:bg-card/50">
                <CardHeader className="space-y-1 text-center">
                    {isSubmitted ? (
                        <div className="flex justify-center mb-2">
                            <CheckCircle2 className="h-10 w-10 text-green-500" />
                        </div>
                    ) : null}
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        {isSubmitted ? "Check your email" : "Reset password"}
                    </CardTitle>
                    <CardDescription>
                        {isSubmitted
                            ? "We have sent a password reset link to your email."
                            : "Enter your email using which you signed up. We will send you a reset link."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium leading-none">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="email"
                                            {...register("email", { required: "Email is required" })}
                                            placeholder="name@example.com"
                                            className={errors.email ? "pl-9 border-destructive animate-[shake_0.18s_ease-in-out]" : "pl-9"}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-xs text-destructive">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>
                                <Button className="w-full mt-2" type="submit" isLoading={isLoading} size="lg">
                                    Send Reset Link
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <Button className="w-full mt-2" variant="outline" asChild>
                            <Link href="/auth/login">Back to Login</Link>
                        </Button>
                    )}
                </CardContent>
                {!isSubmitted && (
                    <CardFooter className="flex flex-col gap-2">
                        <Link
                            href="/auth/login"
                            className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Login
                        </Link>
                    </CardFooter>
                )}
            </Card>
        </motion.div>
    );
}
