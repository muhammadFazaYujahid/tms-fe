import React, { useState, useEffect, useContext, useRef } from 'react';
import { DragDropContext, Droppable, Draggable, resetServerContext } from 'react-beautiful-dnd';
import getConfig from 'next/config';
import Head from 'next/head';
import Cookies from 'js-cookie';
import Router, { useRouter } from 'next/router';

import InviteProjectDialog from '@components/dialog-content/InviteProjectDialog';
import TaskDialog from '@components/TaskDialog';
import Breadcrumb from '@components/BreadCrumb';

import { LayoutContext } from '@layout/context/layoutcontext';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Sidebar } from 'primereact/sidebar';
import { Dropdown } from 'primereact/dropdown';
import { SplitButton } from 'primereact/splitbutton';
import CreateTask from '@components/dialog-content/CreateTask';
import { emit, on } from '@utils/EventEmitter';
import { Toast } from 'primereact/toast';
import EditSprint from '@components/dialog-content/editSprint';
import socket from '@utils/Socket';
import { debounce, result } from 'lodash';
import { requireAuth } from '../../../../../middlewares/requireAuth';
import { Tooltip } from 'primereact/tooltip';
import SprintBloc from '../../../../../services/Blocs/SprintBloc';
import apiResponse from '../../../../../services/apiResponse';
import MemberList from '../../components/memberList';
import TaskBloc from '../../../../../services/Blocs/TaskBloc';


