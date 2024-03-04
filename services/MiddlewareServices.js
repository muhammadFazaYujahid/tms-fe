import getConfig from "next/config";
import Router from "next/router";
// import { useRouter } from 'next/router';

export class MiddlewareServices {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
        this.serverURL = process.env.SERVER_URL;
        this.org_key = sessionStorage.getItem('org_key');
        // this.router = useRouter();
    }

    async getlistedOrg() {
        return await fetch(this.serverURL + '/api/organization/get-org-list', {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        })
            .then((res) => res.json())
            .then((d) => d.data);
    }

    async getWorkspaceRole() {
        return await fetch(this.serverURL + '/api/organization/workspace-member-role', {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        })
            .then((res) => res.json())
            .then((d) => { return d.data });
    }
}