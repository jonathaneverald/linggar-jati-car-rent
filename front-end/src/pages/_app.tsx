import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const excludeLayout = router.pathname === "/login" || router.pathname === "/register" || router.pathname === "/404" || router.pathname === "/";
    return (
        <Provider store={store}>
            {!excludeLayout ? (
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            ) : (
                <>
                    <Component {...pageProps} />
                </>
            )}
        </Provider>
    );
}
