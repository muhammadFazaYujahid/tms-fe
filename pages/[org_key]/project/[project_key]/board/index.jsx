import React, { useState, useEffect, useContext, useRef, Fragment } from 'react';
import Breadcrumb from '@components/BreadCrumb';
import { InputText } from 'primereact/inputtext';
import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { Dialog } from 'primereact/dialog';
import { Badge } from 'primereact/badge';

import KanbanBoard from '@components/board/KanbanBoard';


import getConfig from 'next/config';
import InviteProjectDialog from '@components/dialog-content/InviteProjectDialog';
import { TaskStatusService } from '@services/TaskStatusService';
import { LayoutContext } from '@layout/context/layoutcontext';
import { DragDropContext, Draggable, Droppable, resetServerContext } from 'react-beautiful-dnd';
import { Sidebar } from 'primereact/sidebar';
import TaskDialog from '@components/TaskDialog';
import { OverlayPanel } from 'primereact/overlaypanel';
import CreateStatus from '@components/board/CreateStatus';
import { useRouter } from 'next/router';
import { emit, on } from '@utils/EventEmitter';
import EditName from '@components/board/EditName';
import DeleteStatus from '@components/board/DeleteStatus';
import CompleteSprint from '@components/board/CompleteSprint';
import { ProjectService } from '@services/ProjectServices';
import { debounce, result } from 'lodash';
import { SprintService } from '@services/SprintServices';
import { Divider } from 'primereact/divider';
import { Tooltip } from 'primereact/tooltip';
import TaskBloc from '../../../../../services/Blocs/TaskBloc';
import TaskStatusBloc from '../../../../../services/Blocs/TaskStatusBloc';
import apiResponse from '../../../../../services/apiResponse';
import ProjectBloc from '../../../../../services/Blocs/projectBloc';
import SprintBloc from '../../../../../services/Blocs/SprintBloc';
import MemberList from '../../components/memberList';



