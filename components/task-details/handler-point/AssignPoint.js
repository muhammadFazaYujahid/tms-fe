import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import React, { useEffect, useRef, useState } from 'react';
import EditAssignDetail from './EditAssignDetail';
import { Dialog } from 'primereact/dialog';
import { emit, on } from '../../../utils/EventEmitter';
import { TaskServices } from '../../../services/TaskServices';
import socket from '../../../utils/Socket';

const AssignPoint = ({ fieldValue }) => {

    const [category, setCategory] = useState(null);
    const [handlers, setHandlers] = useState([]);
    const [taskData, setTaskData] = useState(fieldValue);
    const [isFlagged, setIsFlagged] = useState(false)
    const status_list = [
        { name: 'Todo', code: 'to-do' },
        { name: 'On Progress', code: 'in-progress' },
        { name: 'Done', code: 'done' }
    ];

    useEffect(() => {
        setHandlers(fieldValue.task_handlers);
        if (taskData.flag) {
            setIsFlagged(true)
        }

        on('changeFlagStatus', (status) => {
            setIsFlagged(status)
        })
        return () => {

        }
    }, [])
    const getStoryPoint = (optimistic_time, mostlikely_time, pessimistic_time) => {
        const storyPoint = (optimistic_time + (4 * mostlikely_time) + pessimistic_time) / 6;
        return storyPoint;
    }

    // const status = status_list.filter((st) => {
    //     if (selectedTask != null) {
    //         return st.code != fieldValue.status;
    //     }
    //     return st.code
    // })
    const getLevel = (level) => {
        let formattedLevel = '';
        if (level === 0) {
            formattedLevel = 'low'
        } else if (level === 1) {
            formattedLevel = 'medium'
        } else if (level === 2) {
            formattedLevel = 'High'
        } else {
            formattedLevel = 'unkown'
        }
        return formattedLevel;
    }
    const [editAssignDialog, setEditAssignDialog] = useState(false)
    const [dialogHeader, setDialogHeader] = useState('');
    const [dialogContent, setDialogContent] = useState('');

    const [taskStatus, setTaskStatus] = useState([]);
    useEffect(() => {
        if (taskData) {
            const taskService = new TaskServices();
            taskService.getTaskStatus(sessionStorage.getItem('project_key')).then((data) => { setTaskStatus(data) });

            on('refreshStatus', (status) => {
                taskService.getTaskStatus(sessionStorage.getItem('project_key')).then((data) => { setTaskStatus(data) });
            })
        }
    }, [taskData])

    useEffect(() => {
        const cobaData = { ...taskData, status_key: 'coba ganti status_key' }
        on('closeEditDialog', () => {
            setEditAssignDialog(false);
        })
        on('taskrefreshed', (data) => {
            setTaskData(data);
        })
    }, [])


    const changeStatus = (data, task_key, task_name) => {
        const formData = { status_key: data.status_key, task_key: task_key, task_name: task_name }
        const taskService = new TaskServices;
        taskService.changeStatus(formData).then((data) => {
            if (data.success) {
                emit('refreshTaskDialog');
                emit('refreshBacklog');
                emit('refreshActivity');
                // emit('refreshStatus', { ...taskData, status_key: formData.status_key });
                setTaskData({ ...taskData, status_key: formData.status_key })
                const notifData = { room: sessionStorage.getItem('project_key') };
                socket.emit('taskStatusUpdated', notifData);
            }
        })
    }

    const maskStyles = {
        backgroundColor: 'rgb(0 0 0 / 50%)',
    };
    return (<div>
        <div className='grid'>
            <div className='col-3'>
                <Dropdown
                    size="small"
                    value={category}
                    onChange={(e) => changeStatus(e.value, taskData.task_key, taskData.task_name)}
                    options={taskStatus.filter((data) => data.status_key !== taskData.status_key)}
                    optionLabel="name"
                    placeholder={
                        taskStatus.length > 0
                            ? taskStatus.filter((status) => status.status_key === taskData.status_key)[0].name
                            : ""
                    } className="p-inputtext-sm bg-gray-100 text-gray-900" />
            </div>
            {(isFlagged) ? <div className='col'>
                <Button icon="pi pi-flag-fill" label='Flagged' className="text-red-600 p-button-text" />
            </div> : <></>}

        </div>
        <h5>Details</h5>
        <table className='w-full p-2 mt-3' style={{ borderCollapse: "separate", borderSpacing: "0 15px" }}>
            <tbody>

                <tr className=''>
                    <td className='float-top' style={{ verticalAlign: "top" }}>
                        <p className='font-medium text-dark'>Urgency Level</p>
                    </td>
                    <td className=''>
                        <p className='font-medium text-dark'>{getLevel(taskData.level)}</p>
                    </td>
                </tr>
                <tr className=''>
                    <td className='float-top' style={{ verticalAlign: "top" }}>
                        <p className='font-medium text-dark'>Assigne</p>
                    </td>
                    <td className=''>
                        {taskData.task_handlers.filter(handler => handler.type == 'assigner').map((handler) => (
                            <p className='font-medium text-dark' key={handler.id} style={{ cursor: "pointer" }}>{handler.handler_name}</p>
                        ))}
                        {/* <a className='font-medium text-link'>Assign to me</a> */}
                    </td>
                </tr>

                <tr className=''>
                    <td className='float-top' style={{ verticalAlign: "top" }}>
                        <p className='font-medium text-dark'>Reporter</p>
                    </td>
                    <td className=''>
                        {taskData.task_handlers.filter(handler => handler.type == 'reporter').map((handler) => (
                            <p className='font-medium text-dark' key={handler.id} style={{ cursor: "pointer" }}>{handler.handler_name}</p>
                        ))}
                    </td>
                </tr>
                <tr className=''>
                    <td className='float-top' style={{ verticalAlign: "top" }}>
                        <p className='font-medium text-dark'>Fastest Duration</p>
                    </td>
                    <td className=''>
                        <p className='font-medium text-dark' style={{ cursor: "pointer" }}>{taskData.optimistic_time} Days</p>
                    </td>
                </tr>
                <tr className=''>
                    <td className='float-top' style={{ verticalAlign: "top" }}>
                        <p className='font-medium text-dark'>Normal Duration</p>
                    </td>
                    <td className=''>
                        <p className='font-medium text-dark' style={{ cursor: "pointer" }}>{taskData.mostlikely_time} Days</p>
                    </td>
                </tr>
                <tr className=''>
                    <td className='float-top' style={{ verticalAlign: "top" }}>
                        <p className='font-medium text-dark'>Slowest Duration</p>
                    </td>
                    <td className=''>
                        <p className='font-medium text-dark' style={{ cursor: "pointer" }}>{taskData.pessimistic_time} Days</p>
                    </td>
                </tr>
                <tr className=''>
                    <td className='float-top' style={{ verticalAlign: "top" }}>
                        <p className='font-medium text-dark'>Story Point Estimate</p>
                    </td>
                    <td className=''>
                        <p className='font-medium text-dark'>{getStoryPoint(taskData.optimistic_time, taskData.mostlikely_time, taskData.pessimistic_time)}</p>
                    </td>
                </tr>
            </tbody>
        </table>
        <Button label='Edit' className='p-button-sm' onClick={() => {
            setEditAssignDialog(true);
            setDialogHeader("Edit Task Detail");
            setDialogContent(<EditAssignDetail taskData={taskData} />)
        }}
        />


        <Dialog header={<div className='grid'>
            <div className='col'>
                <span>{dialogHeader}</span>

            </div>
            {/* <div className='col-1 mr-6'>
                                <Button icon="pi pi-window-maximize" className="p-button-secondary p-button-text p-0 btn btn-sm" onClick={() => { setVisibleFullScreen(true) }} />
                            </div> */}

        </div>} maskStyle={maskStyles} modal={true} visible={editAssignDialog} className='p-dialog' style={{ width: '30vw', backgroundColor: "#fff" }} onHide={() => setEditAssignDialog(false)}>
            {dialogContent}
        </Dialog>
    </div>
    );
};

export default AssignPoint;
