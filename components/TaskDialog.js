import React, { useRef, useState, useEffect, useContext, Component, createRef, Fragment } from 'react';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { ScrollPanel } from 'primereact/scrollpanel';

import { InputText } from 'primereact/inputtext';
import { OverlayPanel } from 'primereact/overlaypanel';
import { ListBox } from 'primereact/listbox';

import getConfig from 'next/config';
// import FileUpload from './AttachFile';
import AttachFile from './task-details/attachment/AttachFile';
import Activity from './task-details/Activities/Activity';
import AssignPoint from './task-details/handler-point/AssignPoint';
import WatchSection from './task-details/WatchSection';
import VoteSection from './task-details/VoteSection';
import ShareSection from './task-details/ShareSection';
import ChildIssue from './task-details/child-tasks/ChildTask';
import EditDesc from './task-details/EditDesc';
import { emit, on } from '../utils/EventEmitter';
import CreateTask from './dialog-content/CreateTask';
import { Dialog } from 'primereact/dialog';
import TaskIssue from './task-details/task-issues/TaskIssues';
import AddIssue from './task-details/task-issues/AddIssue';
import FileList from './task-details/attachment/FileList';
import { TaskServices } from '../services/TaskServices';
import { Skeleton } from 'primereact/skeleton';
import TaskLoading from './task-details/TaskLoading';
import EditParent from './task-details/EditParent';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { LayoutContext } from '../layout/context/layoutcontext';
import { Toast } from 'primereact/toast';
import socket from '../utils/Socket';

class TaskDialog extends Component {
    static contextType = LayoutContext;

    constructor(props) {
        super(props);

        this.state = {
            fieldValue: '',
            attachClicked: false,
            addChildDialog: false,
            dialogHeader: '',
            dialogContent: '',
            task_key: props.taskKey,
            userKey: null,
        };

        this.actionOp = createRef();
        this.shareOp = createRef();
        this.watchOp = createRef();
        this.voteOp = createRef();
        this.setParentOp = createRef();
        this.cobaToast = createRef();
    }

    componentDidMount() {
        const taskServices = new TaskServices();
        taskServices.getDetail(this.state.task_key).then((res) => {
            this.setState({ fieldValue: res });
        });
        this.setState({ userKey: sessionStorage.getItem('user_key') });

        on('refreshTaskDetail', () => {
            this.setState({ addChildDialog: false });
            taskServices.getDetail(this.state.task_key).then((res) => {
                this.setState({ fieldValue: res });
                emit('taskrefreshed', res);
            });
        });

        on('cancelEditDesc', () => {
            this.setState({ descClicked: false });
        });

        on('closeAddIssue', () => {
            this.setState({ addChildDialog: false });
        });

        on('showTaskToast', ({ toastData }) => {
            if (this.cobaToast.current) {
                this.showingToast(toastData);
            }
        });
    }

    toggleAction = (event) => {
        this.actionOp.current.toggle(event);
    };

    toggleShare = (event) => {
        this.shareOp.current.toggle(event);
    };

    toggleWathed = (event) => {
        this.watchOp.current.toggle(event);
    };

    toggleVote = (event) => {
        this.voteOp.current.toggle(event);
    };

    toggleParent = (event) => {
        this.setParentOp.current.toggle(event);
    };

    handleChildUpdate = (updatedStatus) => {
        const updatedTaskData = {
            ...this.state.fieldValue,
            status_key: updatedStatus,
        };
        this.setState({ fieldValue: updatedTaskData });
    };

    flagTask = (task_key) => {
        const data = {
            task_key: task_key,
            activity: {
                action: 'Flagged this Task',
                old_value: '',
                new_value: '',
                type: 'history',
                task_key: task_key,
                url: window.location.href,
                additional_text: ''
            }
        }
        const taskService = new TaskServices();
        taskService.addFlag(data).then((res) => {
            if (res.success) {
                emit('changeFlagStatus', true)
                emit('refreshTaskDetail')
            }
        })
    }

    unFlagTask = (task_key) => {
        const data = {
            task_key: task_key,
            activity: {
                action: 'Unflagged this Task',
                old_value: '',
                new_value: '',
                type: 'history',
                task_key: task_key,
                url: window.location.href,
                additional_text: ''
            }
        }
        const taskService = new TaskServices();
        taskService.removeFlag(data).then((res) => {
            if (res.success) {
                emit('changeFlagStatus', false)
                emit('refreshTaskDetail')
            }
        })
    }

