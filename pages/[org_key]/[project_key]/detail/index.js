import React, { useState, useEffect, useContext, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import getConfig from 'next/config';

import Breadcrumb from '../../../../components/BreadCrumb';
import InviteProjectDialog from '../../../../components/dialog-content/InviteProjectDialog';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { emit, on } from '../../../../utils/EventEmitter';
import { ProjectService } from '../../../../services/ProjectServices';
import socket from '../../../../utils/Socket';
import EditProjectName from '../../../../components/EditProjectName';
import { OverlayPanel } from 'primereact/overlaypanel';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { useRouter } from 'next/router';

const ProjectDashoard = ({ myQuery }) => {
    const router = useRouter();
    const [inviteDialog, setInviteDialog] = useState(false);
    const { showToast, setAddIssueDialog, setOrgKeyLink, setProjectKeyLink } = useContext(LayoutContext);
    const [memberList, setMemberList] = useState([]);
    const [project_data, setProject_data] = useState([]);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        setUserRole(sessionStorage.getItem('userRole'));
        socket.emit('projectRoom', { org_key: myQuery.project_key, user_key: sessionStorage.getItem('user_key') });

        socket.on('getId', (res) => {
            sessionStorage.setItem('socket_id', res);
        })

        return () => {

        }
    }, [])

    useEffect(() => {
        const projectService = new ProjectService();
        projectService.getProjectDetail(myQuery.project_key).then((res) => setProject_data(res));
        projectService.getUserPhoto(sessionStorage.getItem('project_key')).then((data) => setMemberList(data));

        on('inviteMemberSuccess', () => {
            projectService.getUserPhoto(sessionStorage.getItem('project_key')).then((data) => setMemberList(data));
            setInviteDialog(false);
        })

        on('refreshProject', () => {
            projectService.getProjectDetail(myQuery.project_key).then((res) => setProject_data(res));
        })
        // taskServices.getTaskRoadmap().then((data) => setTaskList(data));
    }, []);

    useEffect(() => {
        on('closeRoadmapDialog', () => {
            setAddIssueDialog(false);
        })
    }, [])

    useEffect(() => {
        setOrgKeyLink(myQuery.org_key);
        setProjectKeyLink(myQuery.project_key);
    }, [])

    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const maskStyles = {
        backgroundColor: 'rgb(0 0 0 / 50%)',
    };

    const getPhoto = async (photo) => {
        const projectService = new ProjectService();
        const data = await projectService.getPhoto(photo)
        return data;
    }
    const [memberPhotos, setMemberPhotos] = useState([]);
    useEffect(() => {
        const fetchMemberPhotos = async () => {
            try {
                const photos = await Promise.all(memberList.slice(0, 4).map((member) => getPhoto(member.photo)));
                setMemberPhotos(photos);
            } catch (error) {
                console.error(error);
            }
        };

        fetchMemberPhotos();
    }, [])


    const editNameOp = useRef(null);
    const editProjectName = (e) => {
        e.stopPropagation();
        editNameOp.current.toggle(e);
    }

    const confirmDelete = (event) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Delete Project?',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => accept(),
        });
    };

    const accept = () => {
        const data = {
            project_key: project_data.project_key,
            activity: {
                action: `removed ${project_data.project_name} Project`,
                object_one: '',
                object_two: '',
                type: 'workspace',
                related_code: project_data.work_key,
                url: window.location.href,
                additional_text: ''
            }
        }
        const projectService = new ProjectService;
        projectService.deleteProject(data)
            .then((res) => {
                if (!res.success) {
                    return showToast({
                        severity: 'error',
                        summary: 'Delete Team Failed',
                        detail: res.message,
                        sticky: false
                    });
                }
                router.replace(`/${myQuery.org_key}`);
                showToast({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Delete Project success',
                    sticky: false
                });
            });
    };

    const confirmRemoveMember = (event, member) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Remove Member?',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => removeMember(member),
        });
    };

    const removeMember = (member) => {
        const data = {
            user_key: member.user_key,
            project_key: project_data.project_key,
            activity: {
                action: `removed ${member.username} from ${project_data.project_name} Project`,
                object_one: '',
                object_two: '',
                type: 'workspace',
                related_code: project_data.work_key,
                url: window.location.href,
                additional_text: ''
            }
        }
        const projectService = new ProjectService;
        projectService.removeMember(data)
            .then((res) => {
                if (!res.success) {
                    return showToast({
                        severity: 'error',
                        summary: 'Delete Team Failed',
                        detail: res.message,
                        sticky: false
                    });
                }
                emit('inviteMemberSuccess');
                showToast({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Delete Member success',
                    sticky: false
                });
            });
    };


    if (project_data == null) {
        return <>loading...</>
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <Breadcrumb orgKey={myQuery.org_key} projectKey={myQuery.project_key} />

                    <div className='flex'>
                        <div className='col-7'>
                            <h5>{project_data.project_name} Project</h5>
                        </div>
                        <div className='col-5 text-right flex'>
                            <Button label='Edit Name' onClick={(e) => { editProjectName(e) }} className='p-button-sm ml-2 p-button-primary' aria-label="Filter" />

                            <OverlayPanel ref={editNameOp} showCloseIcon>
                                <EditProjectName project={project_data} />
                            </OverlayPanel>

                            <Button disabled={(userRole == 'superadmin') ? false : true} onClick={(e) => { confirmDelete(e) }} label='Delete Project' className='p-button-sm ml-2 p-button-danger' aria-label="Filter" />
                            <ConfirmPopup />
                        </div>

                    </div>

                    <div className="grid mb-3">
                        <div className='col'>
                            <div className='flex'>
                                <div className='col-10'>
                                    <h5>Project Handler</h5>
                                </div>
                                <div className='col-2 text-right'>
                                    <Button icon="pi pi-user-plus" onClick={() => { setInviteDialog(true) }} className='p-button-rounded ml-2 p-button-secondary' aria-label="Filter" />

                                </div>

                            </div>
                            {memberList.map((member) => (
                                <div className='task-card p-3 my-2'>
                                    <div className="surface-0 bg-transparent border">
                                        <div className="flex align-items-center flex-column lg:justify-content-between lg:flex-row">
                                            <div>
                                                <div className="font-medium text-xl text-900">
                                                    <span className='ml-2  text-lg'>{member.username}</span>
                                                </div>
                                            </div>
                                            <div style={{ float: "right" }} className='flex-grow-1 flex align-items-end justify-content-end font-bold text-white m-2 px-5' onClick={(e) => e.stopPropagation()}>
                                                <Button icon="pi pi-trash" onClick={(e) => { confirmRemoveMember(e, member) }} tooltip="remove from project" tooltipOptions={{ position: 'bottom' }} style={{ margin: "-0.6em 0", paddingBottom: '0.6em' }} className="p-button-rounded p-button-danger p-button-outlined" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            ))}

                            <Dialog header="Invite People" maskStyle={maskStyles} visible={inviteDialog} className='p-dialog' style={{ width: '30vw', backgroundColor: "#fff" }} modal onHide={() => setInviteDialog(false)}>
                                <InviteProjectDialog />
                            </Dialog>
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



export default ProjectDashoard;
