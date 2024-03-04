import React, { useRef, useState, useEffect, useContext } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { WorkspaceServices } from '../../services/WorkspaceServices';

import { Controller, useForm } from 'react-hook-form';
import { emit } from '../../utils/EventEmitter';
import { Dropdown } from 'primereact/dropdown';
import { TeamServices } from '../../services/TeamServices';
import { MultiSelect } from 'primereact/multiselect';
import { ProjectService } from '../../services/ProjectServices';
import { LayoutContext } from '../../layout/context/layoutcontext';
import Link from 'next/link';
import { TreeSelect } from 'primereact/treeselect';

const CreateTask = ({ sprintKey, parentKey, parentName }) => {

    const { setContentDialog, showToast } = useContext(LayoutContext);

    const [projectHandler, setProjectHandler] = useState([])
    const [workspace, setWorkspace] = useState([])

    const [pertInput, setPertInput] = useState({
        fastest_time: 0,
        normal_time: 0,
        slowest_time: 0,
    });

    const handleInputChange = (name, value) => {
        setPertInput((prevTimes) => ({ ...prevTimes, [name]: value }));
    };

    const Pertsum = (pertInput.fastest_time + (4 * pertInput.normal_time) + pertInput.slowest_time) / 6;


    useEffect(() => {
        const projectService = new ProjectService();
        projectService.getprojectHandler(sessionStorage.getItem('project_key')).then((res) => { setWorkspace(res.workspace); setProjectHandler(res.editedData) })
    }, [])

    const defaultValues = {
        task_name: '',
        level: { level: 0, label: 'low' },
        assigne: [],
        reporter: [],
        fastest_time: '',
        normal_time: '',
        slowest_time: '',
    };
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues });

    const onSubmit = (data) => {

        const selectedAssigneId = Object.keys(selectedAssigneKeys);
        const selectedReporterId = Object.keys(selectedReporterKeys);
        // const selectedTeam = teamList.filter(team => selectedMemberId.includes(team.key));
        const selectedAssigne = workspace.workspace_members.filter((user) => selectedAssigneId.includes(user.user_key))
        const selecteReporter = workspace.workspace_members.filter((user) => selectedReporterId.includes(user.user_key))
        data.project_key = sessionStorage.getItem('project_key');
        data.sprint_key = sprintKey;
        data.assigne = selectedAssigne;
        data.reporter = selecteReporter;
        data.parent_key = parentKey;
        let notifAction = 'created a task';
        let parentData = 'none';
        if (parentKey != null) {
            notifAction = 'Created a child for Task ' + parentName
            parentData = parentKey;
        }
        data.activity = {
            action: notifAction,
            old_value: parentKey,
            new_value: '',
            type: 'history',
            task_key: parentData,
            url: window.location.href,
            additional_text: ''
        }
        const projectService = new ProjectService();
        projectService.createTask(data)
            .then((res) => {
                let summaryNotif = '';
                let detailNotif = '';
                let severity = '';
                if (res.success) {
                    severity = 'success';
                    summaryNotif = 'Task created';
                    detailNotif = '';
                } else {
                    severity = 'error';
                    summaryNotif = 'create task fail';
                    detailNotif = 'error: ' + res.error;
                }
                setContentDialog(false);
                showToast({
                    severity: severity,
                    summary: summaryNotif,
                    detail: detailNotif,
                    sticky: false
                });
                emit('refreshBacklog');
                emit('refreshTaskDialog');
                emit('refreshActivity');
                emit('refreshTaskDetail');
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

    const taskLevel = [
        { level: 0, label: 'low' },
        { level: 1, label: 'medium' },
        { level: 2, label: 'high' },
    ];
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
                                        onChange={(e) => field.onChange(e.value)}
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
                <Button style={{ float: "right" }} className='mx-2' label="Add Task" />
            </div>
        </form>
    </>
    );
};

export default CreateTask;
