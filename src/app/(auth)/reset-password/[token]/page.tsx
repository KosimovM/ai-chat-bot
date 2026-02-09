"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Eye, EyeOff, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // Здесь в реальном приложении будет запрос на бэкенд с токеном
    setIsCompleted(true);
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="w-full max-w-md mx-auto shadow-xl backdrop-blur-md bg-card/80 border-border/60">
        <CardHeader className="space-y-1 text-center">
          {isCompleted && (
            <div className="flex justify-center mb-2">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
          )}
          <CardTitle className="text-2xl font-bold tracking-tight">
            {isCompleted ? "Password updated" : "Set a new password"}
          </CardTitle>
          <CardDescription>
            {isCompleted
              ? "Your password has been successfully updated. You can now sign in."
              : "Choose a strong password that you don&apos;t use on other sites."}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {!isCompleted ? (
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium leading-none">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    className={errors.password ? "pl-9 pr-10 border-destructive animate-[shake_0.18s_ease-in-out]" : "pl-9 pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium leading-none">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === watch("password") || "Passwords do not match",
                    })}
                    className={errors.confirmPassword ? "pl-9 pr-10 border-destructive animate-[shake_0.18s_ease-in-out]" : "pl-9 pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button className="w-full mt-2" type="submit" isLoading={isLoading} size="lg">
                Update Password
              </Button>
            </form>
          ) : null}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/auth/login")}
          >
            Back to login
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
