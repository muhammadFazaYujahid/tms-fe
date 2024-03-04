import React, { useState, useEffect, useContext, useRef } from 'react';
import Breadcrumb from '../../../../components/BreadCrumb';
import { InputText } from 'primereact/inputtext';
import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { Dialog } from 'primereact/dialog';

import KanbanBoard from '../../../../components/board/KanbanBoard';


import getConfig from 'next/config';
import InviteProjectDialog from '../../../../components/dialog-content/InviteProjectDialog';
import { TaskStatusService } from '../../../../services/TaskStatusService';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { DragDropContext, Draggable, Droppable, resetServerContext } from 'react-beautiful-dnd';
import { Sidebar } from 'primereact/sidebar';
import TaskDialog from '../../../../components/TaskDialog';
import { OverlayPanel } from 'primereact/overlaypanel';
import CreateStatus from '../../../../components/board/CreateStatus';
import { useRouter } from 'next/router';
import { emit, on } from '../../../../utils/EventEmitter';
import EditName from '../../../../components/board/EditName';
import DeleteStatus from '../../../../components/board/DeleteStatus';
import CompleteSprint from '../../../../components/board/CompleteSprint';
import { ProjectService } from '../../../../services/ProjectServices';
import { debounce } from 'lodash';
import { SprintService } from '../../../../services/SprintServices';



