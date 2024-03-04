import React, { useState, useEffect, useContext } from 'react';
import { InputText } from 'primereact/inputtext';
import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import getConfig from 'next/config';

import Ganttchart from '../../../../components/roadmap/GanttChart';
import Breadcrumb from '../../../../components/BreadCrumb';
import InviteProjectDialog from '../../../../components/dialog-content/InviteProjectDialog';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { SprintService } from '../../../../services/SprintServices';
import CreateTask from '../../../../components/roadmap/CreateTask';
import { emit, on } from '../../../../utils/EventEmitter';
import { ProjectService } from '../../../../services/ProjectServices';
import { debounce } from 'lodash';
import { MultiSelect } from 'primereact/multiselect';
import { TaskServices } from '../../../../services/TaskServices';
import socket from '../../../../utils/Socket';

const Roadmap = ({ myQuery }) => {

    const [taskList, setTaskList] = useState([])
    const [inviteDialog, setInviteDialog] = useState(false);
    const { addIssueDialog, setAddIssueDialog, setOrgKeyLink, setProjectKeyLink } = useContext(LayoutContext);
    const [memberList, setMemberList] = useState([]);
    const [roadmapData, setRoadmapData] = useState([]);
    const [taskStatus, setTaskStatus] = useState([]);

    useEffect(() => {
        socket.emit('projectRoom', { org_key: myQuery.project_key, user_key: sessionStorage.getItem('user_key') });

        socket.on('getId', (res) => {
            sessionStorage.setItem('socket_id', res);
        })

        return () => {

        }
    }, [])

    useEffect(() => {
        const sprintService = new SprintService();
        const projectService = new ProjectService();
        const taskService = new TaskServices();
        sprintService.getRoadmapSprint(sessionStorage.getItem('project_key')).then((res) => { setRoadmapData(res); })
        projectService.getUserPhoto(sessionStorage.getItem('project_key')).then((data) => setMemberList(data));
        taskService.getTaskStatus(sessionStorage.getItem('project_key')).then((data) => { setTaskStatus(data) });

        on('refreshRoadmap', () => {
            sprintService.getRoadmapSprint(sessionStorage.getItem('project_key')).then((res) => { setRoadmapData(res) })
        })
        on('inviteMemberSuccess', () => {
            projectService.getUserPhoto(sessionStorage.getItem('project_key')).then((data) => setMemberList(data));
            setInviteDialog(false);
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

    const [category, setCategory] = useState(null);
    const status_list = [
        { name: 'Todo', code: 'TD' },
        { name: 'On Progress', code: 'OP' },
        { name: 'Done', code: 'DN' }
    ];

    const maskStyles = {
        backgroundColor: 'rgb(0 0 0 / 50%)',
    };
    if (roadmapData == null) {
        return (<div>loading...</div>)
    }

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


    const filterSprint = debounce((event) => {
        const eventValue = event.target.value;
        const filteredSprints = roadmapData[0].data.filter((sprint) => {
            const tasks = sprint || [];
            return sprint.name.toLowerCase().includes(eventValue.toLowerCase()) || tasks.length > 0;
        });
        // setSprints(filteredSprints);
        const filteredData = [{ name: 'filtered roadmap', data: filteredSprints.map(({ id, name, start, end, owner }) => ({ id, name, start, end, owner })) }]
        setRoadmapData(filteredData)
        if (eventValue == '') {
            emit('refreshRoadmap')
        }
    }, 1000)

    const changeStatusCategory = (event) => {
        setCategory(event);
        const mappedStatusKey = event.map(status => status.status_key);
        const filteredSprints = roadmapData[0].data.filter((sprint) => {
            const tasks = sprint || [];
            return mappedStatusKey.includes(sprint.status) || tasks.length > 0;
        });
        // setSprints(filteredSprints);
        const filteredData = [{ name: 'filtered roadmap', data: filteredSprints.map(({ id, name, start, end, owner }) => ({ id, name, start, end, owner })) }]
        setRoadmapData(filteredData)
        if (mappedStatusKey.length == 0) {
            emit('refreshRoadmap')
        }
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <Breadcrumb orgKey={myQuery.org_key} projectKey={myQuery.project_key} section="Roadmap" />
                    <h5>Roadmap</h5>

                    <div className="grid mb-3">
                        <div className='col lg:col-3'>
                            <span className="p-input-icon-right">
                                <InputText type="text" placeholder="Search" onChange={filterSprint} className='p-inputtext-sm' />
                                <i className="pi pi-search" />
                            </span>

                        </div>
                        <div className='col'>
                            <AvatarGroup className="mb-3">
                                {memberList.slice(0, 4).map((member, index) => (
                                    <Avatar image={memberPhotos[index]} size="large" shape="circle" key={index}></Avatar>
                                ))}
                                {(memberList.length - 4 >= 1) ? <Avatar label={memberList.length - 4} shape="circle" size="large" className='bg-gray-800' style={{ color: '#ffffff' }}></Avatar> : <></>}
                                <Button icon="pi pi-user-plus" onClick={() => { setInviteDialog(true) }} className='p-button-rounded ml-2 p-button-secondary' aria-label="Filter" />
                            </AvatarGroup>

                            <Dialog header="Invite People" maskStyle={maskStyles} visible={inviteDialog} className='p-dialog' style={{ width: '30vw', backgroundColor: "#fff" }} modal onHide={() => setInviteDialog(false)}>
                                <InviteProjectDialog />
                            </Dialog>
                        </div>
                        <div className='col'>
                            {/* <Dropdown size="small" value={category} onChange={(e) => setCategory(e.value)} options={status_list} optionLabel="name" placeholder="Select Category" /> */}
                            <MultiSelect value={category} style={{ float: "right" }} className="w-full md:w-14rem p-inputtext-sm" onChange={(e) => changeStatusCategory(e.value)} options={taskStatus} optionLabel="name" display="chip"
                                placeholder="Status Category" maxSelectedLabels={3} />

                        </div>



                    </div>
                    <Ganttchart seriesData={roadmapData} />
                    <Button label='add Task' icon="pi pi-plus" className="mt-2 lg:ml-3 text-gray-700 p-button-rounded p-button-outlined" onClick={() => { setAddIssueDialog(true) }} />

                    <Dialog header="Add Task" maskStyle={maskStyles} modal={true} visible={addIssueDialog} className='p-dialog' style={{ width: '30vw', backgroundColor: "#fff" }} onHide={() => setAddIssueDialog(false)}>
                        <CreateTask projectKey={myQuery.project_key} />
                    </Dialog>
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



export default Roadmap;
