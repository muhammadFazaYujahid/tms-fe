import { Button } from 'primereact/button';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { TaskServices } from '../../../services/TaskServices';
import { emit, on } from '../../../utils/EventEmitter';
import socket from '../../../utils/Socket';
import { InputText } from 'primereact/inputtext';
import { Controller, useForm } from 'react-hook-form';
import { LayoutContext } from '../../../layout/context/layoutcontext';

const EditName = ({ data, fileId, fileName, taskKey }) => {
    const { showToast } = useContext(LayoutContext);
    const [fileData, setFileData] = useState({ fileId: data.id, fileName: data.attach_name });
    const defaultValues = {
        attachId: fileData.fileId,
        attach_name: fileData.fileName
    };
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        data.activity = {
            action: 'Change a Attachment Name',
            old_value: fileId,
            new_value: '',
            type: 'history',
            task_key: taskKey,
            url: window.location.href,
            additional_text: ''
        }
        const taskServices = new TaskServices();
        taskServices.EditAttachmentName(data)
            .then((res) => {
                if (!res.success) {
                    return showToast({
                        severity: 'error',
                        summary: 'edit failed',
                        detail: res.message,
                        sticky: false
                    });
                }
                emit('refreshAttachment');
                emit('refreshActivity');
                setFileData({ fileId: data.id, attach_name: data.attach_name })
                showToast({
                    severity: 'success',
                    summary: 'File Name Updated',
                    detail: 'File Name Updated successfully',
                    sticky: false
                });
                // if (data.success) {
                // }
            });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h5>Change File Name</h5>
            <div className='col-12'>

                <Controller
                    name='attach_name'
                    control={control}
                    render={({ field }) => (
                        <>
                            <InputText id="link_text" {...field} className='w-full' type="text" />
                        </>
                    )}
                />
            </div>

            <div className='col-12' style={{ float: "right" }}>
                <Button className='mx-2' label="Save" style={{ float: "right" }} />
            </div>
        </form>);
};

export default EditName;
