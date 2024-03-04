import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import React, { useEffect, useRef, useState } from 'react';
import { TaskServices } from '../../../services/TaskServices';
import { emit, on } from '../../../utils/EventEmitter';
import socket from '../../../utils/Socket';
import { InputText } from 'primereact/inputtext';

const AddChild = ({ taskKey }) => {

    const [category, setCategory] = useState(null);
    const [childData, setChildData] = useState([]);
    const [taskStatus, setTaskStatus] = useState([])
    const status_list = [
        { name: 'Todo', code: 'to-do' },
        { name: 'On Progress', code: 'in-progress' },
        { name: 'Done', code: 'done' }
    ];
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

    return (<>

        <div className='col-12'>
            <InputText id="link_text" className='w-full' type="text" />
        </div>

        <div className='col-12' style={{ float: "right" }}>
            <Button onClick={() => setAddChildClicked(false)} className='mx-2 p-button-secondary p-button-outlined' style={{ float: "right" }} label="Cancel" />
            <Button className='mx-2' label="Create" style={{ float: "right" }} />
        </div>
    </>);
};

export default AddChild;
