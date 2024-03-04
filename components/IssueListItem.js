import React, { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Draggable } from 'react-beautiful-dnd';
import { resetServerContext } from "react-beautiful-dnd"
import { ProjectService } from '../services/ProjectServices';

const IssueListItem = ({ data }) => {
    const [dataViewValue, setDataViewValue] = useState([
        {
            "index": "1",
            "project_key": "DPJ-1",
            "code": "TS-1",
            "issue": "create a login design",
            "description": "create a design for login",
            "reporter": "faza",
            "assigner": "ilham"
        },
        {
            "index": "2",
            "project_key": "DPJ-1",
            "code": "TS-2",
            "issue": "create a register design",
            "description": "create a design for register",
            "reporter": "abdul",
            "assigner": "budi"
        },
        {
            "index": "3",
            "project_key": "DPJ-1",
            "code": "TS-3",
            "issue": "create a invite design",
            "description": "create a design for invite",
            "reporter": "ahmad",
            "assigner": "abdul"
        }
    ]);
    const [layout, setLayout] = useState('list');

    useEffect(() => {
        const projectService = new ProjectService();
        projectService.getIssues().then((data) => setDataViewValue(data));
    }, []);

    const dataviewListItem = (data) => {
        resetServerContext();
        return (<>
            <Draggable draggableId={data.code} index={parseInt(data.index)}>
                {(provide, snapshot) => (
                    <div className="col-12"

                        {...provide.dragHandleProps}
                        {...provide.draggableProps}
                        ref={provide.innerRef}
                    >
                        <div className='card px-1 py-0 hover:bg-red-100 my-1 border-none'>
                            <div className="surface-0 bg-transparent my-3 border">
                                <div className="flex align-items-center flex-column lg:justify-content-between lg:flex-row">

                                    <img className="block xl:block mx-auto border-round" width="30" height="20" src={`https://primefaces.org/cdn/primereact/images/product/gaming-set.jpg`} alt={data.code} />
                                    <div>
                                        <div className="font-medium text-xl text-900">
                                            <span className='ml-2 text-gray-500 text-lg lg:mr-2'>{data.code}</span>
                                            <span className='ml-2  text-lg'>{data.issue}</span>
                                        </div>
                                    </div>
                                    <div style={{ float: "right" }} className='flex-grow-1 flex align-items-end justify-content-end font-bold text-white m-2 px-5'>
                                        <Dropdown size="small" value={category} onChange={(e) => setCategory(e.value)} options={cities} optionLabel="name" placeholder="To do" className="p-inputtext-sm" />
                                    </div>
                                    <div className="mt-3 lg:mt-0">
                                        <Button icon="pi pi-user" style={{ padding: "0.5em 1em 0.5em 1em" }} className="p-button-rounded p-button-outlined mr-2 btn btn-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {provide.placeholder}
                    </div>
                )}
            </Draggable>
        </>

        );
    };


    const [category, setCategory] = useState(null);
    const cities = [
        { name: 'Todo', code: 'TD' },
        { name: 'On Progress', code: 'OP' },
        { name: 'Done', code: 'DN' }
    ];

    return (<>
        {/* <DataView value={list_data} layout={layout} paginator rows={9} itemTemplate={dataviewListItem} /> */}
        {/* {dataviewListItem(list_data)} */}
        {dataViewValue.map((issue) => dataviewListItem(issue))}
    </>
    );
};

export default IssueListItem;
