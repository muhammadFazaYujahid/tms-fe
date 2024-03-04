import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { WorkspaceServices } from '../../services/WorkspaceServices';
import { Document, Page, View, Text } from '@react-pdf/renderer';

const ReportPDF = ({ userList }) => {

    const [expandedRows, setExpandedRows] = useState(null);

    // const [userList, setUserList] = useState([]);

    const header = <div className='flex m-0'>
        <div className='left col-8 m-0'>
            <h4 className='pt-2'>Member Report</h4>

        </div>
        <div className='col-4 text-right m-0'>
            <Button icon="pi pi-file-excel" className='p-button-rounded p-button-outlined p-button-success mx-2' />
            <Button icon="pi pi-file-pdf" className='p-button-rounded p-button-outlined p-button-danger mx-2' />
        </div>
    </div>;

    const rowExpansionTemplate = (data) => {
        return (
            <div className="orders-subtable">
                <h5>{data.user.username} handled Tasks</h5>
                <DataTable value={data.tasks} responsiveLayout="scroll">
                    <Column header="Task Key" field="task_key" sortable></Column>
                    <Column header="Task Name" field='task_name' sortable />
                    <Column header="Type" field='handler_type' sortable />
                    <Column header="Story Point" field='story_point' />
                </DataTable>
            </div>
        );
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

    return (<Document>
        <Page>
            <View>
                <DataTable value={userList} expandedRows={true} rowExpansionTemplate={rowExpansionTemplate} dataKey="id">
                    <Column expander style={{ width: '3em' }} />
                    <Column header="Name" body={nameBodyTemplate} sortable />
                    <Column header="Handled Project" field='project_count' />
                    <Column header="Handled Task" field='task_count' />
                    <Column header="Story Point Total" field='total_story_point' />
                </DataTable>

            </View>
        </Page>

    </Document>
    );
};

export default ReportPDF;
