import React, { useRef, useContext } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

import { Controller, useForm } from 'react-hook-form';
import { emit } from '../../utils/EventEmitter';

import { WorkspaceServices } from '../../services/WorkspaceServices';
import { LayoutContext } from '../../layout/context/layoutcontext';
import Link from 'next/link';
import { useRouter } from 'next/router';


const CreateWorkspaceDialog = () => {
    const router = useRouter();

    const { setModalDialog, showToast } = useContext(LayoutContext);

    const defaultValues = {
        workspace_name: '',
    };
    const {
        control,
        handleSubmit,
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        data.activity = {
            action: 'create workspace ',
            object_one: data.workspace_name,
            object_two: '',
            type: 'organization',
            related_code: sessionStorage.getItem('org_key'),
            url: window.location.href,
            additional_text: ''
        }
        const workspaceServices = new WorkspaceServices();
        workspaceServices.createWorkspace(data).then(() => {
            setModalDialog(false);
            // router.reload();
            emit('refreshOrgPage');
            showToast({
                severity: 'success',
                summary: 'success',
                detail: 'workspace created',
                sticky: false
            });
        });
        // data.preventDefault();
    };

    return (<>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='grid'>
                <div className="col-12">
                    <div className="card border-none p-fluid">
                        <div className="field">
                            <Controller
                                name='workspace_name'
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <InputText {...field} placeholder='Workspace Name' type="text" />
                                    </>
                                )}
                            />
                        </div>

                    </div>

                </div>
                <div className='col-12'>
                    <Button style={{ float: "right" }} type='submit' className='mx-2' label="Create Workspace" />
                </div>
            </div>
        </form>
    </>
    );
};

export default CreateWorkspaceDialog;
