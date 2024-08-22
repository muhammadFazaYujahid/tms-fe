import { Button } from 'primereact/button';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { emit, on } from '../../utils/EventEmitter';
// import socket from '../../../utils/Socket';
import { InputText } from 'primereact/inputtext';
import { Controller, useForm } from 'react-hook-form';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { TaskStatusService } from '../../services/TaskStatusService';
import { ColorPicker } from 'primereact/colorpicker';
import { Checkbox } from "primereact/checkbox";

const CreateStatus = ({ projectKey }) => {
    const { showToast } = useContext(LayoutContext);
    const [color, setColor] = useState("fefefe");
    const [needVerify, setNeedVerify] = useState(false);

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
        data.color = `#${(color === null) ? "f4f4f4" : color}`;
        data.need_verify = needVerify;
        // data.activity = {
        //     action: 'has Change Task Parent to',
        //     old_value: selectedTask.task_key,
        //     new_value: '',
        //     type: 'history',
        //     task_key: taskKey,
        //     url: window.location.href,
        //     additional_text: ''
        // }
        console.log('data', data)
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
                            <div className='mt-3'>
                                <label>Color : </label>
                                <ColorPicker value={color} onChange={(e) => setColor(e.value)} />
                            </div>

                            <div className="mt-3 d-flex" style={{ display: "flex" }}>
                                <Checkbox inputId="ingredient1" onChange={e => setNeedVerify(e.checked)} checked={needVerify}></Checkbox>
                                <label htmlFor="ingredient1" className="ml-2">Confirmation</label>
                            </div>
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
