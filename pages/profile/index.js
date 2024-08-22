import React, { useState, useEffect, useContext } from 'react';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';

import getConfig from 'next/config';

import { LayoutContext } from '../../layout/context/layoutcontext';
import { Divider } from 'primereact/divider';
import Link from 'next/link';
import { ScrollPanel } from 'primereact/scrollpanel';
import { UserServices } from '../../services/UserServices';
import { Dialog } from 'primereact/dialog';

import EditProfile from '../../components/dialog-content/EditProfile';
import { on } from '../../utils/EventEmitter';
import { io } from 'socket.io-client';

const socket = io(process.env.SERVER_URL, {
    withCredentials: true,
    extraHeaders: {
        'Content-Type': 'application/json',
        'Control-Allow-Credentials': 'true'
    }
});

const Member = () => {

    const { setShowSidebar, contentDialog, setContentDialog, showToast } = useContext(LayoutContext);

    const [profile, setProfile] = useState('')

    const [dialogType, setDialogType] = useState(null);
    const [dialogHeader, setDialogHeader] = useState(null);
    const [editProfileDialog, setEditProfileDialog] = useState(false);

    const maskStyles = {
        backgroundColor: 'rgb(0 0 0 / 50%)',
    };

    useEffect(() => {
        setShowSidebar(false);

        const userServices = new UserServices;
        userServices.me().then((res) => { setProfile(res.data) });

        on('refreshProfile', () => {
            userServices.me().then((res) => { setProfile(res.data) });
        })

        socket.on('get-profile', (message) => {
            // setNotifications((prevNotifications) => [...prevNotifications, message]);
        });

        return () => {
            setShowSidebar(true);
        }
    }, [])

    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const orgsection = () => {
        if (profile && profile.orgData) {
            return profile.orgData.map((data) => (
                <Link href="" key={data.org_key}>
                    <div className="flex">
                        <span className="text-lg mt-1">
                            {data.org_name}
                        </span>
                    </div>
                </Link>
            ));
        } else {
            return null; // Render nothing if profile or orgData is undefined
        }
    };


    const showEditProfileDialog = (profile) => {
        setContentDialog(true);
        setDialogType(<EditProfile profileData={profile} />);
        setDialogHeader("Edit Profile");
    }

    return (<>
        <div className="grid">
            <div className='col-12'>
                <div className='grid'>
                    <div className='col'></div>
                    {console.log('progile', profile)}
                    <div className='col-12 lg:col-8 m-0' style={{ position: "", background: "url('https://primefaces.org/cdn/primereact/images/galleria/galleria12.jpg')", height: "25vh" }}>
                        <Avatar image={profile.photoUrl} className='img-profile' shape="circle" />
                    </div>
                    <div className='col'></div>

                </div>
            </div>
            <div className='col-12 mt-4'>
                <div className='grid'>
                    <div className='col'></div>
                    <div className='col-12 lg:col-6 m-0'>

                        <div className="card bg-transparent border-none">
                            <h5>About you</h5>
                            {/* <div className='col-12' style={{ marginLeft: "-0.4em" }}>
                                <div className="grid">
                                    <div className='col-12'>
                                        <Button label="Manage Your Account" style={{ padding: "0.5em 1em 0.5em 1em" }} className="p-button-secondary p-button-outlined ml-2 btn btn-sm w-full" />

                                    </div>

                                </div>
                            </div> */}
                            <div className='col-12 task-card'>
                                <div className="grid">

                                    <div className='col-12'>

                                        <span className='font-small text-500'>Username</span>

                                        <div className=''>
                                            <Link href="">
                                                <div className='flex'>
                                                    <span className='text-lg mt-1'>
                                                        {profile.username}
                                                    </span>
                                                </div>

                                            </Link>
                                        </div>

                                    </div>

                                    <div className='col-12'>

                                        <span className='font-small text-500'>Organization</span>

                                        <div className=''>
                                            {orgsection()}
                                        </div>

                                    </div>

                                    <div className='col-12'>
                                        <Button style={{ float: "right" }} onClick={() => showEditProfileDialog(profile)} className='mx-2 p-button-sm' label="Edit Profile" />
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="card bg-transparent border-none">
                            <h5>Contact</h5>
                            {/* <div className='col-12' style={{ marginLeft: "-0.4em" }}>
                                <div className="grid">
                                    <div className='col-12'>
                                        <Button label="Manage Your Account" style={{ padding: "0.5em 1em 0.5em 1em" }} className="p-button-secondary p-button-outlined ml-2 btn btn-sm w-full" />

                                    </div>

                                </div>
                            </div> */}
                            <div className='col-12 task-card'>
                                <div className="grid">


                                    <div className='col-12'>

                                        <span className='font-small text-500'>Email</span>

                                        <div className=''>
                                            <Link href="">
                                                <div className='flex'>
                                                    <span className='text-lg mt-1'>
                                                        {profile.email}
                                                    </span>
                                                </div>

                                            </Link>
                                        </div>

                                    </div>


                                    {/* <div className='col-12'>
                                        <Button style={{ float: "right" }} className='mx-2 p-button-sm' label="Change Email" />
                                        <Button style={{ float: "right" }} className='mx-2 p-button-sm p-button-warning' label="Change Password" />
                                    </div> */}

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col'></div>

                    <Dialog header={dialogHeader} maskStyle={maskStyles} visible={contentDialog} className='p-dialog' style={{ width: '30vw', backgroundColor: "#fff" }} modal onHide={() => setContentDialog(false)}>
                        {dialogType}
                    </Dialog>
                </div>
            </div>

        </div >
    </>
    );
};

export default Member;
