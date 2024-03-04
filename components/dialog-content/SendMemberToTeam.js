import React, { useRef, useState, useEffect, useContext } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

import { Controller, useForm } from 'react-hook-form';
import { WorkspaceServices } from '../../services/WorkspaceServices';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { emit } from '../../utils/EventEmitter';
import { TeamServices } from '../../services/TeamServices';
const SendMemberToTeam = ({ member_key }) => {
    const { setContentDialog, showToast } = useContext(LayoutContext);
    const defaultValues = {
        team: {},
    };
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        data.team = selectedTeam;
        data.member_key = member_key.member_key;
        data.activity = {
            action: `change ${member_key.user.username} team to ${selectedTeam.team_name} team`,
            object_one: '',
            object_two: '',
            type: 'team',
            related_code: selectedTeam.team_key,
            url: window.location.href,
            additional_text: ''
        }
        const workspaceServices = new WorkspaceServices();
        workspaceServices.addMemberToTeam(data).then((res) => {
            let summaryNotif = '';
            let detailNotif = '';
            let severity = '';
            if (res.success) {
                severity = 'success';
                summaryNotif = 'User Added to Team';
                detailNotif = 'User successfully Added to Team';
            } else {
                severity = 'error';
                summaryNotif = 'process failed';
                detailNotif = 'error: ' + res.error;
            }
            setContentDialog(false);
            showToast({
                severity: severity,
                summary: summaryNotif,
                detail: detailNotif,
                sticky: false
            });
            emit('refreshMemberList');
        });
    };
    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
    };

    const [selectedTeam, setSelectedTeam] = useState([]);

    const [teamList, setTeamList] = useState([]);
    useEffect(() => {
        const teamServices = new TeamServices();
        teamServices.getTeams().then((res) => { setTeamList(res) });
    }, [])

    const multiselectRef = useRef(null);
    return (<>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='grid'>

                <div className="col-12">
                    <div className="card border-none p-fluid">
                        <div className="field">

                            <Controller
                                name='team'
                                control={control}
                                rules={{ required: 'Team is required.' }}
                                render={({ field }) => (
                                    <>
                                        <Dropdown {...field}
                                            ref={multiselectRef}
                                            value={selectedTeam}
                                            onChange={(e) => setSelectedTeam(e.value)}
                                            options={teamList}
                                            optionLabel="team_name"
                                            filter
                                            placeholder="Select Team"
                                            showClear
                                            maxSelectedLabels={3}
                                            className=""
                                            style={{ marginTop: "-0.5em" }} />
                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}
                            />
                        </div>

                    </div>

                </div>
                <div className='mt-3 col-12'>
                    <Button style={{ float: "right" }} className='mx-2' label="Save" />
                </div>
            </div>
        </form>
    </>
    );
};

export default SendMemberToTeam;
