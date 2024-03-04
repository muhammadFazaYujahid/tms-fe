import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import React, { useContext, useEffect, useRef, useState } from 'react';
// import socket from '../../../utils/Socket';
import { InputText } from 'primereact/inputtext';
import { SelectButton } from 'primereact/selectbutton';
import { Controller, useForm } from 'react-hook-form';
import { debounce } from 'lodash';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { emit } from '../../utils/EventEmitter';
import { TaskServices } from '../../services/TaskServices';
import { TaskStatusService } from '../../services/TaskStatusService';

const DeleteStatus = ({ statusData }) => {
    const { showToast } = useContext(LayoutContext);
    const [selectedStatus, setSelectedStatus] = useState(statusData)
    const [category, setCategory] = useState(null);
    const [taskStatus, setTaskStatus] = useState([])

    useEffect(() => {
        const taskService = new TaskServices();
        taskService.getTaskStatus(sessionStorage.getItem('project_key')).then((data) => { setTaskStatus(data) });

    }, [selectedStatus])


    const defaultValues = {
        destination_status: taskStatus[0]
    };
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        data.status_key = selectedStatus.status_key;
        // data.destination_status = data.destination_status.status_key;
        data.activity = {
            action: 'Deleted ' + selectedStatus.name + ' Status and move existing task to',
            object_one: data.destination_status.name,
            object_two: '',
            type: 'project',
            related_code: sessionStorage.getItem('project_key'),
            url: window.location.href,
            additional_text: ''
        }

        // console.log('dataaa', data);

        const taskStatusService = new TaskStatusService();
        taskStatusService.deleteStatus(data)
            .then((res) => {
                if (!res.success) {
                    return showToast({
                        severity: 'error',
                        summary: 'Delete Status Failed',
                        detail: res.message,
                        sticky: false
                    });
                }
                emit('refreshBoard');
                emit('closeStatusDialog');
                showToast({
                    severity: 'success',
                    summary: 'Delete Status Success',
                    detail: 'Status Deleted successfully',
                    sticky: false
                });
                // if (data.success) {
                // }
            });
    };

    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error mt-5">{errors[name].message}</small> : <small className="p-error mt-5">&nbsp;</small>;
    };

    return (<>

        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='col-12'>
                <div className="p-inputgroup mt-2 justify-content-between">

                    <div className='mr-5'>
                        <span>This Status will be deleted:</span>
                        <h5 className='font-medium text-red-500'>{selectedStatus.name}</h5>
                    </div>
                    <div className='mr-5'>
                        <h6>Move existing Task to:</h6>
                        <Controller
                            name='destination_status'
                            control={control}
                            rules={{ required: 'Please Select Status' }}
                            render={({ field }) => (
                                <>
                                    <Dropdown
                                        style={{ margin: "-0.6em 0" }} size="small"
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.value)}
                                        placeholder="Select Status"
                                        options={taskStatus.filter((data) => data.status_key !== selectedStatus.status_key)}
                                        optionLabel="name"
                                        className="w-full mb-1" />
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}
                        />
                    </div>
                </div>

            </div>

            <div className='col-12' style={{ float: "right" }}>
                <Button className='mx-2 p-button-sm' label="Delete" style={{ float: "right" }} />
            </div>

        </form>
    </>);
};

export default DeleteStatus;
