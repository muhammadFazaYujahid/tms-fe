import getConfig from 'next/config';
import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';

const AppMenu = () => {
    const { layoutConfig, orgKeyLink, projectKeyLink } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    // if (Cookies.get('logged_in')) {
    //     '' = '/' + sessionStorage.getItem('org_key') + '/' + sessionStorage.getItem('project_key');
    // }
    const model = [
        {
            label: 'Projects',
            items: [
                { label: 'Roadmap', icon: 'pi pi-fw pi-server', to: '/' + orgKeyLink + '/' + projectKeyLink + '/roadmap' },
                { label: 'Backlog', icon: 'pi pi-fw pi-table', to: '/' + orgKeyLink + '/' + projectKeyLink + '/backlog' },
                { label: 'Board', icon: 'pi pi-fw pi-clone', to: '/' + orgKeyLink + '/' + projectKeyLink + '/board' },
            ]
        },
        {
            label: 'Settings',
            items: [
                { label: 'Project Detail', icon: 'pi pi-fw pi-cog', to: '/' + orgKeyLink + '/' + projectKeyLink + '/detail' },
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
                {/* 
                <Link href="https://www.primefaces.org/primeblocks-react">
                    <a target="_blank" style={{ cursor: 'pointer' }}>
                        <img alt="Prime Blocks" className="w-full mt-3" src={`${contextPath}/layout/images/banner-primeblocks${layoutConfig.colorScheme === 'light' ? '' : '-dark'}.png`} />
                    </a>
                </Link> */}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
