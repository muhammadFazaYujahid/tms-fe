import Link from 'next/link';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import getConfig from 'next/config';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { TaskServices } from '../../services/TaskServices';
import { emit, on } from '../../utils/EventEmitter';

const WatchSection = ({ taskKey }) => {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const [watchers, setWatchers] = useState([])
    const [task_key, setTask_key] = useState(taskKey);
    const [loggedInEmail, setLoggedInEmail] = useState(sessionStorage.getItem('loggedInEmail'))

    useEffect(() => {
        const taskServices = new TaskServices();
        taskServices.getWatcher(task_key).then((res) => setWatchers(res));

        on('refreshWatcher', () => {
            taskServices.getWatcher(task_key).then((res) => setWatchers(res));
        })
    }, [])

    const startWatch = () => {
        const data = {
            task_key: task_key,
            activity: {
                action: 'Start Watch this task',
                old_value: '',
                new_value: '',
                type: 'history',
                task_key: task_key,
                url: window.location.href,
                additional_text: ''
            }
        }
        const taskServices = new TaskServices();
        taskServices.watchTask(data).then((res) => {
            if (res.success) {
                emit('refreshWatcher');
                emit('refreshActivity');
            }
        })
    }

    const stopWatch = () => {
        const data = {
            task_key: task_key,
            activity: {
                action: 'Stop Watch this task',
                old_value: '',
                new_value: '',
                type: 'history',
                task_key: task_key,
                url: window.location.href,
                additional_text: ''
            }
        }
        const taskServices = new TaskServices();
        taskServices.stopWatchTask(data).then((res) => {
            if (res.success) {
                emit('refreshWatcher');
                emit('refreshActivity');
            }
        })
    }

    return (<>
        <div>
            {(watchers.filter(watcher => watcher.email == loggedInEmail).length === 0) ? <>
                <Button icon="pi pi-eye" label='start watching' onClick={() => startWatch()} className='p-button-text p-button-secondary p-button-sm w-full' /></> : <>
                <Button icon="pi pi-eye-slash" label='Stop watching' onClick={() => stopWatch()} className='p-button-text p-button-secondary p-button-sm w-full' /></>}

        </div>

        <Divider></Divider>
        <p className='font-medium text-dark'>Who watch this Task?</p>

        {watchers.map((watcher) => (
            <Link href="/workspace/member" key={watcher.id}>
                <div className='flex hover:bg-gray-200 active:text-gray-100 active:bg-gray-400 p-2' style={{ cursor: "pointer", borderRadius: "5px" }}>
                    <i className='pi pi-user border-1 p-2 mr-1' style={{ borderRadius: "100%" }}> </i>
                    <span className='text-lg ml-2 mt-1'>
                        {watcher.username}
                    </span>
                </div>

            </Link>

        ))}
    </>);
};

export default WatchSection;
