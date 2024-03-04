import React, { useState, useEffect, useContext, useRef } from 'react';
import Router from 'next/router';
import Cookies from 'js-cookie';

import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { Dialog } from 'primereact/dialog';
import { SplitButton } from 'primereact/splitbutton';
import { Badge } from 'primereact/badge';

import getConfig from 'next/config';

import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { Divider } from 'primereact/divider';
import Link from 'next/link';
import { ScrollPanel } from 'primereact/scrollpanel';
import InviteWorkspace from '../../../../components/dialog-content/InviteWorkspace';
import { WorkspaceServices } from '../../../../services/WorkspaceServices';
import CreateWorkspaceTeam from '../../../../components/dialog-content/CreateWorkspaceTeam';
import { TeamServices } from '../../../../services/TeamServices';
import { emit, on } from '../../../../utils/EventEmitter';
import { Toast } from 'primereact/toast';
import SendMemberToTeam from '../../../../components/dialog-content/sendMemberToTeam';
import { OverlayPanel } from 'primereact/overlaypanel';
import Activity from '../../../../components/workspace/Activity';
import MemberReport from '../../../../components/MemberReport';
import { useRouter } from 'next/router';
import { checkWorkspaceRole } from '../../../../middlewares/requireAuth';

const Dashboard = ({ myQuery }) => {
    const router = useRouter();
    const [role, setRole] = useState('');
    const { setShowSidebar, contentDialog, setContentDialog, setOrgKeyLink, showToast } = useContext(LayoutContext);

    const [members, setMembers] = useState([])
    const [noTeamMember, setNoTeamMember] = useState([]);
    const [teamList, setTeamList] = useState([]);
    const [workKey, setWorkKey] = useState(myQuery.workspace_key);

    useEffect(() => {
        if (sessionStorage.getItem('userRole') == 'superadmin') {
            setRole(sessionStorage.getItem('userRole'));
        } else {
            setRole(sessionStorage.getItem('workspaceRole'));
        }

        setOrgKeyLink(myQuery.org_key);
        setShowSidebar(false);
        Cookies.set('work_key', workKey);
        sessionStorage.setItem('work_key', workKey);

        const workspaceServices = new WorkspaceServices();
        workspaceServices.getMember().then((res) => { setMembers(res.allMember); setNoTeamMember(res.noTeamMember) });

        const teamServices = new TeamServices();
        teamServices.getTeams().then((res) => { setTeamList(res) });

        on('refreshMemberList', () => {
            workspaceServices.getMember().then((res) => { setMembers(res.allMember); setNoTeamMember(res.noTeamMember) });
            teamServices.getTeams().then((res) => { setTeamList(res) });

        })
        return () => {
            setShowSidebar(true);
        }
    }, [])

    const maskStyles = {
        backgroundColor: 'rgb(0 0 0 / 50%)',
    };

    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const [dialogType, setDialogType] = useState(null);
    const [dialogHeader, setDialogHeader] = useState(null);

    const showInviteDialog = () => {
        setContentDialog(true);
        setDialogType(<InviteWorkspace />);
        setDialogHeader("Invite to Workspace");
    }

    const createTeamDialog = () => {
        setContentDialog(true);
        setDialogType(<CreateWorkspaceTeam />);
        setDialogHeader("Create Workspace Team");
    }

    const sendToTeam = (member_key, headerData) => {
        setContentDialog(true);
        setDialogType(<SendMemberToTeam member_key={member_key} />);
        setDialogHeader(headerData);
    }

    const kickMember = (member) => {
        const data = {
            member_key: member.member_key,
            activity: {
                action: 'Kick ' + member.user.username.split(' ')[0] + ' from this workspace',
                object_one: '',
                object_two: '',
                type: 'workspace',
                related_code: workKey,
                url: window.location.href,
                additional_text: ''
            }
        }
        const workspaceServices = new WorkspaceServices();
        workspaceServices.kickMember(data).then((res) => {
            let summaryNotif = '';
            let detailNotif = '';
            let severity = '';
            if (res.success) {
                severity = 'success';
                summaryNotif = 'User Kicked';
                detailNotif = 'User successfully kicked from this workspace';
            } else {
                severity = 'error';
                summaryNotif = 'Kick user failed';
                detailNotif = 'error: ' + res.error;
            }
            clear(false);
            showNotif(severity, summaryNotif, detailNotif);
            emit('refreshMemberList');
            emit('refreshWorkActivity');
        });
    }

    const deleteWorkspace = (work_key) => {
        const workspaceServices = new WorkspaceServices();
        workspaceServices.deleteWorkspace(work_key)
            .then((res) => {
                let summaryNotif = '';
                let detailNotif = '';
                let severity = '';
                if (res.success) {
                    severity = 'success';
                    summaryNotif = 'Workspace deleted';
                    detailNotif = 'Workspace successfully deleted';
                } else {
                    severity = 'error';
                    summaryNotif = 'workspace delete failed';
                    detailNotif = 'error: ' + res.error;
                }
                clear(false);
                showToast({ severity: severity, summary: summaryNotif, detail: detailNotif, sticky: false });
                // showNotif(severity, summaryNotif, detailNotif);
                Router.replace('/' + sessionStorage.getItem('org_key'));
            });
    }

    const clear = (submit) => {
        toast.current.clear();
        submit && show();
    };

    const toast = useRef(null);
    const notif = useRef(null);

    const showNotif = (severity, summaryNotif, detailNotif) => {
        notif.current.show({ severity: severity, summary: summaryNotif, detail: detailNotif });
    }

    const show = (showContent, severity) => {
        toast.current.show({
            severity: severity,
            sticky: true,
            className: 'border-none',
            content: showContent
        });
    };
    const itemsModel = (member) => {
        const items = [
            {
                label: (member.team == null) ? 'Add to Team' : 'Change Team',
                icon: 'pi pi-users',
                command: () => {
                    let header = '';
                    (member.team == null) ? header = 'Add to Team' : header = 'Change Team';
                    sendToTeam(member, header)
                }
            },
            {
                label: <span className="text-red-500">Kick from workspace</span>,
                icon: <span className="p-menuitem-icon pi pi-times text-red-500"></span>,
                style: { color: 'red' },
                command: () => {
                    const severity = 'warn'
                    const showContent = (
                        <div className="flex flex-column align-items-center" style={{ flex: '1' }}>
                            <div className="text-center">
                                <i className="pi pi-question-circle" style={{ fontSize: '3rem' }}></i>
                                <div className="font-bold text-xl my-3">Kick from this workspace?</div>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={(e) => clear(false)} type="button" label="Cancel" className="p-button-info w-6rem" />
                                <Button onClick={(e) => kickMember(member)} type="button" label="Kick" className="p-button-danger w-6rem" />
                            </div>
                        </div>
                    )
                    show(showContent, severity)
                }
            }
        ];

        return items;
    }

    const workOp = [

        {
            label: <span className="text-red-500">Delete workspace</span>,
            icon: <span className="p-menuitem-icon pi pi-trash text-red-500"></span>,
            command: () => {
                const severity = 'error';
                const showContent = (
                    <div className="flex flex-column align-items-center" style={{ flex: '1' }}>
                        <div className="text-center">
                            <i className="pi pi-question-circle" style={{ fontSize: '3rem' }}></i>
                            <div className="font-bold text-xl my-3">Delete this workspace?</div>
                            <p className="text-lg my-3">All data about this workspace including, handled project, teams, member, etc will deleted</p>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={(e) => clear(false)} type="button" label="Cancel" className="p-button-info w-6rem" />
                            <Button onClick={(e) => deleteWorkspace(Cookies.get('work_key'))} type="button" label="Delete" className="p-button-danger w-6rem" />
                        </div>
                    </div>
                )
                show(showContent, severity);
            }
        },
    ]

    const [inviteDialog, setInviteDialog] = useState(false);
    return (
        <div className="grid">
            <Toast ref={toast} position="bottom-center" />
            <Toast ref={notif} />

            <div className='col-12 m-0' style={{ background: "url('https://primefaces.org/cdn/primereact/images/galleria/galleria12.jpg')", height: "25vh" }}>
            </div>

            <div className='col-12 mt-4'>
                <div className='grid'>

                    <div className='col lg:col-3'>
                        <div className="card bg-transparent border-none">
                            <h5>WorkSpace 1</h5>
                            <div className='col-12' style={{ marginLeft: "-0.4em" }}>
                                {(role == 'superadmin') ? <>
                                    <SplitButton label={
                                        <div className='flex'>
                                            <span className='font-large text-md ml-2 mt-1'>
                                                Add Member to WorkSpace
                                            </span>
                                        </div>
                                    }
                                        onClick={() => { showInviteDialog() }}
                                        model={workOp}
                                        className="ml-1 p-button-outlined p-button-secondary p-button-sm w-full custom-splitbutton-custom"
                                    ></SplitButton>
                                </> : <>
                                    <SplitButton label={
                                        <div className='flex'>
                                            <span className='font-large text-md ml-2 mt-1'>
                                                Add Member to WorkSpace
                                            </span>
                                        </div>
                                    }
                                        onClick={() => { showInviteDialog() }}
                                        model=""
                                        className="ml-1 p-button-outlined p-button-secondary p-button-sm w-full custom-splitbutton-custom"
                                    ></SplitButton>
                                </>}

                            </div>
                            <div className='col-12 task-card'>
                                <div className="grid">
                                    <div className='col-12'>

                                        <span className='font-medium text-900'>Members</span>
                                        <br />
                                        <span className='font-medium text-500 text-sm'>{members.length} Member</span>

                                        <Divider />
                                        {members.map((member) => (
                                            <div className='mt-3' key={member.member_key}>

                                                {(role == 'user') ? <>
                                                    <SplitButton onClick={() => router.replace(`/${myQuery.org_key}/member/${member.user_key}`)} label={
                                                        <div className='flex'>
                                                            <span className='text-lg ml-2 mt-1'>
                                                                {member.user.username.split(' ')[0]}
                                                            </span>
                                                            {(member.team != null) ? <Badge value={member.team.team_name} severity="success"></Badge> : <Badge value='No Team' severity="danger"></Badge>}

                                                        </div>
                                                    }
                                                        className="p-button-text p-button-secondary p-button-sm w-full custom-splitbutton-custom"
                                                    ></SplitButton>
                                                </> : <>
                                                    <SplitButton onClick={() => router.replace(`/${myQuery.org_key}/member/${member.user_key}`)} label={
                                                        <div className='flex'>
                                                            <span className='text-lg ml-2 mt-1'>
                                                                {member.user.username.split(' ')[0]}
                                                            </span>
                                                            {(member.team != null) ? <Badge value={member.team.team_name} severity="success"></Badge> : <Badge value='No Team' severity="danger"></Badge>}

                                                        </div>
                                                    }
                                                        model={itemsModel(member)}
                                                        className="p-button-text p-button-secondary p-button-sm w-full custom-splitbutton-custom"
                                                    ></SplitButton>
                                                </>}
                                            </div>

                                        ))}

                                        <Divider />
                                    </div>

                                    <Button label="Create Team" onClick={() => { createTeamDialog() }} className='w-full p-button-sm p-button-secondary mt-3' style={{ padding: "0.5em 1em 0.5em 1em", borderRadius: "5px" }} />

                                    <Button label="Report" onClick={() => { setInviteDialog(true) }} className='w-full p-button-sm p-button-secondary mt-3' style={{ padding: "0.5em 1em 0.5em 1em", borderRadius: "5px" }} />

                                    <Dialog maskStyle={maskStyles} visible={inviteDialog} className='p-dialog' style={{ backgroundColor: "#fff", maxWidth: "80vw" }} modal onHide={() => setInviteDialog(false)}>
                                        <MemberReport workKey={workKey} />
                                    </Dialog>
                                </div>
                            </div>
                        </div>

                    </div>


                    <Dialog header={dialogHeader} maskStyle={maskStyles} visible={contentDialog} className='p-dialog' style={{ width: '30vw', backgroundColor: "#fff" }} modal onHide={() => setContentDialog(false)}>
                        {dialogType}
                    </Dialog>
                    <div className="col lg:col-9 p-0">
                        <div className="card bg-transparent border-none" style={{ marginBottom: "-1em" }}>
                            <Activity workKey={workKey} />

                        </div>
                        <div className="card bg-transparent border-none" >
                            <div className='grid'>

                                <div className='col-12'>
                                    <h5>Team List</h5>

                                    <ScrollPanel style={{ height: "50vh" }} className="grid c mb-3 task-card">
                                        {
                                            teamList.map((team) => (

                                                <div className='col-12 mt-3 p-0' key={team.team_key}>

                                                    <Link href={'/' + myQuery.org_key + "/workspace/" + workKey + '/' + team.team_key}>
                                                        <div className='task-card w-full hover:bg-gray-200 p-2 ' style={{ cursor: "pointer", borderRadius: "5px" }}>
                                                            <div className='grid'>
                                                                <div className='col-2'>
                                                                    <p className='text-md text-gray-900'>
                                                                        {team.team_name}
                                                                    </p>
                                                                    <h5 className='text-sm text-gray-500' style={{ marginTop: "-1em", marginBottom: "0" }}>
                                                                        {team.team_key}
                                                                    </h5>
                                                                </div>
                                                                <div className='col'>
                                                                    {
                                                                        team.workspace_members.map((member) => (

                                                                            <Avatar className='mx-2' image={contextPath + '/demo/images/avatar/amyelsner.png'} size="large" shape="circle"></Avatar>
                                                                        ))
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>

                                                </div>
                                            ))
                                        }

                                    </ScrollPanel>

                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export async function getServerSideProps(context) {
    const { query } = context;
    return {
        props: {
            myQuery: query
        },
    };
}

export default checkWorkspaceRole(Dashboard);
