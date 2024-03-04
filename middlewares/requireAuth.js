import { useEffect, useState, useContext } from "react";
import Router from "next/router";
import Cookies from 'js-cookie';
import { MiddlewareServices } from "../services/MiddlewareServices";
import { useRouter } from "next/router";
import { LayoutContext } from "../layout/context/layoutcontext";

export const requireAuth = (WrappedComponent) => {
    const authComponent = (props) => {
        useEffect(() => {

            const logged_in = Cookies.get('logged_in');
            const access_token = Cookies.get('accesToken');

            if (!logged_in || access_token == undefined) {
                sessionStorage.setItem('redirectUrl', Router.asPath);
                window.location = '/auth/login';
            } else {
                if (sessionStorage.getItem('redirectUrl') == '/auth/login') {
                    window.location = '/';
                }
            }

        }, [])

        return <WrappedComponent {...props} />;
    }

    return authComponent;
}

export const listedOrg = (WrappedComponent) => {
    const authComponent = (props) => {

        const [orgList, setOrgList] = useState([])

        useEffect(async () => {
            const middlewareServices = new MiddlewareServices;
            const getOrg = await middlewareServices.getlistedOrg();
            const orgList = getOrg.map(org => org.org_key);
            const org_key = sessionStorage.getItem('org_key');

            setOrgList(getOrg);
            // console.log(getOrg);

            if (!orgList.includes(org_key)) {
                return window.location = '/404';
            }
            const userRole = getOrg.filter(org => org.org_key == org_key)[0].role;
            // console.log(userRole);
            sessionStorage.setItem('userRole', userRole);

        }, [])

        return <WrappedComponent {...props} avaiableOrg={orgList} />;
    }

    return authComponent;
}

export const checkWorkspaceRole = (WrappedComponent) => {
    const authComponent = (props) => {
        const { showToast } = useContext(LayoutContext);

        const router = useRouter();

        useEffect(async () => {
            const middlewareServices = new MiddlewareServices;
            const getWorkspace = await middlewareServices.getWorkspaceRole();
            if (getWorkspace == null || getWorkspace == '') {
                if (sessionStorage.getItem('userRole') == 'user') {
                    showToast({
                        severity: 'warn',
                        summary: 'Restirect',
                        detail: "You don't have access this page",
                        sticky: false
                    });
                    return router.back();
                }
                sessionStorage.setItem('workspaceRole', sessionStorage.getItem('userRole'));
            }
            else {
                sessionStorage.setItem('workspaceRole', getWorkspace.role);
            }


        }, [])

        return <WrappedComponent {...props} />;
    }

    return authComponent;
}