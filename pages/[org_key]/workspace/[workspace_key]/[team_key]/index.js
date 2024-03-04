import React, { useState, useEffect, useContext, useRef } from 'react';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { Dialog } from 'primereact/dialog';

import getConfig from 'next/config';

import { LayoutContext } from '../../../../../layout/context/layoutcontext';
import { Divider } from 'primereact/divider';
import Link from 'next/link';
import { ScrollPanel } from 'primereact/scrollpanel';
import { TeamServices } from '../../../../../services/TeamServices';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { OverlayPanel } from 'primereact/overlaypanel';
import EditTeamName from '../../../../../components/workspace/EditTeamName';
import { on } from '../../../../../utils/EventEmitter';

const Team = ({ myQuery }) => {
    const router = useRouter();
    const [userRole, setUserRole] = useState('');
    const { setShowSidebar, showToast } = useContext(LayoutContext);

    const [members, setMembers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [team, setTeam] = useState([]);

    useEffect(() => {
        sessionStorage.setItem('team_key', myQuery.team_key)
        setUserRole(sessionStorage.getItem('userRole'));
    }, []);

    useEffect(() => {
        setShowSidebar(false);
        const teamServices = new TeamServices();
        teamServices.getTeamDetail(sessionStorage.getItem('team_key')).then((res) => setTeam(res));
        teamServices.getTeamMember(sessionStorage.getItem('team_key')).then((res) => setMembers(res));
        teamServices.getTeamProject(sessionStorage.getItem('team_key')).then((res) => { setProjects(res); });

        on('refreshTeam', () => {
            teamServices.getTeamDetail(sessionStorage.getItem('team_key')).then((res) => setTeam(res));
        })

        return () => {
            setShowSidebar(true);
        }
    }, [])

    const contextPath = getConfig().publicRuntimeConfig.contextPath;


    const editNameOp = useRef(null);
    const editTeamName = (e) => {
        e.stopPropagation();
        editNameOp.current.toggle(e);
    }


    const confirmDelete = (event) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Delete Team??',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => accept(),
        });
    };

    const accept = () => {
        const data = {
            team_key: team.team_key,
            activity: {
                action: `removed ${team.team_name} team`,
                object_one: '',
                object_two: '',
                type: 'workspace',
                related_code: team.work_key,
                url: window.location.href,
                additional_text: ''
            }
        }
        const teamServices = new TeamServices;
        teamServices.deleteTeam(data)
            .then((res) => {
                if (!res.success) {
                    return showToast({
                        severity: 'error',
                        summary: 'Delete Team Failed',
                        detail: res.message,
                        sticky: false
                    });
                }
                router.replace(`/${myQuery.org_key}/workspace/${myQuery.workspace_key}`);
                showToast({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Delete Team success',
                    sticky: false
                });
                // if (data.success) {
                // }
            });
    };

    return (
        <div className="grid">
            <div className='col-12 m-0' style={{ background: "url('https://primefaces.org/cdn/primereact/images/galleria/galleria12.jpg')", height: "25vh" }}>
            </div>

            <div className='col-12 mt-4'>
                <div className='grid'>

                    <div className='col lg:col-3'>
                        <div className="card bg-transparent border-none">
                            <h5>{team.team_name}</h5>
                            {/* <div className='col-12' style={{ marginLeft: "-0.4em" }}>
                                <div className="grid">
                                    <div className='col-10'>
                                        <Button label="Add People" style={{ padding: "0.5em 1em 0.5em 1em" }} className="p-button-secondary p-button-outlined mr-2 btn btn-sm w-full" />

                                    </div>
                                    <div className='col-2'>
                                        <Button label="..." className='p-button-secondary ' style={{ padding: "0.5em 1em 0.5em 1em" }} />

                                    </div>

                                </div>
                            </div> */}
                            <div className='col-12 task-card'>
                                <div className="grid">
                                    <div className='col-12'>
                                        <span className='font-medium text-900'>Members</span>
                                        <br />
                                        <span className='font-medium text-500 text-sm'>{members.length} Member</span>
                                        <Divider />
                                        {members.map((member) => (
                                            <div className='mt-3' key={member.user.user_key}>
                                                <Link href={`/${myQuery.org_key}/member/${member.user.user_key}`}>
                                                    <div className='flex hover:bg-gray-200 active:text-gray-100 active:bg-gray-400 p-2' style={{ cursor: "pointer", borderRadius: "5px" }}>
                                                        <Avatar image={`${contextPath}/demo/images/avatar/amyelsner.png`} shape="circle" />
                                                        <span className='text-lg ml-2 mt-1'>
                                                            {member.user.username}
                                                        </span>
                                                    </div>

                                                </Link>
                                            </div>

                                        ))}

                                        <Divider />
                                        <Button label="Edit Team Name" onClick={(e) => { editTeamName(e) }} className='w-full p-button-sm p-button-secondary mt-3' style={{ padding: "0.5em 1em 0.5em 1em", borderRadius: "5px" }} />

                                        <OverlayPanel ref={editNameOp} showCloseIcon>
                                            <EditTeamName team={team} />
                                        </OverlayPanel>

                                        <Button label="Delete Team" disabled={(userRole == 'superadmin') ? false : true} onClick={(e) => { confirmDelete(e) }} className='w-full p-button-sm p-button-danger mt-3' style={{ padding: "0.5em 1em 0.5em 1em", borderRadius: "5px" }} />
                                        <ConfirmPopup />

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="col lg:col-9 p-0">
                        {/* <div className="card bg-transparent border-none" style={{ marginBottom: "-1em" }}>
                            <h5>Team Activity</h5>

                            <div className="grid mb-3 task-card">
                                <div className='col-12 mt-3'>
                                    <span className='text-lg'><i className='pi pi-user border-1 p-2 mr-1' style={{ borderRadius: "100%" }}> </i> <b>Ilham ramadhan</b> add a Comment March 16, 2023 at 08:09 AM <Chip label="Comment" /> Siap laksanakan</span>
                                </div>
                                <div className='col-12 mt-3'>
                                    <span className='text-lg'><i className='pi pi-user border-1 p-2 mr-1' style={{ borderRadius: "100%" }}> </i> <b>Ilham ramadhan</b> add a Comment March 16, 2023 at 08:09 AM <Chip label="Comment" /> Siap laksanakan</span>
                                </div>
                                <div className='col-12 mt-3'>
                                    <span className='text-lg'><i className='pi pi-user border-1 p-2 mr-1' style={{ borderRadius: "100%" }}> </i> <b>Ilham ramadhan</b> add a Comment March 16, 2023 at 08:09 AM <Chip label="Comment" /> Siap laksanakan</span>
                                </div>



                            </div>

                        </div> */}
                        <div className="card bg-transparent border-none">
                            <div className='grid'>

                                <div className='col-12'>
                                    <h5>Handled Projects</h5>

                                    <ScrollPanel style={{ height: "50vh" }} className="grid c mb-3 task-card">
                                        {projects.map((project) => (
                                            <div className='col-12 mt-3 p-0' key={project.project_key}>

                                                <Link href={`/${myQuery.org_key}/${project.project_key}/roadmap`}>
                                                    <div className='w-full hover:bg-gray-200 p-2' style={{ cursor: "pointer", borderRadius: "5px" }}>
                                                        <p className='text-md text-gray-900'>
                                                            {project.project_name}
                                                        </p>
                                                        <h5 className='text-sm text-gray-500' style={{ marginTop: "-1em", marginBottom: "0" }}>
                                                            {project.project_key}
                                                        </h5>
                                                    </div>
                                                </Link>

                                            </div>

                                        ))}
                                    </ScrollPanel>

                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
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

export default Team;