    confirmDelete = (event, task_key) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Delete Task?',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => this.accept(task_key),
        });
    };

    accept = (task_key) => {
        const taskServices = new TaskServices();
        taskServices.deleteTask(task_key)
            .then((res) => {
                if (!res.success) {
                    return this.context.showToast({
                        severity: 'error',
                        summary: 'Remove Issue Failed',
                        detail: res.message,
                        sticky: false
                    });
                }
                emit('taskDeleted');
                this.context.showToast({
                    severity: 'success',
                    summary: 'Task Deleted',
                    detail: 'Task Deleted successfully',
                    sticky: false
                });
            });
    };

    showingToast = ({ severity, summary, detail, sticky }) => {
        this.cobaToast.current.show({ severity, summary, detail, sticky });
    };

    confirmTaskStatus = () => {
        const { fieldValue } = this.state;
        const formData = { status_key: fieldValue?.status_key, task_key: fieldValue?.task_key, task_name: fieldValue?.task_name, verify_status: 'verified', is_confirm: true }
        const taskService = new TaskServices();
        taskService.changeStatus(formData).then((data) => {
            if (data.success) {
                emit('refreshTaskDialog');
                emit('refreshBoard');
                emit('refreshActivity');

                const notifData = { room: sessionStorage.getItem('project_key') };
                socket.emit('sendNotif', notifData);
            }
        });
    }

    render() {
        const maskStyles = {
            backgroundColor: 'rgb(0 0 0 / 50%)',
        };

        const { fieldValue, attachClicked, addChildDialog, dialogHeader, dialogContent, userKey } = this.state;

        if (fieldValue === '') {
            return <TaskLoading />;
        }

        return (<>
            <Toast ref={this.context.toast} />
            {/* <Button onClick={showingToast} label="Show" /> */}
            <h5 className='text-gray-500' style={{ position: "absolute", top: "0", marginTop: "1em" }} >
                {fieldValue?.task_key} |
            </h5>
            <h5 className='text-gray-500' style={{ position: "absolute", top: "0", marginTop: "1em", marginLeft: "4.5em" }} >
                {fieldValue?.task_name}
            </h5>
            <div className='text-gray-500 custom-sidebar-header' >
    
                {/* <Button icon="pi pi-lock" className="text-gray-900 p-button-rounded p-button-text" /> */}
    
                {/* <Button icon="pi pi-eye" onClick={toggleWathed} className="text-gray-900 p-button-rounded p-button-text" />
                <OverlayPanel className='p-0' ref={watchOp} appendTo={typeof window !== 'undefined' ? document.body : null}>
                    <WatchSection taskKey={fieldValue?.task_key} />
                </OverlayPanel> */}
    
                {/* <Button icon="pi pi-thumbs-up" onClick={toggleVote} className="text-gray-900 p-button-rounded p-button-text" />
                <OverlayPanel className='p-0' ref={voteOp} appendTo={typeof window !== 'undefined' ? document.body : null}>
                    <VoteSection taskKey={fieldValue?.task_key} />
                </OverlayPanel> */}
    
                <Button icon="pi pi-share-alt" onClick={this.toggleShare} className="text-gray-900 p-button-rounded p-button-text" />
                <OverlayPanel className='p-0' ref={this.shareOp} appendTo={typeof window !== 'undefined' ? document.body : null}>
                    <ShareSection taskData={{ task_key: fieldValue?.task_key, task_name: fieldValue?.task_name }} />
                </OverlayPanel>
                {/* {console.log('apakah', fieldValue.status_key.split('-')[0])} */}
    
                {!(fieldValue.status_key.split('-')[0] === 'CP' && fieldValue.verify_status === "verified") && 
                    <Button icon="pi pi-ellipsis-h" onClick={this.toggleAction} className="text-gray-900 p-button-rounded p-button-text p-0" />
                }
                <OverlayPanel className='p-0' ref={this.actionOp} appendTo={typeof window !== 'undefined' ? document.body : null}>
                    {/* <ListBox value={selectedAction} onChange={(e) => setselectedAction(e.value)} options={cities} optionLabel="name" className="w-full md:w-10rem border-none p-0" /> */}
                    <div className='grid w-10rem'>
                        {/* <div className='col-12'>
                            {(fieldValue?.flag) ?
                                <Button label='Remove flag' onClick={() => unFlagTask(fieldValue?.task_key)} className='p-button-text p-button-secondary w-full p-button-sm' /> :
                                <Button label='Add flag' onClick={() => flagTask(fieldValue?.task_key)} className='p-button-text p-button-secondary w-full p-button-sm' />}
    
                        </div> */}
                        <div className='col-12'>
                            <Button label='Add/Change Parent' onClick={this.toggleParent} className='p-button-text p-button-secondary w-full p-button-sm' />
    
                            <OverlayPanel ref={this.setParentOp} showCloseIcon>
                                <EditParent taskKey={fieldValue?.task_key} parent_key={fieldValue?.parent_key} />
                                {/* <EditName data={selectedFile} taskKey={attachment.task_key} fileId={attachments[index].id} fileName={attachments[index].attach_name} /> */}
                            </OverlayPanel>
                        </div>
                        <div className='col-12'>
                            <ConfirmPopup />
                            <Button onClick={(e) => this.confirmDelete(e, fieldValue?.task_key)} label='Delete' className='p-button-text p-button-secondary w-full p-button-sm text-red-500' />
                        </div>
    
                    </div>
                </OverlayPanel>
            </div>
    
            <div className='grid'>
                <div className='col'>
                    <ScrollPanel style={{ height: "85vh" }}>
    
                        <h1 style={{ fontWeight: 'normal' }}>{fieldValue?.name}</h1>

                        {!(fieldValue.status_key.split('-')[0] === 'CP' && fieldValue.verify_status === "verified") &&
                            <Fragment>
                                <Button label="Attach file" onClick={() => this.setState({attachClicked: true})} className='p-1 m-2 px-2 bg-grey-200 p-button-secondary' icon="pi pi-paperclip"></Button>
                                <Button label="Add a Child Task"
                                    onClick={() => {
                                        this.setState({
                                            addChildDialog: true,
                                            dialogHeader: "Add Child Task",
                                            dialogContent: <CreateTask sprintKey={fieldValue?.sprint_key} isChild={true} parentKey={fieldValue?.task_key} parentName={fieldValue?.task_namr} />
                                        })
                                    }} className='p-1 m-2 px-2 bg-grey-200 p-button-secondary' icon="pi pi-sitemap"></Button>
                                <Button label="Add Issue" className='p-1 m-2 px-2 bg-grey-200 p-button-secondary' icon="pi pi-link" onClick={() => {
                                    this.setState({
                                        addChildDialog: true,
                                        dialogHeader: "Add Task Issue",
                                        dialogContent: <AddIssue taskKey={fieldValue?.task_key} taskName={fieldValue?.task_name} />
                                    })
                                }}></Button>
                            </Fragment>
                        }
    
    
                        {attachClicked == true ? (<>
                            <AttachFile taskKey={fieldValue?.task_key} />
    
                            <div className='mt-3'>
                                <Button className='p-button-secondary p-button-outlined' label="Close" onClick={() => this.setState({attachClicked: false})} />
                            </div>
                        </>) : (<></>)}
    
    
                        <FileList taskKey={fieldValue?.task_key} taskName={fieldValue?.task_name} additionalInfo={{ status_key: fieldValue?.status_key, verify_status: fieldValue?.verify_status }} />
    
                        <EditDesc taskData={{ task_key: fieldValue?.task_key, description: fieldValue?.task_description, task_name: fieldValue?.task_name, status_key: fieldValue?.status_key, verify_status: fieldValue?.verify_status }} />
                        <h5 className='mt-5'>Child Task</h5>
    
    
                        <ChildIssue taskKey={fieldValue?.task_key} onChildUpdate={this.handleChildUpdate} taskName={fieldValue?.task_name} additionalInfo={{ status_key: fieldValue?.status_key, verify_status: fieldValue?.verify_status }} />
                        {/* {addChildClicked == true ? (<>
                            <AddChild />
                        </>
                        ) : (<>
                        </>
                        )} */}
    
    
                        <div className='col-12 mt-5 '>
                            <TaskIssue taskKey={fieldValue?.task_key} taskName={fieldValue?.task_name} additionalInfo={{ status_key: fieldValue?.status_key, verify_status: fieldValue?.verify_status }} />
                        </div>
    
                        <div className='col-12 mt-6 '>
                            <Activity taskData={fieldValue}></Activity>
                        </div>
                    </ScrollPanel>
    
                </div>
                <Divider layout='vertical'></Divider>
                <div className='col lg:col-4'>
    
                    <AssignPoint fieldValue={fieldValue} />
                    <div className='mt-4' style={{display: 'flex', justifyContent: "flex-end"}}>
                        {/* {console.log('task', fieldValue)} */}
                        {/* {(fieldValue?.task_handlers.find(data => data.type === 'assigner').handler === userKey) && 
                            <Button onClick={() => revertTaskStatus()} className='m-1' label="Revert Status Change" size='small' severity="danger" />
                        } */}
                        {((fieldValue?.task_handlers.find(data => data.type === "reporter").handler === userKey) && fieldValue?.verify_status === 'requested') && 
                            <Button onClick={() => this.confirmTaskStatus()} className='m-1' label="Confirm Status Change" size='small' severity="success" />
                        }
                        {(fieldValue?.verify_status === 'verified') && <div className='p-2 bg-green-500 w-full text-center text-white font-semibold' style={{borderRadius: '5px'}}>Confirmed by Reporter</div>}
                    </div>
                </div>
            </div>
    
    
    
            <Dialog header={<div className='grid'>
                <div className='col'>
                    <span>{dialogHeader}</span>
    
                </div>
                {/* <div className='col-1 mr-6'>
                                    <Button icon="pi pi-window-maximize" className="p-button-secondary p-button-text p-0 btn btn-sm" onClick={() => { setVisibleFullScreen(true) }} />
                                </div> */}
    
            </div>} maskStyle={maskStyles} modal={true} visible={addChildDialog} className='p-dialog' style={{ width: '30vw', backgroundColor: "#fff" }} onHide={() => this.setState({addChildDialog: false})}>
                {dialogContent}
            </Dialog>
    
        </>
        );
    }
}


export default TaskDialog;
