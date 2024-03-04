import React, { useRef, useState, useEffect, useContext } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';

import { Controller, useForm } from 'react-hook-form';
import { OrgServices } from '../../services/OrgServices';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { emit } from '../../utils/EventEmitter';


import { FilePond, registerPlugin } from 'react-filepond';
// import 'filepond/dist/filepond.min.css';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

import { UserServices } from '../../services/UserServices';
import getConfig from 'next/config';

// Register the plugins
registerPlugin(FilePondPluginImagePreview)

const contextPath = getConfig().publicRuntimeConfig.contextPath;


const EditProfile = ({ profileData }) => {
    const { setContentDialog, showToast } = useContext(LayoutContext);

    const [uploadedFile, setUploadedFile] = useState([])
    const [tempAvatar, setTempAvatar] = useState(profileData.photo)

    const defaultValues = {
        user_key: profileData.user_key,
        username: profileData.username,
        oldPhoto: profileData.photo,
        avatar: '',
    };
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues });

    const onSubmit = (data) => {

        data.user_key = profileData.user_key;
        data.avatar = uploadedFile;

        const userServices = new UserServices;
        userServices.editProfile(data)
            .then((res) => {
                let summaryNotif = '';
                let detailNotif = '';
                let severity = '';
                if (res.success) {
                    severity = 'success';
                    summaryNotif = 'success';
                    detailNotif = res.message;
                } else {
                    severity = 'error';
                    summaryNotif = res.message;
                    detailNotif = 'error: ' + res.error;
                }
                setContentDialog(false);
                showToast({
                    severity: severity,
                    summary: summaryNotif,
                    detail: detailNotif,
                    sticky: false
                });
                emit('refreshProfile');
            });
    };
    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
    };

    return (<>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <div className='grid'>

                <div className="col-12">
                    <div className="card border-none p-fluid">

                        <table className='w-full p-2 mt-3' style={{ borderCollapse: "separate", borderSpacing: "0 15px" }}>
                            <tr className=''>
                                <td className='float-top' style={{ verticalAlign: "top" }}>
                                    <p className='font-medium text-dark'>Username</p>
                                </td>
                                <td className=''>
                                    <Controller
                                        name='username'
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
                                    <p className='font-medium text-dark'>Photo</p>
                                </td>
                                <td className='text-center'>
                                    {/* <Image src={`${contextPath}/demo/images/avatar/${tempAvatar}`} className='text-center' alt="Image" width="150" /> */}
                                    <Controller
                                        name="avatar"
                                        control={control}
                                        render={({ field }) => (
                                            <FilePond
                                                {...field}
                                                acceptedFileTypes={['image/*']}
                                                labelIdle="Drag & Drop your Photo or Browse"
                                                allowMultiple={false}
                                                onupdatefiles={fileItems => {
                                                    // Set currently active file objects to this.state

                                                    setUploadedFile(fileItems.map(fileItem => fileItem.file))
                                                }}
                                            />
                                        )}
                                    />
                                </td>
                            </tr>
                        </table>

                    </div>

                </div>
                <div className='mt-3 col-12'>
                    <Button style={{ float: "right" }} className='mx-2' label="Edit" />
                </div>
            </div>
        </form>
    </>
    );
};

export default EditProfile;
