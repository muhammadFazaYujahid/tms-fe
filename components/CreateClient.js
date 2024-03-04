import React, { useRef, useState, useEffect, useContext } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

import { Controller, useForm } from 'react-hook-form';
import { LayoutContext } from '../layout/context/layoutcontext';
import { InputTextarea } from 'primereact/inputtextarea';
import { OrgServices } from '../services/OrgServices';
import { emit } from '../utils/EventEmitter';

const CreateClient = ({ orgKey }) => {

    const { setContentDialog, showToast } = useContext(LayoutContext);
    const defaultValues = {
        client_name: '',
        description: '',
    };
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        data.org_key = orgKey;
        data.activity = {
            action: 'Added a client',
            object_one: '',
            object_two: '',
            type: 'organization',
            related_code: orgKey,
            url: window.location.href,
            additional_text: ''
        }
        const orgServices = new OrgServices();
        orgServices.createClient(data)
            .then((res) => {
                if (!res.success) {
                    return showToast({
                        severity: 'error',
                        summary: 'create task fail',
                        detail: 'error: ' + res.error,
                        sticky: false
                    });
                }

                showToast({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Client Added',
                    sticky: false
                });
                emit('refreshClient');
            });
    };

    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
    };

    return (<>

        <form onSubmit={handleSubmit(onSubmit)}>

            <table className='w-full p-2 mt-3' style={{ borderCollapse: "separate", borderSpacing: "0 15px" }}>
                <tr className=''>
                    <td className='float-top' style={{ verticalAlign: "top" }}>
                        <p className='font-medium text-dark'>Client name</p>
                    </td>
                    <td className=''>
                        <Controller
                            name='client_name'
                            control={control}
                            rules={{ required: 'Client name is required' }}
                            render={({ field }) => (
                                <>
                                    <InputText {...field} type="text" className='w-full' />
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}
                        />
                    </td>
                </tr>
                <tr className=''>
                    <td className='float-top' style={{ verticalAlign: "top" }}>
                        <p className='font-medium text-dark'>Description</p>
                    </td>
                    <td className=''>
                        <Controller
                            name='description'
                            control={control}
                            render={({ field }) => (
                                <>
                                    <InputTextarea {...field} type="text" className='w-full' />
                                </>
                            )}
                        />
                    </td>
                </tr>
            </table>
            <div className='col-12'>
                <Button style={{ float: "right" }} className='mx-2' label="Add Client" />
            </div>
        </form>
    </>
    );
};

export default CreateClient;
