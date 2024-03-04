import React, { useState, useRef } from 'react';
// import socketIo from '../../utils/Socket';
export const LayoutContext = React.createContext();

export const LayoutProvider = (props) => {
    const [layoutConfig, setLayoutConfig] = useState({
        ripple: false,
        inputStyle: 'outlined',
        menuMode: 'static',
        colorScheme: 'light',
        theme: 'tailwind-light',
        scale: 14
    });

    const [layoutState, setLayoutState] = useState({
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        profileSidebarVisible: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false
    });

    const [modalDialog, setModalDialog] = useState(false);
    const [contentDialog, setContentDialog] = useState(false);

    const [showSidebar, setShowSidebar] = useState(true);

    const [addIssueDialog, setAddIssueDialog] = useState(false)
    const [newnotification, setNewNotification] = useState(false)

    // const [socket, setSocket] = useState(socketIo);

    const onMenuToggle = () => {
        if (isOverlay()) {
            setLayoutState((prevLayoutState) => ({ ...prevLayoutState, overlayMenuActive: !prevLayoutState.overlayMenuActive }));
        }

        if (isDesktop()) {
            setLayoutState((prevLayoutState) => ({ ...prevLayoutState, staticMenuDesktopInactive: !prevLayoutState.staticMenuDesktopInactive }));
        } else {
            setLayoutState((prevLayoutState) => ({ ...prevLayoutState, staticMenuMobileActive: !prevLayoutState.staticMenuMobileActive }));
        }
    };

    const showProfileSidebar = () => {
        setLayoutState((prevLayoutState) => ({ ...prevLayoutState, profileSidebarVisible: !prevLayoutState.profileSidebarVisible }));
    };

    const isOverlay = () => {
        return layoutConfig.menuMode === 'overlay';
    };

    const isDesktop = () => {
        return window.innerWidth > 991;
    };
    //toast

    const toast = useRef(null);
    const showToast = ({ severity, summary, detail, sticky }) => {
        toast.current.show({ severity: severity, summary: summary, detail: detail, sticky: sticky });
    };

    const [orgKeyLink, setOrgKeyLink] = useState('')
    const [projectKeyLink, setProjectKeyLink] = useState('')
    const [avaiableOrgData, setAvaiableOrgData] = useState([]);

    const value = {
        layoutConfig,
        setLayoutConfig,
        layoutState,
        setLayoutState,
        onMenuToggle,
        showProfileSidebar,
        modalDialog,
        setModalDialog,
        contentDialog,
        setContentDialog,
        showSidebar,
        addIssueDialog,
        setAddIssueDialog,
        setShowSidebar,
        showToast,
        toast,
        newnotification,
        setNewNotification,
        orgKeyLink,
        setOrgKeyLink,
        projectKeyLink,
        setProjectKeyLink,
        avaiableOrgData,
        setAvaiableOrgData
    };

    return <LayoutContext.Provider value={value}>{props.children}</LayoutContext.Provider>;
};
