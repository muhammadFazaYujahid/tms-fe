import React, { useState, useEffect, useContext, useRef, Fragment } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import Breadcrumb from '@components/BreadCrumb';
import InviteProjectDialog from '@components/dialog-content/InviteProjectDialog';
import { LayoutContext } from '@layout/context/layoutcontext';
import { emit, on } from '@utils/EventEmitter';
import socket from '@utils/Socket';
import EditProjectName from '@components/EditProjectName';
import { OverlayPanel } from 'primereact/overlaypanel';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { useRouter } from 'next/router';
import PieChart from '../../../../../components/project-detail/PieChart';
import Ganttchart from '../../../../../components/roadmap/GanttChart';
import { generateExcel, numberToChar } from '../../../../../utils/generateExcel';
import moment from 'moment';
import SprintBloc from '../../../../../services/Blocs/SprintBloc';
import ProjectBloc from '../../../../../services/Blocs/projectBloc';
import apiResponse from '../../../../../services/apiResponse';
import MemberList from '../../components/memberList';

const ProjectDashoard = ({ myQuery }) => {
    const router = useRouter();
    const [inviteDialog, setInviteDialog] = useState(false);
    const { showToast, setAddIssueDialog, setOrgKeyLink, setProjectKeyLink, setShowSidebar } = useContext(LayoutContext);
    const [memberList, setMemberList] = useState([]);
    const [project_data, setProject_data] = useState([]);
    const [userRole, setUserRole] = useState('');
    const [statusSummary, setStatusSummary] = useState([]);
    const [roadmapData, setRoadmapData] = useState([]);
    const [hideButton, setHideButton] = useState(false);
    const [tasks, setTasks] = useState([]);

    const sprintBloc = new SprintBloc();
    const projectBloc = new ProjectBloc();

    useEffect(() => {
        setUserRole(sessionStorage.getItem('userRole'));
        socket.emit('projectRoom', { org_key: myQuery.project_key, user_key: sessionStorage.getItem('user_key') });

        socket.on('getId', (res) => {
            sessionStorage.setItem('socket_id', res);
        })
        setShowSidebar(true);
        return () => {
            
            setShowSidebar(false);
        }
    }, [])

    const fetchProjectDetail = () => {
        projectBloc.fetchGetProjectDetail(sessionStorage.getItem('project_key'));
    }
    const fetchMemberList = () => {
        projectBloc.fetchGetUserPhoto(sessionStorage.getItem('project_key'));
    }

    const fetchRoadmapData = () => {
        sprintBloc.fetchGetRoadmapSprint(sessionStorage.getItem('project_key'));
    }

    const fetchGetSprint = () => {
        sprintBloc.fetchGetSprint({project_key: sessionStorage.getItem('project_key')});
    }

    useEffect(() => {
        fetchProjectDetail();
        fetchMemberList();
        fetchRoadmapData();
        fetchGetSprint();

        const getDetail = projectBloc.getProjectDetail.subscribe((result) => {
            switch (result.status) {
                case apiResponse.COMPLETED:
                    const {project, statusData} = result.data.data;
                    setProject_data(project)
                    setStatusSummary(statusData);
                    break
                case apiResponse.ERROR:
                    console.error('error', result.data)
                    break
                default:
                    break
            }
        })

        const getMember = projectBloc.getUserPhoto.subscribe((result) => {
            switch (result.status) {
                case apiResponse.COMPLETED:
                    setMemberList(result.data);
                    break
                case apiResponse.ERROR:
                    console.error('error', result.data)
                    break
                default:
                    break
            }
        })

        const getRoadmap = sprintBloc.getRoadmapSprint.subscribe((result) => {
            switch (result.status) {
                case apiResponse.COMPLETED:
                    setRoadmapData(result.data);
                    break
                case apiResponse.ERROR:
                    console.error('error', result.data)
                    break
                default:
                    break
            }
        })

        const getSprint = sprintBloc.getSprint.subscribe((result) => {
            switch (result.status) {
                case apiResponse.COMPLETED:
                    setTasks(result.data.sprint.map(task => task.tasks).flat());
                    break
                case apiResponse.ERROR:
                    console.error('error', result.data)
                    break
                default:
                    break
            }
        })
        
        on('inviteMemberSuccess', () => {
            fetchMemberList();
            setInviteDialog(false);
        })

        on('refreshProject', () => {
            console.log('refresh')
            fetchProjectDetail();
        })
    
        return () => {
            getDetail.unsubscribe();
            getMember.unsubscribe();
            getRoadmap.unsubscribe();
            getSprint.unsubscribe();
        }
    }, [])

    useEffect(() => {

      const removeMember = projectBloc.removeMember.subscribe((result) => {
        switch (result.status) {
            case apiResponse.COMPLETED:
                console.log('berhasil remove member', result);
                emit('inviteMemberSuccess');
                showToast({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Delete Member success',
                    sticky: false
                });
                break
            case apiResponse.ERROR:
                console.error('error', result.data)
                showToast({
                    severity: 'error',
                    summary: 'Delete Member Failed',
                    detail: res.message,
                    sticky: false
                });
                break
            default:
                break
        }
      })

      const deleteProject = projectBloc.deleteProject.subscribe((result) => {
        switch (result.status) {
            case apiResponse.COMPLETED:
                console.log('berhasil delete project', result);
                
                router.replace(`/${myQuery.org_key}`);
                showToast({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Delete Project success',
                    sticky: false
                });
                break
            case apiResponse.ERROR:
                console.error('error', result.data)
                showToast({
                    severity: 'error',
                    summary: 'Delete Team Failed',
                    detail: res.message,
                    sticky: false
                });
                break
            default:
                break
        }
      })
    
      return () => {
        removeMember.unsubscribe();
        deleteProject.unsubscribe();
      }
    }, [projectBloc])
    
    
    useEffect(() => {
        on('closeRoadmapDialog', () => {
            setAddIssueDialog(false);
        })
    }, [])

    useEffect(() => {
        setOrgKeyLink(myQuery.org_key);
        setProjectKeyLink(myQuery.project_key);
    }, [])

    const maskStyles = {
        backgroundColor: 'rgb(0 0 0 / 50%)',
    };

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
        projectBloc.fetchDeleteProject(data);
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
        projectBloc.fetchRemoveMember(data);
    };

    const generatePdf = () => {
        setHideButton(true);
    }
    
    const rearrangeData = (data) => {
        return data.map((cellData) => {
            return {
                ['Task Name']: cellData.task_name,
                ['Task Level']: cellData.level + 1,
                ['Assigner']: cellData.task_handlers.filter(handler => handler.type === "assigner")[0].handler_name,
                ['Watcher']: cellData.task_handlers.filter(handler => handler.type === "reporter")[0].handler_name,
                ['Status']: statusSummary.find(status => status.status_key === cellData.status_key).status_name,
                ['Created Date']: moment(cellData.createdAt).format("DD-MM-YYYY"),
                ['Optimistic Finish day']: `${cellData.mostlikely_time} Days`,
                ['Mostlikely Finish day']: `${cellData.optimistic_time} Days`,
                ['Pessimistic Finish day']: `${cellData.pessimistic_time} Days`,
            };
        });
    }

    const exportExcel = () => {
        try {
            const data = rearrangeData(tasks);
            const headerLength = Object.keys(data[0] ?? {}).length;
            const numberField = [];
            const title = project_data.project_name + ' Task Report';
            
            let headerData =  [];
            Object.keys(data[0]).forEach((key, index) => {
                const newFormat = {
                    title: key,
                    align: (!numberField.includes(key)) ? 'center' : 'right',
                    wordwarp: true,
                    valign: 'middle',
                    columnWidth: (data.filter(item => item[key].length > key.length).length > 0) ? 'content' : 'title'
                }
                headerData.push(newFormat);
            })
            
            const customCells = [
                {
                    cell: 'A1',
                    value: title,
                    alignment: { vertical: 'middle', horizontal: 'center' },
                    mergeTo: `${numberToChar(headerLength)}1`
                },
                {
                    cell: 'A2',
                    value: `Export Date: ${moment().format("DD-MM-YYYY")}`,
                    alignment: { vertical: 'middle', horizontal: 'center' },
                    mergeTo: `${numberToChar(headerLength)}2`
                },
            ];

            generateExcel({customCells, data, excelTitle: title, startRow: 4, headerData});

        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        if (hideButton) {
            window.print()    
        }
        return setHideButton(false);
    }, [hideButton])

    if (project_data == null) {
        return <>loading...</>
    }
    


    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <div className={`${(hideButton) && 'hidden'}`}>
                        <Breadcrumb orgKey={myQuery.org_key} projectKey={myQuery.project_key} />
                    </div>

                    <div className='flex'>
                        <div className='col-7'>
                            <h5>{project_data.project_name} Project</h5>
                        </div>
                        <div className='col-5 text-right flex justify-end' style={{justifyContent: 'flex-end'}}>
                            <Button className={`p-button-sm ml-2 p-button-primary ${(hideButton) && 'hidden'}`} label='Edit Name' onClick={(e) => { editProjectName(e) }} aria-label="Filter" />

                            <OverlayPanel ref={editNameOp} showCloseIcon>
                                <EditProjectName project={project_data} />
                            </OverlayPanel>

                            <Button className={`p-button-sm ml-2 p-button-danger ${(hideButton) && 'hidden'}`} disabled={(userRole == 'superadmin') ? false : true} onClick={(e) => { confirmDelete(e) }} label='Delete Project' aria-label="Filter" />
                            <ConfirmPopup />
                        </div>

                    </div>

                    <div className="grid mb-3">
                        <div className='col-12 grid mt-2'>
                            <div className='col'>
                                <PieChart colors={statusSummary.map(data => data.status_color)} seriesData={statusSummary} />
                            </div>
                            <div className='col grid h-fit'>
                                <div className='col-12 text-right'>
                                    <Button onClick={() => exportExcel()} className={`mr-2 ${(hideButton) && 'hidden'}`} size='small' severity='success' label={
                                        <Fragment>
                                            <i className='pi pi-download'></i> <span>Export Detail Task</span>
                                        </Fragment>
                                    } />
                                    <Button className={`${(hideButton) && 'hidden'}`} onClick={() => generatePdf()} size='small' severity='secondary' label={
                                        <Fragment>
                                            <i className='pi pi-file-pdf'></i> <span>Export Project Info</span>
                                        </Fragment>
                                    } />
                                </div>
                                {(statusSummary.map((statusData, idx) => (
                                    <div className="col-12 md:col-6 lg:col-6" key={idx}>
                                        <div className="shadow-2 p-3 border-round" style={{border: `solid 2px ${statusData.status_color}`, backgroundColor: statusData.status_color }}>
                                            <div className="flex justify-content-between">
                                                <div>
                                                    <span className="block text-500 font-medium mb-3">Task</span>
                                                    <div className="text-900 font-medium text-xl">{statusData.status_name}</div>
                                                </div>
                                                <div className={`flex align-items-center justify-content-center bg-gray-100 border-round`} style={{ width: '2.5rem', height: '2.5rem', border: `solid 2px #808080`, backgroundColor: statusData.status_color  }}>
                                                <div className="text-900 font-medium text-2xl">{statusData.task_count}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )))}
                            </div>
                        </div>
                        <div className='col'>
                            <Ganttchart seriesData={roadmapData} title={`${project_data.project_name} Roadmap`} />
                        </div>
                        <div className='col'>
                            <div className='flex'>
                                <div className='lg:col-9'>
                                    <h5>Project Handler</h5>
                                </div>
                                <div className='lg:col-3 text-right'>
                                    {(!hideButton) && <MemberList />}
                                    
                                    {/* <Button icon="pi pi-user-plus" onClick={() => { setInviteDialog(true) }} className={`p-button-rounded ml-2 p-button-secondary ${(hideButton) && 'hidden'}`} aria-label="Filter" /> */}

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
                                                <Button icon="pi pi-trash" onClick={(e) => { confirmRemoveMember(e, member) }} tooltip="remove from project" tooltipOptions={{ position: 'bottom' }} style={{ margin: "-0.6em 0", paddingBottom: '0.6em' }} className={`p-button-rounded p-button-danger p-button-outlined ${(hideButton) && 'hidden'}`} />
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
