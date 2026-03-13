"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Github, Mail, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);
        setIsSubmitted(true);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 bg-primary/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 bg-blue-500/20 rounded-full blur-[120px]" />
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all mb-6">
                        <div className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center">
                            <Send className="h-3 w-3 text-white" />
                        </div>
                        <span className="font-bold text-sm text-white">AI Support</span>
                    </Link>
                    <h1 className="text-3xl font-black text-white tracking-tight">Recover access</h1>
                    <p className="text-slate-400 mt-2 font-medium">We'll send you instructions to reset your password.</p>
                </div>

                <AnimatePresence mode="wait">
                    {!isSubmitted ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="border-none shadow-2xl shadow-black/50 bg-slate-900/50 backdrop-blur-xl ring-1 ring-white/10 rounded-[2.5rem] overflow-hidden">
                                <form onSubmit={handleSubmit}>
                                    <CardHeader className="p-8 pb-4">
                                        <CardTitle className="text-white">Email Lookup</CardTitle>
                                        <CardDescription className="text-slate-400">Enter your registered email address</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-8 pt-6 space-y-4">
                                        <Input
                                            label="Email Address"
                                            placeholder="johndoe@example.com"
                                            type="email"
                                            required
                                            className="bg-slate-950/50 border-white/10 text-white rounded-2xl h-12 focus:ring-primary/20"
                                            icon={<Mail className="h-4 w-4 text-slate-500" />}
                                        />
                                    </CardContent>
                                    <CardFooter className="p-8 flex flex-col gap-4 bg-white/[0.02] border-t border-white/5">
                                        <Button
                                            type="submit"
                                            className="w-full h-12 rounded-2xl text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all"
                                            isLoading={isLoading}
                                        >
                                            Send Reset Link
                                        </Button>
                                        <Link href="/auth/login" className="w-full">
                                            <Button variant="ghost" className="w-full text-slate-400 hover:text-white hover:bg-white/5 flex items-center justify-center gap-2">
                                                <ArrowLeft className="h-4 w-4" />
                                                Back to login
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </form>
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="border-none shadow-2xl shadow-black/50 bg-slate-900/50 backdrop-blur-xl ring-1 ring-white/10 rounded-[2.5rem] p-8 text-center space-y-6">
                                <div className="mx-auto h-20 w-20 rounded-3xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-2">
                                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-white">Check your email</h3>
                                    <p className="text-slate-400 font-medium">We've sent a recovery link to your inbox. Please check your spam folder if you don't see it.</p>
                                </div>
                                <div className="pt-4">
                                    <Link href="/auth/login" className="w-full">
                                        <Button className="w-full h-12 rounded-2xl font-bold bg-white text-slate-900 hover:bg-slate-100">
                                            Return to login
                                        </Button>
                                    </Link>
                                </div>
                                <p className="text-sm text-slate-500">
                                    Didn't get the email? <button onClick={() => setIsSubmitted(false)} className="text-primary font-bold hover:underline">Try again</button>
                                </p>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
