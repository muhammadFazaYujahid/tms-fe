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
import { WorkspaceServices } from '../../services/WorkspaceServices';
const InviteWorkspace = () => {

    const { setContentDialog, showToast } = useContext(LayoutContext);
    const roles = [
        { name: 'Admin', code: 'admin' },
        { name: 'User', code: 'user' },
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
            action: 'invite ' + data.users.length + ' people to this workspace',
            object_one: '',
            object_two: '',
            type: 'workspace',
            related_code: '',
            url: window.location.href,
            additional_text: ''
        }
        const workspaceServices = new WorkspaceServices();
        workspaceServices.inviteUser(data)
            .then((res) => {
                if (!res.success) {
                    return showToast({
                        severity: 'error',
                        summary: 'Invitation Failed',
                        detail: res.message,
                        sticky: false
                    });
                }
                setContentDialog(false);
                emit('refreshMemberList');
                emit('refreshWorkActivity');
                showToast({
                    severity: 'success',
                    summary: 'Added',
                    detail: 'Member Added Successfully',
                    sticky: false
                });
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
        orgServices.searchMember(filterText).then((res) => {
            if (res.length !== 0) {
                const filteredMember = res.filter(member => member.verified === true)
                setNonTeamMember(filteredMember);
            } else {
            }
            setCustomEmail(filterText);
        });
    }, 1000);


    const handleCreateCustomEmailOption = (user) => {
        const newOption = { user_key: 'no_key', username: customEmail, email: customEmail, sameOrg: false, user_has_orgs: [] }; // Customize the object structure according to your needs
        setNonTeamMember([...nonTeamMember, newOption]);
        setSelectedEmail([...selectedEmail, newOption]);
        setCustomEmail('');


    };

    const emailOptionTemplate = (option) => {
        return (
            <div className="flex-block">
                <small className='font-medium m-0'>{option.category}</small>
                {(option.sameOrg == true) ?
                    <small className='font-medium text-blue-500 m-0'>Same Organization</small>
                    :
                    (option.sameOrg == false) ? <small className='font-medium text-red-500 m-0'>Different Organization</small> : <></>
                }
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
                                    name='email'
                                    control={control}
                                    // rules={{ required: 'User is required.' }}
                                    render={({ field }) => (
                                        <>
                                            <Dropdown
                                                ref={multiselectRef}
                                                value={selectedEmail}
                                                onChange={(e) => { setSelectedEmail([...selectedEmail, e.target.value]); }}
                                                options={nonTeamMember}
                                                optionLabel="email"
                                                // optionGroupLabel="category"
                                                // optionGroupChildren="users"
                                                // optionGroupTemplate={groupedItemTemplate}
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

export default InviteWorkspace;


// import React, { useRef, useState, useEffect, useContext } from 'react';
// import { InputText } from 'primereact/inputtext';
// import { Button } from 'primereact/button';
// import { Dropdown } from 'primereact/dropdown';
// import { debounce } from 'lodash';

// import { Controller, useForm } from 'react-hook-form';
// import { AuthServices } from '../../services/AuthServices';
// import { classNames } from 'primereact/utils';
// import { MultiSelect } from 'primereact/multiselect';
// import { OrgServices } from '../../services/OrgServices';
// import { WorkspaceServices } from '../../services/WorkspaceServices';
// import { LayoutContext } from '../../layout/context/layoutcontext';
// import { emit } from '../../utils/EventEmitter';
// const InviteWorkspace = () => {
//     const { setContentDialog, showToast } = useContext(LayoutContext);
//     const roles = [
//         { name: 'Admin', code: 'admin' },
//         { name: 'User', code: 'user' },
//     ];

//     const defaultValues = {
//         users: {},
//         role: '',
//     };
//     const {
//         control,
//         formState: { errors },
//         handleSubmit,
//     } = useForm({ defaultValues });

//     const onSubmit = (data) => {
//         data.users = selectedCities;
//         const workspaceServices = new WorkspaceServices();
//         workspaceServices.inviteUser(data).then(() => {
//             setContentDialog(false);
//             emit('refreshMemberList');
//             showToast({
//                 severity: 'success',
//                 summary: 'Added',
//                 detail: 'Member Added Successfully',
//                 sticky: false
//             });
//         });
//
//     };
//     const getFormErrorMessage = (name) => {
//         return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
//     };

//     const [selectedCities, setSelectedCities] = useState([]);

//     const [nonTeamMember, setNonTeamMember] = useState([])
//     useEffect(() => {
//         const orgServices = new OrgServices;
//         orgServices.nonTeamMember().then((res) => {
//             const filteredMember = res.filter(member => member.verified === true)
//             setNonTeamMember(filteredMember);
//
//         });
//     }, [])

//     const multiselectRef = useRef(null);
//     const [customEmail, setCustomEmail] = useState('');

//     const handleFilter = debounce((event) => {
//         const filterText = event.filter;
//         setCustomEmail(filterText);
//     }, 1000);


//     const handleCreateCustomEmailOption = () => {
//         const newOption = { user_key: 'no_key', username: customEmail }; // Customize the object structure according to your needs
//         setNonTeamMember([...nonTeamMember, newOption]);
//         setSelectedCities([...selectedCities, newOption]);
//         setCustomEmail('');
//     };

//     const cities = [
//         { name: 'Sprint 1', code: 'NY' },
//         { name: 'Sprint 2', code: 'RM' },
//         { name: 'Sprint 3', code: 'LDN' }
//     ];
//     return (<>
//         <form onSubmit={handleSubmit(onSubmit)}>
//             <div className='grid'>

//                 <div className="col-12">
//                     <div className="card border-none p-fluid">
//                         <div className="field">
//                             {/* <InputText id="name1" placeholder='Type a Email address' type="text" /> */}

//                             <Controller
//                                 name='users'
//                                 control={control}
//                                 rules={{ required: 'User is required.' }}
//                                 render={({ field }) => (
//                                     <>
//                                         {/* <InputText {...field} placeholder='Type a Email address' className={classNames({ 'p-invalid': field.error })} type="text" /> */}
//                                         <MultiSelect {...field}
//                                             ref={multiselectRef}
//                                             value={selectedCities}
//                                             onChange={(e) => setSelectedCities(e.value)}
//                                             options={nonTeamMember}
//                                             optionLabel="username"
//                                             filter
//                                             placeholder="Select by username/Invite by Email"
//                                             maxSelectedLabels={3}
//                                             emptyFilterMessage={<div>
//                                                 user not found, {' '}
//                                                 <button
//                                                     type="button"
//                                                     onClick={handleCreateCustomEmailOption}
//                                                     className="p-link text-blue-500 hover:text-blue-900"
//                                                 >
//                                                     invite via email
//                                                 </button>
//                                             </div>}
//                                             onFilter={handleFilter}
//                                             className=""
//                                             style={{ marginTop: "-0.5em" }} display='chip' />
//                                         {getFormErrorMessage(field.name)}
//                                     </>
//                                 )}
//                             />
//                         </div>
//                         <div className="field">

//                             <Controller
//                                 name='role'
//                                 control={control}
//                                 render={({ field }) => (
//                                     <>
//                                         <label htmlFor="email1">Role</label>
//                                         {/* <InputText id="email1" type="text" value="Admin" readOnly /> */}
//                                         <Dropdown
//                                             id={field.name}
//                                             value={field.value}
//                                             optionLabel="name"
//                                             placeholder="Admin"
//                                             options={roles}
//                                             focusInputRef={field.ref}
//                                             onChange={(e) => field.onChange(e.value)}
//                                             className='w-full'
//                                         />
//                                     </>
//                                 )}
//                             />
//                         </div>

//                     </div>

//                 </div>
//                 <div className='mt-3 col-12'>
//                     <Button style={{ float: "right" }} className='mx-2' label="Invite" />
//                 </div>
//             </div>
//         </form>
//     </>
//     );
// };

// export default InviteWorkspace;
