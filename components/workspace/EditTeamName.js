import { Button } from 'primereact/button';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Controller, useForm } from 'react-hook-form';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { TeamServices } from '../../services/TeamServices';
import { emit } from '../../utils/EventEmitter';

const EditTeamName = ({ team }) => {
    const { showToast } = useContext(LayoutContext);
    const [teamData, setTeamData] = useState(team);
    const defaultValues = {
        team_key: teamData.team_key,
        team_name: teamData.team_name
    };
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        data.activity = {
            action: 'Change Team Name',
            object_one: team.team_name,
            object_two: data.team_name,
            type: 'team',
            related_code: teamData.team_key,
            url: window.location.href,
            additional_text: ''
        }
        const teamServices = new TeamServices;
        teamServices.editName(data)
            .then((res) => {
                if (!res.success) {
                    return showToast({
                        severity: 'error',
                        summary: 'edit failed',
                        detail: res.message,
                        sticky: false
                    });
                }
                emit('refreshTeam');
                showToast({
                    severity: 'success',
                    summary: 'success',
                    detail: 'Team Name Updated',
                    sticky: false
                });
                // if (data.success) {
                // }
            });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h5>Change Team Name</h5>
            <div className='col-12'>

                <Controller
                    name='team_name'
                    control={control}
                    render={({ field }) => (
                        <>
                            <InputText id="link_text" {...field} className='w-full' type="text" />
                        </>
                    )}
                />
            </div>

            <div className='col-12' style={{ float: "right" }}>
                <Button className='mx-2' label="Save" style={{ float: "right" }} />
            </div>
        </form>);
};

export default EditTeamName;
