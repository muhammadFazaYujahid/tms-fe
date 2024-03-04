import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { TaskServices } from '../../../services/TaskServices';
import { emit, on } from '../../../utils/EventEmitter';
import socket from '../../../utils/Socket';
import TaskDialog from '../../TaskDialog';
import { Sidebar } from 'primereact/sidebar';
import { useRouter } from 'next/router';
import { LayoutContext } from '../../../layout/context/layoutcontext';

const TaskIssue = ({ taskKey, taskName }) => {
    const { showToast } = useContext(LayoutContext);

    const router = useRouter();
    const [category, setCategory] = useState(null);
    const [issueData, setIssueData] = useState([]);
    const [taskStatus, setTaskStatus] = useState([]);
    useEffect(() => {
        if (taskKey) {
            const taskService = new TaskServices();
            taskService.getIssue(taskKey).then((res) => setIssueData(res.data))

            on('refreshTaskDialog', () => {
                taskService.getIssue(taskKey).then((res) => setIssueData(res.data))

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
                emit('refreshBacklog');
                emit('refreshTaskDialog');

                emit('refreshActivity');
                const notifData = { room: sessionStorage.getItem('project_key'), message: 'Task telah diupdate' };
                socket.emit('taskStatusUpdated', notifData);
            }
        })
    }


    const confirmDelete = (event, issue) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Remove Task Issue?',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => accept(issue),
        });
    };

    const accept = (issue) => {
        const data = {
            issueId: issue.id,
            activity: {
                action: `remove an issue from task ${taskName} with Key`,
                old_value: issue.issued_task,
                new_value: '',
                type: 'history',
                task_key: taskKey,
                url: window.location.href,
                additional_text: ''
            }
        }
        const taskServices = new TaskServices();
        taskServices.removeIssue(data)
            .then((res) => {
                if (!res.success) {
                    return showToast({
                        severity: 'error',
                        summary: 'Remove Issue Failed',
                        detail: res.message,
                        sticky: false
                    });
                }
                emit('refreshTaskDialog');
                emit('refreshActivity');
                showToast({
                    severity: 'success',
                    summary: 'Remove Issue Success',
                    detail: 'Issue Removed successfully',
                    sticky: false
                });
                // if (data.success) {
                // }
            });
    };

    const [issueTaskDialog, setIssueTaskDialog] = useState(false)
    const [detailTask, setDetailTask] = useState([])

    const handleTaskUpdate = (updatedTaskData) => {
        setDetailTask(updatedTaskData);
    };


    const handleCloseSidebar = () => {
        setIssueTaskDialog(false)
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
        setIssueTaskDialog(true)
        setDetailTask(task)
    }


    return (<>

        <h5 className='text-xl desc w-fit'>Task Issue</h5>
        {issueData.filter(issue => issue.type == 'link_issue').map((issue) => (
            <>
                <div className="col-12">
                    <div className='task-card px-1 py-0 my-0' onClick={() => showDetailTask(issue.taskDetail)}>
                        <div className="surface-0 bg-transparent my-3 border">
                            <div className="flex align-items-center flex-column lg:justify-content-between lg:flex-row">
                                <div>
                                    <span className='ml-2 text-red-600 lg:mr-2'>{issue.issue}</span>
                                    <div className="font-medium text-xl text-900">
                                        <span className='ml-2 text-gray-500 text-lg lg:mr-2'>{issue.taskDetail.task_key}</span>
                                        <span className='ml-2  text-lg'>{issue.taskDetail.task_name}</span>
                                    </div>
                                </div>
                                <div style={{ float: "right" }} onClick={(e) => e.stopPropagation()} className='flex-grow-1 flex align-items-end justify-content-end font-bold text-white m-2 px-5'>
                                    <Dropdown
                                        style={{ margin: "-0.6em 0" }} size="small"
                                        value={category}
                                        onChange={(e) => changeStatus(e.value, issue.taskDetail.task_key, issue.taskDetail.task_name)}
                                        // placeholder={taskStatus.filter((status) => status.status_key === issue.taskDetail.status_key)[0].name}
                                        placeholder={
                                            taskStatus.length > 0
                                                ? taskStatus.filter((status) => status.status_key === issue.taskDetail.status_key)[0].name
                                                : ""
                                        }
                                        options={taskStatus.filter((data) => data.status_key !== issue.taskDetail.status_key)}
                                        optionLabel="name"
                                        className="p-inputtext-sm" />
                                    <ConfirmPopup />
                                    <Button onClick={(e) => confirmDelete(e, issue)} icon="pi pi-times" className="p-button-danger p-button-text p-button-rounded ml-3" style={{ margin: "-0.6em -2em -0.6em 0" }}></Button>

                                    {/* <Dropdown style={{ margin: "-0.6em 0" }} size="small" value={category} onChange={(e) => setCategory(e.value)} options={status_list} optionLabel="name" placeholder="To do" className="p-inputtext-sm" /> */}
                                </div>
                                {/* <div className="mt-3 lg:mt-0">
                                <Button icon="pi pi-user" style={{ margin: "-0.6em 0" }} className="p-button-rounded p-button-outlined mr-2 btn btn-sm" />
                            </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        ))}

        <Sidebar visible={issueTaskDialog} onHide={() => handleCloseSidebar()} baseZIndex={9000} fullScreen>
            <TaskDialog taskKey={detailTask.task_key} previousKey={taskKey} />
        </Sidebar>
    </>);
};

export default TaskIssue;
