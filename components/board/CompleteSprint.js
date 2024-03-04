import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import React, { useContext, useEffect, useState } from 'react';
// import socket from '../../../utils/Socket';
import { Controller, useForm } from 'react-hook-form';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { emit } from '../../utils/EventEmitter';
import { TaskServices } from '../../services/TaskServices';
import { TaskStatusService } from '../../services/TaskStatusService';
import { SprintService } from '../../services/SprintServices';

const CompleteSprint = ({ projectKey }) => {
    const { showToast } = useContext(LayoutContext);
    const [selectedStatus, setSelectedStatus] = useState('')
    const [category, setCategory] = useState(null);
    const [taskStatus, setTaskStatus] = useState([])
    const [sprints, setSprints] = useState([]);
    const [project_key, setProject_key] = useState(sessionStorage.getItem('project_key'))

    useEffect(() => {
        const sprintService = new SprintService();
        const taskService = new TaskServices();
        sprintService.getSprint(project_key).then((data) => {
            const activeSprint = data.sprint.filter(data => data.status == 'process' || data.status == 'backlog')
            setSprints(activeSprint);
            if (activeSprint.filter(sprint => sprint.status !== 'backlog').length == 1) {
                setSelectedSprint(activeSprint[0])
            }

        });
        taskService.getTaskStatus(project_key).then((data) => { setTaskStatus(data) });

    }, [selectedStatus])


    const defaultValues = {
        destination_status: ''
    };
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        data.completed_sprint = selectedSprint.sprint_key
        data.destination_sprint = category.sprint_key;
        data.activity = {
            action: 'Change ' + selectedSprint.sprint_name + ' Sprint Status to Completed and move uncompleted task to',
            object_one: category.sprint_name,
            object_two: '',
            type: 'project',
            related_code: sessionStorage.getItem('project_key'),
            url: window.location.href,
            additional_text: ''
        }



        const taskStatusService = new TaskStatusService();
        taskStatusService.completeSprint(data)
            .then((res) => {

                if (!res.success) {
                    return showToast({
                        severity: 'error',
                        summary: 'Complete Sprint Failed',
                        detail: res.message,
                        sticky: false
                    });
                }
                emit('refreshBoard');
                emit('closeStatusDialog');
                showToast({
                    severity: 'success',
                    summary: 'Complete Sprint Success',
                    detail: selectedSprint.sprint_name + ' Sprint Completed',
                    sticky: false
                });
                // if (data.success) {
                // }
            });
    };

    const [selectedSprint, setSelectedSprint] = useState('')
    const [sprinteSelected, setSprinteSelected] = useState(false)

    const getselectedSprint = (sprint) => {
        setSelectedSprint(sprint);
        setSprinteSelected(true);
    }

    return (<>

        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='col-12'>
                {(sprints.filter(sprint => sprint.status !== 'backlog').length > 1) ? <>
                    <div className=''>
                        <h6>Select a Sprint to Complete</h6>
                        <Dropdown
                            size="small"
                            value={selectedSprint}
                            onChange={(e) => getselectedSprint(e.value)}
                            placeholder="Select Status"
                            options={sprints.filter(sprint => sprint.status !== 'backlog')}
                            optionLabel="sprint_name"
                            className="w-full" />
                    </div>

                </> : <></>}

                <div className='mt-5'>
                    <h6>Move uncompleted Task to:</h6>
                    <Controller
                        name='destination_status'
                        control={control}
                        render={({ field }) => (
                            <>
                                <Dropdown
                                    disabled={(selectedSprint == '') ? true : false}
                                    style={{ margin: "-0.6em 0" }} size="small"
                                    value={category}
                                    onChange={(e) => setCategory(e.value)}
                                    placeholder="Select Status"
                                    options={sprints.filter((data) => data.sprint_key !== selectedSprint.sprint_key && (data.status == 'process' || data.status == 'backlog'))}
                                    optionLabel="sprint_name"
                                    className="w-full" />
                            </>
                        )}
                    />
                </div>

            </div>

            <div className='col-12' style={{ float: "right" }}>
                <Button className='mx-2 p-button-sm mt-3' label="Complete Sprint" style={{ float: "right" }} />
            </div>

        </form>
    </>);
};

export default CompleteSprint;
