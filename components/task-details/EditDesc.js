import React, { useContext, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { Button } from 'primereact/button';
import { Editor } from "primereact/editor";
import { Tooltip } from 'primereact/tooltip';
import { Card } from 'primereact/card';
import { TaskServices } from '../../services/TaskServices';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { emit, on } from '../../utils/EventEmitter';
import { ScrollPanel } from 'primereact/scrollpanel';

const EditDesc = ({ taskData }) => {

    const { showToast } = useContext(LayoutContext);

    const [editable, setEditable] = useState(false);
    const [taskDetail, settaskDetail] = useState([]);

    const defaultValues = {
        description: ''
    };
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues });

    useEffect(() => {
        settaskDetail(taskData);

        on('taskOpened', () => {
            settaskDetail(taskData);

        })
    }, [taskDetail])


    const onSubmit = (data) => {
        data.task_key = taskDetail.task_key;
        data.activity = {
            action: `Edit Task ${taskDetail.task_name} Description`,
            old_value: '',
            new_value: '',
            type: 'history',
            task_key: taskDetail.task_key,
            url: window.location.href,
            additional_text: ''
        }
        taskDetail.description = data.description;
        const taskService = new TaskServices();
        taskService.editDesc(data).then((res) => {
            let severity = '',
                summary = '',
                detail = '',
                sticky = ''
            if (!res.success) {
                return showToast({
                    severity: 'error',
                    summary: 'Edit Task Failed',
                    detail: res.message,
                    sticky: false
                });
            } else {
                showToast({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Edit Description Success',
                    sticky: false
                });
            }
            emit('refreshBacklog');
            emit('refreshActivity');
            setEditable(false);
        })
    };
    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
    };

    const renderHeader = () => {
        return (<>
            <span className="ql-formats">
                <select className="ql-size" defaultValue="medium">
                    <option value="small">Size 1</option>
                    <option value="medium">Size 2</option>
                    <option value="large">Size 3</option>
                </select>
                <select className="ql-header" defaultValue="3">
                    <option value="1">Heading</option>
                    <option value="2">Subheading</option>
                    <option value="3">Normal</option>
                </select>
            </span>
            <span className="ql-formats">
                <button className="ql-bold" aria-label="Bold"></button>
                <button className="ql-italic" aria-label="Italic"></button>
                <button className="ql-underline" aria-label="Underline"></button>
            </span>

            <span className="ql-formats">
                <button className="ql-list" value="ordered" />
                <button className="ql-list" value="bullet" />
                <button className="ql-indent" value="-1" />
                <button className="ql-indent" value="+1" />
            </span>
        </>
        );
    };

    const header = renderHeader();
    return (<>
        <Tooltip target=".desc" />
        <h5 className='text-xl desc w-fit'
            data-pr-tooltip="Double click Textarea Bellow to edit"
            data-pr-mouseTrack={true}
            data-pr-mouseTrackTop="15"
            data-pr-position="right"
            data-pr-showDelay="100"
            data-pr-at="right+5 top"
            data-pr-my="left center-2">Description</h5>

        <ScrollPanel style={{ height: "17em" }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                {(!editable) ? <>

                    <div className="card mx-1" style={{ borderRadius: "10px", minHeight: "17em" }} onDoubleClick={() => { setEditable(true) }}>
                        <div className='m-0' dangerouslySetInnerHTML={{ __html: taskDetail.description }}></div>
                    </div>

                </> : <>
                    <Controller
                        name="description"
                        control={control}
                        rules={{ required: 'Content is required.' }}
                        render={({ field }) =>
                            <Editor id={field.name} headerTemplate={header} value={taskDetail.description} onTextChange={(e) => field.onChange(e.htmlValue)} className='' style={{ height: '120px' }} />
                        }
                    />
                    {getFormErrorMessage('blog')}
                    <div className=''>
                        <Button type='submit' className='mx-2 p-button-sm' label="Save" />
                        <Button type='button' className='mx-2 p-button-secondary p-button-sm p-button-outlined' label="Cancel" onClick={() => setEditable(false)} />
                    </div>

                </>}
            </form>
        </ScrollPanel>

    </>
    );
};

export default EditDesc;
