import { Button } from 'primereact/button';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { TaskServices } from '../../services/TaskServices';
// import socket from '../../../utils/Socket';
import { InputText } from 'primereact/inputtext';
import { Controller, useForm } from 'react-hook-form';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { emit } from '../../utils/EventEmitter';
import { TaskStatusService } from '../../services/TaskStatusService';
import { ColorPicker } from 'primereact/colorpicker';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { OrgServices } from '../../services/OrgServices';

const EditUserRole = ({ data }) => {
    const { showToast } = useContext(LayoutContext);
    const [statusData, setStatusData] = useState({ username: data.username, role: data.role, user_key: data.user_key });
    
    const roles = [
        { name: 'admin', code: 'admin' },
        { name: 'user', code: 'user' },
    ];

    const [selectedRole, setSelectedRole] = useState(roles.find(role => role.code == statusData.role));
    
    const defaultValues = {
        role: roles.find(role => role.code == statusData.role) 
    };
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        data.activity = {
            action: `Change ${statusData.username} Role`,
            object_one: statusData.role,
            object_two: selectedRole.name,
            type: 'organization',
            related_code: statusData.user_key,
            url: window.location.href,
            additional_text: ''
        }
        data.role = selectedRole.name;
        data.user_key = statusData.user_key;
        console.log('log', data)
        const orgServices = new OrgServices;
        orgServices.editUserRole(data)
            .then((res) => {
                if (!res.success) {
                    return showToast({
                        severity: 'error',
                        summary: 'edit failed',
                        detail: res.message,
                        sticky: false
                    });
                }
                emit('refreshOrgDetail');
                emit('refreshRoleOp');
                showToast({
                    severity: 'success',
                    summary: 'Status Name Updated',
                    detail: 'Status Name Updated successfully',
                    sticky: false
                });
                // if (data.success) {
                // }
            });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h5>{statusData.username}</h5>
            <div className='col-12'>
                <Dropdown value={selectedRole} onChange={(e) => setSelectedRole(e.value)} options={roles} optionLabel="name" placeholder="Select a City" className="w-full md:w-14rem" />

            </div>

            <div className='col-12' style={{ float: "right" }}>
                <Button className='mx-2' label="Save" style={{ float: "right" }} />
            </div>
        </form>);
};

export default EditUserRole;
