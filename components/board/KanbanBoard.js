import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Sidebar } from 'primereact/sidebar';

import TaskDialog from '../TaskDialog';
import { TaskServices } from '../../services/TaskServices';
import { Button } from 'primereact/button';

const KanbanBoard = ({ tasks }) => {
  const [columns, setColumns] = useState(tasks);

  useEffect(() => {
    const taskServices = new TaskServices();
    taskServices.getTaskStatus().then((data) => setColumns(data));
  }, []);

  const onDragEnd = result => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const column = columns[source.droppableId];
    const newTaskIds = Array.from(column.taskIds);
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);


    const newColumn = {
      ...column,
      taskIds: newTaskIds
    };

    setColumns({
      ...columns,
      [newColumn.id]: newColumn
    });
  };


  const [visibleFullScreen, setVisibleFullScreen] = useState(false);
  const [selectedTask, setSelectedTask] = useState({})

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className='grid'>
          {columns.map(column => (


            <div className='col' key={column.id}>
              <div className="card mb-0 " style={{ backgroundColor: "#f9f9f9" }}>
                <div className="flex justify-content-between mb-3">
                  <div>
                    <h4 className="block font-medium mb-3">{column.status}</h4>
                  </div>
                </div>
                <Droppable droppableId={column.id}>
                  {provided => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {column.taskIds.map((taskId, index) => (
                        <Draggable key={taskId} draggableId={taskId} index={index}>
                          {provided => (

                            <div className='task-card p-3 my-2'
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              onClick={() => { setVisibleFullScreen(true); setSelectedTask(tasks.find(task => task.id === taskId)) }}
                            >
                              <div className="surface-0 bg-transparent border">
                                <div className="flex align-items-center flex-column lg:flex-row">

                                  <div>
                                    <div className="font-medium text-xl text-900">
                                      {/* <span className=' text-lg'>{tasks.find(task => task.id === taskId).name}</span> */}
                                    </div>
                                    <div className="font-medium text-xl text-900 block">
                                      {/* <img className=" border-round" width="30" height="20" src={`https://primefaces.org/cdn/primereact/images/product/gaming-set.jpg`} /> */}
                                      <span className='text-gray-500 text-lg'>{tasks.find(task => task.id === taskId).id}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>


          ))}

        </div>
      </DragDropContext>


      <Sidebar visible={visibleFullScreen} onHide={() => setVisibleFullScreen(false)} baseZIndex={9000} fullScreen>
        <TaskDialog selectedTask={selectedTask} />
      </Sidebar>
    </>
  );
};

export default KanbanBoard;