const Board = ({ myQuery }) => {
    const router = useRouter();
    const { contentDialog, setContentDialog, projectKeyLink, setOrgKeyLink, setProjectKeyLink, setShowSidebar } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const [tasks, setTasks] = useState([])
    const [inviteDialog, setInviteDialog] = useState(false);
    const [columns, setColumns] = useState(tasks);
    const [memberList, setMemberList] = useState([]);
    const [sprints, setSprints] = useState([]);
    const [memberPhotos, setMemberPhotos] = useState([]);
    const [defaultStatus, setdefaultStatus] = useState([]);

    const taskStatusBloc = new TaskStatusBloc;
    const projectBloc = new ProjectBloc;
    const sprintBloc = new SprintBloc;

    const fetchTaskStatus = () => {
        taskStatusBloc.fetchGetStatus(myQuery.project_key);
    }
    const fetchSprint = () => {
        sprintBloc.fetchGetSprint({project_key: myQuery.project_key});
    }

    useEffect(() => {
        fetchTaskStatus();
        fetchSprint();

        const getStatus = taskStatusBloc.getStatus.subscribe((result) => {
            switch (result.status) {
                case apiResponse.COMPLETED:
                    setColumns(result.data.data);
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
                    const activeSprint = result.data.sprint.filter(data => data.status == 'process')
                    setSprints(activeSprint);
                    break
                case apiResponse.ERROR:
                    console.error('error', result.data)
                    break
                default:
                    break
            }
        })
    
      return () => {
        getStatus.unsubscribe();
        getSprint.unsubscribe();
      }
    }, [])

    useEffect(() => {
      const changeStatus = taskStatusBloc.changeStatus.subscribe((result) => {
        console.log('berhasil', result);
        emit('refreshBoard')
      })
    
      return () => {
        changeStatus.unsubscribe();
      }
    }, [taskStatusBloc])
    

    useEffect(() => {
      
        on('refreshBoard', () => {
            fetchTaskStatus();
        })
    
      return () => {
        
      }
    }, [])
    
    

    useEffect(() => {
        setShowSidebar(true);
        return () => {
            
            setShowSidebar(false);
        }
    }, []);

    const [projectKey, setProjectKey] = useState(myQuery.project_key);

    useEffect(() => {
        setOrgKeyLink(myQuery.org_key);
        setProjectKeyLink(myQuery.project_key);
    }, [])

    const [selectedCities, setSelectedCities] = useState(null);
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
        taskStatusBloc.fetchChangeStatus(data);

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
                            <MemberList />

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
                                    <div className="card mb-0"
                                    style={{ backgroundColor: column.color }}
                                    // {...provided.draggableProps}
                                    // {...provided.dragHandleProps}
                                    // ref={provided.innerRef}
                                    >
                                        <div className="flex justify-content-between mb-3">
                                            <div>
                                                <h5 className="font-medium mb-3">{column.name} {(column.need_verify === true) && <Badge value="Need Confirmation" severity="secondary"></Badge>}</h5>
                                            </div>
                                            <div>
                                                <Button icon="pi pi-ellipsis-v ml-5" onClick={(e) => toggleAction(e, column)} className='py-2 p-button-secondary p-button-text p-button-sm' />

                                                <OverlayPanel className='p-0' ref={actionOp}>
                                                    <div className='grid w-10rem'>
                                                        <div className='col-12'>
                                                            <Button label='Edit' onClick={toggleEditStatusName} className='p-button-text p-button-secondary w-full px-0' />

                                                        </div>
                                                        {(!['TD', 'OP', 'CP'].includes(selectedStatusData.status_key?.split("-")[0])) && 
                                                            <div className='col-12'>
                                                                <Button label='Delete'
                                                                    onClick={() => {
                                                                        setStatusDialog(true);
                                                                        setDialogHeader("Delete Task Status");
                                                                        setDialogContent(<DeleteStatus statusData={selectedStatusData} />)
                                                                    }} className='p-button-text p-button-secondary w-full px-0 text-red-500' />
                                                            </div>
                                                        }

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
                                                        <Draggable key={task.id} isDragDisabled={(column.need_verify === true && task.verify_status === 'verified')} draggableId={task.id.toString()} index={index}>
                                                            {provided => (

                                                                <div className='task-card p-3 my-2'
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    ref={provided.innerRef}
                                                                    onClick={() => { showDetailTask(task) }}
                                                                >
                                                                    <div className="surface-0 bg-transparent border">
                                                                        <div className="flex align-items-center flex-column lg:justify-content-between lg:flex-row">
                                                                            <div className='w-full p-1'>
                                                                                <div className="font-medium text-xl text-900 grid" style={{display: 'flex', justifyContent: "space-between"}}>
                                                                                    <span className=' text-2xl ml-1'>{task.task_name}</span>
                                                                                    {(column.need_verify === true && task.verify_status === 'requested') && 
                                                                                        <Fragment>
                                                                                            <Tooltip target=".verify-needed">Need Confirmation</Tooltip>
                                                                                            <div className={`verify-needed flex align-items-center justify-content-center bg-red-100 border-round`} style={{ width: '2.5rem', height: '2.5rem' }}>
                                                                                                <i className={`pi pi-exclamation-triangle text-red-500 text-xl`}></i>
                                                                                            </div>
                                                                                        </Fragment>}
                                                                                        {(column.need_verify === true && task.verify_status === 'verified') && 
                                                                                        <Fragment>
                                                                                            <Tooltip target=".verified">Task Confirmed</Tooltip>
                                                                                            <div className={`verified flex align-items-center justify-content-center bg-green-100 border-round`} style={{ width: '2.5rem', height: '2.5rem' }}>
                                                                                                <i className={`pi pi-verified text-green-500 text-xl`}></i>
                                                                                            </div>
                                                                                        </Fragment>}
                                                                                </div>
                                                                                <div className="font-medium text-xl text-900 block grid mt-2">
                                                                                    <span className='text-gray-500 text-lg col'>{task.task_key} | {task.task_handlers.filter(handler => handler.type === "assigner").map(handler => handler.handler_name)}</span>
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
