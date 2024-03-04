import React, { useRef, useState, useEffect, useContext } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

import { Controller, useForm } from 'react-hook-form';
import { LayoutContext } from '../layout/context/layoutcontext';
import { InputTextarea } from 'primereact/inputtextarea';
import { OrgServices } from '../services/OrgServices';
import { emit } from '../utils/EventEmitter';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';

const EditClient = ({ client }) => {

    const { setContentDialog, showToast } = useContext(LayoutContext);
    const [clientData, setClientData] = useState(client);
    const [editMode, setEditMode] = useState(false);
    const defaultValues = {
        client_name: client.name,
        description: client.description,
    };
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        data.client_key = clientData.client_key;
        data.activity = {
            action: 'Edit a client Data',
            object_one: '',
            object_two: '',
            type: 'organization',
            related_code: clientData.org_key,
            url: window.location.href,
            additional_text: ''
        }

        const orgServices = new OrgServices();
        orgServices.updateClient(data)
            .then((res) => {
                if (!res.success) {
                    return showToast({
                        severity: 'error',
                        summary: 'Edit client fail',
                        detail: 'error: ' + res.error,
                        sticky: false
                    });
                }

                showToast({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Client Updated',
                    sticky: false
                });
                emit('refreshClient');
            });
    };

    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
    };


    const deleteClient = useRef(null);
    const [deleteClientPopup, setDeleteClientPopup] = useState(false);

    const confirmDelete = (event, Client_key) => {
        // 
        // setDeleteClientPopup(true)
        confirmPopup({
            onHide: () => setDeleteClientPopup(false),
            target: event.currentTarget,
            message: 'Delete Client?',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => accept(Client_key),
        });
    };

    const accept = (client_key) => {
        const data = {
            client_key: client_key,
            activity: {
                action: 'Remove a client with name',
                object_one: clientData.name,
                object_two: '',
                type: 'organization',
                related_code: clientData.org_key,
                url: window.location.href,
                additional_text: ''
            }
        }

        const orgServices = new OrgServices();
        orgServices.deleteClient(data)
            .then((res) => {
                if (!res.success) {
                    return showToast({
                        severity: 'error',
                        summary: 'delete Client fail',
                        detail: 'error: ' + res.error,
                        sticky: false
                    });
                }
                showToast({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Client Deleted',
                    sticky: false
                });
                emit('refreshClient');
                // if (data.success) {
                // }
            });
    };


    return (<>
        {(editMode == false) ? <>
            <table className='w-fit p-2 mt-3 ml-5' style={{ borderCollapse: "separate", borderSpacing: "0 15px" }}>
                <tr className=''>
                    <td className='float-top w-8rem' style={{ verticalAlign: "top" }}>
                        <p className='font-medium text-dark'>Client name</p>
                    </td>
                    <td className=''>
                        <h5>{clientData.name}</h5>
                    </td>
                </tr>
                <tr className=''>
                    <td className='float-top' style={{ verticalAlign: "top" }}>
                        <p className='font-medium text-dark'>Description</p>
                    </td>
                    <td className=''>
                        <h5>{clientData.description}</h5>
                    </td>
                </tr>
            </table>
            <div className='col-12'>
                <Button style={{ float: "right" }} onClick={() => setEditMode(true)} className='mx-2' label="Edit" />
                <Button style={{ float: "right" }} onClick={(e) => { setDeleteClientPopup(true); confirmDelete(e, clientData.client_key) }} className='mx-2 p-button-danger' label="Delete" />

                <ConfirmPopup visible={deleteClientPopup} />
            </div>
        </> : <>

            <form onSubmit={handleSubmit(onSubmit)}>

                <table className='w-fit p-2 mt-3 ml-5' style={{ borderCollapse: "separate", borderSpacing: "0 15px" }}>
                    <tr className=''>
                        <td className='float-top w-8rem' style={{ verticalAlign: "top" }}>
                            <p className='font-medium text-dark'>Client name</p>
                        </td>
                        <td className=''>
                            <Controller
                                name='client_name'
                                control={control}
                                rules={{ required: 'Client name is required' }}
                                render={({ field }) => (
                                    <>
                                        {(editMode == false) ?
                                            <h5>{clientData.name}</h5> :
                                            <InputText {...field} type="text" className='w-full' />
                                        }

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
                                        {(editMode == false) ?
                                            <h5>{clientData.description}</h5>
                                            :
                                            <InputTextarea {...field} type="text" className='w-full' />
                                        }
                                    </>
                                )}
                            />
                        </td>
                    </tr>
                </table>
                <div className='col-12'>
                    <Button style={{ float: "right" }} className='mx-2' label="Edit" />
                    <Button style={{ float: "right" }} onClick={() => setEditMode(false)} type='button' className='mx-2 p-button-secondary' label="Cancel" />
                </div>
            </form>
        </>}

    </>
    );
};

export default EditClient;
