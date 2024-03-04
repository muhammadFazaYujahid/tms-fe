import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { TaskServices } from '../../../services/TaskServices';
import { emit, on } from '../../../utils/EventEmitter';
import socket from '../../../utils/Socket';
import Link from 'next/link';
import { OverlayPanel } from 'primereact/overlaypanel';
import EditName from './EditName';
import { LayoutContext } from '../../../layout/context/layoutcontext';

const FileList = ({ taskKey, taskName }) => {
    const { showToast } = useContext(LayoutContext);

    const [attachments, setAttachments] = useState([]);

    const [attachFile, setAttachFile] = useState([]);

    useEffect(() => {
        if (taskKey) {
            const taskService = new TaskServices();
            taskService.getAttachment(taskKey).then(async (res) => {
                setAttachments(res.data.data);
            })

            on('refreshAttachment', () => {
                taskService.getAttachment(taskKey).then(async (res) => {
                    setAttachments(res.data.data);
                })

            })
        }
    }, [taskKey])

    const confirmDelete = (event, attachment) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Delete File?',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => accept(attachment),
        });
    };

    const accept = (attachment) => {
        const data = {
            attachId: attachment.id,
            activity: {
                action: 'remove a Attachment from task ' + taskName,
                old_value: attachment.id,
                new_value: '',
                type: 'history',
                task_key: taskKey,
                url: window.location.href,
                additional_text: ''
            }
        }
        const taskServices = new TaskServices();
        taskServices.removeAttachment(data)
            .then((res) => {
                if (!res.success) {
                    return showToast({
                        severity: 'error',
                        summary: 'Remove Attachment Failed',
                        detail: res.message,
                        sticky: false
                    });
                }
                emit('refreshAttachment');
                emit('refreshActivity');
                showToast({
                    severity: 'success',
                    summary: 'Remove Attachment Success',
                    detail: 'Attachment Removed successfully',
                    sticky: false
                });
                // if (data.success) {
                // }
            });
    };
    const [selectedFile, setSelectedFile] = useState([]);
    const editFile = (e, attachment) => {
        e.stopPropagation();
        editNameOp.current.toggle(e);
        setSelectedFile(attachment)
    }
    const openFile = (index) => {
        const taskService = new TaskServices();
        taskService.getAttachFile(index).then(async (res) => {
            window.open(res);
        })
    }


    const editNameOp = useRef(null);
    return (<>

        <h5 className='text-xl desc w-fit'>File Attachment</h5>
        <div className='grid'>
            {attachments.map((attachment, index) => (
                <div className='col cursor-pointer' key={attachment.id}>
                    <div onClick={() => openFile(attachment.id)}>
                        <div className='task-card px-1 py-0 my-0'>
                            <div className="surface-0 bg-transparent my-3 border">
                                <div className="flex align-items-center flex-column lg:justify-content-between lg:flex-row">
                                    <div>
                                        <div className="font-medium text-xl text-900">
                                            <span className='ml-2  text-lg'>{attachment.attach_name}</span>
                                        </div>
                                    </div>
                                    <div style={{ float: "right" }} onClick={(e) => e.stopPropagation()} className='flex-grow-1 flex align-items-end justify-content-end font-bold text-white m-2 px-5'>
                                        <ConfirmPopup />
                                        <Button onClick={(e) => { editFile(e, attachment) }} icon="pi pi-pencil" className="p-button-secondary p-button-text p-button-rounded ml-3" style={{ margin: "-0.6em -2em -0.6em 0" }}></Button>

                                        <Button onClick={(e) => { e.stopPropagation(); confirmDelete(e, attachment) }} icon="pi pi-trash" className="p-button-danger p-button-text p-button-rounded ml-3" style={{ margin: "-0.6em -2em -0.6em 0" }}></Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <OverlayPanel ref={editNameOp} showCloseIcon>
                        <EditName data={selectedFile} taskKey={attachment.task_key} fileId={attachments[index].id} fileName={attachments[index].attach_name} />
                    </OverlayPanel>
                </div>
            ))}

        </div>
    </>);
};

export default FileList;
