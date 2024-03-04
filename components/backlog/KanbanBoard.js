import React, { useState, useEffect, useRef, useContext } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { SplitButton } from 'primereact/splitbutton';
import { Dropdown } from 'primereact/dropdown';
import TaskDialog from '../TaskDialog';
const KanbanBoard = ({ tasks }) => {

  const [category, setCategory] = useState(null);
  const cities = [
    { name: 'Todo', code: 'TD' },
    { name: 'On Progress', code: 'OP' },
    { name: 'Done', code: 'DN' }
  ];

  const toast = useRef(null);
  const items = [
    {
      label: 'Update',
      icon: 'pi pi-refresh',
      command: () => {
        toast.current.show({ severity: 'success', summary: 'Updated', detail: 'Data Updated' });
      }
    },
    {
      label: 'Delete',
      icon: 'pi pi-times',
      command: () => {
        toast.current.show({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted' });
      }
    }
  ];

  const save = () => {
    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Data Saved' });
  };

  return (
    <>
      <div className='grid'>
        <div className='col-12'>
          <div className="card mb-0 " style={{ backgroundColor: "#f9f9f9" }}>
            <div className="flex justify-content-between mb-3">
              <Button icon="pi pi-chevron-up" style={{ marginTop: "-1em", padding: "0" }} className="p-button-text" />
              <div className="font-medium text-xl text-900">

                <span className='ml-2 text-lg'>AAA</span>
                <a href="https://nextjs.org/" className="text-lg text-gray-900 hover:text-gray-600"><i className='pi pi-pencil ml-3'></i> Add Date</a>
                <span className='ml-5 text-lg'>(0 Issues)</span>
              </div>

              <div style={{ float: "right" }} className='flex-grow-1 flex align-items-end justify-content-end font-bold text-white m-2 px-5'>
                <Badge value="2"></Badge>
                <Badge value="8" severity="success"></Badge>
                <Badge value="4" severity="info"></Badge>
                <Badge value="12" severity="warning"></Badge>
                <Badge value="3" severity="danger"></Badge>
              </div>
              <div className="mt-3 lg:mt-0">
                <SplitButton className='p-button-outlined p-0 p-button-sm' size='small' label="Start Sprint" model={items} style={{ borderRadius: "0px" }} />
              </div>
            </div>

            <div>
              <div className='task-card p-3 my-2'>
                <div className="surface-0 bg-transparent border">
                  <div className="flex align-items-center flex-column lg:justify-content-between lg:flex-row">
                    <div>
                      <div className="font-medium text-xl text-900">
                        <span className='ml-2 text-gray-500 text-lg lg:mr-2'>AAA</span>
                        <span className='ml-2  text-lg'>AAA</span>
                      </div>
                    </div>
                    <div style={{ float: "right" }} className='flex-grow-1 flex align-items-end justify-content-end font-bold text-white m-2 px-5'>
                      <Dropdown style={{ margin: "-0.6em 0" }} size="small" value={category} onChange={(e) => setCategory(e.value)} options={cities} optionLabel="name" placeholder="To do" className="p-inputtext-sm" />
                    </div>
                    <div className="mt-3 lg:mt-0">
                      <Button icon="pi pi-user" style={{ margin: "-0.6em 0" }} className="p-button-rounded p-button-outlined mr-2 btn btn-sm" />
                    </div>
                  </div>
                </div>
              </div>
              <Button label="Add Issue" icon="pi pi-plus" className='px-3 py-2 mt-3 p-button-text p-button-secondary' />


            </div>
          </div>
        </div>
      </div>
      {/* <Sidebar visible={visibleFullScreen} onHide={() => setVisibleFullScreen(false)} baseZIndex={9000} fullScreen>
        <TaskDialog selectedTask={selectedTask} />
      </Sidebar> */}
    </>
  )
}
export default KanbanBoard;