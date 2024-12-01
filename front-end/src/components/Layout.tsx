import { cn } from "@/lib/utils";
import React from "react";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import Head from "next/head";
import useUserProfile from "@/hooks/useAuthenticatedUser";
import AdminSidebar from "./layouts/AdminSidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading, fetchUserData } = useUserProfile();

    const renderLayoutRoleBased = () => {
        if (isLoading || !user) {
            return null;
        }

        return user.role_id === 1 ? (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex flex-1">
                    <AdminSidebar />
                    <main className="flex-1 overflow-auto p-6 bg-gray-50">{children}</main>
                </div>
                <Footer />
            </div>
        ) : (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
            </div>
        );
    };

    return (
        <>
            <Head>
                <title>Linggar Jati Car Rent</title>
                <meta name="description" content="Linggar Jati is a rent car company." />
                <meta name="keywords" content="Linggar Jati, car rent, rent car company, carslocal economy" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="robots" content="index, follow" />
                <meta name="author" content="Ecomus Team" />
                <link rel="icon" href="https://themesflat.co/html/ecomus/images/logo/favicon.png" type="image/png" />
                <meta property="og:title" content="Linggar Jati" />
                <meta property="og:description" content="Rent car at Linggar Jati to support local company" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://themesflat.co/html/ecomus/images/logo/logo.svg" />
            </Head>
            <div className={cn("min-h-screen bg-background bg-gray-100 font-sans antialiased")}>
                {renderLayoutRoleBased()}

                {/* <Header />

                <main>{children}</main>

                <Footer /> */}
            </div>
        </>
    );
};

export default Layout;
