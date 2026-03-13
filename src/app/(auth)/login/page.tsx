"use client";

import { ThemeToggle } from "@/components/ThemeToggle";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";
import { useAuthStore } from "@/store/useAuthStore";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, Github, Chrome, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type LoginFormValues = {
    email: string;
    password: string;
};

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>();
    const { login } = useAuthStore();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        try {
            await login(data);
            router.push("/dashboard/chats");
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
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
                <div className="text-center mb-8">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 shadow-xl shadow-slate-900/20 mb-4 transform -rotate-6">
                        <Sparkles className="text-white h-6 w-6" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter text-slate-900">Welcome Back</h1>
                    <p className="text-muted-foreground font-medium mt-2">Log in to manage your AI workspace</p>
                    <div className="flex flex-col items-center">
                        <ThemeToggle />
                    </div>
                </div>

                <Card className="border-none shadow-2xl shadow-black/10 bg-card/80 backdrop-blur-xl">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-xl font-bold">Sign In</CardTitle>
                        <CardDescription>
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-4">
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
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-sm font-medium text-foreground/80">Password</label>
                                        <Link
                                            href="/auth/forgot-password"
                                            className="text-xs font-bold text-primary hover:opacity-80 transition-opacity"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground z-10" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            error={errors.password?.message}
                                            {...register("password", { required: "Password is required" })}
                                            className="pl-10 rounded-2xl"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <Button className="w-full h-12 rounded-2xl font-bold shadow-lg shadow-primary/20" type="submit" isLoading={isLoading}>
                                Sign In
                            </Button>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border/50" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest">
                                <span className="bg-background px-3 text-muted-foreground">
                                    Or Continue With
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="secondary" className="rounded-xl h-11 transition-all hover:bg-muted" type="button" disabled={isLoading}>
                                <Github className="h-4 w-4 mr-2" /> Github
                            </Button>
                            <Button variant="secondary" className="rounded-xl h-11 transition-all hover:bg-muted" type="button" disabled={isLoading}>
                                <Chrome className="h-4 w-4 mr-2" /> Google
                            </Button>
                        </div>
                    </CardContent>
                    <CardFooter className="pt-2 pb-8">
                        <div className="text-sm text-center w-full text-muted-foreground font-medium">
                            New to Antigravity?{" "}
                            <Link href="/auth/register" className="text-primary hover:underline font-bold transition-all">
                                Create an account
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
