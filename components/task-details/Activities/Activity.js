import React, { Component, createRef, useContext } from 'react';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { InputText } from 'primereact/inputtext';
import AddComment from './AddComment';
import { emit, on } from '../../../utils/EventEmitter';
import { TaskServices } from '../../../services/TaskServices';
import { ScrollPanel } from 'primereact/scrollpanel';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { LayoutContext } from '../../../layout/context/layoutcontext';

class Activity extends Component {
    static contextType = LayoutContext;

    constructor(props) {
        super(props);
        this.state = {
            addCommentClicked: false,
            taskDetail: props.taskData,
            taskActivites: [],
            defaultActivities: [],
            loggedInEmail: sessionStorage.getItem('loggedInEmail'),
            deleteCommentPopup: false
        };
        this.deleteComment = createRef();
    }

    componentDidMount() {
        const taskService = new TaskServices();
        taskService.getHistory(this.state.taskDetail.task_key).then((res) => {
            this.setState({ taskActivites: res, defaultActivities: res });
        });

        on('commentOnly', () => {
            this.setState({ taskActivites: this.state.defaultActivities.filter(data => data.type === 'comment') });
        });
        on('historyOnly', () => {
            this.setState({ taskActivites: this.state.defaultActivities.filter(data => data.type === 'history') });
        });
        // on('showAll', () => {
        //     this.setState({ taskActivites: res });
        // });

        on('refreshActivity', () => {
            this.setState({ addCommentClicked: false });
            taskService.getHistory(this.state.taskDetail.task_key).then((res) => this.setState({ taskActivites: res, defaultActivities: res }));
        });

        on('cancelAddComment', () => {
            this.setState({ addCommentClicked: false });
        });
    }

    getFormattedDate = (original_date) => {
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

    confirmDelete = (event, comment_id) => {
        confirmPopup({
            onHide: () => this.setState({ addCommentClicked: false }),
            target: event.currentTarget,
            message: 'Delete Comment?',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => this.accept(comment_id),
        });
    };

    accept = (comment_id) => {
        const data = {
            commentId: comment_id,
            activity: {
                action: 'Delete a comment from task ' + this.state.taskDetail.task_name,
                old_value: '',
                new_value: '',
                type: 'history',
                task_key: this.state.taskDetail.task_key,
                url: window.location.href,
                additional_text: ''
            }
        };
        const taskServices = new TaskServices();
        taskServices.deleteComment(data).then((res) => {
            if (!res.success) {
                this.context.showToast({
                    severity: 'error',
                    summary: 'Delete Comment Failed',
                    detail: res.message,
                    sticky: false
                });
            } else {
                this.context.showToast({
                    severity: 'success',
                    summary: 'Deleted',
                    detail: 'Comment Deleted successfully',
                    sticky: false
                });
            }
            emit('refreshAttachment');
            emit('refreshActivity');
        });
    };

    // filterActivity = (type) => {
    //     emit('refreshActivity');
    //     this.setState({
    //         taskActivites: this.state.taskActivites.filter(data => data.type === type)
    //     });
    // }

    updateStatus = (res) => {
        console.log('isinya coy', res);
    }

    render() {
        return (
            <>
                <h5>Activity</h5>
                <div className='grid'>
                    <div className='col'>
                        <span className="p-buttonset flex">
                            <Button className='py-2 p-button-outlined lg:mt-1' onClick={() => emit('refreshActivity')} label="All" />
                            <Button className='py-2 p-button-outlined lg:mt-1' onClick={() => emit('commentOnly')} label="Comment" />
                            <Button className='py-2 p-button-outlined lg:mt-1' onClick={() => emit('historyOnly')} label="History" />
                        </span>
                    </div>
                    <div className='col-12'>
                        {!this.state.addCommentClicked ? (
                            <InputText
                                id="link_text"
                                disabled={(this.state.taskDetail.status_key.split('-')[0] === 'CP' && this.state.taskDetail.verify_status === "verified")}
                                placeholder='Add a comment...'
                                onClick={() => this.setState({ addCommentClicked: true })}
                                readOnly
                                className='w-full'
                                type="text"
                            />
                        ) : (
                            <AddComment taskData={this.state.taskDetail} commentAdded={this.updateStatus} />
                        )}
                    </div>
                    <div className='col-12'>
                        <ScrollPanel style={{ height: "17em" }}>
                            {this.state.taskActivites.map((activity) => (
                                <div className='col-12' key={activity.id}>
                                    <div className='grid'>
                                        <span className='text-lg pt-2 ml-2'>
                                            <i className='pi pi-user border-1 p-2 mr-1' style={{ borderRadius: "100%" }}></i>
                                        </span>
                                        <span className='col text-lg'>
                                            <b>{activity.user.username}</b> {activity.action}
                                            {activity.type === 'history' ? (
                                                <>
                                                    {activity.new_value === '' ? (
                                                        <> {activity.old_value}</>
                                                    ) : (
                                                        <> from {activity.old_value} to {activity.new_value}</>
                                                    )}
                                                </>
                                            ) : null} on {this.getFormattedDate(activity.createdAt)} <Chip label={activity.type} />
                                            <div className='m-0' dangerouslySetInnerHTML={{ __html: activity.additional_text }}></div>
                                            {activity.type === 'comment' && activity.user.email === this.state.loggedInEmail ? (
                                                <Button
                                                    ref={this.deleteComment}
                                                    disabled={(this.state.taskDetail.status_key.split('-')[0] === 'CP' && this.state.taskDetail.verify_status === "verified")}
                                                    onClick={(e) => { this.setState({ deleteCommentPopup: true }); this.confirmDelete(e, activity.id) }}
                                                    label='Delete'
                                                    className='p-button-sm p-button-text p-0 p-button-danger'
                                                />
                                            ) : null}
                                        </span>
                                        <ConfirmPopup visible={this.state.deleteCommentPopup} />
                                    </div>
                                </div>
                            ))}
                        </ScrollPanel>
                    </div>
                </div>
            </>
        );
    }
}

export default Activity;