const Board = ({ myQuery }) => {
    const router = useRouter();
    const { contentDialog, setContentDialog, projectKeyLink, setOrgKeyLink, setProjectKeyLink } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const [tasks, setTasks] = useState([])
    const [inviteDialog, setInviteDialog] = useState(false);
    const [columns, setColumns] = useState(tasks);
    const [memberList, setMemberList] = useState([]);
    const [sprints, setSprints] = useState([]);

    useEffect(() => {
        // taskServices.getTask().then((data) => setTasks(data));
        const taskStatusService = new TaskStatusService();
        const projectService = new ProjectService();
        const sprintService = new SprintService();
        taskStatusService.getStatus(myQuery.project_key).then((res) => { setColumns(res); });
        projectService.getUserPhoto(sessionStorage.getItem('project_key')).then((data) => setMemberList(data));

        sprintService.getSprint(myQuery.project_key).then((data) => {
            const activeSprint = data.sprint.filter(data => data.status == 'process')
            setSprints(activeSprint);
        });
        on('refreshBoard', () => {
            taskStatusService.getStatus(myQuery.project_key).then((res) => { setColumns(res) });

        })
        on('inviteMemberSuccess', () => {
            projectService.getUserPhoto(sessionStorage.getItem('project_key')).then((data) => setMemberList(data));
            setInviteDialog(false);
        })
    }, []);

    const [projectKey, setProjectKey] = useState(myQuery.project_key);

    useEffect(() => {
        setOrgKeyLink(myQuery.org_key);
        setProjectKeyLink(myQuery.project_key);
    }, [])


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



    const [selectedCities, setSelectedCities] = useState(null);
    const cities = [
        { name: 'Sprint 1', code: 'NY' },
        { name: 'Sprint 2', code: 'RM' },
        { name: 'Sprint 3', code: 'LDN' }
    ];

    const maskStyles = {
        backgroundColor: 'rgb(0 0 0 / 50%)',
    };

    const onDragEnd = result => {
        const { destination, source, draggableId, type } = result;
        if (!destination) {
            return;
        }

        if (type == 'column') {

            const sourcecolumnIndex = columns.findIndex(column => column.sort_index === parseInt(source.index));
            const destinationcolumnIndex = columns.findIndex(column => column.sort_index === parseInt(destination.index));

            const updatedColumns = Array.from(columns);
            const sourceSortColumn = updatedColumns[sourcecolumnIndex].sort_index;
            updatedColumns.splice(sourcecolumnIndex, 1, { ...updatedColumns[sourcecolumnIndex], sort_index: updatedColumns[destinationcolumnIndex].sort_index });
            updatedColumns.splice(destinationcolumnIndex, 1, { ...updatedColumns[destinationcolumnIndex], sort_index: sourceSortColumn })

            const tempArr = updatedColumns[destinationcolumnIndex];
            updatedColumns[destinationcolumnIndex] = updatedColumns[sourcecolumnIndex];
            updatedColumns[sourcecolumnIndex] = tempArr;
            setColumns(updatedColumns);
            return;
        }

        const data = { status_id: destination.droppableId, task_id: draggableId }
        const taskStatusService = new TaskStatusService();
        taskStatusService.changeStatus(data);

        if (source.droppableId === destination.droppableId) {
            // If the item was moved within the same sprint
            const columnIndex = columns.findIndex(column => column.id === parseInt(source.droppableId));
            const updatedColumns = Array.from(columns);
            const [removed] = updatedColumns[columnIndex].tasks.splice(source.index, 1);
            updatedColumns[columnIndex].tasks.splice(destination.index, 0, removed);
            setColumns(updatedColumns);
        } else {
            // If the item was moved across columns
            const sourcecolumnIndex = columns.findIndex(column => column.id === parseInt(source.droppableId));
            const destinationcolumnIndex = columns.findIndex(column => column.id === parseInt(destination.droppableId));

            const updatedColumns = Array.from(columns);
            const [removed] = updatedColumns[sourcecolumnIndex].tasks.splice(source.index, 1);
            updatedColumns[destinationcolumnIndex].tasks.splice(destination.index, 0, removed);
            setColumns(updatedColumns);


        }

    };


    const [visibleFullScreen, setVisibleFullScreen] = useState(false);
    const [selectedTask, setSelectedTask] = useState({})


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
    }

    const addStatusOp = useRef(null);
    const actionOp = useRef(null);
    const editStatusNameOp = useRef(null);

    const toggleAddStatus = (event) => {
        addStatusOp.current.toggle(event);
    };
    const [selectedStatusData, setSelectedStatusData] = useState('');

    const toggleAction = (event, columnData) => {
        actionOp.current.toggle(event);
        setSelectedStatusData(columnData);
    };
    const toggleEditStatusName = (event) => {
        editStatusNameOp.current.toggle(event);
    };

    const [statusDialog, setStatusDialog] = useState(false)
    const [dialogHeader, setDialogHeader] = useState('');
    const [dialogContent, setDialogContent] = useState('');


    useEffect(() => {
        on('closeStatusDialog', () => {
            setStatusDialog(false)
        })
    }, [])


    const filterSprint = debounce((event) => {
        const eventValue = event.target.value;
        // const filteredTasks = columns.reduce((filtered, column) => {
        //     const filteredColumnTasks = column.tasks.filter((task) =>
        //         task.task_name.includes(eventValue)
        //     );
        //     return [...filtered, ...filteredColumnTasks];
        // }, []);
        const originalColumns = columns;
        const filteredColumns = [];
        const filterColumns = originalColumns.map((column) => {
            column.tasks = column.tasks.filter((task) => task.task_name.toLowerCase().includes(eventValue.toLowerCase()));
            column.taskIds = column.tasks.map(task => task.id)
            filteredColumns.push(column)
        })
        setColumns(filteredColumns);
        if (eventValue == '') {
            emit('refreshBoard')
        }
    }, 1000)

    const changeSprintCategory = (event) => {
        setSelectedCities(event);
        const mappedSprintKey = event.map(sprint => sprint.sprint_key);
        const originalColumns = columns;
        const filteredColumns = [];
        const filterColumns = originalColumns.map((column) => {
            column.tasks = column.tasks.filter((task) => mappedSprintKey.includes(task.sprint_key));
            column.taskIds = column.tasks.map(task => task.id)
            filteredColumns.push(column)
        })
        setColumns(filteredColumns)
        if (mappedSprintKey.length == 0 || mappedSprintKey.length == sprints.length) {
            emit('refreshBoard')
        }
    }

    return (
        <div className="grid">
            <div className="col-12">

                <div className="card border-none">
                    <Breadcrumb orgKey={myQuery.org_key} projectKey={myQuery.project_key} section="Board" />
                    <div className='grid mt-4'>
                        <div className='col'>

                            <h5>TS Board</h5>
                        </div>
                        <div className='col-3 lg:col-2 flex'>

                            <Button icon="pi pi-plus" tooltip='add column' onClick={toggleAddStatus} className='py-2 p-button-secondary p-button-sm' />

                            <OverlayPanel ref={addStatusOp} showCloseIcon>
                                <CreateStatus projectKey={projectKey} />
                            </OverlayPanel>
                            <Button label='Complete Sprint'
                                onClick={() => {
                                    setStatusDialog(true);
                                    setDialogHeader("Complete Sprint");
                                    setDialogContent(<CompleteSprint projectKey={projectKeyLink} />)
                                }} className='py-2 ml-1 p-button-secondary p-button-sm' style={{ float: "right" }
                                } />
                        </div>
                    </div>


                    <div className="grid my-3">
                        <div className='col lg:col-3'>
                            <span className="p-input-icon-right">
                                <InputText type="text" onChange={filterSprint} placeholder="Search" className='p-inputtext-sm' />
                                <i className="pi pi-search" />
                            </span>

                        </div>
                        <div className='col lg:col-2'>
                            <AvatarGroup className="mb-3" style={{ marginTop: "-0.4em" }}>
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
                            <MultiSelect value={selectedCities} onChange={(e) => changeSprintCategory(e.value)} options={sprints} optionLabel="sprint_name"
                                filter placeholder="Sprint" maxSelectedLabels={3} className="p-0 border-none" style={{ marginTop: "-0.5em" }} display='chip' />

                        </div>



                    </div>

                    <DragDropContext onDragEnd={onDragEnd}>
                        {/* <Droppable droppableId="droppable" direction='horizontal' type='column'> */}
                        {/* {provided => ( */}
                        <div className='grid'
                        // {...provided.droppableProps}
                        // ref={provided.innerRef}
                        >
                            {columns.sort((a, b) => a.sort_index - b.sort_index).map((column, index) => (
                                <div className='col-4' key={column.id}>
                                    {/* <Draggable key={column.sort_index} draggableId={column.sort_index.toString()} index={index + 1}> */}
                                    {/* {provided => ( */}

                                    <div className="card mb-0 bg-gray-100"
                                    // {...provided.draggableProps}
                                    // {...provided.dragHandleProps}
                                    // ref={provided.innerRef}
                                    >
                                        <div className="flex justify-content-between mb-3">
                                            <div>
                                                <h5 className="font-medium mb-3">{column.name}</h5>
                                            </div>
                                            <div>
                                                <Button icon="pi pi-ellipsis-v ml-5" onClick={(e) => toggleAction(e, column)} className='py-2 p-button-secondary p-button-text p-button-sm' />

                                                <OverlayPanel className='p-0' ref={actionOp}>
                                                    <div className='grid w-10rem'>
                                                        <div className='col-12'>
                                                            <Button label='Edit Name' onClick={toggleEditStatusName} className='p-button-text p-button-secondary w-full px-0' />

                                                        </div>
                                                        <div className='col-12'>
                                                            <Button label='Delete'
                                                                onClick={() => {
                                                                    setStatusDialog(true);
                                                                    setDialogHeader("Delete Task Status");
                                                                    setDialogContent(<DeleteStatus statusData={selectedStatusData} />)
                                                                }} className='p-button-text p-button-secondary w-full px-0 text-red-500' />
                                                        </div>

                                                    </div>
                                                </OverlayPanel>
                                            </div>
                                        </div>

                                        <OverlayPanel ref={editStatusNameOp} showCloseIcon>
                                            <EditName selectedStatus={selectedStatusData} />
                                        </OverlayPanel>

                                        <Droppable droppableId={column.id.toString()} type='task'>
                                            {provided => (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                >
                                                    {column.tasks.map((task, index) => (
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
                                                                                    <span className=' text-lg'>{task.task_name}</span>
                                                                                </div>
                                                                                <div className="font-medium text-xl text-900 block">
                                                                                    <span className='text-gray-500 text-lg'>{task.task_key}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            )}
                                                        </Draggable>

                                                    ))}
                                                    {provided.placeholder}
                                                    <div style={{ height: '0.1rem' }}></div>

                                                </div>
                                            )}
                                        </Droppable>
                                    </div>
                                    {/* )} */}
                                    {/* </Draggable> */}
                                </div>
                            ))}

                            {/* {provided.placeholder} */}
                        </div>

                        {/* )} */}
                        {/* </Droppable> */}

                    </DragDropContext>

                    <Dialog header={<div className='grid'>
                        <div className='col'>
                            <span>{dialogHeader}</span>

                        </div>
                    </div>} maskStyle={maskStyles} modal={true} visible={statusDialog} className='p-dialog' style={{ width: '30vw', backgroundColor: "#fff" }} onHide={() => setStatusDialog(false)}>
                        {dialogContent}
                    </Dialog>

                    <Sidebar visible={visibleFullScreen} onHide={() => handleCloseSidebar()} baseZIndex={9000} fullScreen>
                        <TaskDialog taskKey={setselectedTaskKey} />
                    </Sidebar>
                </div>
            </div>

        </div>
    );
};

export async function getServerSideProps(context) {
    const { query } = context;

    resetServerContext();
    return {
        props: {
            myQuery: query
        },
    };
}


export default Board;
