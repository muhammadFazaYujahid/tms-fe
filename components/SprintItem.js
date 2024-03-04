import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { Ripple } from 'primereact/ripple';
import { Badge } from 'primereact/badge';
import { Droppable } from 'react-beautiful-dnd';

import { DragDropContext } from 'react-beautiful-dnd';
import IssueListItem from './IssueListItem';

import { ProjectService } from '../services/ProjectServices';


const SprintItem = ({ data }) => {

    const [projectList, setProjectList] = useState([])

    useEffect(() => {
        const projectService = new ProjectService();
        projectService.getProject().then((data) => setProjectList(data));
    }, []);


    const sprint_header = (options) => {
        const toggleIcon = options.collapsed ? 'pi pi-chevron-down' : 'pi pi-chevron-up';
        return (

            <div className="surface-0 bg-transparent mb-3">
                <div className="flex align-items-center flex-column lg:justify-content-between lg:flex-row">
                    <div>
                        <div className="font-medium text-xl text-900">

                            <button className={options.togglerClassName} onClick={options.onTogglerClick}>
                                <span className={toggleIcon}></span>
                                <Ripple />
                            </button>
                            <span className='ml-2 text-lg'>Customers</span>
                            <a href="https://nextjs.org/" className="text-lg text-gray-900 hover:text-gray-600"><i className='pi pi-pencil ml-3'></i> Add Date</a>
                            <span className='ml-5 text-lg'>(0 Issues)</span>
                        </div>
                    </div>
                    <div style={{ float: "right" }} className='flex-grow-1 flex align-items-end justify-content-end font-bold text-white m-2 px-5'>
                        <Badge value="2"></Badge>
                        <Badge value="8" severity="success"></Badge>
                        <Badge value="4" severity="info"></Badge>
                        <Badge value="12" severity="warning"></Badge>
                        <Badge value="3" severity="danger"></Badge>
                    </div>
                    <div className="mt-3 lg:mt-0">
                        <Button label="Start Sprint" style={{ padding: "0.5em 1em 0.5em 1em" }} className="p-button-outlined mr-2 btn btn-sm" />

                        <Button label="..." style={{ padding: "0.5em 1em 0.5em 1em" }} />
                    </div>
                </div>
            </div>
        );
    }

    return (<>
        <Droppable droppableId="droppable">
            {provided => (
                <div className='card bg-gray-100 p-3'
                    ref={provided.innerRef}
                    {...provided.droppableProps}>
                    <Panel headerTemplate={sprint_header} toggleable>
                        <IssueListItem key="iniKey" />
                    </Panel>
                    <Button label="Add Issue" icon="pi pi-plus" className='px-3 py-2 mt-3 p-button-text p-button-secondary' />
                    {provided.placeholder}
                </div>

            )}
        </Droppable>
    </>
    );
};

export default SprintItem;
