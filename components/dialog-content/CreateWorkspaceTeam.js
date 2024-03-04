import React, { useRef, useState, useEffect, useContext } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

import { Controller, useForm } from 'react-hook-form';
import { AuthServices } from '../../services/AuthServices';
import { classNames } from 'primereact/utils';
import { MultiSelect } from 'primereact/multiselect';
import { OrgServices } from '../../services/OrgServices';
import { WorkspaceServices } from '../../services/WorkspaceServices';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { useRouter } from 'next/router';
import { emit } from '../../utils/EventEmitter';
const CreateWorkspaceTeam = () => {
    const router = useRouter();

    const { setContentDialog, showToast } = useContext(LayoutContext);

    const [selectedMember, setSelectedMember] = useState(null);

    const [noTeamMember, setNoTeamMember] = useState([])

    useEffect(() => {
        const workspaceServices = new WorkspaceServices();
        workspaceServices.getMember().then((res) => { setNoTeamMember(res.noTeamMember) });
    }, [])


    const defaultValues = {
        team_name: '',
        users: {},
    };
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        data.users = selectedMember;
        data.activity = {
            action: 'created team ' + data.team_name,
            object_one: '',
            object_two: '',
            type: 'workspace',
            related_code: '',
            url: window.location.href,
            additional_text: ''
        }
        const workspaceServices = new WorkspaceServices();
        workspaceServices.createTeam(data).then(() => {
            setContentDialog(false);
            emit('refreshMemberList');
            showToast({
                severity: 'success',
                summary: 'Team created',
                detail: 'Team Created Successfully',
                sticky: false
            });
        });
    };
    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
    };


    return (<>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='grid'>

                <div className="col-12">
                    <div className="card border-none p-fluid">
                        <div className="field">
                            {/* <InputText id="name1" placeholder='Type a Email address' type="text" /> */}


                            <Controller
                                name='team_name'
                                control={control}
                                rules={{ required: 'Team name is required' }}
                                render={({ field }) => (
                                    <>
                                        <InputText {...field} placeholder='Team Name' type="text" />

                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}
                            />
                        </div>
                        <div className="field">

                            <Controller
                                name='users'
                                control={control}
                                rules={{ required: "Member is required" }}
                                render={({ field }) => (
                                    <>
                                        <label htmlFor="email1">Member</label>
                                        {/* <InputText id="email1" type="text" value="Admin" readOnly /> */}
                                        <MultiSelect {...field}
                                            value={selectedMember}
                                            onChange={(e) => setSelectedMember(e.value)}
                                            options={noTeamMember}
                                            optionLabel="user.username"
                                            filter
                                            placeholder="Select User"
                                            maxSelectedLabels={3}
                                            className=""
                                            style={{ marginTop: "-0.5em" }} display='chip' />
                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}
                            />
                        </div>

                    </div>

                </div>
                <div className='mt-3 col-12'>
                    <Button style={{ float: "right" }} className='mx-2' label="Create Team" />
                </div>
            </div>
        </form>
    </>
    );
};

export default CreateWorkspaceTeam;
