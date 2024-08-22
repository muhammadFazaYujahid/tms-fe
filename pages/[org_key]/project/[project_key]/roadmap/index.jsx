import React, { useState, useEffect, useContext } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import Ganttchart from '@components/roadmap/GanttChart';
import Breadcrumb from '@components/BreadCrumb';
import InviteProjectDialog from '@components/dialog-content/InviteProjectDialog';
import { LayoutContext } from '@layout/context/layoutcontext';
import CreateTask from '@components/roadmap/CreateTask';
import { emit, on } from '@utils/EventEmitter';
import { debounce } from 'lodash';
import { MultiSelect } from 'primereact/multiselect';
import socket from '@utils/Socket';
import SprintBloc from '../../../../../services/Blocs/SprintBloc';
import apiResponse from '../../../../../services/apiResponse';
import MemberList from '../../components/memberList';
import TaskBloc from '../../../../../services/Blocs/TaskBloc';

const Roadmap = ({ myQuery }) => {

    const [inviteDialog, setInviteDialog] = useState(false);
    const { addIssueDialog, setAddIssueDialog, setOrgKeyLink, setProjectKeyLink, setShowSidebar } = useContext(LayoutContext);
    const [roadmapData, setRoadmapData] = useState([]);
    const [taskStatus, setTaskStatus] = useState([]);

    const sprintBloc = new SprintBloc;
    const taskBloc = new TaskBloc;

    const fetchRoadmapData = () => {
        sprintBloc.fetchGetRoadmapSprint(sessionStorage.getItem('project_key'))
    }

    const fetchTaskStatus = () => {
        taskBloc.fetchGetTaskStatus(sessionStorage.getItem('project_key'));
    }

    useEffect(() => {
      fetchRoadmapData();
      fetchTaskStatus();
      const getRoadmap = sprintBloc.getRoadmapSprint.subscribe((result) => {
        switch (result.status) {
            case apiResponse.COMPLETED:
                setRoadmapData(result.data)
                break
            case apiResponse.ERROR:
                console.error('error', result.data)
                break
            default:
                break
        }
      })

      const getStatus = taskBloc.getTaskStatus.subscribe((result) => {
        switch (result.status) {
            case apiResponse.COMPLETED:
                console.log('berhasil get status', result);
                setTaskStatus(result.data.data);
                break
            case apiResponse.ERROR:
                console.error('error', result.data)
                break
            default:
                break
        }
      })

      return () => {
        getRoadmap.unsubscribe();
        getStatus.unsubscribe();
      }
    }, [])
    

    useEffect(() => {
        socket.emit('projectRoom', { org_key: myQuery.project_key, user_key: sessionStorage.getItem('user_key') });

        socket.on('getId', (res) => {
            sessionStorage.setItem('socket_id', res);
        })
        setShowSidebar(true);
        return () => {
            
            setShowSidebar(false);
        }
    }, [])

    useEffect(() => {
        on('refreshRoadmap', () => {
            fetchRoadmapData();
        })
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

    const [category, setCategory] = useState(null);
    const maskStyles = {
        backgroundColor: 'rgb(0 0 0 / 50%)',
    };
    if (roadmapData == null) {
        return (<div>loading...</div>)
    }

    const filterSprint = debounce((event) => {
        const eventValue = event.target.value;
        const filteredSprints = roadmapData[0].data.filter((sprint) => {
            const tasks = sprint || [];
            return sprint.name.toLowerCase().includes(eventValue.toLowerCase()) || tasks.length > 0;
        });
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
                            <MemberList />

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
