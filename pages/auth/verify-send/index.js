import getConfig from 'next/config';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { Avatar } from 'primereact/avatar';
import { classNames } from 'primereact/utils';
import Head from 'next/head';

const verifyAccount = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    return (<>
        <Head>
            <title>Check Email | Project Manager</title>
        </Head>
        <div className={containerClassName}>
            <div className="align-items-center justify-content-center">
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8 md:w-40rem" style={{ borderRadius: '53px' }}>

                        <div className='text-center' style={{ justifyContent: "center" }}>
                            <Avatar image={`${contextPath}/demo/images/assets/checked.png`} style={{ width: "175px", height: "175px" }} shape="circle" />
                            <label htmlFor="email1" className="block text-900 text-xl align-center text-center font-medium mb-2">
                                Thanks for joining us
                            </label>
                            <p>your account has been created. please check your email for setting up your account</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
};

verifyAccount.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
        </React.Fragment>
    );
};
export default verifyAccount;
