import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, Phone, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useRegister from "@/hooks/useRegister";

const FormSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    address: z.string().min(5, "Address must be at least 5 characters long"),
    phone_number: z.string().min(10, "Phone number must be at least 10 digits long"),
});

type FormData = z.infer<typeof FormSchema>;

const RegisterPage: React.FC = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const { onSubmit, loading, error, success } = useRegister();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(FormSchema),
    });

    const handleFormSubmit = async (data: FormData) => {
        try {
            await onSubmit(data);
            if (success) {
                reset(); // Reset form after successful submission
            }
        } catch (error) {
            console.error("Registration error:", error);
        }
    };

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                router.push("/login");
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [success, router]);

    return (
        <>
            <Head>
                <title>Register - Linggar Jati</title>
                <meta name="description" content="Create a new account" />
            </Head>

            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
                        <CardDescription className="text-center">Enter your details to register</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {success && (
                                <Alert className="border-green-500 bg-green-50">
                                    <AlertDescription className="text-green-600">Registration successful! Redirecting to login...</AlertDescription>
                                </Alert>
                            )}

                            {/* Name Field */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input {...register("name")} id="name" type="text" placeholder="Enter your full name" className="pl-9" />
                                </div>
                                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input {...register("email")} id="email" type="email" placeholder="Enter your email" className="pl-9" />
                                </div>
                                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input {...register("password")} id="password" type={showPassword ? "text" : "password"} placeholder="Create a password" className="pl-9" />
                                    <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                                    </Button>
                                </div>
                                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                            </div>

                            {/* Address Field */}
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <div className="relative">
                                    <Home className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input {...register("address")} id="address" type="text" placeholder="Enter your address" className="pl-9" />
                                </div>
                                {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
                            </div>

                            {/* Phone Number Field */}
                            <div className="space-y-2">
                                <Label htmlFor="phone_number">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input {...register("phone_number")} id="phone_number" type="tel" placeholder="Enter your phone number" className="pl-9" />
                                </div>
                                {errors.phone_number && <p className="text-sm text-red-500">{errors.phone_number.message}</p>}
                            </div>

                            <Button className="w-full" type="submit" disabled={loading}>
                                {loading ? "Creating account..." : "Register"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <div className="text-sm text-center text-gray-500">
                            Already have an account?{" "}
                            <Link href="/login" className="font-semibold text-primary hover:underline">
                                Login here
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
};

export default RegisterPage;
