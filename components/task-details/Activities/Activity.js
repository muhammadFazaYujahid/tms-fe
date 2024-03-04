import React, { useContext, useEffect, useRef, useState } from 'react';

import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { InputText } from 'primereact/inputtext';
import AddComment from './AddComment';
import { emit, on } from '../../../utils/EventEmitter';
import { TaskServices } from '../../../services/TaskServices';
import { ScrollPanel } from 'primereact/scrollpanel';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { LayoutContext } from '../../../layout/context/layoutcontext';

const Activity = ({ taskData }) => {
    const { showToast } = useContext(LayoutContext);
    const [addCommentClicked, setAddCommentClicked] = useState(false);
    const [taskDetail, settaskDetail] = useState(taskData)
    const [taskActivites, setTaskActivites] = useState([])
    const [loggedInEmail, setLoggedInEmail] = useState(sessionStorage.getItem('loggedInEmail'))

    useEffect(() => {
        const taskService = new TaskServices();
        taskService.getHistory(taskDetail.task_key).then((res) => {
            setTaskActivites(res);
            on('commentOnly', () => {
                setTaskActivites(res.filter(data => data.type == 'comment'));
            })
            on('historyOnly', () => {
                setTaskActivites(res.filter(data => data.type == 'history'));
            })
            on('showAll', () => {
                setTaskActivites(res);
            })
        });

        on('refreshActivity', () => {
            setAddCommentClicked(false);
            taskService.getHistory(taskDetail.task_key).then((res) => setTaskActivites(res))
        })
    }, [taskDetail])


    useEffect(() => {
        on('cancelAddComment', () => {
            setAddCommentClicked(false);
        })
    }, [])

    const getformatedDate = (original_date) => {
        const objDate = new Date(original_date);

        const formattedDate = new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(objDate);
        return formattedDate;
    }


    const deleteComment = useRef(null);
    const [deleteCommentPopup, setDeleteCommentPopup] = useState(false)
    const confirmDelete = (event, comment_id) => {
        // setDeleteCommentPopup(true)
        confirmPopup({
            onHide: () => setAddCommentClicked(false),
            target: event.currentTarget,
            message: 'Delete Comment?',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => accept(comment_id),
        });
    };

    const accept = (comment_id) => {
        const data = {
            commentId: comment_id,
            activity: {
                action: 'Delete a comment from task ' + taskDetail.task_name,
                old_value: '',
                new_value: '',
                type: 'history',
                task_key: taskDetail.task_key,
                url: window.location.href,
                additional_text: ''
            }
        }
        const taskServices = new TaskServices();
        taskServices.deleteComment(data)
            .then((res) => {
                if (!res.success) {
                    showToast({
                        severity: 'error',
                        summary: 'Delete Comment Failed',
                        detail: res.message,
                        sticky: false
                    });
                } else {
                    showToast({
                        severity: 'success',
                        summary: 'Deleted',
                        detail: 'Comment Deleted successfully',
                        sticky: false
                    });
                }
                emit('refreshAttachment');
                emit('refreshActivity');

                // if (data.success) {
                // }
            });
    };

    return (<>
        <h5 >Activity</h5>
        <div className='grid'>
            <div className='col'>
                <span className="p-buttonset flex">
                    <Button className='py-2 p-button-outlined lg:mt-1' onClick={() => emit('showAll')} label="All" />
                    <Button className='py-2 p-button-outlined lg:mt-1' onClick={() => emit('commentOnly')} label="Comment" />
                    <Button className='py-2 p-button-outlined lg:mt-1' onClick={() => emit('historyOnly')} label="History" />
                </span>

            </div>
            <div className='col-12'>
                {(!addCommentClicked) ? <InputText id="link_text" placeholder='Add a comment...' onClick={() => setAddCommentClicked(true)} readOnly className='w-full' type="text" /> : <AddComment taskData={taskDetail} />}


            </div>
            <div className='col-12'>
                <ScrollPanel style={{ height: "17em" }}>

                    {taskActivites.map((activity) => (
                        <div className='col-12' key={activity.id}>

                            <div className='grid'>
                                <span className='text-lg pt-2 ml-2'><i className='pi pi-user border-1 p-2 mr-1' style={{ borderRadius: "100%" }}> </i>
                                </span>
                                <span className='col text-lg'>
                                    <b>{activity.user.username}</b> {activity.action}
                                    {(activity.type == 'history') ?
                                        <>{(activity.new_value == '') ? <> {activity.old_value}</> : <>from {activity.old_value} to {activity.new_value}</>}</> :
                                        <></>} on {getformatedDate(activity.createdAt)} <Chip label={activity.type} />
                                    <div className='m-0' dangerouslySetInnerHTML={{ __html: activity.additional_text }}></div>
                                    {(activity.type == 'comment' && activity.user.email == loggedInEmail) ? <><Button ref={deleteComment} onClick={(e) => { setDeleteCommentPopup(true); confirmDelete(e, activity.id) }} label='Delete' className='p-button-sm p-button-text p-0 p-button-danger' /></> : <></>}

                                </span>
                                <ConfirmPopup visible={deleteCommentPopup} />
                            </div>
                        </div>

                    ))}
                </ScrollPanel>
            </div>
        </div>
    </>
    );
};

export default Activity;
