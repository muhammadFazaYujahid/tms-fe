import React, { useEffect } from 'react';
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';

import { useRouter } from 'next/router';

import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import '../styles/uikit/customCss.scss';

export default function MyApp({ Component, pageProps }) {

    const router = useRouter();

    useEffect(() => {
        // Fix for react-beautiful-dnd getComputedStyle error
        const style = document.createElement('style');
        style.textContent = '* { transition: none !important; animation: none !important; }';
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, [router.asPath]);

    if (Component.getLayout) {
        return (
            <LayoutProvider>
                {Component.getLayout(<Component {...pageProps} />)}
            </LayoutProvider>
        )
    } else {
        return (
            <LayoutProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </LayoutProvider>
        );
    }
}
