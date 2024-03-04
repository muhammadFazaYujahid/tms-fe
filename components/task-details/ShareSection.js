import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ProjectService } from '../../services/ProjectServices';
import { Controller, useForm } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { TaskServices } from '../../services/TaskServices';
import { emit } from '../../utils/EventEmitter';
import { LayoutContext } from '../../layout/context/layoutcontext';

const ShareSection = ({ taskData }) => {
    const { showToast } = useContext(LayoutContext);

    const [buttonTooltip, setButtonTooltip] = useState('Click to Copy');
    const [userList, setUserList] = useState([]);
    const [taskDetail, setTaskDetail] = useState(taskData);
    useEffect(() => {
        const projectService = new ProjectService();
        projectService.getUserPhoto(sessionStorage.getItem('project_key')).then((data) => setUserList(data));
    }, [])


    const copyUrl = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(
            () => {
                setButtonTooltip('Copied to Clipboard')
            },
            (error) => {
                // Unable to copy to clipboard
                console.error('Failed to copy URL:', error);
                // You can show an error message to the user if desired.
            }
        );
    }

    const [selectedUser, setselectedUser] = useState('')



    const defaultValues = {
        message: ''
    };
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        const message = data.message;
        data.selected_user = selectedUser.user_key;
        // data.destination_sprint = category.sprint_key;
        data.activity = {
            action: 'Shared this task link to',
            old_value: selectedUser.username,
            new_value: '',
            type: 'history',
            task_key: taskDetail.task_key,
            url: window.location.href,
            additional_text: message
        }


        const taskServices = new TaskServices();
        taskServices.shareTask(data)
            .then((res) => {
                if (!res.success) {
                    return showToast({
                        severity: 'error',
                        summary: 'Share Task Failed',
                        detail: res.message,
                        sticky: false
                    });
                }
                showToast({
                    severity: 'success',
                    summary: 'shared',
                    detail: 'Share Task Success',
                    sticky: false
                });
                // if (data.success) {
                // }
            });
    };


    return (<form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-5 border-none mb-3">
            <h6 className='font-medium text-900'>Share Issue</h6>
            <div className='col-12 '>

                <span className='font-small text-500'>Share to</span>

                <div className=''>
                    <div className='flex'>
                        <Dropdown
                            size="small"
                            value={selectedUser}
                            onChange={(e) => setselectedUser(e.value)}
                            placeholder="Select User"
                            filter
                            options={userList}
                            optionLabel="username"
                            className="w-full" />
                    </div>
                </div>
            </div>
            <div className='col-12 '>

                <span className='font-small text-500'>Message</span>

                <div className=''>
                    <div className='w-full'>
                        <Controller
                            name='message'
                            control={control}
                            render={({ field }) => (
                                <>
                                    <InputTextarea {...field} className='w-full' />
                                </>
                            )}
                        />
                    </div>
                </div>
            </div>
            <Button style={{ float: "left" }} type='button' tooltip={buttonTooltip} icon="pi pi-link" onClick={() => copyUrl()} className="p-button-secondary p-button-outlined p-button-rounded p-button-sm" />
            <Button style={{ float: "right" }} className='mx-2 p-button-sm' label="Share" />
        </div>
    </form>);
};

export default ShareSection;
