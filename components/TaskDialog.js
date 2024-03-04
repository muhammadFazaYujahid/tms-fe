import React, { useRef, useState, useEffect, useContext } from 'react';
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

const TaskDialog = ({ taskKey, previousKey }) => {

    const { showToast, toast } = useContext(LayoutContext);

    const [fieldValue, setFieldValue] = useState('');

    const [attachClicked, setattachClicked] = useState(false)

    const [addChildDialog, setAddChildDialog] = useState(false)

    const [dialogHeader, setDialogHeader] = useState('');
    const [dialogContent, setDialogContent] = useState('');

    const [task_key, setTask_key] = useState(taskKey);

    useEffect(() => {
        const taskServices = new TaskServices();
        taskServices.getDetail(task_key).then((res) => { setFieldValue(res); });

        on('refreshTaskDetail', () => {
            setAddChildDialog(false)
            taskServices.getDetail(task_key).then((res) => { setFieldValue(res); emit('taskrefreshed', res) });

        })
    }, [task_key])

    useEffect(() => {
        on('cancelEditDesc', () => {
            setDescClicked(false);
        })
        on('closeAddIssue', () => {
            setAddChildDialog(false);
        })


    }, [])



    const maskStyles = {
        backgroundColor: 'rgb(0 0 0 / 50%)',
    };

    const actionOp = useRef(null);
    const shareOp = useRef(null);
    const watchOp = useRef(null);
    const voteOp = useRef(null);
    const setParentOp = useRef(null);

    const toggleAction = (event) => {
        actionOp.current.toggle(event);
    };

    const toggleShare = (event) => {
        shareOp.current.toggle(event);
    };

    const toggleWathed = (event) => {
        watchOp.current.toggle(event);
    };

    const toggleVote = (event) => {
        voteOp.current.toggle(event);
    };
    const toggleParent = (event) => {
        setParentOp.current.toggle(event);
    };

    const handleChildUpdate = (updatedStatus) => {
        // Update the status key in the edited task data
        const updatedTaskData = {
            ...fieldValue,
            status_key: updatedStatus,
        };
        setFieldValue(updatedTaskData);
    };
    const flagTask = (task_key) => {
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
    const unFlagTask = (task_key) => {
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

    const confirmDelete = (event, task_key) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Delete Task?',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => accept(task_key),
        });
    };

    const accept = (task_key) => {
        // const data = {
        //     task_key: task_key,
        // }
        const taskServices = new TaskServices();
        taskServices.deleteTask(task_key)
            .then((res) => {
                if (!res.success) {
                    return showToast({
                        severity: 'error',
                        summary: 'Remove Issue Failed',
                        detail: res.message,
                        sticky: false
                    });
                }
                emit('taskDeleted');
                showToast({
                    severity: 'success',
                    summary: 'Task Deleted',
                    detail: 'Task Deleted successfully',
                    sticky: false
                });
                // if (data.success) {
                // }
            });
    };

    const cobaToast = useRef(null);

    useEffect(() => {
        on('showTaskToast', ({ toastData }) => {
            if (cobaToast != null) {
                showingToast({ severity: toastData.severity, summary: toastData.summary, detail: toastData.detail, sticky: toastData.sticky, })

            }
        })
    }, [cobaToast])


    const showingToast = ({ severity, summary, detail, sticky }) => {
        cobaToast.current.show({ severity: severity, summary: summary, detail: detail, sticky: sticky });
    };

    if (fieldValue === '') {
        return (
            <TaskLoading />
        )
    }

    return (<>
        <Toast ref={toast} />
        {/* <Button onClick={showingToast} label="Show" /> */}
        <h5 className='text-gray-500' style={{ position: "absolute", top: "0", marginTop: "1em" }} >
            {fieldValue.task_key} |
        </h5>
        <h5 className='text-gray-500' style={{ position: "absolute", top: "0", marginTop: "1em", marginLeft: "4.5em" }} >
            {fieldValue.task_name}
        </h5>
        <div className='text-gray-500 custom-sidebar-header' >

            {/* <Button icon="pi pi-lock" className="text-gray-900 p-button-rounded p-button-text" /> */}

            <Button icon="pi pi-eye" onClick={toggleWathed} className="text-gray-900 p-button-rounded p-button-text" />
            <OverlayPanel className='p-0' ref={watchOp} appendTo={typeof window !== 'undefined' ? document.body : null}>
                <WatchSection taskKey={fieldValue.task_key} />
            </OverlayPanel>

            <Button icon="pi pi-thumbs-up" onClick={toggleVote} className="text-gray-900 p-button-rounded p-button-text" />
            <OverlayPanel className='p-0' ref={voteOp} appendTo={typeof window !== 'undefined' ? document.body : null}>
                <VoteSection taskKey={fieldValue.task_key} />
            </OverlayPanel>

            <Button icon="pi pi-share-alt" onClick={toggleShare} className="text-gray-900 p-button-rounded p-button-text" />
            <OverlayPanel className='p-0' ref={shareOp} appendTo={typeof window !== 'undefined' ? document.body : null}>
                <ShareSection taskData={{ task_key: fieldValue.task_key, task_name: fieldValue.task_name }} />
            </OverlayPanel>

            <Button icon="pi pi-ellipsis-h" onClick={toggleAction} className="text-gray-900 p-button-rounded p-button-text p-0" />
            <OverlayPanel className='p-0' ref={actionOp} appendTo={typeof window !== 'undefined' ? document.body : null}>
                {/* <ListBox value={selectedAction} onChange={(e) => setselectedAction(e.value)} options={cities} optionLabel="name" className="w-full md:w-10rem border-none p-0" /> */}
                <div className='grid w-10rem'>
                    <div className='col-12'>
                        {(fieldValue.flag) ?
                            <Button label='Remove flag' onClick={() => unFlagTask(fieldValue.task_key)} className='p-button-text p-button-secondary w-full p-button-sm' /> :
                            <Button label='Add flag' onClick={() => flagTask(fieldValue.task_key)} className='p-button-text p-button-secondary w-full p-button-sm' />}

                    </div>
                    <div className='col-12'>
                        <Button label='Add/Change Parent' onClick={toggleParent} className='p-button-text p-button-secondary w-full p-button-sm' />

                        <OverlayPanel ref={setParentOp} showCloseIcon>
                            <EditParent taskKey={fieldValue.task_key} parent_key={fieldValue.parent_key} />
                            {/* <EditName data={selectedFile} taskKey={attachment.task_key} fileId={attachments[index].id} fileName={attachments[index].attach_name} /> */}
                        </OverlayPanel>
                    </div>
                    <div className='col-12'>
                        <ConfirmPopup />
                        <Button onClick={(e) => confirmDelete(e, fieldValue.task_key)} label='Delete' className='p-button-text p-button-secondary w-full p-button-sm text-red-500' />
                    </div>

                </div>
            </OverlayPanel>
        </div>

        <div className='grid'>
            <div className='col'>
                <ScrollPanel style={{ height: "85vh" }}>

                    <h1 style={{ fontWeight: 'normal' }}>{fieldValue.name}</h1>

                    <Button label="Attach file" onClick={() => setattachClicked(true)} className='p-1 m-2 px-2 bg-grey-200 p-button-secondary' icon="pi pi-paperclip"></Button>
                    <Button label="Add a Child Task"
                        onClick={() => {
                            setAddChildDialog(true);
                            setDialogHeader("Add Child Task");
                            setDialogContent(<CreateTask sprintKey={fieldValue.sprint_key} isChild={true} parentKey={fieldValue.task_key} parentName={fieldValue.task_namr} />)
                        }} className='p-1 m-2 px-2 bg-grey-200 p-button-secondary' icon="pi pi-sitemap"></Button>
                    <Button label="Add Issue" className='p-1 m-2 px-2 bg-grey-200 p-button-secondary' icon="pi pi-link" onClick={() => {
                        setAddChildDialog(true);
                        setDialogHeader("Add Task Issue");
                        setDialogContent(<AddIssue taskKey={fieldValue.task_key} taskName={fieldValue.task_name} />)
                    }}></Button>

                    {attachClicked == true ? (<>
                        <AttachFile taskKey={fieldValue.task_key} />

                        <div className='mt-3'>
                            <Button className='p-button-secondary p-button-outlined' label="Close" onClick={() => setattachClicked(false)} />
                        </div>
                    </>) : (<></>)}


                    <FileList taskKey={fieldValue.task_key} taskName={fieldValue.task_name} />

                    <EditDesc taskData={{ task_key: fieldValue.task_key, description: fieldValue.task_description, task_name: fieldValue.task_name }} />
                    <h5 className='mt-5'>Child Task</h5>


                    <ChildIssue taskKey={fieldValue.task_key} onChildUpdate={handleChildUpdate} taskName={fieldValue.task_name} />
                    {/* {addChildClicked == true ? (<>
                        <AddChild />
                    </>
                    ) : (<>
                    </>
                    )} */}


                    <div className='col-12 mt-5 '>
                        <TaskIssue taskKey={fieldValue.task_key} taskName={fieldValue.task_name} />
                    </div>

                    <div className='col-12 mt-6 '>
                        <Activity taskData={fieldValue}></Activity>
                    </div>
                </ScrollPanel>

            </div>
            <Divider layout='vertical'></Divider>
            <div className='col lg:col-4'>

                <AssignPoint fieldValue={fieldValue} />
            </div>
        </div>



        <Dialog header={<div className='grid'>
            <div className='col'>
                <span>{dialogHeader}</span>

            </div>
            {/* <div className='col-1 mr-6'>
                                <Button icon="pi pi-window-maximize" className="p-button-secondary p-button-text p-0 btn btn-sm" onClick={() => { setVisibleFullScreen(true) }} />
                            </div> */}

        </div>} maskStyle={maskStyles} modal={true} visible={addChildDialog} className='p-dialog' style={{ width: '30vw', backgroundColor: "#fff" }} onHide={() => setAddChildDialog(false)}>
            {dialogContent}
        </Dialog>

    </>
    );
};

export default TaskDialog;
