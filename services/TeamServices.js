import getConfig from "next/config";
import Cookies from 'js-cookie';
import Router from 'next/router'

export class TeamServices {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
        this.serverURL = process.env.SERVER_URL;
        this.org_key = Cookies.get('org_key');
        this.work_key = sessionStorage.getItem('work_key');
        this.team_key = sessionStorage.getItem('team_key');
        // this.router = useRouter();
    }

    async getTeams(work_key) {
        let workKey = this.work_key;
        if (work_key != undefined) {
            workKey = work_key
        }
        return await fetch(this.serverURL + '/api/organization/workspace/team?work_key=' + workKey, {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        })
            .then((res) => res.json())
            .then((d) => d.data);
    }

    async getMemberByTeam(work_key) {
        let workKey = this.work_key;
        if (work_key != undefined) {
            workKey = work_key
        }
        return await fetch(this.serverURL + '/api/organization/workspace/member-workspace?work_key=' + workKey, {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        })
            .then((res) => res.json())
            .then((d) => {
                const user = d.data;
                let editedData = [];
                Promise.all(
                    user.map((data) => {
                        editedData.push({
                            key: data.team_key, label: data.team_name, children: data.workspace_members.map((member) => {
                                return { key: member.member_key, label: member.user.username }
                            })
                        })
                    })
                )
                return editedData;
            });
    }
    async getTeamDetail(team_key) {
        return await fetch(this.serverURL + '/api/organization/workspace/team/detail?team_key=' + team_key, {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        })
            .then((res) => res.json())
            .then((d) => d.data);
    }
    async getTeamMember(team_key) {

        return await fetch(this.serverURL + '/api/organization/workspace/team/get-member?team_key=' + team_key, {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        })
            .then((res) => res.json())
            .then((d) => d.data);
    }

    async getTeamProject(team_key) {

        const response = await fetch(this.serverURL + '/api/organization/workspace/team/get-project?team_key=' + team_key, {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        });

        const data = await response.json();
        return data.data;
    }

    async editName(formData) {
        const response = await fetch(this.serverURL + '/api/organization/workspace/team/edit-name', {
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

    async deleteTeam(formData) {
        const response = await fetch(this.serverURL + '/api/organization/workspace/team/' + formData.team_key, {
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



    // async createTeam(formData) {
    //     formData.work_key = Cookies.get('work_key');
    //     const response = await fetch(this.serverURL + '/api/organization/workspace/team', {
    //         method: 'POST',
    //         credentials: 'include',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Control-Allow-Credentials': 'true'
    //         },
    //         body: JSON.stringify(formData)
    //     });
    //     const data = await response.json();
    //     
    // }


}