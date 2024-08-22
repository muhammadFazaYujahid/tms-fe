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

        useEffect(() => {
            const fetchOrgList = async () => {
              const middlewareServices = new MiddlewareServices();
              const getOrg = await middlewareServices.getlistedOrg();
              const orgList = getOrg.map(org => {return { org_key: org.org_key, org_name: org.org_name }});
              const org_key = sessionStorage.getItem('org_key');
        
              setOrgList(getOrg);
        
              if (!orgList.map(org => org.org_key).includes(org_key)) {
                window.location = '/404';
              } else {
                const userRole = getOrg.find(org => org.org_key === org_key).role;
                const listedWorkspace = getOrg.find(org => org.org_key === org_key).listed_workspace;
                const listedProject = getOrg.find(org => org.org_key === org_key).listed_project;
        
                // sessionStorage.setItem('userRole', userRole);
                sessionStorage.setItem('listedWorkspace', JSON.stringify(listedWorkspace));
                sessionStorage.setItem('listedProject', JSON.stringify(listedProject));
                localStorage.setItem('orgList', JSON.stringify(orgList));

                // console.log('Role', userRole);
                // console.log('LWP', JSON.stringify(listedWorkspace));
                // console.log('LORG', JSON.stringify(orgList));
              }
            };
        
            fetchOrgList();
          }, []);
        
        return <WrappedComponent {...props} avaiableOrg={orgList} />;
    }

    return authComponent;
}

export const checkWorkspaceRole = (WrappedComponent) => {
    const authComponent = (props) => {
        const { showToast } = useContext(LayoutContext);
        // const userRole = sessionStorage.getItem('userRole');

        const router = useRouter();

        useEffect(async () => {
            const middlewareServices = new MiddlewareServices;
            const getWorkspace = await middlewareServices.getWorkspaceRole();
            // console.log('isi worksp', getWorkspace)
            // console.log('isi role', userRole)
            if (getWorkspace == null || getWorkspace ==  '') {
                // if (userRole == 'user') {
                //     showToast({
                //         severity: 'warn',
                //         summary: 'Restirect',
                //         detail: "You don't have access this page",
                //         sticky: false
                //     });
                //     return router.back();
                // }
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