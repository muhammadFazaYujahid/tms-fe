import getConfig from "next/config";

export class ProjectService {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
        this.serverURL = process.env.SERVER_URL;
        this.org_key = sessionStorage.getItem('org_key');
        this.project_key = sessionStorage.getItem('project_key');
    }

    async createProject(formData) {
        const response = await fetch(this.serverURL + '/api/organization/project', {
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

    async inviteToProject(formData) {
        formData.project_key = this.project_key;
        const response = await fetch(this.serverURL + '/api/organization/project/invite-member', {
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

    async getUserPhoto(project_key) {
        const response = await fetch(this.serverURL + '/api/organization/project/user-photo', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify({ project_key })
        });
        const data = await response.json();
        return data.data;
    }

    async getPhoto(imageName) {
        const userPhoto = await fetch(this.serverURL + '/api/organization/project/user-photo?photo=' + imageName, {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        });
        const photo = await userPhoto;
        const data = photo.url;
        return data.toString();
    }

    async getProjectList() {
        return await fetch(this.serverURL + '/api/organization/project/list?org_key=' + this.org_key, {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        })
            .then((res) => res.json())
            .then((d) => d.data);
    }

    async getProjectDetail(project_key) {
        return await fetch(this.serverURL + '/api/organization/project/detail?project_key=' + project_key, {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        })
            .then((res) => res.json())
            .then((d) => { return d.data });
    }

    async getprojectHandler(project_key) {
        return await fetch(this.serverURL + '/api/organization/project/handler?project_key=' + project_key, {
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
                                return { key: member.user_key, label: member.user.username }
                            })
                        })
                    })
                )
                return { editedData, workspace: d.workspace };;
            });
    }


    async editProjectName(formData) {
        const response = await fetch(this.serverURL + '/api/organization/project/edit-name', {
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

    async deleteProject(formData) {
        const response = await fetch(this.serverURL + '/api/organization/project/' + formData.project_key, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify(formData)
        });
        return await response.json();
    }

    async removeMember(formData) {
        const response = await fetch(this.serverURL + '/api/organization/project/remove-member', {
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

    async createTask(formData) {
        const response = await fetch(this.serverURL + '/api/organization/project/task', {
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

    async editSprint(formData) {
        const response = await fetch(this.serverURL + '/api/organization/project/edit-sprint', {
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

    async searchMember(email) {
        return await fetch(this.serverURL + '/api/organization/project/search-member?email=' + email + '&project_key=' + this.project_key, {
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
                        allUser.push({ email: user.user.email, user_key: user.user_key, member_key: user.member_key, username: user.user.username });
                    })
                )
                return allUser;
            });
    }


    async inviteUser() {
        return await fetch(this.serverURL + '/api/organization/project/search-member?project_key=' + this.project_key, {
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
                return { editedData, workspace: d.workspace };
            });
    }

    getProject() {
        return fetch(this.contextPath + '/demo/dummy/projects.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    }
    getIssues() {
        return fetch(this.contextPath + '/demo/dummy/issues.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    }
    project_mapping() {
        return fetch(this.contextPath + '/demo/dummy/projectTask.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => {
                return d.data.projectOrder.map((projectId) => {
                    const project_data = d.data.projects[projectId];
                    const issue = project_data.taskId.map(taskId => d.data.tasks[taskId]);

                    return { "project_data": project_data, "issue": issue }
                })
            });
    }
}