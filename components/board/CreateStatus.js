import { Button } from 'primereact/button';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { emit, on } from '../../utils/EventEmitter';
// import socket from '../../../utils/Socket';
import { InputText } from 'primereact/inputtext';
import { Controller, useForm } from 'react-hook-form';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { TaskStatusService } from '../../services/TaskStatusService';

const CreateStatus = ({ projectKey }) => {
    const { showToast } = useContext(LayoutContext);

    const defaultValues = {
        status_name: ''
    };
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        data.project_key = projectKey;
        // data.activity = {
        //     action: 'has Change Task Parent to',
        //     old_value: selectedTask.task_key,
        //     new_value: '',
        //     type: 'history',
        //     task_key: taskKey,
        //     url: window.location.href,
        //     additional_text: ''
        // }
        const taskStatusService = new TaskStatusService();
        taskStatusService.createStatus(data)
            .then((res) => {
                if (!res.success) {
                    return showToast({
                        severity: 'error',
                        summary: 'Create Status Failed',
                        detail: res.message,
                        sticky: false
                    });
                }
                emit('refreshBoard');
                showToast({
                    severity: 'success',
                    summary: 'Create Status Success',
                    detail: 'Status Created successfully',
                    sticky: false
                });
                // if (data.success) {
                // }
            });
    };


    return (<>

        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='col-12'>
                <Controller
                    name='status_name'
                    control={control}
                    render={({ field }) => (
                        <>
                            <InputText {...field} className='w-full' placeholder='status name' />
                        </>
                    )}
                />

            </div>

            <div className='col-12' style={{ float: "right" }}>
                <Button className='mx-2 p-button-sm py-2 px-3 mb-2' label="Create" style={{ float: "right" }} />
            </div>

        </form>
    </>);
};

export default CreateStatus;
