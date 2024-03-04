import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import getConfig from 'next/config';
import { Image } from 'primereact/image';
import { WorkspaceServices } from '../services/WorkspaceServices';

const MemberReport = ({ workKey }) => {

    const pdfContentRef = useRef();
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const [expandedRows, setExpandedRows] = useState(null);

    const [allExpanded, setAllExpanded] = useState(false);
    const [work_key, setWork_key] = useState(workKey);
    const [userList, setUserList] = useState([]);
    const dt = useRef(null);

    const cols = [
        { field: 'username', header: 'Name' },
        { field: 'project_count', header: 'Handled Project' },
        { field: 'task_count', header: 'Handled Task' },
        { field: 'total_story_point', header: 'Story Point Total' }
    ];

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    useEffect(() => {
        const workspaceServices = new WorkspaceServices;
        workspaceServices.getUserReport(work_key).then(res => setUserList(res));
    }, [])


    const toggleAll = () => {
        if (allExpanded) collapseAll();
        else expandAll();
    };

    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    };
    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                doc.addImage(`${contextPath}/demo/images/assets/kop.png`, "PNG", 20, 10);
                doc.setFont("times", "bold")
                doc.text("Member Report", 105, 45, null, null, "center")
                doc.autoTable(exportColumns, userList, { startY: 50 });
                doc.addImage(`${contextPath}/demo/images/assets/ttd.png`, "PNG", 120, 150);
                doc.save('User_Report.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(userList);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'user reports');
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

    const header = <div className='flex m-0'>
        <div className='left col-8 m-0'>
            <h4 className='pt-2'>Member Report</h4>

        </div>
        <div className='col-4 text-right m-0'>

            <Button icon="pi pi-file-excel" onClick={exportExcel} className='p-button-rounded p-button-outlined p-button-success mx-2' />
            <Button icon="pi pi-file-pdf" onClick={exportPdf} data-pr-tooltip="PDF" className='p-button-rounded p-button-outlined p-button-danger mx-2' />
        </div>
    </div>;

    const rowExpansionTemplate = (data) => {
        return (
            <div className="orders-subtable">
                <h5>{data.user.username} handled Tasks</h5>
                <DataTable value={data.tasks} responsiveLayout="scroll">
                    {/* <Column header="Task Key" field="task_key" sortable></Column>
                    <Column header="Task Name" field='task_name' sortable />
                    <Column header="Type" field='handler_type' sortable />
                    <Column header="Story Point" field='story_point' /> */}
                    {cols.map((col, index) => (
                        <Column key={index} field={col.field} header={col.header} />
                    ))}
                </DataTable>
            </div>
        );
    };

    const expandAll = () => {
        let _expandedRows = {};
        products.forEach((p) => (_expandedRows[`${p.id}`] = true));

        setExpandedRows(_expandedRows);
        setAllExpanded(true);
    };

    const collapseAll = () => {
        setExpandedRows(null);
        setAllExpanded(false);
    };


    const nameBodyTemplate = (rowData) => {
        return (
            <div className='flex'>
                <span className='text-lg ml-2 mt-2'>
                    {rowData.user.username}
                </span>
            </div>
        );
    };

    return (<>
        {/* <Image src={`${contextPath}/demo/images/assets/kop.png`} alt="Image" /> */}

        <DataTable ref={dt} value={userList} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} rowExpansionTemplate={rowExpansionTemplate} dataKey="id" id="pdf-content" header={header}>
            {/* <Column expander style={{ width: '3em' }} /> */}
            <Column header="Name" field='username' sortable />
            <Column header="Handled Project" field='project_count' />
            <Column header="Handled Task" field='task_count' />
            <Column header="Story Point Total" field='total_story_point' />
        </DataTable>

    </>
    );
};

export default MemberReport;
