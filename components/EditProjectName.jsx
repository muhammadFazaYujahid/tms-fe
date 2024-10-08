import { Button } from 'primereact/button';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Controller, useForm } from 'react-hook-form';
import { LayoutContext } from '../layout/context/layoutcontext';
import { emit } from '../utils/EventEmitter';
import ProjectBloc from '../services/Blocs/projectBloc';
import apiResponse from '../services/apiResponse';

const EditProjectName = ({ project }) => {
    const { showToast } = useContext(LayoutContext);
    const [projectData] = useState(project);

    const projectBloc = new ProjectBloc();
    const defaultValues = {
        project_key: projectData.project_key,
        project_name: projectData.project_name
    };

    useEffect(() => {
        const editName = projectBloc.editProjectName.subscribe((result) => {
            switch (result.status) {
                case apiResponse.COMPLETED:
                    emit('refreshProject');
                    showToast({
                        severity: 'success',
                        summary: 'success',
                        detail: 'Project Name Updated',
                        sticky: false
                    });
                    break
                case apiResponse.ERROR:
                    console.error('error', result.data)
                    showToast({
                        severity: 'error',
                        summary: 'edit failed',
                        detail: result.data,
                        sticky: false
                    });
                    break
                default:
                    break
            }
        })
    
      return () => {
        editName.unsubscribe();
      }
    }, [projectBloc])
    
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        data.activity = {
            action: 'Change Project Name',
            object_one: projectData.project_name,
            object_two: data.project_name,
            type: 'project',
            related_code: projectData.project_key,
            url: window.location.href,
            additional_text: ''
        }
        projectBloc.fetchEditProjectName(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h5>Change Project Name</h5>
            <div className='col-12'>

                <Controller
                    name='project_name'
                    control={control}
                    render={({ field }) => (
                        <>
                            <InputText {...field} className='w-full' type="text" />
                        </>
                    )}
                />
            </div>

            <div className='col-12' style={{ float: "right" }}>
                <Button className='mx-2' label="Save" style={{ float: "right" }} />
            </div>
        </form>);
};

export default EditProjectName;
