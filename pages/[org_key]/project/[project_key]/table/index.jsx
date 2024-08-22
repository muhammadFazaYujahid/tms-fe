import React, { useState, useEffect, useContext, useRef, Fragment } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

import TaskDialog from '@components/TaskDialog';
import Breadcrumb from '@components/BreadCrumb';

import { LayoutContext } from '@layout/context/layoutcontext';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Sidebar } from 'primereact/sidebar';
import { emit, on } from '@utils/EventEmitter';
import { Toast } from 'primereact/toast';
import { requireAuth } from '../../../../../middlewares/requireAuth';
import apiResponse from '../../../../../services/apiResponse';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import MemberList from '../../components/memberList';
import TaskStatusBloc from '../../../../../services/Blocs/TaskStatusBloc';
import ImportTask from '../../../../../components/importData/ImportTask';
import { Dropdown } from 'primereact/dropdown';
import TaskBloc from '../../../../../services/Blocs/TaskBloc';

const TableBoard = ({ myQuery }) => {

    const { contentDialog, setContentDialog, setOrgKeyLink, setProjectKeyLink, setShowSidebar } = useContext(LayoutContext);

    const router = useRouter();

    const [visibleFullScreen, setVisibleFullScreen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [taskStatus, setTaskStatus] = useState([]);
    const [dialogContent, setDialogContent] = useState('');
    const [dialogHeader, setDialogHeader] = useState('');

    const taskStatusBloc = new TaskStatusBloc;
    const taskBloc = new TaskBloc;
    
    const fetchTask = () => {
        taskStatusBloc.fetchGetStatus(myQuery.project_key);
    }
    
    useEffect(() => {
        fetchTask();

        const getStatus = taskStatusBloc.getStatus.subscribe((result) => {
            switch (result.status) {
                case apiResponse.COMPLETED:
                    const status = result.data.data.map(status => {
                        return {
                            status_key: status.status_key,
                            name: status.name,
                            color: status.color
                        }
                    })

                    const tasks = result.data.data.map(data => data.tasks).flat().map(task => {
                        return {...task, status: status.find(status => status.status_key === task.status_key)?.name}
                    });
                    
                    const sortedTask = tasks.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

                    setTasks(sortedTask);
                    setTaskStatus(status);
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
      }
    }, [])
    
    useEffect(() => {
        // if (router.query.project_key != undefined) {

        //     Cookies.set('project_key', router.query.project_key, { expires: 1 });
        //     sessionStorage.setItem('project_key', router.query.project_key);
        // }
        on('refreshTable', () => {
            fetchTask();
        })
        setShowSidebar(true);
        return () => {
            setShowSidebar(false);
            // sprintBloc.createSPrint.unsubscribe();
        }
    }, []);

    useEffect(() => {
        setOrgKeyLink(myQuery.org_key);
        setProjectKeyLink(myQuery.project_key);
        // socket.emit('projectRoom', sessionStorage.getItem('project_key'))

        return () => {

        }
    }, [])

    const maskStyles = {
        backgroundColor: 'rgb(0 0 0 / 50%)',
    };

    const changeStatus = (data, taskData) => {
        const formData = { status_key: data.status_key, task_key: taskData.task_key, task_name: taskData.task_name }
        taskBloc.fetchChangeStatus(formData);
    }
    
    useEffect(() => {
        const changeStatus = taskBloc.changeStatus.subscribe((result) => {
            switch (result.status) {
                case apiResponse.COMPLETED:
                    emit('refreshTable');
                    showToast('success', 'Success', 'Change Status Success')
                    break
                case apiResponse.ERROR:
                    console.error('error', result.data)
                    showToast('error', 'Failed', result.data)
                    break
                default:
                    break
            }
        });
    
        return () => {
          changeStatus.unsubscribe();
        }
      }, [taskBloc])


    const [detailTask, setDetailTask] = useState([])
    useEffect(() => {
        if (myQuery.task == '' || myQuery.task == undefined) {
        } else {
            const data = { task: { task_key: myQuery.task } }
            setSelectedTaskKey(myQuery.task);
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

    const [selectedTaskKey, setSelectedTaskKey] = useState(null)

    const showDetailTask = (task) => {
        router.push({
            pathname: router.pathname,
            query: { ...router.query, task: task.task_key }, // Replace 'task-1' with the actual task value
        })
        setSelectedTaskKey(task.task_key);
        setVisibleFullScreen(true)
        setDetailTask(task)
    }

    useEffect(() => {
        on('taskDeleted', () => {
            handleCloseSidebar();
            emit('refreshTable');
        })

        on('refreshTable', () => {
            fetchTask();
        })
        
        initFilters();
    }, [])

    const columns = [
        { field: 'task_key', header: 'Task Key' },
        { field: 'task_name', header: 'Task Name' },
        // { field: 'assigner', header: 'Assigner' },
        // { field: 'watcher', header: 'Watcher' },
        { field: 'status', header: 'Status' },
        { field: 'mostlikely_time', header: 'Story Point' },
        // { field: 'action', header: 'Action' }
    ];
    
    const dt = useRef(null);
    const exportColumns = columns.map((col) => ({ title: col.header, dataKey: col.field }));
    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);

                doc.autoTable(exportColumns, tasks);
                doc.save('Task Report.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(tasks);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'Task Report');
        });
    };

    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };
    
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState(null);
    
    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            status: { value: null, matchMode: FilterMatchMode.IN },
        });
        setGlobalFilterValue('');
    };

    const clearFilter = () => {
        initFilters();
    };
    
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const header = (
        <div className='block lg:flex' style={{justifyContent: "space-between"}}>
            <Button 
                type="button" 
                icon="pi pi-upload" 
                severity="primary" 
                rounded 
                onClick={() => {
                    setSelectedTaskKey(null);
                    setVisibleFullScreen(true);
                }
            } />
            
            <div>
                <Button type="button" icon="pi pi-filter-slash" className='mr-2' label="Clear" outlined onClick={clearFilter} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>

            <div>
                <Button type="button" icon="pi pi-file-excel" className='lg: mr-2' severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
                <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
            </div>
        </div>
    );

    const statusTemplate = (task) => {
        return <div style={{ cursor: "pointer" }}>
            {task.status}
        </div>
    }

    const textEditor = (options) => {
        return <Dropdown loading value={taskStatus.find(status => status.status_key === options.rowData.status_key)} onChange={(e) => changeStatus(e.target.value, options.rowData)} options={taskStatus} optionLabel="name" onKeyDown={(e) => e.stopPropagation()} />
    };
    const toast = useRef(null);

    const showToast = (severity, summary, detail) => {
        toast.current.show({ severity, summary, detail, life: 3000 });
    };
    
    const actionBodyTemplate = (task) => {
        return  <div className='text-center'><Button onClick={() => showDetailTask(task)} label='Detail' className='text-center' text /></div>;
    };

    return (
        <Fragment>
            <Toast ref={toast} />
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <Breadcrumb orgKey={myQuery.org_key} projectKey={myQuery.project_key} section="Table" />

                        <div className="grid mb-3 mt-4">
                            <div className='col lg:col-3' style={{display: "flex", alignItems: "center"}}>
                                <h5>Task Table Board</h5>
                            </div>
                            <div className='col'>
                                <MemberList />
                            </div>
                        </div>
                        
                    <DataTable 
                    value={tasks} 
                    header={header}
                    ref={dt}
                    scrollable
                    scrollHeight="450px"
                    filters={filters}
                    globalFilterFields={['task_key', 'task_name', 'assigner', 'watcher', 'status', 'point']}
                    emptyMessage="No data found."
                    // virtualScrollerOptions={{ itemSize: 46 }}
                    removableSort
                    reorderableColumns 
                    reorderableRows 
                    paginator 
                    showGridlines 
                    rows={10} 
                    rowsPerPageOptions={[5, 10, 25, 50]} 
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}"
                    onRowReorder={(e) => setTasks(e.value)} 
                    editMode='cell'
                    className='w-full'>
                        <Column rowReorder style={{ width: '3rem' }} />
                        {columns.map((col, i) => ( 
                            <Column 
                            key={col.field} 
                            sortable 
                            columnKey={col.field} 
                            body={(col.field === 'status') && statusTemplate}
                            field={col.field} 
                            editor={(col.field === 'status') && textEditor}
                            showFilterMatchModes={false} 
                            header={col.header} />
                        ))}
                        <Column headerStyle={{display: "flex", justifyContent: "center"}} header="Action" body={actionBodyTemplate} />
                    </DataTable>

                        <Dialog header={<div className='grid'>
                            <div className='col'>
                                <span>{dialogHeader}</span>

                            </div>
                        </div>} maskStyle={maskStyles} modal={true} visible={contentDialog} className='p-dialog' style={{ width: '30vw', backgroundColor: "#fff" }} onHide={() => setContentDialog(false)}>
                            {dialogContent}
                        </Dialog>

                        <Sidebar visible={visibleFullScreen} onHide={() => handleCloseSidebar()} baseZIndex={9000} fullScreen>
                            {(selectedTaskKey !== null) ? (
                                <TaskDialog taskKey={selectedTaskKey} />
                            ) :
                            <ImportTask />
                        }
                        </Sidebar>


                    </div>
                </div >
            </div >
        </Fragment>
    );
};


export async function getServerSideProps(context) {
    const { query } = context;
    // console.log('isi query', query);
    return {
        props: {
            myQuery: query
        },
    };
}


export default  requireAuth(TableBoard);
