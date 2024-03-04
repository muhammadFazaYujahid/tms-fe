import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { TaskServices } from '../../../services/TaskServices';
import { emit, on } from '../../../utils/EventEmitter';
import socket from '../../../utils/Socket';
import { InputText } from 'primereact/inputtext';
import { SelectButton } from 'primereact/selectbutton';
import { Controller, useForm } from 'react-hook-form';
import { debounce } from 'lodash';
import { LayoutContext } from '../../../layout/context/layoutcontext';

const AddIssue = ({ taskKey, taskName }) => {
    const { showToast } = useContext(LayoutContext);

    const defaultValues = {
        issue: "",
        issued_task: "",
        link_text: "",
        task_key: "",
        type: "",
        web_link: "",
    };
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        data.issue = selectedIssue.name;
        data.issued_task = selectedTask.task_key;
        data.task_key = taskKey;
        data.type = issueType;
        data.activity = {
            action: 'added an issue for task ' + taskName,
            old_value: '',
            new_value: '',
            type: 'history',
            task_key: taskKey,
            url: window.location.href,
            additional_text: ''
        }

        const taskServices = new TaskServices();
        taskServices.createIssue(data)
            .then((res) => {
                if (!res.success) {
                    return showToast({
                        severity: 'error',
                        summary: 'Invitation Failed',
                        detail: res.message,
                        sticky: false
                    });
                }
                emit('refreshTaskDialog');
                emit('refreshTaskDetail');
                emit('refreshActivity');
                showToast({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Issue Created',
                    sticky: false
                });
                // if (data.success) {
                // }
            });
    };
    const buttonOptions = ['Link Issue', 'Web Link'];
    const [issueType, seIssueType] = useState(buttonOptions[0]);
    const [isLinkIssue, setIsLinkIssue] = useState(true);

    const issues = [
        { name: "is blocked by" },
        { name: "blocks" },
        { name: "is clone by" },
        { name: "clones" },
        { name: "is duplicated by" },
        { name: "duplicates" },
        { name: "relates to" }
    ];
    const [selectedIssue, setSelectedIssue] = useState(issues[0]);

    const getIssueType = (type) => {
        seIssueType(type);
        (type == "Link Issue") ? setIsLinkIssue(true) : setIsLinkIssue(false);
    }

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
                <SelectButton className='text-center mb-5 w-full p-button-sm' value={issueType} onChange={(e) => getIssueType(e.value)} options={buttonOptions} />

                {(isLinkIssue) ? <>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon p-0">
                            <Controller
                                name='issue'
                                control={control}
                                // rules={{ required: 'User is required.' }}
                                render={({ field }) => (
                                    <>
                                        <Dropdown
                                            value={selectedIssue}
                                            style={{ backgroundColor: "transparent", border: "none" }}
                                            defaultValue={issues[0]}
                                            onChange={(e) => setSelectedIssue(e.value)} options={issues} optionLabel="name"
                                            className="m-0 p-0" />
                                    </>
                                )}
                            />
                        </span>

                        <Controller
                            name='task'
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
                </> : <>
                    <div className="p-inputgroup mt-2">

                        <Controller
                            name='web_link'
                            control={control}
                            render={({ field }) => (
                                <>
                                    <InputText placeholder="URL" {...field} />
                                </>
                            )}
                        />
                        <Controller
                            name='link_text'
                            control={control}
                            render={({ field }) => (
                                <>
                                    <InputText placeholder="Link Text" {...field} />
                                </>
                            )}
                        />
                    </div>
                </>}

            </div>

            <div className='col-12' style={{ float: "right" }}>
                <Button onClick={() => emit('closeAddIssue')} className=' mx-2  p-button-sm p-button-secondary p-button-outlined' style={{ float: "right" }} label="Cancel" />
                <Button className='mx-2 p-button-sm' label="Create" style={{ float: "right" }} />
            </div>

        </form>
    </>);
};

export default AddIssue;
