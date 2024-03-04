import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { TaskServices } from '../../services/TaskServices';
import { emit, on } from '../../utils/EventEmitter';
// import socket from '../../../utils/Socket';
import { InputText } from 'primereact/inputtext';
import { SelectButton } from 'primereact/selectbutton';
import { Controller, useForm } from 'react-hook-form';
import { debounce } from 'lodash';
import { LayoutContext } from '../../layout/context/layoutcontext';

const EditParent = ({ taskKey, parent_key }) => {
    const { showToast } = useContext(LayoutContext);

    const defaultValues = {
        parent_key: ''
    };
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        data.parent_key = selectedTask.task_key;
        data.task_key = taskKey;
        data.activity = {
            action: 'has Change Task Parent to',
            old_value: selectedTask.task_key,
            new_value: '',
            type: 'history',
            task_key: taskKey,
            url: window.location.href,
            additional_text: ''
        }

        const taskServices = new TaskServices();
        taskServices.editParent(data)
            .then((res) => {
                if (!res.success) {
                    return showToast({
                        severity: 'error',
                        summary: 'Edit Parent Failed',
                        detail: res.message,
                        sticky: false
                    });
                }
                emit('refreshTaskDialog');
                emit('refreshActivity');
                showToast({
                    severity: 'success',
                    summary: 'Change Parent Success',
                    detail: 'Parent Task Change successfully',
                    sticky: false
                });
                // if (data.success) {
                // }
            });
    };
    const buttonOptions = ['Link Issue', 'Web Link'];
    const [selectedIssue, setSelectedIssue] = useState('');

    const issueRef = useRef(null);

    const [selectedTask, setSelectedTask] = useState([]);

    const [taskList, setTaskList] = useState(['']);

    const handleFilter = debounce((event) => {
        const filterText = event.filter;

        const taskServices = new TaskServices;
        taskServices.searchTask({ task_name: filterText, task_key: taskKey }).then((res) => {
            setTaskList(res);
        });
    }, 1000);

    const TaskOptionTemplate = (option) => {
        return (
            <div className="flex-block">
                <p className='font-medium m-0'>{option.task_name}</p>
                <p className='text-gray-500 m-0'>{option.task_key}</p>
            </div>
        );
    };

    return (<>

        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='col-12'>
                <Controller
                    name='parent_key'
                    control={control}
                    render={({ field }) => (
                        <>
                            <Dropdown
                                ref={issueRef}
                                value={selectedTask}
                                onChange={(e) => { setSelectedTask(e.value); }}
                                options={taskList}
                                optionLabel="task_name"
                                itemTemplate={TaskOptionTemplate}
                                className='w-full'
                                filter
                                placeholder="Search Task"
                                maxSelectedLabels={3}
                                emptyFilterMessage={<div>
                                    Task not found, {' '}
                                </div>}
                                onFilter={handleFilter} />
                        </>
                    )}
                />

            </div>

            <div className='col-12' style={{ float: "right" }}>
                <Button className='mx-2 p-button-sm py-2 px-3 mb-2' label="Save" style={{ float: "right" }} />
            </div>

        </form>
    </>);
};

export default EditParent;
