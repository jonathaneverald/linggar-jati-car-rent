import React from "react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { z } from "zod";
import useUserProfile from "@/hooks/useAuthenticatedUser";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useLogin from "@/hooks/useLogin";
import { LoginResponse } from "@/types/login";
import { setToken } from "@/utils/tokenUtils";

const FormSchema = z.object({
    email: z.string().email("Invalid email address!"),
    password: z.string().min(6, "Password must be at least 6 characters long!"),
});

type FormData = z.infer<typeof FormSchema>;

const LoginPage: React.FC = () => {
    const router = useRouter();
    const { fetchUserData } = useUserProfile();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { onSubmit, loading, error } = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleFormSubmit = async (data: z.infer<typeof FormSchema>) => {
        const response = (await onSubmit(data)) as LoginResponse;

        if (response) {
            setToken(response.data.access_token);
            const role = response.data.user.role_id;

            await fetchUserData();
            if (role == 1) {
                router.push("/admin/dashboard");
            } else {
                router.push("/cars");
            }
        }
    };

    return (
        <>
            <Head>
                <title>Login - Linggar Jati</title>
                <meta name="description" content="Login to your account" />
            </Head>

            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Linggar Jati Rent Car</CardTitle>
                        <CardDescription className="text-center">Enter your email and password to login</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input {...register("email")} id="email" type="email" placeholder="Enter your email" className="pl-9" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input {...register("password")} id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" className="pl-9" required />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                                    </Button>
                                </div>
                            </div>

                            <Button className="w-full" type="submit" disabled={isLoading}>
                                {isLoading ? "Logging in..." : "Login"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <div className="text-sm text-center text-gray-500">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="font-semibold text-primary hover:underline">
                                Register here
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
};

export default LoginPage;
