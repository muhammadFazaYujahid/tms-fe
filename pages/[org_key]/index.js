import getConfig from 'next/config';
import React, { useState, useContext, useEffect, useRef } from 'react';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { Divider } from 'primereact/divider';
import { AvatarGroup } from 'primereact/avatargroup';
import { Avatar } from 'primereact/avatar';
import Link from 'next/link';
import { WorkspaceServices } from '../../services/WorkspaceServices';
import { Button } from 'primereact/button';

import { OrgServices } from '../../services/OrgServices';

import { emit, on } from '../../utils/EventEmitter';
import { ProjectService } from '../../services/ProjectServices';
import { Badge } from 'primereact/badge';
import { listedOrg, requireAuth } from '../../middlewares/requireAuth';
import { ScrollPanel } from 'primereact/scrollpanel';
import { InputText } from 'primereact/inputtext';
import { debounce } from 'lodash';
import CreateClient from '../../components/CreateClient';
import { Dialog } from 'primereact/dialog';
import EditClient from '../../components/EditCLient';
import { NextPageContext } from 'next';
import socket from '../../utils/Socket';
import { Dropdown } from 'primereact/dropdown';


const Dashboard = ({ myQuery, avaiableOrg }) => {

    const { setShowSidebar, setOrgKeyLink } = useContext(LayoutContext);
    const [workspaceList, setWorkspaceList] = useState([]);
    const [projectList, setProjectList] = useState([]);
    const [nonTeamMember, setNonTeamMember] = useState([]);
    const [orgKey, setOrgKey] = useState(myQuery.org_key);
    const [clientList, setClientList] = useState([]);

    useEffect(() => {
        setOrgKeyLink(myQuery.org_key);
        sessionStorage.setItem('org_key', myQuery.org_key);


    }, [])

    useEffect(() => {
        socket.emit('loggedIn', { org_key: myQuery.org_key, user_key: sessionStorage.getItem('user_key') });

        socket.on('getId', (res) => {

            sessionStorage.setItem('socket_id', res);
        })

        return () => {

        }
    }, [])

    useEffect(() => {

        setShowSidebar(false);
        const workspaceServices = new WorkspaceServices();
        workspaceServices.getWorkspaceList().then((res) => { setWorkspaceList(res); });

        const orgServices = new OrgServices;
        orgServices.nonTeamMember().then((res) => { setNonTeamMember(res) });
        orgServices.getClient(orgKey).then((res) => setClientList(res));

        const projectService = new ProjectService();
        projectService.getProjectList().then((res) => setProjectList(res));

        const reload = on('refreshOrgPage', () => {
            workspaceServices.getWorkspaceList().then((res) => { setWorkspaceList(res); });
            projectService.getProjectList().then((res) => setProjectList(res));
            orgServices.nonTeamMember().then((res) => { setNonTeamMember(res) });
        })

        on('refreshMember', () => {
            orgServices.nonTeamMember().then((res) => { setNonTeamMember(res) });

        })
        on('refreshClient', () => {
            setShowDialog(false);
            orgServices.getClient(orgKey).then((res) => setClientList(res));

        })
        return () => {
            setShowSidebar(true);
            // reload();
        }
    }, [])


    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const workspaceMember = (member) => {

        if (member.length < 4) {
            let coba = []
            member.map((data) => {

                coba.push()
            })

        }
    }

    const [dialogHeader, setDialogHeader] = useState('');
    const [dialogContent, setDialogContent] = useState('');
    const [showDialog, setShowDialog] = useState(false);


    const maskStyles = {
        backgroundColor: 'rgb(0 0 0 / 50%)',
    };


    const filterMember = debounce((event) => {
        const eventValue = event.target.value;
        const filterednonTeamMember = nonTeamMember.filter((member) => {
            const tasks = member.tasks || [];
            return member.username.toLowerCase().includes(eventValue.toLowerCase()) || tasks.length > 0;
        });
        setNonTeamMember(filterednonTeamMember);
        if (eventValue == '') {
            emit('refreshMember')
        }
    }, 1000)

    const changeOrgView = (event) => {

        window.location = `/${event.org_key}`
    }

    if (nonTeamMember.length == 0) {
        return <>loading...</>
    }

    return (
        <div className="grid">

            <div className='col lg:mr-5'>
                <div className='grid'>
                    <div className='col-12'>
                        <div className='col-12' style={{ marginBottom: "-1em" }}>

                            <h5>Workspaces</h5>
                            {/* <InputText type="text" placeholder="Search Workspace..." onChange={filterMember} className='p-inputtext-sm w-2 mb-4' /> */}
                        </div>
                        <ScrollPanel style={{ height: "19.5em" }} className='w-full'>
                            <div className='grid'>

                                {
                                    workspaceList.map((workspace) => (

                                        <div className="col-12 lg:col-6 xl:col-3" key={workspace.work_key}>
                                            <Link href={orgKey + "/workspace/" + workspace.work_key}>

                                                <div className="card mb-0" style={{ cursor: "pointer" }}>

                                                    <div className="">
                                                        <span className="block text-900 font-medium mb-3">{workspace.workspace_name}</span>
                                                        <Divider />
                                                        <div className="text-500 font-small  text-sm">Team member :</div>

                                                        <AvatarGroup className="mt-3">
                                                            {(workspace.workspace_members.length <= 4) ? (
                                                                workspace.workspace_members.map((member) => (
                                                                    <Avatar image={`${contextPath}/demo/images/avatar/${(member.user.photo == null) ? 'default-photo.png' : member.user.photo}`} size="large" shape="circle"></Avatar>
                                                                ))) : (<>
                                                                    {workspace.workspace_members.slice(0, 4).map((member) => (
                                                                        <Avatar image={`${contextPath}/demo/images/avatar/${(member.user.photo == null) ? 'default-photo.png' : member.user.photo}`} size="large" shape="circle"></Avatar>
                                                                    ))}
                                                                    <Avatar label={'+' + workspace.workspace_members.length - 4} shape="circle" size="large" className='bg-gray-800' style={{ color: '#ffffff' }}></Avatar>
                                                                </>
                                                            )}
                                                        </AvatarGroup>
                                                    </div>
                                                </div>

                                            </Link>
                                        </div>
                                    ))
                                }

                            </div>

                        </ScrollPanel>


                    </div>
                    {/* <Divider className='mt-0 mb-1' /> */}
                    {/* <div className='col-12'>  </div> */}
                    <div className='col-12'>
                        <div className='col-12' style={{ marginBottom: "-1em" }}>

                            <h5>Projects</h5>
                            {/* <InputText type="text" placeholder="Search Project..." onChange={filterMember} className='p-inputtext-sm w-2 mb-4' /> */}
                        </div>
                        <ScrollPanel style={{ height: "21.5em" }} className='w-full'>
                            <div className='grid'>

                                {
                                    projectList.map((project) => (
                                        <div className="col-12 lg:col-6 xl:col-3" key={project.project_key}>

                                            <Link href={orgKey + '/' + project.project_key + "/backlog"}>
                                                <div className="card mb-0" style={{ cursor: "pointer" }}>
                                                    <div className="">
                                                        <span className="block text-900 font-medium mb-3">{project.project_name}</span>
                                                        <Divider />
                                                        <div className='py-0'>
                                                            <div className="my-1 text-500 font-small text-sm">Worked by : <Badge value={project.workspace_name} className='m-1' severity="info"></Badge></div>
                                                        </div>

                                                    </div>
                                                </div>

                                            </Link>
                                        </div>
                                    ))
                                }


                            </div>

                        </ScrollPanel>

                    </div>
                </div>
            </div>
            <div className='col-3'>
                <div className='col-12 task-card shadow'>
                    <div className="grid">
                        <div className='col-12'>

                            <Dropdown
                                size="small"
                                placeholder='Change Organization View'
                                onChange={(e) => changeOrgView(e.value)}
                                options={avaiableOrg}
                                optionLabel="org_name"
                                className="w-full bg-white p-inputtext-sm bg-gray-100 text-gray-900" />
                            <Divider />

                            <span className='font-medium text-900'>Organization Members</span>
                            <br />
                            <span className='font-medium text-500 text-sm'>{nonTeamMember.length} Members</span>

                            <Divider />

                            <InputText type="text" placeholder="Search Member..." onChange={filterMember} className='p-inputtext-sm w-full mb-4' />
                            <ScrollPanel style={{ height: "10em" }} className='w-full'>
                                {
                                    (nonTeamMember.length > 0) ? nonTeamMember.map((user) => (

                                        <div className='mt-3'>
                                            <Link href="#">
                                                <div className='flex hover:bg-gray-200 active:text-gray-100 active:bg-gray-400 p-2' style={{ cursor: "pointer", borderRadius: "5px" }}>
                                                    <Avatar image={`${contextPath}/demo/images/avatar/${(user.photo == null) ? 'amyelsner.png' : 'user.photo'}`} shape="circle" />
                                                    <p className='text-lg ml-2 mt-1'>
                                                        {user.username}
                                                        {(!user.verified) ? (<>
                                                            <br></br>
                                                            <small className='text text-orange-400'>invited, waiting verified</small>
                                                        </>) : ('')}

                                                    </p>
                                                </div>

                                            </Link>
                                        </div>
                                    )) : <></>
                                }

                            </ScrollPanel>

                        </div>

                    </div>
                </div>
                <div className='col-12 task-card shadow'>
                    <div className="grid">
                        <div className='col-12'>
                            <div className='flex'>
                                <div className='col-6'>
                                    <span className='font-medium text-900'>Clients</span>
                                    <br />
                                    <span className='font-medium text-500 text-sm'>{clientList.length} Client</span>
                                </div>
                                <div className='col-6 text-right'>
                                    <Button icon="pi pi-plus"
                                        onClick={() => {
                                            setShowDialog(true);
                                            setDialogHeader("Add Client");
                                            setDialogContent(<CreateClient orgKey={orgKey} />)
                                        }} tooltip='add client' tooltipOptions={{ position: 'bottom' }} className='p-button-rounded' />
                                </div>
                            </div>


                            <Divider />

                            {/* <InputText type="text" placeholder="Search Member..." className='p-inputtext-sm w-full mb-4' /> */}
                            <ScrollPanel style={{ height: "10em" }} className='w-full'>
                                {
                                    clientList.map((client) => (

                                        <div className='mt-3 pointer' key={client.client_key} onClick={() => {
                                            setShowDialog(true);
                                            setDialogHeader("Edit Client");
                                            setDialogContent(<EditClient client={client} />)
                                        }}>
                                            <div className='flex hover:bg-gray-200 active:text-gray-100 active:bg-gray-400 p-2' style={{ cursor: "pointer", borderRadius: "5px" }}>
                                                <p className='text-lg ml-2 mt-1'>
                                                    {client.name}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                }

                            </ScrollPanel>

                        </div>

                    </div>
                </div>

            </div>

            <Dialog header={<div className='grid'>
                <div className='col'>
                    <span>{dialogHeader}</span>

                </div>
                {/* <div className='col-1 mr-6'>
                                <Button icon="pi pi-window-maximize" className="p-button-secondary p-button-text p-0 btn btn-sm" onClick={() => { setVisibleFullScreen(true) }} />
                            </div> */}

            </div>} maskStyle={maskStyles} modal={true} visible={showDialog} className='p-dialog' style={{ width: '30vw', backgroundColor: "#fff" }} onHide={() => setShowDialog(false)}>
                {dialogContent}
            </Dialog>

        </div>
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


export default requireAuth(listedOrg(Dashboard));
