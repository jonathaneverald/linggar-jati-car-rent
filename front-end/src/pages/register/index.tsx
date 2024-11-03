import React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, Phone, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const RegisterPage: React.FC = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        phoneNumber: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Add your registration logic here
            // For example:
            // await register(formData);
            // router.push("/login");

            console.log("Registration attempt with:", formData);
        } catch (err) {
            setError("Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow numbers and plus symbol
        const value = e.target.value.replace(/[^\d+]/g, "");
        setFormData({ ...formData, phoneNumber: value });
    };

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
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {/* Name Field */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input id="name" type="text" placeholder="Enter your full name" className="pl-9" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input id="email" type="email" placeholder="Enter your email" className="pl-9" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="Create a password" className="pl-9" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                                    <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                                    </Button>
                                </div>
                            </div>

                            {/* Address Field */}
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <div className="relative">
                                    <Home className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input id="address" type="text" placeholder="Enter your address" className="pl-9" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
                                </div>
                            </div>

                            {/* Phone Number Field */}
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input id="phoneNumber" type="tel" placeholder="Enter your phone number" className="pl-9" value={formData.phoneNumber} onChange={handlePhoneNumberChange} required />
                                </div>
                            </div>

                            <Button className="w-full" type="submit" disabled={isLoading}>
                                {isLoading ? "Creating account..." : "Register"}
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
