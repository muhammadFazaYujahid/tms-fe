import { Button } from 'primereact/button';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { TaskServices } from '../../services/TaskServices';
// import socket from '../../../utils/Socket';
import { InputText } from 'primereact/inputtext';
import { Controller, useForm } from 'react-hook-form';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { emit } from '../../utils/EventEmitter';
import { TaskStatusService } from '../../services/TaskStatusService';
import { ColorPicker } from 'primereact/colorpicker';
import { Checkbox } from 'primereact/checkbox';

const EditName = ({ selectedStatus }) => {
    const { showToast } = useContext(LayoutContext);
    const [statusData, setStatusData] = useState({ status_name: selectedStatus.name, status_key: selectedStatus.status_key, color: selectedStatus.color, need_verify: selectedStatus.need_verify });
    const [needVerify, setNeedVerify] = useState(statusData.need_verify);
    const defaultValues = {
        status_name: statusData.status_name,
        status_key: statusData.status_key
    };
    const [color, setColor] = useState(statusData.color);
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        const new_status_name = data.status_name;
        data.activity = {
            action: 'Change Status Name',
            object_one: statusData.status_name,
            object_two: new_status_name,
            type: 'project',
            related_code: statusData.status_key,
            url: window.location.href,
            additional_text: ''
        }
        data.color = `${(color === null) ? "#f4f4f4" : color}`;
        data.need_verify = needVerify;
        const taskStatusService = new TaskStatusService();
        taskStatusService.editStatusName(data)
            .then((res) => {
                if (!res.success) {
                    return showToast({
                        severity: 'error',
                        summary: 'edit failed',
                        detail: res.message,
                        sticky: false
                    });
                }
                emit('refreshBoard');
                showToast({
                    severity: 'success',
                    summary: 'Status Name Updated',
                    detail: 'Status Name Updated successfully',
                    sticky: false
                });
                // if (data.success) {
                // }
            });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h5>Change Status</h5>
            <div className='col-12'>

                <Controller
                    name='status_name'
                    control={control}
                    render={({ field }) => (
                        <>
                            <InputText id="link_text" {...field} className='w-full' type="text" />
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
                <Button className='mx-2' label="Save" style={{ float: "right" }} />
            </div>
        </form>);
};

export default EditName;
