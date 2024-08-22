import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload"
import { Tag } from "primereact/tag";
import { Fragment, useEffect, useRef, useState } from "react"
import * as ExcelJS from 'exceljs';
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tooltip } from "primereact/tooltip";
import { Dialog } from "primereact/dialog";
import UploadTask from "./uploadTask";
import { Dropdown } from "primereact/dropdown";
import SprintBloc from "../../services/Blocs/SprintBloc";
import apiResponse from "../../services/apiResponse";
import TaskBloc from "../../services/Blocs/TaskBloc";
import { emit, on } from '../../utils/EventEmitter';

const ImportTask = () => {
    const toast = useRef(null);
    const [totalSize, setTotalSize] = useState(0);

    const [tableData, setTableData] = useState([]);
    const [tableHeader, setTableHeader] = useState([]);
    const fileUploadRef = useRef(null);
    const [fileData, setFileData] = useState({})

    const [uploadData, setUploadData] = useState(false);

    const [sprints, setSprints] = useState([]);
    const sprintBloc = new SprintBloc();
    const taskBloc = new TaskBloc();
    
    useEffect(() => {
        sprintBloc.fetchGetSprint({project_key: sessionStorage.getItem('project_key')});
        const getSprint = sprintBloc.getSprint.subscribe((result) => {

            switch (result.status) {
                case apiResponse.COMPLETED:
                    const sprintList = result.data.sprint;
                    const formattedSprints = sprintList.map(({sprint_key, sprint_name}) => {
                        return {
                            sprint_key,
                            sprint_name
                        }
                    })
                    setSprints(formattedSprints);
                    setSelectedSprint(formattedSprints.find(({sprint_key}) => sprint_key.split('-')[0] === 'BL'));
                    // console.log('formated sprint', );
                    break
                case apiResponse.ERROR:
                    console.error('error', result.data)
                    break
                default:
                    break
            }
        })
    
      return () => {
        getSprint.unsubscribe();
      }
    }, [])
    
    
    const maskStyles = {
        backgroundColor: 'rgb(0 0 0 / 50%)',
    };
    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const customBase64Uploader = async (event) => {
        // convert file to base64 encoded
        const file = event.files[0];
        const reader = new FileReader();
        
        reader.readAsArrayBuffer(file); // Read the file as an ArrayBuffer
        reader.onload = () => {
            const buffer = reader.result;
            workbook.xlsx.load(buffer).then((wb) => {
                wb.eachSheet((sheet, id) => {
                sheet.eachRow((row, rowIndex) => {
                    // console.log(row.values, rowIndex);
                });
                });
            }).catch((error) => {
                console.error('Error reading the Excel file:', error);
            });
        };

    };

    const reArrangeData = (rawData) => {
        const headers = rawData[0];
        const rows = rawData.slice(1);

        const result = rows.map(row => {
            let obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index];
            });
            return obj;
        });

        return result;
    }
    
    const importExcel = (event) => {
        const file = event.files[0]; // Get the first selected file
        if (!file) return; // If no file was selected, return early

        const workbook = new ExcelJS.Workbook();
        const reader = new FileReader();

        reader.readAsArrayBuffer(file); // Read the file as an ArrayBuffer

        reader.onload = () => {
        const buffer = reader.result;
        workbook.xlsx.load(buffer).then((wb) => {
            let tableData = [];
            wb.eachSheet((sheet, id) => {
                // console.log('sheet', sheet)
                sheet.eachRow((row, rowIndex) => {
                    tableData.push(row.values.flat());
                    // console.log('row', row.values, rowIndex);
                });
            });
            const convertedData = reArrangeData(tableData);

            const tableHeading = tableData[0].map(data => {
                return { field: data, name: data }
            })
            setTableHeader(tableHeading);
            setTableData(convertedData);
        }).catch((error) => {
            console.error('Error reading the Excel file:', error);
        });
        
        let _totalSize = totalSize;
        let files = event.files;

        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0;
        });

        setTotalSize(_totalSize);

        };
    }
    
    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-file-excel mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                    Drag and Drop Excel File Here
                </span>
            </div>
        );
    };

    const dynamicColumns = tableHeader.map((col, i) => {
        return <Column key={col.field} columnKey={col.field} field={col.field} header={col.name} />;
    });
    
    const itemTemplate = (file, props) => {
        on('resetFile', () => {
            props.onRemove();
        })
        return (
            <div className="text-center">
                <h5>Generated Data</h5>
                <DataTable 
                scrollable 
                scrollHeight="400px"
                paginator rows={5}
                rowsPerPageOptions={[5, 10, 25, 50]}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                value={tableData}>
                    {dynamicColumns}
                </DataTable>
                <Button type="button" label="Upload Data" className="mt-3 p-button-outlined p-button-rounded p-button-success ml-auto" onClick={() => setUploadData(true)} />
            </div>
        );
    }; 
    const [selectedSprint, setSelectedSprint] = useState(null);

    const uploadTaskData = () => {
        const tasks = tableData.map(task => {
            return {
                ...task, sprint_key: selectedSprint.sprint_key
            }
        })
        taskBloc.fetchImportTasks({tasks});
    }

    useEffect(() => {
      const importTask = taskBloc.importTasks.subscribe((result) => {
        
        switch (result.status) {
            case apiResponse.COMPLETED:
                console.log('berhasil import', fileData);
                emit('resetFile');
                emit('refreshTable');
                setUploadData(false);
                toast.current.show({severity:'success', summary: 'Success', detail:'Import Task Success', life: 3000});
                break
            case apiResponse.ERROR:
                
                setUploadData(false);
                toast.current.show({severity:'error', summary: 'Failed', detail: result.data, life: 3000});
                console.error('error', result.data)
                break
            default:
                break
        }
      })
    
      return () => {
        importTask.unsubscribe();
      }
    }, [taskBloc])
    

    return (
        <Fragment>
            <Toast ref={toast}></Toast>
            <div className="text-center" >
                <h2 className='text-gray-900' >
                    Import Task
                </h2>
                
                <h6 className="text-red-400 saved-content">Imported Data must have this field</h6>
                    
                    <DataTable emptyMessage=" " showGridlines >
                        <Column header="task_name" />
                        <Column header="level" />
                        <Column header="assigner_mail" />
                        <Column header="reporter_mail" />
                        <Column header="status" />
                        <Column header="optimistic_time" />
                        <Column header="mostlikely_time" />
                        <Column header="pessimistic_time" />
                        {/* {dynamicColumns} */}
                    </DataTable>
                <FileUpload
                    className="mt-2"
                    ref={fileUploadRef}
                    maxFileSize={1000000}
                    onError={onTemplateClear} 
                    onClear={onTemplateClear}
                    mode="advanced"
                    name="demo[]"
                    url="/api/upload"
                    accept=".xlsx, .xls"
                    customUpload
                    uploadOptions={{className: "hidden"}}
                    onSelect={importExcel}
                    itemTemplate={itemTemplate}
                    emptyTemplate={emptyTemplate} />
                    
                <Dialog 
                    header={<div className='grid'>
                            <div className='col'>
                                <span>Upload Data</span>
                            </div>
                        </div>} 
                    maskStyle={maskStyles} modal={true} visible={uploadData} className='p-dialog' style={{ width: '30vw', backgroundColor: "#fff" }} onHide={() => setUploadData(false)}>
                
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <h6>Select a Sprint</h6>
                        <Dropdown
                            value={selectedSprint}
                            onChange={(e) => setSelectedSprint(e.value)}
                            options={sprints}
                            optionLabel="sprint_name"
                            placeholder="Select a Sprint" 
                            filter 
                            className="w-full md:w-14rem" />

                        <Button label="Upload" className="mt-4" onClick={() => uploadTaskData()} />
                    </div> 
                </Dialog>
            </div>
        </Fragment>
    )
}

export default ImportTask