import getConfig from 'next/config';
import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { LayoutContext } from './context/layoutcontext';

import { AuthServices } from '../services/AuthServices';

import { Menubar } from 'primereact/menubar';
import { Toast } from 'primereact/toast';
import ModalDialog from '../components/ModalDIalog';
import CreateProjectDialog from '../components/dialog-content/CreateProjectDialog';
import CreateWorkspaceDialog from '../components/dialog-content/CreateWorkspaceDialog';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Badge } from 'primereact/badge';
import NotifSection from '../components/NotifSection';
import InviteOrgDialog from '../components/dialog-content/InviteOrgDialog';
import { useRouter } from 'next/router';

const AppTopbar = forwardRef((props, ref) => {
    const router = useRouter();
    const { layoutState, onMenuToggle, setModalDialog, showSidebar, toast, newnotification, setNewNotification, orgKeyLink } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const [dialogType, setDialogType] = useState(null);
    const [dialogHeader, setDialogHeader] = useState(null);
    const [orgKey, setOrgKey] = useState()

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    useEffect(() => {
        // setOrgKey(Cookies.get('org_key'));
        setOrgKey(sessionStorage.getItem('org_key'));
    }, [])


    const logout = () => {
        const authServices = new AuthServices();
        authServices.logout();
    }

    // const menuItems = 

    const profilenotif = [
        {
            icon: <i className="pi pi-user text-lg rounded-full"></i>,
            items: [
                {
                    label: 'Account Setting',
                    icon: 'pi pi-cog',
                    url: '/profile',
                    // command: () => { setModalDialog(true); setDialogType('invite-people') },
                },
                {
                    label: 'Logout',
                    icon: 'pi pi-sign-out',
                    command: () => { logout() },
                },
            ]
        },
    ];

    const menuItems = [
        {
            label: 'Dashboard',
            url: '/' + orgKey,
        },
        {
            label: 'Projects',
            items: [
                {
                    label: 'create project',
                    command: () => { setModalDialog(true); setDialogType(<CreateProjectDialog />); setDialogHeader('Create Project') },
                },
            ]
        },
        {
            label: 'Organization',
            items: [
                {
                    label: 'Invite People',
                    icon: 'pi pi-fw pi-plus',
                    command: () => { setModalDialog(true); setDialogType(<InviteOrgDialog />); setDialogHeader('Invite People') },
                },
                {
                    label: 'create Workspace',
                    icon: 'pi pi-briefcase',
                    command: () => { setModalDialog(true); setDialogType(<CreateWorkspaceDialog />); setDialogHeader('Create Workspace') },
                }
            ]
        },
    ];
    const watchOp = useRef(null);

    const toggleWathed = (event) => {
        watchOp.current.toggle(event);
        setNewNotification(false);
    };

    return (
        <div className="layout-topbar">
            <Link href={"/" + orgKeyLink}>
                <a className="layout-topbar-logo" style={{ justifyContent: "center" }}>
                    <>
                        <img src={`${contextPath}/layout/images/logo-milennia.png`} width="100px" height={'35px'} widt={'true'} alt="logo" />
                    </>
                </a>
            </Link>
            {showSidebar == true ? (

                <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                    <i className="pi pi-bars" />
                </button>
            ) : (<></>)}



            <div className="layout-topbar-menu">
                <Menubar model={menuItems} className='bg-transparent border-none' />
                <ModalDialog dialogType={dialogType} dialogHeader={dialogHeader} />

            </div>
            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <button type="button" onClick={toggleWathed} style={{ height: 'fit-content', width: 'fit-content' }} className={(!newnotification) ? "p-2 p-link layout-topbar-button mt-3" : "p-2 p-link layout-topbar-button mt-3 bg-red-500 text-white"}>
                    <i className="pi pi-bell text-lg mt-1">
                        <Badge value="2"></Badge>
                    </i>
                </button>
                <OverlayPanel className='p-0' ref={watchOp} appendTo={typeof window !== 'undefined' ? document.body : null}>
                    <NotifSection />
                </OverlayPanel>
                {/* <button type="button" className="p-link layout-topbar-button">
                    <i className=""></i>
                    <span>Profile</span>
                </button> */}
                <Menubar model={profilenotif} className='p-menubar-custom bg-transparent border-none p-menuitem-link-custom mt-1' />

            </div>

            <Toast ref={toast} style={{ zIndex: "9090" }} />
        </div>
    );
});

export default AppTopbar;
