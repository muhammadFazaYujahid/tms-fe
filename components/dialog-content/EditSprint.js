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
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';

const EditSprint = ({ sprint }) => {

    const { setContentDialog, showToast } = useContext(LayoutContext);

    const defaultValues = {
        sprint_name: sprint.sprint_name,
        start_date: sprint.end_date,
        end_date: sprint.end_date,
        sprint_goal: sprint.sprint_goal,
    };
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        data.sprint_key = sprint.sprint_key;
        const projectService = new ProjectService();
        projectService.editSprint(data)
            .then((res) => {
                let summaryNotif = '';
                let detailNotif = '';
                let severity = '';
                if (res.success) {
                    severity = 'success';
                    summaryNotif = 'success';
                    detailNotif = 'Sprint Has been edited';
                } else {
                    severity = 'error';
                    summaryNotif = 'edit sprint fail';
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
            });
        // data.preventDefault();
    };

    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
    };
    return (<>
        <form onSubmit={handleSubmit(onSubmit)}>

            <table className='w-full p-2 mt-3' style={{ borderCollapse: "separate", borderSpacing: "0 15px" }}>
                <tr className=''>
                    <td className='float-top' style={{ verticalAlign: "top" }}>
                        <p className='font-medium text-dark'>Sprint name</p>
                    </td>
                    <td className=''>
                        <Controller
                            name='sprint_name'
                            control={control}
                            render={({ field }) => (
                                <>
                                    <InputText {...field} defaultValue={sprint.sprint_name} type="text" className='w-full' />
                                </>
                            )}
                        />
                    </td>
                </tr>
                <tr className=''>
                    <td className='float-top' style={{ verticalAlign: "top" }}>
                        <p className='font-medium text-dark'>Start Date</p>
                        {(sprint.start_date !== '01/01/1970') ? <p className='font-medium text-dark'>{sprint.start_date}</p> : <></>}
                    </td>
                    <td className=''>
                        <Controller
                            name='start_date'
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Calendar
                                        inputId={field.name}
                                        value={field.value}
                                        onChange={field.onChange}
                                        dateFormat="dd/mm/yyyy"
                                    />
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}
                        />
                    </td>
                </tr>
                <tr className=''>
                    <td className='float-top' style={{ verticalAlign: "top" }}>
                        <p className='font-medium text-dark'>End Date</p>
                        {(sprint.end_date != '01/01/1970') ? <p className='font-medium text-dark'>{sprint.end_date}</p> : <></>}
                    </td>
                    <td className=''>
                        <Controller
                            name='end_date'
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Calendar
                                        inputId={field.name}
                                        value={field.value}
                                        onChange={field.onChange}
                                        dateFormat="dd/mm/yyyy"
                                    />
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}
                        />
                    </td>
                </tr>
                <tr className=''>
                    <td className='float-top' style={{ verticalAlign: "top" }}>
                        <p className='font-medium text-dark'>Sprint Goals</p>
                    </td>
                    <td className=''>
                        <Controller
                            name='sprint_goal'
                            control={control}
                            render={({ field }) => (
                                <>
                                    <InputTextarea
                                        id={field.name}
                                        {...field}
                                        rows={4}
                                        cols={30}
                                    />
                                </>
                            )}
                        />
                    </td>
                </tr>
            </table>
            <div className='col-12'>
                <Button style={{ float: "right" }} className='mx-2' label="Edit Sprint" />
            </div>
        </form>
    </>
    );
};

export default EditSprint;
