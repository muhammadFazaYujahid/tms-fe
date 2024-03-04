import getConfig from 'next/config';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import AppConfig from '../../../layout/AppConfig';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { AuthServices } from '../../../services/AuthServices';


import { Controller, useForm } from 'react-hook-form';
import Link from 'next/link';
import Head from 'next/head';
import { Toast } from 'primereact/toast';

const LoginPage = () => {
    const { layoutConfig, showToast, toast } = useContext(LayoutContext);
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const defaultValues = {
        email: '',
        password: '',
    };
    const {
        control,
        handleSubmit,
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        const authServices = new AuthServices();
        authServices.login(data).then((res) => {
            if (!res.success) {
                return showToast({
                    severity: 'error',
                    summary: 'Login failed',
                    detail: res.message,
                    sticky: false
                });
            }
            window.location = res.redirectUrl;
        })
    };

    return (<>

        <Head>
            <title>Sign In | Project Manager</title>
        </Head>
        <div className={containerClassName}>

            <Toast ref={toast} />
            <div className="flex flex-column align-items-center justify-content-center">
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>

                        <div>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Controller
                                    name='email'
                                    control={control}
                                    render={({ field }) => (
                                        <>

                                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                                Email
                                            </label>
                                            <InputText {...field} placeholder="Email address" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

                                        </>
                                    )}
                                />

                                <Controller
                                    name='password'
                                    control={control}
                                    render={({ field }) => (
                                        <>

                                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                                Password
                                            </label>
                                            <Password className="w-full mb-5" {...field} toggleMask inputClassName='w-full p-3 md:w-30rem' feedback={false} />

                                        </>
                                    )}
                                />


                                <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                    {/* <div className="flex align-items-center">
                                        <Checkbox inputid="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked)} className="mr-2"></Checkbox>
                                        <label htmlFor="rememberme1">
                                            Remember me
                                        </label>
                                    </div> */}
                                    <Link href="/auth/forgot-password" className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                        Forgot password?
                                    </Link>
                                </div>
                                <Button label="Sign In" type='submit' className="w-full p-3 text-xl mb-3"></Button>

                                <span className='mt-4'>Don't have account? <Link href="/auth/register" className="font-medium no-underline text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    register here
                                </Link></span>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </>
    );
};

LoginPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            {/* <AppConfig simple /> */}
        </React.Fragment>
    );
};
export default LoginPage;
