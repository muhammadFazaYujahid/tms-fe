import React, { useRef, useState, useEffect, useContext } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { TreeSelect } from 'primereact/treeselect';

import { WorkspaceServices } from '../../services/WorkspaceServices';
import { Controller, useForm } from 'react-hook-form';
import { emit } from '../../utils/EventEmitter';
import { TeamServices } from '../../services/TeamServices';
import { ProjectService } from '../../services/ProjectServices';
import { LayoutContext } from '../../layout/context/layoutcontext';
import Link from 'next/link';
import { OrgServices } from '../../services/OrgServices';

const CreateProjectDialog = () => {

    const { setModalDialog, showToast } = useContext(LayoutContext);

    const [workspaceList, setWorkspaceList] = useState([])
    const [selectedWorkspace, setSelectedWorkspace] = useState([]);
    const [clientList, setClientList] = useState([]);

    useEffect(() => {
        const workspaceServices = new WorkspaceServices();
        const orgServices = new OrgServices;
        workspaceServices.getWorkspaceList().then((res) => { setWorkspaceList(res); });
        orgServices.getClient(sessionStorage.getItem('org_key')).then((res) => setClientList(res));
    }, [])

    const defaultValues = {
        project_name: '',
        client: {},
        workspace: {},
        teams: [],
    };
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        const project_name = data.project_name;
        const selectedMemberId = Object.keys(selectedNodeKeys);
        const selectedTeam = teamList.filter(team => selectedMemberId.includes(team.key));
        const selectedMember = data.workspace.workspace_members.filter((user) => selectedMemberId.includes(user.member_key))
        data.selectedTeam = selectedTeam;
        data.client_key = '';
        if (data.client != undefined) {
            data.client_key = data.client.client_key;
        }
        data.selectedMember = selectedMember;
        data.activity = {
            action: 'create a project ',
            object_one: project_name,
            object_two: '',
            type: 'organization',
            related_code: sessionStorage.getItem('org_key'),
            url: window.location.href,
            additional_text: ''
        }

        const projectService = new ProjectService();
        projectService.createProject(data)
            .then((res) => {
                let summaryNotif = '';
                let detailNotif = '';
                let severity = '';
                if (res.success) {
                    severity = 'success';
                    summaryNotif = 'success';
                    detailNotif = 'Project has been created';
                } else {
                    severity = 'error';
                    summaryNotif = 'create project fail';
                    detailNotif = 'error: ' + res.error;
                }
                setModalDialog(false);
                showToast({
                    severity: severity,
                    summary: summaryNotif,
                    detail: detailNotif,
                    sticky: false
                });
                emit('refreshOrgPage');
            });
        // data.preventDefault();
    };

    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
    };

    const [selectedTeam, setSelectedTeam] = useState([]);
    const [teamList, setTeamList] = useState([]);
    const [teamFormActive, setTeamFormActive] = useState(false);
    const [selectedNodeKeys, setSelectedNodeKeys] = useState(null);

    const TeamsRef = useRef(null);
    const workspaceRef = useRef(null);

    const getTeamList = (ws_data) => {
        if (ws_data == undefined) {
            setTeamFormActive(false);
            setTeamList([]);
            setSelectedTeam([]);
        } else {
            const teamServices = new TeamServices();
            teamServices.getMemberByTeam(ws_data.work_key).then((res) => { setTeamList(res); setTeamFormActive(true); });
        }
    }
    return (<>

        <form onSubmit={handleSubmit(onSubmit)}>

            <div className='grid'>

                <div className="col-12">
                    <div className="card border-none p-fluid">
                        <div className="field">
                            <Controller
                                name='project_name'
                                control={control}
                                rules={{ required: 'Project name is required' }}
                                render={({ field }) => (
                                    <>
                                        <InputText {...field} placeholder='Project Name' type="text" className='mb-3' />

                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}
                            />
                        </div>


                        <div className="field">

                            <Controller
                                name='client'
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Dropdown
                                            id={field.name}
                                            value={field.value}
                                            optionLabel="name"
                                            placeholder="Select Client(optional)"
                                            options={clientList}
                                            focusInputRef={field.ref}
                                            filter
                                            showClear
                                            onChange={(e) => { field.onChange(e.value); }}
                                        // className={classNames({ 'p-invalid': fieldState.error })}
                                        />
                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}
                            />
                        </div>

                        <div className="field">

                            <Controller
                                name='workspace'
                                control={control}
                                rules={{ required: 'workspace is required' }}
                                render={({ field }) => (
                                    <>
                                        <Dropdown
                                            id={field.workspace_name}
                                            value={field.value}
                                            optionLabel="workspace_name"
                                            placeholder="Select a Workspace"
                                            options={workspaceList}
                                            focusInputRef={field.ref}
                                            filter
                                            showClear
                                            onChange={(e) => { field.onChange(e.value); getTeamList(e.value) }}
                                        // className={classNames({ 'p-invalid': fieldState.error })}
                                        />
                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}
                            />
                        </div>


                        <div className="field">
                            <TreeSelect
                                value={selectedNodeKeys}
                                disabled={(!teamFormActive) ? true : false}
                                onChange={(e) => { setSelectedNodeKeys(e.value); setSelectedTeam(e) }} options={teamList}
                                filter
                                selectionMode="checkbox"
                                display="chip"
                                placeholder="Select Project Handlers"></TreeSelect>

                            {/* <Controller
                                name='teams'
                                control={control}
                                rules={{ required: 'Team is required.' }}
                                render={({ field }) => (
                                    <>
                                        <MultiSelect
                                            {...field}
                                            ref={TeamsRef}
                                            disabled={(!teamFormActive) ? true : false}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            options={teamList}
                                            optionLabel="team_name"
                                            filter
                                            placeholder="Select Team"
                                            maxSelectedLabels={3}
                                            className=""
                                            style={{ marginTop: "-0.5em" }} display='chip' />
                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}
                            /> */}
                        </div>

                    </div>

                </div>
                <div className='col-12'>
                    <Button style={{ float: "right" }} className='mx-2' label="Create Project" />
                </div>
            </div>
        </form>
    </>
    );
};

export default CreateProjectDialog;
