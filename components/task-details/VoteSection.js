import Link from 'next/link';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import getConfig from 'next/config';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { TaskServices } from '../../services/TaskServices';
import { emit, on } from '../../utils/EventEmitter';

const VoteSection = ({ taskKey }) => {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const [voteList, setVoteList] = useState([])
    const [task_key, setTask_key] = useState(taskKey);
    const [loggedInEmail, setLoggedInEmail] = useState(sessionStorage.getItem('loggedInEmail'))

    useEffect(() => {
        const taskServices = new TaskServices();
        taskServices.getVote(task_key).then((res) => setVoteList(res));

        on('refreshVote', () => {
            taskServices.getVote(task_key).then((res) => setVoteList(res));
        })
    }, [])


    const voteTask = () => {
        const data = {
            task_key: task_key,
            activity: {
                action: 'Vote this task',
                old_value: '',
                new_value: '',
                type: 'history',
                task_key: task_key,
                url: window.location.href,
                additional_text: ''
            }
        }
        const taskServices = new TaskServices();
        taskServices.voteTask(data).then((res) => {
            if (res.success) {
                emit('refreshVote');
                emit('refreshActivity');
            }
        })
    }


    const unvoteTask = () => {
        const data = {
            task_key: task_key,
            activity: {
                action: 'Unvote this task',
                old_value: '',
                new_value: '',
                type: 'history',
                task_key: task_key,
                url: window.location.href,
                additional_text: ''
            }
        }
        const taskServices = new TaskServices();
        taskServices.unvoteTask(data).then((res) => {
            if (res.success) {
                emit('refreshVote');
                emit('refreshActivity');
            }
        })
    }

    return (<>
        {(voteList.filter(vote => vote.email == loggedInEmail).length === 0) ? <>
            <Button label="Vote this Task" onClick={() => voteTask()} className='p-button-text p-button-sm p-button-secondary w-full' icon="pi pi-thumbs-up"></Button></> : <>
            <Button label="Unvote this Task" onClick={() => unvoteTask()} className='p-button-text p-button-sm p-button-secondary w-full' icon="pi pi-thumbs-up"></Button></>}
        {/* <Button label="Vote this issue" onClick={() => voteTask()} className='p-button-text p-button-sm p-button-secondary w-full' icon="pi pi-thumbs-up"></Button> */}

        <Divider></Divider>
        <span className='font-medium text-dark'>Voted for this Task:</span>

        {voteList.map((vote) => (
            <Link href="/workspace/member" key={vote.id}>
                <div className='flex hover:bg-gray-200 active:text-gray-100 active:bg-gray-400 p-2' style={{ cursor: "pointer", borderRadius: "5px" }}>
                    <i className='pi pi-user border-1 p-2 mr-1' style={{ borderRadius: "100%" }}> </i>
                    <span className='text-lg ml-2 mt-1'>
                        {vote.username}
                    </span>
                </div>

            </Link>

        ))}
        {/* <Link href="/workspace/member">
            <div className='mt-2 flex hover:bg-gray-200 active:text-gray-100 active:bg-gray-400 p-2' style={{ cursor: "pointer", borderRadius: "5px" }}>
                <Avatar image={`${contextPath}/demo/images/avatar/amyelsner.png`} shape="circle" />
                <span className='text-lg ml-2 mt-1'>
                    Muhammad Faza Yujahid
                </span>
            </div>

        </Link>

        <Link href="/workspace/member">
            <div className='flex hover:bg-gray-200 active:text-gray-100 active:bg-gray-400 p-2' style={{ cursor: "pointer", borderRadius: "5px" }}>
                <Avatar image={`${contextPath}/demo/images/avatar/amyelsner.png`} shape="circle" />
                <span className='text-lg ml-2 mt-1'>
                    Ilham Ramadhan
                </span>
            </div>

        </Link> */}
    </>);
};

export default VoteSection;
