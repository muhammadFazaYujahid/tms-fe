import React, { useRef, useState, useEffect, useContext } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { TreeSelect } from 'primereact/treeselect';

import { WorkspaceServices } from '../../services/WorkspaceServices';
import { Controller, useForm } from 'react-hook-form';
import { emit } from '../../utils/EventEmitter';
import { ProjectService } from '../../services/ProjectServices';
import { LayoutContext } from '../../layout/context/layoutcontext';
import Link from 'next/link';

const InviteProjectDialog = () => {

    const { setContentDialog, showToast } = useContext(LayoutContext);

    const [workspaceList, setWorkspaceList] = useState([])
    const [workspace, setWorkspace] = useState([])

    useEffect(() => {
        const workspaceServices = new WorkspaceServices();
        workspaceServices.getWorkspaceList().then((res) => { setWorkspaceList(res); });

        const projectService = new ProjectService();
        projectService.inviteUser().then((res) => { setTeamList(res.editedData); setTeamFormActive(true); setWorkspace(res.workspace) });
    }, [])

    const defaultValues = {
        workspace: {},
    };
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        const selectedMemberId = Object.keys(selectedNodeKeys);
        const selectedTeam = teamList.filter(team => selectedMemberId.includes(team.key));
        const selectedMember = workspace.workspace_members.filter((user) => selectedMemberId.includes(user.member_key))
        data.selectedTeam = selectedTeam;
        data.selectedMember = selectedMember;
        data.workspace = workspace;

        const projectService = new ProjectService();
        projectService.inviteToProject(data)
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
                emit('inviteMemberSuccess');
                showToast({
                    severity: 'success',
                    summary: 'Added',
                    detail: 'Member Added Successfully',
                    sticky: false
                });
            });
        // data.preventDefault();
    };

    const [selectedTeam, setSelectedTeam] = useState([]);
    const [teamList, setTeamList] = useState([]);
    const [teamFormActive, setTeamFormActive] = useState(false);
    const [selectedNodeKeys, setSelectedNodeKeys] = useState(null);

    return (<>

        <form onSubmit={handleSubmit(onSubmit)}>

            <div className='grid'>

                <div className="col-12">
                    <div className="card border-none p-fluid">
                        <div className="field">
                            <Controller
                                name='project_name'
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <InputText {...field} value={workspace.workspace_name} readOnly placeholder='Project Name' type="text" className='mb-3' />
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
                                placeholder="Choose Member"></TreeSelect>
                            <small>*only member from {workspace.workspace_name} that can be invited. if you want to invite outsiders, please invite to workspace first</small>
                        </div>

                    </div>

                </div>
                <div className='col-12'>
                    <Button style={{ float: "right" }} className='mx-2' label="Invite" />
                </div>
            </div>
        </form>
    </>
    );
};

export default InviteProjectDialog;
