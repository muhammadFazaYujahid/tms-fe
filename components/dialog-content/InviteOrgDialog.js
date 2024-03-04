import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Chip } from 'primereact/chip';
import { Divider } from 'primereact/divider';
import { Fieldset } from 'primereact/fieldset';

import { Controller, useForm } from 'react-hook-form';
import { AuthServices } from '../../services/AuthServices';
import { classNames } from 'primereact/utils';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { emit } from '../../utils/EventEmitter';
import { OrgServices } from '../../services/OrgServices';
import { debounce, forEach } from 'lodash';
const InviteOrgDialog = () => {

    const { setModalDialog, showToast } = useContext(LayoutContext);
    const roles = [
        { name: 'Admin', code: 'admin' },
        { name: 'User', code: 'user' },
        { name: 'Superadmin', code: 'superadmin' },
    ];

    const defaultValues = {
        role: '',
    };
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        const userData = selectedEmail.filter(user => {
            return !removedEmail.some(removeData => removeData.email === user.email)
        });
        data.users = userData;
        data.activity = {
            action: 'invite ' + data.users.length + ' people to this organization',
            object_one: '',
            object_two: '',
            type: 'organization',
            related_code: sessionStorage.getItem('org_key'),
            url: window.location.href,
            additional_text: ''
        }

        const authServices = new AuthServices();
        authServices.inviteUser(data)
            .then((res) => {

                if (!res.success) {
                    return showToast({
                        severity: 'error',
                        summary: 'Invitation Failed',
                        detail: res.message,
                        sticky: false
                    });
                }
                setModalDialog(false);
                emit('refreshOrgPage');
                showToast({
                    severity: 'success',
                    summary: 'Invitation Success',
                    detail: 'Invitation link sent successfully',
                    sticky: false
                });
                // if (data.success) {
                // }
            });
    };
    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
    };
    const [selectedEmail, setSelectedEmail] = useState([]);
    const [removedEmail, setRemovedEmail] = useState([]);

    const [nonTeamMember, setNonTeamMember] = useState(['']);
    const [customEmail, setCustomEmail] = useState('');
    const dropdownRef = useRef(selectedEmail);

    const handleFilter = debounce((event) => {
        const filterText = event.filter;

        const orgServices = new OrgServices;
        orgServices.getUserList(filterText).then((res) => {
            if (res.length !== 0) {
                const filteredMember = res.filter(member => member.verified === true)
                setNonTeamMember(filteredMember);
            } else {
            }
            setCustomEmail(filterText);
        });
    }, 1000);


    const handleCreateCustomEmailOption = (user) => {

        const newOption = { user_key: 'no_key', username: customEmail, email: customEmail }; // Customize the object structure according to your needs
        setNonTeamMember([...nonTeamMember, newOption]);
        setSelectedEmail([...selectedEmail, newOption]);
        setCustomEmail('');


    };

    const emailOptionTemplate = (option) => {
        return (
            <div className="flex-block">
                <p className='font-medium m-0'>{option.email}</p>
                <p className='text-gray-500 m-0'>{option.username}</p>
                {/* <div>{option.email}</div> */}
            </div>
        );
    };

    const removeEmail = (userData) => {
        setRemovedEmail([...removedEmail, userData]);
    }
    const multiselectRef = useRef(null);


    return (<>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='grid'>

                <div className="col-12">
                    <div className="card border-none p-fluid">
                        <div className="field">

                            <Fieldset legend="Send Invitation To" >
                                <Controller
                                    name='username'
                                    control={control}
                                    // rules={{ required: 'User is required.' }}
                                    render={({ field }) => (
                                        <>
                                            <Dropdown
                                                ref={multiselectRef}
                                                value={selectedEmail}
                                                onChange={(e) => { setSelectedEmail([...selectedEmail, e.target.value]) }}
                                                options={nonTeamMember}
                                                optionLabel="email"
                                                itemTemplate={emailOptionTemplate}
                                                filter
                                                placeholder="Search User by Email"
                                                maxSelectedLabels={3}
                                                emptyFilterMessage={<div>
                                                    user not found, {' '}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleCreateCustomEmailOption(field)}
                                                        className="p-link text-blue-500 hover:text-blue-900"
                                                    >
                                                        send invitation mail
                                                    </button>
                                                </div>}
                                                onFilter={handleFilter} />
                                            {getFormErrorMessage(field.name)}
                                        </>
                                    )}
                                />
                                <div className='mt-1'>
                                    {selectedEmail.map((user) => (
                                        <Chip className='m-1' removable onRemove={() => { removeEmail(user) }} label={user.email} />

                                    ))}
                                </div>
                            </Fieldset>

                            {/* <Divider align="left">
                                <div className="inline-flex align-items-center">
                                    <i className="pi pi-user mr-2"></i>
                                    <b>Text</b>
                                </div>
                            </Divider> */}
                        </div>
                        <div className="field">

                            <Controller
                                name='role'
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <label htmlFor="email1">Role</label>
                                        {/* <InputText id="email1" type="text" value="Admin" readOnly /> */}
                                        <Dropdown
                                            value={field.value}
                                            optionLabel="name"
                                            placeholder="Admin"
                                            options={roles}
                                            onChange={(e) => field.onChange(e.value)}
                                            className='w-full'
                                        />
                                    </>
                                )}
                            />
                        </div>

                    </div>

                </div>
                <div className='mt-3 col-12'>
                    <Button style={{ float: "right" }} className='mx-2' label="Invite" />
                </div>
            </div>
        </form>
    </>
    );
};

export default InviteOrgDialog;
