import React, { useRef, useState, useEffect, useContext } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

import { Controller, useForm } from 'react-hook-form';
import { emit } from '../../../utils/EventEmitter';
import { Dropdown } from 'primereact/dropdown';
import { TeamServices } from '../../../services/TeamServices';
import { MultiSelect } from 'primereact/multiselect';
import { ProjectService } from '../../../services/ProjectServices';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import Link from 'next/link';
import { TreeSelect } from 'primereact/treeselect';
import { TaskServices } from '../../../services/TaskServices';

const EditAssignDetail = ({ taskData }) => {

    const { setContentDialog, showToast } = useContext(LayoutContext);

    const [taskDetail, setTaskDetail] = useState(taskData);
    const [projectHandler, setProjectHandler] = useState([]);
    const [workspace, setWorkspace] = useState([]);

    const [pertInput, setPertInput] = useState({
        fastest_time: taskDetail.optimistic_time,
        normal_time: taskDetail.mostlikely_time,
        slowest_time: taskDetail.pessimistic_time,
    });

    const taskLevel = [
        { level: 0, label: 'low' },
        { level: 1, label: 'medium' },
        { level: 2, label: 'high' },
    ];

    const handleInputChange = (name, value) => {
        setPertInput((prevTimes) => ({ ...prevTimes, [name]: value }));
    };

    const Pertsum = (pertInput.fastest_time + (4 * pertInput.normal_time) + pertInput.slowest_time) / 6;


    useEffect(() => {
        const projectService = new ProjectService();
        projectService.getprojectHandler(sessionStorage.getItem('project_key')).then((res) => { setWorkspace(res.workspace); setProjectHandler(res.editedData) })
    }, [])

    const multiSelectFormat = (optionValue) => {
        const formatted = optionValue.reduce((acc, item) => {
            acc[item.handler] = { checked: true, partialChecked: false }
            return acc;
        }, {})
        return formatted
    }

    useEffect(() => {
        const assigner = taskDetail.task_handlers.filter(handler => handler.type == 'assigner')
        const formattedAssigner = multiSelectFormat(assigner);
        const reporter = taskDetail.task_handlers.filter(handler => handler.type == 'reporter')
        const formattedreporter = multiSelectFormat(reporter);
        setSelectedAssigneKeys(formattedAssigner)
        setSelectedReporterKeys(formattedreporter)

    }, [taskDetail])


    const defaultValues = {
        task_name: taskDetail.task_name,
        level: taskLevel.filter(data => data.level == taskDetail.level)[0],
        assigne: [],
        reporter: [],
        fastest_time: taskDetail.optimistic_time,
        normal_time: taskDetail.mostlikely_time,
        slowest_time: taskDetail.pessimistic_time,
    };
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues });

    const onSubmit = (data) => {

        const selectedAssigneId = Object.keys(selectedAssigneKeys);
        const selectedReporterId = Object.keys(selectedReporterKeys);
        const selectedAssigne = workspace.workspace_members.filter((user) => selectedAssigneId.includes(user.user_key))
        const selecteReporter = workspace.workspace_members.filter((user) => selectedReporterId.includes(user.user_key))
        data.task_key = taskDetail.task_key;
        data.project_key = sessionStorage.getItem('project_key');
        data.assigne = selectedAssigne;
        data.reporter = selecteReporter;
        data.activity = {
            action: `edited task ${taskDetail.task_name} detail`,
            old_value: '',
            new_value: '',
            type: 'history',
            task_key: taskDetail.task_key,
            url: window.location.href,
            additional_text: ''
        }
        const taskServices = new TaskServices();
        taskServices.editAssigPoint(data)
            .then((res) => {
                let summaryNotif = '';
                let detailNotif = '';
                let severity = '';
                if (res.success) {
                    severity = 'success';
                    summaryNotif = 'Edit Task Success';
                    detailNotif = '';
                } else {
                    severity = 'error';
                    summaryNotif = 'Edit Task fail';
                    detailNotif = 'error: ' + res.error;
                }
                showToast({
                    severity: severity,
                    summary: summaryNotif,
                    detail: detailNotif,
                    sticky: false
                });
                emit('refreshActivity');
                emit('refreshBacklog');
                emit('refreshTaskDetail');
                emit('refreshDetail', data);
                emit('closeEditDialog');
            });
    };

    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
    };

    const [selectedTeam, setSelectedTeam] = useState([]);
    const [teamList, setTeamList] = useState([]);
    const [teamFormActive, setTeamFormActive] = useState(false);
    const [selectedAssigneKeys, setSelectedAssigneKeys] = useState(null);
    const [selectedReporterKeys, setSelectedReporterKeys] = useState(null);

    return (<>

        <form onSubmit={handleSubmit(onSubmit)}>

            <table className='w-full p-2 mt-3' style={{ borderCollapse: "separate", borderSpacing: "0 15px" }}>
                <tr className=''>
                    <td className='float-top' style={{ verticalAlign: "top" }}>
                        <p className='font-medium text-dark'>Task name</p>
                    </td>
                    <td className=''>
                        <Controller
                            name='task_name'
                            control={control}
                            render={({ field }) => (
                                <>
                                    <InputText {...field} type="text" className='w-full' />
                                </>
                            )}
                        />
                    </td>
                </tr>
                <tr className=''>
                    <td className='float-top' style={{ verticalAlign: "top" }}>
                        <p className='font-medium text-dark'>Urgency Level</p>
                    </td>
                    <td className=''>
                        <Controller
                            name='level'
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Dropdown
                                        // {...field}
                                        value={field.value}
                                        onChange={(e) => { field.onChange(e.value) }}
                                        options={taskLevel}
                                        optionLabel="label"
                                        maxSelectedLabels={3}
                                        className="w-full"
                                        style={{ marginTop: "-0.5em" }} display='chip' />
                                </>
                            )}
                        />
                    </td>
                </tr>
                <tr className=''>
                    <td className='float-top' style={{ verticalAlign: "top" }}>
                        <p className='font-medium text-dark'>Assigne</p>
                    </td>
                    <td className=''>
                        <Controller
                            name='assigne'
                            control={control}
                            render={({ field }) => (
                                <>
                                    <TreeSelect
                                        value={selectedAssigneKeys}
                                        onChange={(e) => { setSelectedAssigneKeys(e.value); setSelectedTeam(e) }}
                                        options={projectHandler}
                                        filter
                                        selectionMode="checkbox"
                                        className="md:w-25rem w-full"
                                        display="chip"
                                        placeholder="Select Assigne"></TreeSelect>
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}
                        />
                    </td>
                </tr>
                <tr className=''>
                    <td className='float-top' style={{ verticalAlign: "top" }}>
                        <p className='font-medium text-dark'>Reporter</p>
                    </td>
                    <td className=''>
                        <Controller
                            name='reporter'
                            control={control}
                            render={({ field }) => (
                                <>
                                    <TreeSelect
                                        value={selectedReporterKeys}
                                        onChange={(e) => { setSelectedReporterKeys(e.value); setSelectedTeam(e) }}
                                        options={projectHandler}
                                        filter
                                        selectionMode="checkbox"
                                        className="md:w-25rem w-full"
                                        display="chip"
                                        placeholder="Select Reporter"></TreeSelect>
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}
                        />
                    </td>
                </tr>
                <tr className=''>
                    <td className='float-top' style={{ verticalAlign: "top" }}>
                        <p className='font-medium text-dark'>Fastest Duration</p>
                    </td>
                    <td className=''>
                        <Controller
                            name='fastest_time'
                            control={control}
                            render={({ field }) => (
                                <>
                                    <InputText
                                        type="number"
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value);
                                            field.onChange(e.target.value)
                                            handleInputChange('fastest_time', value);
                                        }}
                                        value={field.value}
                                        className='w-full' />
                                </>
                            )}
                        />
                    </td>
                </tr>
                <tr className=''>
                    <td className='float-top' style={{ verticalAlign: "top" }}>
                        <p className='font-medium text-dark'>Normal Duration</p>
                    </td>
                    <td className=''>
                        <Controller
                            name='normal_time'
                            control={control}
                            render={({ field }) => (
                                <>
                                    <InputText
                                        type="number"
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value);
                                            field.onChange(e.target.value)
                                            handleInputChange('normal_time', value);
                                        }}
                                        value={field.value}
                                        className='w-full' />
                                </>
                            )}
                        />
                    </td>
                </tr>
                <tr className=''>
                    <td className='float-top' style={{ verticalAlign: "top" }}>
                        <p className='font-medium text-dark'>Slowest Duration</p>
                    </td>
                    <td className=''>
                        <Controller
                            name='slowest_time'
                            control={control}
                            render={({ field }) => (
                                <>
                                    <InputText
                                        // {...field}
                                        type="number"
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value);
                                            field.onChange(e.target.value)
                                            handleInputChange('slowest_time', value);
                                        }}
                                        value={field.value}
                                        className='w-full' />
                                </>
                            )}
                        />
                    </td>
                </tr>
                <tr className=''>
                    <td className='float-top' style={{ verticalAlign: "top" }}>
                        <p className='font-medium text-dark'>Story Point Estimate</p>
                    </td>
                    <td className=''>
                        <p className='font-medium text-dark'>{Pertsum}</p>
                    </td>
                </tr>
            </table>
            <div className='col-12'>
                <Button style={{ float: "right" }} className='mx-2' label="Edit" />
            </div>
        </form>
    </>
    );
};

export default EditAssignDetail;
