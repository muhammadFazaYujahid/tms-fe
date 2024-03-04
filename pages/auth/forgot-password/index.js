import getConfig from 'next/config';
import { useRouter } from 'next/router';
import React, { useContext, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

import { Controller, useForm } from 'react-hook-form';
import { AuthServices } from '../../../services/AuthServices';
import Head from 'next/head';
import { Toast } from 'primereact/toast';
import Link from 'next/link';

const ForgotPassword = () => {
    const { layoutConfig, showToast, toast } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const defaultValues = {
        email: '',
    };
    const failToast = useRef('');

    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        const authServices = new AuthServices();
        authServices.requestResetPassword(data)
            .then((res) => {
                if (!res.success) {
                    return showToast({
                        severity: 'error',
                        summary: 'Rest Password failed',
                        detail: res.message,
                        sticky: false
                    });
                }
                window.location = '/auth/reset-password-send'
            })
    };

    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
    };
    return (<>
        <Head>
            <title>Forgot Password | Project Manager</title>
        </Head>
        <div className={containerClassName}>

            <Toast ref={toast} />

            <div className="align-items-center justify-content-center" style={{ width: "500px" }}>
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <h4 className='text-center mb-5'>Forgot Password</h4>
                        <div>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Controller
                                    name='email'
                                    control={control}
                                    rules={{ required: 'Email is Required' }}
                                    render={({ field }) => (
                                        <>

                                            <InputText {...field} placeholder="Please input your email address" className="w-full" style={{ padding: '1rem' }} />

                                            {getFormErrorMessage(field.name)}
                                        </>
                                    )}
                                />
                                <div className="align-items-center justify-content-between mb-5">
                                </div>
                                <Button label="Reset Password" type='submit' className="w-full p-3 text-xl"></Button>
                            </form>
                            <div className='text-center mt-2'>
                                <Link href="/auth/login" className="font-medium no-underline ml-2 text-center cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    Back to Login
                                </Link>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </>
    );
};

ForgotPassword.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            {/* <AppConfig simple /> */}
        </React.Fragment>
    );
};
export default ForgotPassword;
