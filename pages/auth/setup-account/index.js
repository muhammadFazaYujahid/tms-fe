import getConfig from 'next/config';
import React, { useContext, useRef, useState } from 'react';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { Avatar } from 'primereact/avatar';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';

import { Controller, useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { AuthServices } from '../../../services/AuthServices';
import Head from 'next/head';

const AccountVerified = ({ token, invited }) => {
    const { layoutConfig } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const toast = useRef(null);
    const showToast = ({ severity, summary, detail, sticky }) => {
        toast.current.show({ severity: severity, summary: summary, detail: detail, sticky: sticky });
    };
    const defaultValues = {
        username: '',
        password: '',
    };
    const {
        register,
        control,
        formState: { errors },
        handleSubmit,
        watch
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        data.token = token;
        data.invited = invited;
        const authServices = new AuthServices();
        authServices.setupAccount(data).then((res) => {
            if (res) {
                show();
                window.location = '/auth/login'
            }
            // window.location = '/autn/login'
        })
    };

    const show = () => {
        toast.current.show({
            severity: 'success',
            sticky: false,
            className: 'border-none',
            content: (
                <div className="flex flex-column align-items-center" style={{ flex: '1' }}>
                    <div className="text-center">
                        <i className="pi pi-check-circle" style={{ fontSize: '3rem' }}></i>
                        <div className="font-bold text-xl my-3">Creating account Success</div>
                    </div>
                </div>
            )
        });
    };
    const password = useRef({});
    password.current = watch('password', '');

    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
    };
    return (<>

        <Head>
            <title>Setup Account | Project Manager</title>
        </Head>
        <div className={containerClassName}>

            <Toast ref={toast} position="bottom-center" />

            <div className="align-items-center justify-content-center">
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8 md:w-40rem" style={{ borderRadius: '53px' }}>

                        <div className='text-center' style={{ justifyContent: "center" }}>
                            <Avatar image={`${contextPath}/demo/images/assets/checked.png`} style={{ width: "175px", height: "175px" }} shape="circle" />
                            <label htmlFor="email1" className="block text-900 text-xl align-center text-center font-medium mb-2">
                                Almost done, Let's set your username and password
                            </label>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className='grid'>
                                    <div className="col-12">
                                        <div className="card border-none p-fluid">
                                            <div className="field">
                                                <Controller
                                                    name='username'
                                                    rules={{ required: 'Usrename is required' }}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <>
                                                            <InputText {...field} placeholder='Username' type="text" />
                                                            {getFormErrorMessage(field.name)}
                                                        </>
                                                    )}
                                                />
                                            </div>
                                            <div className="field">
                                                <Controller
                                                    name='password'
                                                    control={control}
                                                    rules={{
                                                        required: 'Password is required',
                                                        minLength: {
                                                            value: 8,
                                                            message: 'Password must be at least 8 characters',
                                                        },
                                                    }}
                                                    render={({ field }) => (
                                                        <>
                                                            <Password
                                                                value={field.value}
                                                                onChange={(e) => field.onChange(e.target.value)}
                                                                onBlur={field.onBlur}
                                                                toggleMask
                                                                placeholder='Password'
                                                                type="text" />
                                                            {getFormErrorMessage(field.name)}
                                                        </>
                                                    )}
                                                />
                                            </div>
                                            <div className="field">
                                                <Controller
                                                    name='confirmPassword'
                                                    control={control}
                                                    rules={{
                                                        required: 'Confirm Password is required',
                                                        validate: (value) =>
                                                            value === password.current || 'The passwords do not match',
                                                    }}
                                                    render={({ field }) => (
                                                        <>
                                                            <Password
                                                                value={field.value}
                                                                onChange={(e) => field.onChange(e.target.value)}
                                                                onBlur={field.onBlur}
                                                                toggleMask
                                                                placeholder='Confirm Password'
                                                                feedback={false}
                                                                type="text" />
                                                            {getFormErrorMessage(field.name)}
                                                        </>
                                                    )}
                                                />
                                            </div>

                                        </div>

                                    </div>
                                    <div className='col-12'>
                                        <Button style={{ float: "right" }} type='submit' className='mx-2' label="Save" />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
};


export async function getServerSideProps(context) {
    const { query } = context;
    const { token, invited } = query;

    return {
        props: {
            token,
            invited,
        },
    };
}

AccountVerified.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            {/* <AppConfig simple /> */}
        </React.Fragment>
    );
};
export default AccountVerified;
