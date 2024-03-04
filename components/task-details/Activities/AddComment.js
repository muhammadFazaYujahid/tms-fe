import React, { useContext, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { Button } from 'primereact/button';
import { Editor } from "primereact/editor";
import { Tooltip } from 'primereact/tooltip';
import { Card } from 'primereact/card';
import { ScrollPanel } from 'primereact/scrollpanel';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { emit } from '../../../utils/EventEmitter';
import { TaskServices } from '../../../services/TaskServices';

const AddComment = ({ taskData }) => {

    const { showToast } = useContext(LayoutContext);

    const [editable, setEditable] = useState(false);
    const [taskDetail, settaskDetail] = useState(taskData);

    const defaultValues = {
        task_key: taskDetail.task_key,
        comment: ''
    };
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues });


    const onSubmit = (data) => {
        const taskService = new TaskServices();
        taskService.addComment(data).then((res) => {

            if (!res.success) {
                return showToast({
                    severity: 'error',
                    summary: 'comment Failed',
                    detail: res.message,
                    sticky: false
                });
            }
            emit('refreshActivity');
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

        <ScrollPanel style={{ height: "17em" }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="comment"
                    control={control}
                    rules={{ required: 'Content is required.' }}
                    render={({ field }) =>
                        <Editor id={field.name} headerTemplate={header} value={''} onTextChange={(e) => field.onChange(e.htmlValue)} className='' style={{ height: '120px' }} />
                    }
                />
                {getFormErrorMessage('blog')}
                <div className=''>
                    <Button type='submit' className='mx-2 p-button-sm' label="Save" />
                    <Button type='button' className='mx-2 p-button-secondary p-button-sm p-button-outlined' label="Cancel" onClick={() => emit('cancelAddComment')} />
                </div>
            </form>
        </ScrollPanel>

    </>
    );
};

export default AddComment;
