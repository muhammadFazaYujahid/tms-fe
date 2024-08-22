import getConfig from "next/config";
import Router from "next/router";
import { WorkspaceServices } from "./WorkspaceServices";
// import { useRouter } from 'next/router';

export class OrgServices {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
        this.serverURL = process.env.SERVER_URL;
        this.org_key = sessionStorage.getItem('org_key');
        // this.router = useRouter();
    }

    async getOrgByKey() {
        // return await fetch(this.serverURL + '/api/organization/myorg?orgKey=' + this.org_key, {
        //     method: 'GET', credentials: 'include', headers: {
        //         'Control-Allow-Credentials': 'true'
        //     }
        // })
        //     .then((res) => res.json())
        //     .then((d) => d.data);
        const getOrg = await fetch(this.serverURL + '/api/organization/myorg?orgKey=' + this.org_key, {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        })
        const orgData = await getOrg.json();

        const org_logo = await fetch(this.serverURL + '/api/organization/org-logo?org_key=' + this.org_key, {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        });

        const logo = await org_logo;
        orgData.data.logo = logo.url;

        return {orgData: orgData.data};
    }

    async getOrgLogo() {
        const org_logo = await fetch(this.serverURL + '/api/organization/org-logo?org_key=' + this.org_key, {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        });

        const logo = await org_logo;
        const orgLogo = (logo.status === 200) ? logo.url : null;

        return orgLogo;
    }

    
    async changeUserRole(formData) {
        const response = await fetch(this.serverURL + '/api/organization/project/task/status/change-name', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify(formData)
        });
        return await response.json();
    }

    async nonTeamMember() {
        return await fetch(this.serverURL + '/api/organization/nonteam-member?org_key=' + this.org_key, {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        })
            .then((res) => res.json())
            .then((d) => d.data);
    }


    async searchMember(email) {
        return await fetch(this.serverURL + '/api/organization/search-member?email=' + email + '&org_key=' + this.org_key, {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        })
            .then((res) => res.json())
            .then(async (d) => {
                const userData = d.data;
                const allUser = [];
                Promise.all(
                    userData.map((user) => {
                        const filteredOrgKey = user.user_has_orgs.map(orgKey => orgKey.org_key);
                        user.orgKeyList = filteredOrgKey;
                        if (user.orgKeyList.includes(this.org_key)) {
                            user.sameOrg = true;
                        }
                        else {
                            user.sameOrg = false;
                        }
                        allUser.push(user);
                    })
                )
                const workspaceServices = new WorkspaceServices;
                const getMember = await workspaceServices.getMember();
                const alreadyExistMember = getMember.allMember.map(member => member.user_key);
                const filteredUser = allUser.filter(user => !alreadyExistMember.includes(user.user_key));
                return filteredUser;
            });
    }

    async getUserList(email) {
        return await fetch(this.serverURL + '/api/organization/users/user-list?email=' + email + '&org_key=' + this.org_key, {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        })
            .then((res) => res.json())
            .then((d) => d.data);
    }

    async createClient(formData) {
        const response = await fetch(this.serverURL + '/api/organization/client', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        return data;
    }

    async getClient(org_key) {
        const response = await fetch(this.serverURL + '/api/organization/get-client?org_key=' + org_key, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Control-Allow-Credentials': 'true'
            }
        });
        const data = await response.json();
        return data.data;
    }

    async updateClient(formData) {
        const response = await fetch(this.serverURL + '/api/organization/client/edit', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        return data;
    }

    async deleteClient(formData) {
        const response = await fetch(this.serverURL + '/api/organization/client/' + formData.client_key, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        return data;
    }
    
    async editOrgDetail(data) {

        const bodyData = new FormData();
        bodyData.append('org_key', data.org_key);
        bodyData.append('organization_name', data.organization_name);
        bodyData.append('oldPhoto', data.oldPhoto);
        bodyData.append('org_logo', data.org_logo[0]);

        const response = await fetch(this.serverURL + '/api/organization/edit-detail', {
            method: 'POST',
            credentials: 'include',
            headers: {
                // 'Content-Type': 'multipart/form-data',
                'Control-Allow-Credentials': 'true'
            },
            body: bodyData,
        });
        return await response.json();
    }
    
    async editUserRole(formData) {
        formData.org_key = this.org_key;
        const response = await fetch(this.serverURL + '/api/organization/change-user-role', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify(formData)
        });
        return await response.json();
    }

    async deleteUser(formData) {
        // formData.org_key = this.org_key;
        const response = await fetch(this.serverURL + '/api/organization/delete-user', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify(formData)
        });
        return await response.json();
    }
}