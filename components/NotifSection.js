import Link from 'next/link';
import { Divider } from 'primereact/divider';
import getConfig from 'next/config';
import React, { useRef, useState, useEffect, useContext } from 'react';
import { UserServices } from '../services/UserServices';
import { on } from '../utils/EventEmitter';
import { ScrollPanel } from 'primereact/scrollpanel';
import socket from '../utils/Socket';

const NotifSection = () => {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const [notif, setNotif] = useState([])

    useEffect(() => {

        const userServices = new UserServices;
        userServices.getNotif().then((res) => setNotif(res.data));

        on('getNewNotification', () => {
            userServices.getNotif().then((res) => setNotif(res.data));

        });

        return () => {

        }
    }, [])


    if (notif == null || notif == '' || notif.length == 0) {
        return <div className='w-20rem'>no data...</div>
    }

    return (
        <div className='w-20rem'>
            <span className='font-medium text-dark'>Notifications</span>

            <Divider></Divider>
            <ScrollPanel style={{ height: "20rem" }}>
                {notif.map((data) => (
                    <div className='p-0' key={data.id}>
                        <Link href={data.url}>
                            <div className='w-96 hover:bg-gray-200 active:text-gray-100 active:bg-gray-400 p-2' style={{ cursor: "pointer", borderRadius: "5px" }}>
                                <p className='text-lg mt-1'><span className='font-semibold'>{data.user.username}</span> {data.action} {(data.new_value !== null) ? <>
                                    {(data.new_value != '') ? <>
                                        from <span className='font-semibold'>{data.old_value}</span> to <span className='font-semibold'>{data.new_value}</span>
                                    </> : <></>}
                                </> : <> {data.old_value}</>}</p>
                                <p className='text-lg mt-1 text-gray-600'>{data.additional_text}</p>
                            </div>

                        </Link>

                        <Divider></Divider>
                    </div>
                ))}

            </ScrollPanel>
        </div>);
};

export default NotifSection;