const Backlog = ({ myQuery }) => {

    const { contentDialog, setContentDialog, setOrgKeyLink, setProjectKeyLink, setShowSidebar } = useContext(LayoutContext);

    const router = useRouter();

    const [category, setCategory] = useState(null);
    const [inviteDialog, setInviteDialog] = useState(false);
    const [visibleFullScreen, setVisibleFullScreen] = useState(false);
    const [sprints, setSprints] = useState([]);
    const [dialogContent, setDialogContent] = useState('');
    const [taskStatus, setTaskStatus] = useState([])
    const [dialogHeader, setDialogHeader] = useState('');
    
    const sprintBloc = new SprintBloc;
    const taskBloc = new TaskBloc;

    useEffect(() => {
        console.log('ke render brp kali nih?')
        const createSPrint = sprintBloc.createSPrint.subscribe((result) => {
            switch (result.status) {
                case apiResponse.COMPLETED:
                    emit('refreshBacklog');
                    break
                case apiResponse.ERROR:
                    console.error('error', result.data)
                    break
                default:
                    break
            }
        })

        const startSPrint = sprintBloc.startSprint.subscribe((result) => {
            switch (result.status) {
                case apiResponse.COMPLETED:
                    Router.replace('/' + sessionStorage.getItem('org_key') + "/project/" + myQuery.project_key + '/board')
                    break
                case apiResponse.ERROR:
                    console.error('error', result.data)
                    break
                default:
                    break
            }
        })
        const deleteSPrint = sprintBloc.deleteSprint.subscribe((result) => {
            let summaryNotif = '';
            let detailNotif = '';
            let severity = '';

            switch (result.status) {
                case apiResponse.COMPLETED:
                    severity = 'success';
                    summaryNotif = 'Sprint Deleted';
                    detailNotif = 'Sprint Deleted Successfully';
                    break
                case apiResponse.ERROR:
                    severity = 'error';
                    summaryNotif = 'delete sprint failed';
                    detailNotif = 'error: ' + res.error;
                    console.error('error', result.data)
                    break
                default:
                    break
            }

            clear(false);
            showNotif(severity, summaryNotif, detailNotif);
            emit('refreshBacklog');
        })

      return () => {
        createSPrint.unsubscribe();
        startSPrint.unsubscribe();
        deleteSPrint.unsubscribe();
      }
    }, [sprintBloc])

    useEffect(() => {
      const changeSprint = taskBloc.changeSprint.subscribe((result) => {
        switch (result.status) {
            case apiResponse.COMPLETED:
                emit('refreshBacklog');
                break
            case apiResponse.ERROR:
                console.error('error', result.data)
                break
            default:
                break
        }
      })

      const changeStatus = taskBloc.changeStatus.subscribe((result) => {
        switch (result.status) {
            case apiResponse.COMPLETED:
                console.log('berhasil change status', result)
                emit('refreshBacklog');
        
                const notifData = { room: myQuery.project_key };
                showNotif('success', 'Success', 'Change Task Status Success');
                socket.emit('sendNotif', notifData);
                break
            case apiResponse.ERROR:
                console.error('error', result.data)
                break
            default:
                break
        }
      })
    
      return () => {
        changeSprint.unsubscribe();
        changeStatus.unsubscribe();
      }
    }, [taskBloc])
    

    const getSprintsData = () => {
        sprintBloc.fetchGetSprint({project_key: myQuery.project_key})
    }

    const getTaskStatus = () => {
        taskBloc.fetchGetTaskStatus(myQuery.project_key);
    }
    
    useEffect(() => {
        getSprintsData();
        getTaskStatus();
        const getSprint = sprintBloc.getSprint.subscribe((result) => {
            switch (result.status) {
                case apiResponse.COMPLETED:
                    setSprints(result.data.sprint);
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
                    setTaskStatus(result.data.data);
                    break
                case apiResponse.ERROR:
                    console.error('error', result.data)
                    showToast('error', 'Failed', result.data)
                    break
                default:
                    break
            }
            // console.log('berhasil task status', result);
        })
    
      return () => {
        getSprint.unsubscribe();
        getStatus.unsubscribe();
      }
    }, [])

    useEffect(() => {
        on('refreshBacklog', () => {
            getSprintsData();
        })
    
    }, [])

    useEffect(() => {
        // if (router.query.project_key != undefined) {
        //     // Cookies.set('project_key', router.query.project_key, { expires: 1 });
        // }
        sessionStorage.setItem('project_key', myQuery.project_key);
        console.log('apakah', myQuery);
        setShowSidebar(true);
        return () => {
            setShowSidebar(false);
        }
    }, []);

    useEffect(() => {
        setOrgKeyLink(myQuery.org_key);
        setProjectKeyLink(myQuery.project_key);

        return () => {

        }
    }, [])

    const createSprint = () => {
        sprintBloc.fetchCreateSPrint(myQuery.project_key);
    }


    const maskStyles = {
        backgroundColor: 'rgb(0 0 0 / 50%)',
    };

    const toast = useRef(null);
    const notif = useRef(null);

    const show = (showContent, severity) => {
        toast.current.show({
            severity: severity,
            sticky: true,
            className: 'border-none',
            content: showContent
        });
    };
    const clear = (submit) => {
        toast.current.clear();
        submit && show();
    };

    const showNotif = (severity, summaryNotif, detailNotif) => {
        notif.current.show({ severity: severity, summary: summaryNotif, detail: detailNotif });
    }
    const deleteSprint = (sprint, backlog_key) => {
        const data = {
            sprint_key: sprint.sprint_key,
            backlog_key: backlog_key,
            activity: {
                action: 'Deleted ' + sprint.sprint_name + ' Sprint',
                object_one: '',
                object_two: '',
                type: 'project',
                related_code: myQuery.project_key,
                url: window.location.href,
                additional_text: ''
            }
        }
        sprintBloc.fetchDeleteSprint(data)
    }
    const sprintSetting = (sprint, backlog_key) => {
        const items = [
            {
                label: 'Update',
                icon: 'pi pi-refresh',
                command: () => {
                    sprint.start_date = editDate(sprint.start_date);
                    sprint.end_date = editDate(sprint.end_date);
                    setContentDialog(true); setDialogContent(<EditSprint sprint={sprint} />); setDialogHeader('Edit Sprint');
                }
            },
            {
                label: <span className="text-red-500">Delete</span>,
                icon: <span className="p-menuitem-icon pi pi-times text-red-500"></span>,
                command: () => {
                    const severity = 'warn'
                    const showContent = (
                        <div className="flex flex-column align-items-center" style={{ flex: '1' }}>
                            <div className="text-center">
                                <i className="pi pi-question-circle" style={{ fontSize: '3rem' }}></i>
                                <div className="font-bold text-xl mt-3">Delete Sprint?</div>
                                <p className='mb-3'>All Task will deleted and can't be restored</p>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={(e) => clear(false)} type="button" label="Cancel" className="p-button-info w-6rem" />
                                <Button onClick={(e) => deleteSprint(sprint, backlog_key)} type="button" label="Delete" className="p-button-danger w-6rem" />
                            </div>
                        </div>
                    )
                    show(showContent, severity)
                }
            }
        ];

        return items
    }

    const onDragEnd = result => {
        const { destination, source, draggableId, type } = result;
        if (!destination) {
            return;
        }

        if (type == 'column') {
            // const newSprintOrder = sprints;
            // newSprintOrder.splice(source.index + 1, 1);
            // newSprintOrder.splice(destination.index + 1, 0, sprints[source.index]);

            // setSprints(newSprintOrder);
            // return;

            const sourceSprintIndex = sprints.findIndex(sprint => sprint.sort_index === parseInt(source.index));
            const destinationSprintIndex = sprints.findIndex(sprint => sprint.sort_index === parseInt(destination.index));

            const updatedSprints = Array.from(sprints);
            const sourceSortColumn = updatedSprints[sourceSprintIndex].sort_index;
            updatedSprints.splice(sourceSprintIndex, 1, { ...updatedSprints[sourceSprintIndex], sort_index: updatedSprints[destinationSprintIndex].sort_index });
            updatedSprints.splice(destinationSprintIndex, 1, { ...updatedSprints[destinationSprintIndex], sort_index: sourceSortColumn })

            const tempArr = updatedSprints[destinationSprintIndex];
            updatedSprints[destinationSprintIndex] = updatedSprints[sourceSprintIndex];
            updatedSprints[sourceSprintIndex] = tempArr;
            setSprints(updatedSprints);
            return;
        }

        const data = { sprint_id: destination.droppableId, task_id: draggableId }
        taskBloc.fetchChangeSprint(data);

        if (source.droppableId === destination.droppableId) {
            // If the item was moved within the same sprint
            const sprintIndex = sprints.findIndex(sprint => sprint.id === parseInt(source.droppableId));
            const updatedSprints = Array.from(sprints);
            const [removed] = updatedSprints[sprintIndex].tasks.splice(source.index, 1);
            updatedSprints[sprintIndex].tasks.splice(destination.index, 0, removed);
            setSprints(updatedSprints);
        } else {
            // If the item was moved across sprints
            const sourceSprintIndex = sprints.findIndex(sprint => sprint.id === parseInt(source.droppableId));
            const destinationSprintIndex = sprints.findIndex(sprint => sprint.id === parseInt(destination.droppableId));

            const updatedSprints = Array.from(sprints);
            const [removed] = updatedSprints[sourceSprintIndex].tasks.splice(source.index, 1);
            updatedSprints[destinationSprintIndex].tasks.splice(destination.index, 0, removed);
            setSprints(updatedSprints);
        }

    };

    const editDate = (date) => {
        const dateObj = new Date(date);
        var formattedDate = dateObj.toLocaleDateString("en-US", { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/');
        return formattedDate;
    }
    const sprintButton = (sprint, backlog_key) => {
        if (sprint.type == 'backlog') {
            return (
                <Button label="Create Sprint" onClick={createSprint} style={{ padding: "0.5em 1em 0.5em 1em" }} className="p-button-outlined mr-2 btn btn-sm" />
            )
        }
        if (sprint.status == 'not_start') {
            return (
                <SplitButton className='p-button-outlined p-0 p-button-sm' onClick={() => startSprint(sprint.sprint_key)} size='small' label="Start Sprint" model={sprintSetting(sprint, backlog_key)} style={{ borderRadius: "0px" }} />
            )
        } else if (sprint.status == 'process') {
            return (
                <SplitButton className='p-button-outlined p-0 p-button-sm' size='small' label="Sprint is Running" model={sprintSetting(sprint, backlog_key)} style={{ borderRadius: "0px" }} />
            )
        } else {
            <SplitButton disabled className='p-button-outlined p-0 p-button-sm' size='small' label="Sprint Completed" model={sprintSetting(sprint, backlog_key)} style={{ borderRadius: "0px" }} />

        }
    }

    const changeStatus = (data, taskData) => {
        const formData = { status_key: data.status_key, task_key: taskData.task_key, task_name: taskData.task_name }
        taskBloc.fetchChangeStatus(formData);
    }

    const startSprint = (sprint_key) => {
        // alert(sprint_key);

        const severity = 'info';
        const showContent = (
            <div className="flex flex-column align-items-center" style={{ flex: '1' }}>
                <div className="text-center">
                    <i className="pi pi-question-circle" style={{ fontSize: '3rem' }}></i>
                    <div className="font-bold text-xl my-3">Start Sprint?</div>
                </div>
                <div className="flex gap-2">
                    <Button onClick={(e) => clear(false)} type="button" label="Cancel" className="p-button-warning p-button-sm w-6rem" />
                    <Button onClick={(e) => {
                        sprintBloc.fetchStartSprint({sprint_key});
                        // const sprintService = new SprintService();
                        // sprintService.startSprint(sprint_key)
                        //     .then((res) => {
                        //         // emit('refreshBacklog');
                        //         if (res.success) {
                        //             Router.replace('/' + sessionStorage.getItem('org_key') + "/project/" + myQuery.project_key + '/board')
                        //         }
                        //     })
                    }} type="button" label="Start" className="p-button-success p-button-sm w-6rem" />
                </div>
            </div>
        )
        show(showContent, severity);

    }

    const [detailTask, setDetailTask] = useState([])
    // const handleOpenSidebar = (task_key) => {
    //     setVisibleFullScreen(true);
    //     // Set the task query parameter in the URL when the sidebar is opened
    //     router.push({
    //         pathname: router.pathname,
    //         query: { ...router.query, task: task_key }, // Replace 'task-1' with the actual task value
    //     });
    // };
    useEffect(() => {
        if (myQuery.task == '' || myQuery.task == undefined) {
        } else {
            const data = { task: { task_key: myQuery.task } }
            setSetselectedTaskKey(myQuery.task);
            setVisibleFullScreen(true)
            // showDetailTask({ task: { task_key: myQuery.task } })
        }
    }, [])

    const handleCloseSidebar = () => {
        setVisibleFullScreen(false);
        // Remove the task query parameter from the URL when the sidebar is closed
        router.push({
            pathname: router.pathname,
            query: { ...router.query, task: undefined },
        });


    };

    const [setselectedTaskKey, setSetselectedTaskKey] = useState(null)

    const showDetailTask = (task) => {
        router.push({
            pathname: router.pathname,
            query: { ...router.query, task: task.task_key }, // Replace 'task-1' with the actual task value
        })
        setSetselectedTaskKey(task.task_key);
        setVisibleFullScreen(true)
        setDetailTask(task)
    }

    useEffect(() => {
        on('taskDeleted', () => {
            handleCloseSidebar();
            emit('refreshBacklog');
        })
    }, [])


    const handleTaskUpdate = (updatedTaskData) => {
        setDetailTask(updatedTaskData);
    };

    const filterSprint = debounce((event) => {
        const eventValue = event.target.value;
        const filteredSprints = sprints.map((sprint) => ({
            ...sprint,
            tasks: sprint.tasks.filter((task) =>
                task.task_name.toLowerCase().includes(eventValue.toLowerCase())
            ),
        })).filter((sprint) => {
            const tasks = sprint.tasks || [];
            return sprint.sprint_name.toLowerCase().includes(eventValue.toLowerCase()) || tasks.length > 0;
        });
        setSprints(filteredSprints);
        if (eventValue == '') {
            emit('refreshBacklog')
        }
    }, 1000)

    const getformatedDate = (original_date) => {
        const objDate = new Date(original_date);

        const formattedDate = new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        }).format(objDate);
        return formattedDate;
    }

    return (
        <>
            <Head>
                <style>
                    {`
                    .p-panel-content {
                        bacgkround-color: #BADA55;
                    }
                    .p-dialog-mask {
                        bacgkround-color: #BADA55 !important;
                    }
                `}
                </style>
            </Head>

            {/* <BlockUI blocked={blocked} fullScreen style={{ zIndex: "-100" }} /> */}

            <div className="grid">
                <div className="col-12">

                    <Toast ref={toast} position="bottom-center" />
                    <Toast ref={notif} />
                    <div className="card">
                        <Breadcrumb orgKey={myQuery.org_key} projectKey={myQuery.project_key} section="Backlog" />
                        <h5>Backlog</h5>

                        <div className="grid mb-3">
                            <div className='col lg:col-3'>
                                <span className="p-input-icon-right">
                                    <InputText type="text" onChange={filterSprint} placeholder="Search Task" className='p-inputtext-sm' />
                                    <i className="pi pi-search" />
                                </span>

                            </div>
                            <div className='col'>
                                <MemberList />
                                {/* <AvatarGroup className="mb-3">
                                    {memberList?.slice(0, 4).map((member, index) => (
                                        <Avatar image={memberPhotos[index]} size="large" shape="circle" key={index}></Avatar>
                                    ))}
                                    {(memberList?.length - 4 >= 1) ? <Avatar label={memberList.length - 4} shape="circle" size="large" className='bg-gray-800' style={{ color: '#ffffff' }}></Avatar> : <></>}

                                    <Button icon="pi pi-user-plus" onClick={() => { setInviteDialog(true) }} className='p-button-rounded ml-2 p-button-secondary' aria-label="Filter" />
                                </AvatarGroup> */}

                                <Dialog header="Invite People to Project" maskStyle={maskStyles} visible={inviteDialog} className='p-dialog' style={{ width: '30vw', backgroundColor: "#fff" }} modal onHide={() => setInviteDialog(false)}>
                                    <InviteProjectDialog />
                                </Dialog>
                            </div>
                        </div>

                        {/* ---------------------------------------- KanbanBoard ---------------------------------------- */}
                        <DragDropContext onDragEnd={onDragEnd}>
                            {/* <Droppable droppableId="droppable" direction='vertical' type='column'>
                                {provided => ( */}
                            <div className='grid'
                            // {...provided.droppableProps}
                            // ref={provided.innerRef}
                            >

                                {sprints.filter(data => data.status != 'completed').map((sprint, index) => (
                                    <div className='col-12' key={sprint.id}>
                                        {/* <Draggable /*isDragDisabled={(sprint.type === 'backlog') ? true : false}} draggableId={sprint.id.toString()} index={sprint.sort_index}> */}
                                        {/* {provided => ( */}
                                        <div className={`card mb-0 ${(sprint.type !== 'backlog') ? 'bg-gray-100' : ''} `}
                                        // {...provided.draggableProps}
                                        // {...provided.dragHandleProps}
                                        // ref={provided.innerRef}
                                        >
                                            <div className="flex justify-content-between mb-3">
                                                <Button icon="pi pi-chevron-up" style={{ marginTop: "-1em", padding: "0" }} className="p-button-text" />
                                                <div className="font-medium text-xl text-900">

                                                    <span className='ml-2 text-lg'>{sprint.sprint_key} - {sprint.sprint_name}</span>
                                                    {(sprint.status !== 'backlog') ? <>
                                                        {(sprint.start_date == null || sprint.start_date == '01/01/1970') ? <>
                                                        </> : <>
                                                            <span className='ml-5 text-lg'>({getformatedDate(sprint.start_date)} - {getformatedDate(sprint.end_date)})</span>
                                                        </>}
                                                    </> : <></>}
                                                    <span className='ml-5 text-lg'>({sprint.tasks.length} Task)</span>
                                                </div>

                                                <div style={{ float: "right" }} className='flex-grow-1 flex align-items-end justify-content-end font-bold text-white m-2 px-5'>

                                                </div>
                                                <div className="mt-3 lg:mt-0">
                                                    {sprintButton(sprint, sprints.filter(data => data.status === 'backlog')[0]?.sprint_key)}
                                                </div>
                                            </div>

                                            <Droppable droppableId={sprint.id.toString()} type='task'>
                                                {provided => (
                                                    <div
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                    >
                                                        {sprint.tasks.map((task, index) => (
                                                            <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                                                {provided => (

                                                                    <div className='task-card p-3 my-2'
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        ref={provided.innerRef}
                                                                        onClick={() => { showDetailTask(task) }}
                                                                    >
                                                                        <div className="surface-0 bg-transparent border">
                                                                            <div className="flex align-items-center flex-column lg:justify-content-between lg:flex-row">
                                                                                <div>
                                                                                    <div className="font-medium text-xl text-900">
                                                                                        <span className='ml-2 text-gray-500 text-lg lg:mr-2'>{task.task_key}</span>
                                                                                        <span className='ml-2  text-lg'>{task.task_name}</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div style={{display: "flex", alignItems: "center"}} className='font-bold text-white m-2 px-5' onClick={(e) => e.stopPropagation()}>
                                                                                    {(task.level === 0) ?
                                                                                        <Button icon="pi pi-minus" tooltip="Urgency Level: Low" tooltipOptions={{ position: 'bottom' }} style={{ margin: "-0.6em 0", paddingBottom: '0.6em' }} className="p-button-rounded p-button-secondary p-button-outlined mr-4 btn btn-sm" />
                                                                                        : (task.level === 1) ?
                                                                                            <Button icon="pi pi-pause" tooltip="Urgency Level: Medium" tooltipOptions={{ position: 'bottom' }} style={{ margin: "-0.6em 0", rotate: "90deg", paddingBottom: '0.6em' }} className="p-button-rounded p-button-warning p-button-outlined mr-4 btn btn-sm" />
                                                                                            :
                                                                                            <Button icon="pi pi-bars" tooltip="Urgency Level: High" tooltipOptions={{ position: 'bottom' }} style={{ margin: "-0.6em 0", paddingBottom: '0.6em' }} className="p-button-rounded p-button-danger p-button-outlined mr-4 btn btn-sm" />
                                                                                    }
                                                                                    <Dropdown
                                                                                        style={{ margin: "-0.6em 0" }} size="small"
                                                                                        value={category}
                                                                                        disabled={(task.status_key.split('-')[0] === 'CP' && task.verify_status === "verified")}
                                                                                        onChange={(e) => changeStatus(e.value, task)}
                                                                                        placeholder={taskStatus.filter((status) => status.status_key === task.status_key)[0].name}
                                                                                        options={taskStatus.filter((data) => data.status_key !== task.status_key)}
                                                                                        optionLabel="name"
                                                                                        className="p-inputtext-sm" />

                                                                                        {(task.verify_status === "verified") && 
                                                                                            <div className='ml-2'>
                                                                                                    <Tooltip target=".verified">Task Confirmed</Tooltip>
                                                                                                    <div className={`verified flex align-items-center justify-content-center bg-green-100 border-round`} style={{ width: '2.5rem', height: '2.5rem' }}>
                                                                                                        <i className={`pi pi-verified text-green-500`}></i>
                                                                                                    </div>
                                                                                            </div>
                                                                                        }
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                )}
                                                            </Draggable>

                                                        ))}
                                                        {provided.placeholder}
                                                        <Button
                                                            label="Add Task"
                                                            icon="pi pi-plus"
                                                            className='px-3 py-2 mt-3 p-button-text p-button-secondary'
                                                            onClick={() => {
                                                                setContentDialog(true);
                                                                setDialogHeader("Add Task");
                                                                setDialogContent(<CreateTask sprintKey={sprint.sprint_key} parentKey={null} />)
                                                            }}
                                                        />

                                                    </div>
                                                )}
                                            </Droppable>
                                        </div>
                                        {/* )}
                                        </Draggable> */}
                                    </div>
                                ))}
                                {/* {provided.placeholder} */}


                            </div>

                            {/* )}
                            </Droppable> */}

                        </DragDropContext>
                        {/* ---------------------------------------- /KanbanBoard ---------------------------------------- */}
                        {/* <KanbanBoard sprints={sprints} /> */}


                        <Dialog header={<div className='grid'>
                            <div className='col'>
                                <span>{dialogHeader}</span>

                            </div>
                            {/* <div className='col-1 mr-6'>
                                <Button icon="pi pi-window-maximize" className="p-button-secondary p-button-text p-0 btn btn-sm" onClick={() => { setVisibleFullScreen(true) }} />
                            </div> */}

                        </div>} maskStyle={maskStyles} modal={true} visible={contentDialog} className='p-dialog' style={{ width: '30vw', backgroundColor: "#fff" }} onHide={() => setContentDialog(false)}>
                            {dialogContent}
                        </Dialog>

                        <Sidebar visible={visibleFullScreen} onHide={() => handleCloseSidebar()} baseZIndex={9000} fullScreen>
                            <TaskDialog taskKey={setselectedTaskKey} />
                        </Sidebar>


                    </div>
                </div >
            </div >
        </>
    );
};


export async function getServerSideProps(context) {
    const { query } = context;
    // console.log('isi query', query);

    resetServerContext();
    return {
        props: {
            myQuery: query
        },
    };
}


export default  requireAuth(Backlog);
