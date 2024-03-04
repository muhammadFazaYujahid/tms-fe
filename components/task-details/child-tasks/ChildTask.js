import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { TaskServices } from '../../../services/TaskServices';
import { emit, on } from '../../../utils/EventEmitter';
import socket from '../../../utils/Socket';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { Sidebar } from 'primereact/sidebar';
import TaskDialog from '../../TaskDialog';
import { useRouter } from 'next/router';

const ChildTask = ({ taskKey, taskName }) => {

    const router = useRouter();
    const { showToast } = useContext(LayoutContext);
    const [childTaskDialog, setChildTaskDialog] = useState(false)

    const [category, setCategory] = useState(null);
    const [childData, setChildData] = useState([]);
    const [taskStatus, setTaskStatus] = useState([]);
    useEffect(() => {
        if (taskKey) {
            const taskService = new TaskServices();
            taskService.getChildTask(taskKey).then((res) => setChildData(res.data))

            on('refreshTaskDialog', () => {
                taskService.getChildTask(taskKey).then((res) => setChildData(res.data))

            })
        }
    }, [taskKey])

    useEffect(() => {
        if (taskKey) {
            const taskService = new TaskServices();
            taskService.getTaskStatus(sessionStorage.getItem('project_key')).then((data) => { setTaskStatus(data) });

            on('refreshBacklog', () => {
                taskService.getTaskStatus(sessionStorage.getItem('project_key')).then((data) => { setTaskStatus(data) });

            })
        }
    }, [taskKey])

    useEffect(() => {
        if (taskKey) {
            on('refreshBacklog', () => {
                const taskService = new TaskServices();
                taskService.getTaskStatus(sessionStorage.getItem('project_key')).then((data) => { setTaskStatus(data) });

            })
        }
    }, [taskKey])


    const changeStatus = (data, task_key, task_name) => {
        const formData = { status_key: data.status_key, task_key: task_key, task_name: task_name }
        const taskService = new TaskServices;
        taskService.changeStatus(formData).then((data) => {
            if (data.success) {
                emit('refreshTaskDialog');
                emit('refreshActivity');

                const notifData = { room: sessionStorage.getItem('project_key'), message: 'Task telah diupdate' };
                socket.emit('taskStatusUpdated', notifData);
            }
        })
    }


    const confirmDelete = (event, child_key) => {
        event.stopPropagation();
        confirmPopup({
            target: event.currentTarget,
            message: 'Remove Task From Child?',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => accept(child_key),
        });
    };

    const accept = (child_key) => {
        const data = {
            child_key: child_key,
            activity: {
                action: `remove task ${taskName} child with Key`,
                old_value: child_key,
                new_value: '',
                type: 'history',
                task_key: taskKey,
                url: window.location.href,
                additional_text: ''
            }
        }
        const taskServices = new TaskServices();
        taskServices.removeChild(data)
            .then((res) => {
                if (!res.success) {
                    return showToast({
                        severity: 'error',
                        summary: 'Remove Child Failed',
                        detail: res.message,
                        sticky: false
                    });
                }
                emit('refreshTaskDialog');
                emit('refreshActivity');
                showToast({
                    severity: 'success',
                    summary: 'Remove Child Success',
                    detail: 'Child Removed successfully',
                    sticky: false
                });
                // if (data.success) {
                // }
            });
    };

    const [detailTask, setDetailTask] = useState([])

    const handleTaskUpdate = (updatedTaskData) => {
        setDetailTask(updatedTaskData);
    };

    const handleCloseSidebar = () => {
        setChildTaskDialog(false);
        // Remove the task query parameter from the URL when the sidebar is closed
        router.push({
            pathname: router.pathname,
            query: { ...router.query, task: taskKey },
        });


    };

    const showDetailTask = (task) => {
        router.push({
            pathname: router.pathname,
            query: { ...router.query, task: task.task_key }, // Replace 'task-1' with the actual task value
        })
        setChildTaskDialog(true)
        setDetailTask(task)
    }

    return (<>
        {childData.map((task) => (

            <div className="col-12" key={task.id}>
                <div className='task-card px-1 py-0 my-0' onClick={() => showDetailTask(task)}>
                    <div className="surface-0 bg-transparent my-3 border">
                        <div className="flex align-items-center flex-column lg:justify-content-between lg:flex-row">
                            <div>
                                <div className="font-medium text-xl text-900">
                                    <span className='ml-2 text-gray-500 text-lg lg:mr-2'>{task.task_key}</span>
                                    <span className='ml-2  text-lg'>{task.task_name}</span>
                                </div>
                            </div>
                            <div onClick={(e) => e.stopPropagation()} style={{ float: "right" }} className='flex-grow-1 flex align-items-end justify-content-end font-bold text-white m-2 px-5'>
                                <Dropdown
                                    style={{ margin: "-0.6em 0" }} size="small"
                                    value={category}
                                    onChange={(e) => changeStatus(e.value, task.task_key, task.task_name)}
                                    // placeholder={taskStatus.filter((status) => status.status_key === task.status_key)[0].name}
                                    placeholder={
                                        taskStatus.length > 0
                                            ? taskStatus.filter((status) => status.status_key === task.status_key)[0].name
                                            : ""
                                    }
                                    options={taskStatus.filter((data) => data.status_key !== task.status_key)}
                                    optionLabel="name"
                                    className="p-inputtext-sm" />

                                <ConfirmPopup />
                                <Button onClick={(e) => confirmDelete(e, task.task_key)} icon="pi pi-times" className="p-button-danger p-button-text p-button-rounded ml-3" style={{ margin: "-0.6em -2em -0.6em 0" }}></Button>
                            </div>
                            {/* <div className="mt-3 lg:mt-0">
                                <Button icon="pi pi-user" style={{ margin: "-0.6em 0" }} className="p-button-rounded p-button-outlined mr-2 btn btn-sm" />
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        ))}

        <Sidebar visible={childTaskDialog} onHide={() => handleCloseSidebar()} baseZIndex={9000} fullScreen>
            <TaskDialog taskKey={detailTask.task_key} previousKey={taskKey} />
        </Sidebar>
    </>);
};

export default ChildTask;
