import getConfig from "next/config";

export class TaskStatusService {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
        this.serverURL = process.env.SERVER_URL;
    }


    async getTask(project_key, status_key) {

        return await fetch(this.serverURL + '/api/organization/project/task/status/task?project_key=' + project_key + '&status_key=' + status_key, {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        })
            .then((res) => res.json())
            .then((d) => { return d.data });
    }

    async getStatus(project_key) {
        const getStatus = await fetch(this.serverURL + '/api/organization/project/task/status?project_key=' + project_key, {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        });
        const statuses = await getStatus.json();

        let statusData = [];
        // let sprintOrder = [];
        await Promise.all(
            statuses.data.map(async (status) => {
                const task = await this.getTask(project_key, status.status_key);
                // sprint.tasks = task;
                statusData.push({ ...status, tasks: task });
            })

        )
        const updatedStatusData = statusData.map((status) => {
            const taskId = status.tasks.map((task) => task.id);
            return { ...status, taskIds: taskId }
        });

        const sortedData = updatedStatusData.sort((a, b) => a.sort_index - b.sort_index)


        return sortedData;
    }

    async createStatus(formData) {
        const response = await fetch(this.serverURL + '/api/organization/project/task/status', {
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

    async changeStatus(formData) {
        formData.url = window.location.href;
        // this.socket.emit('updateStatus');
        console.log(formData);
        const response = await fetch(this.serverURL + '/api/organization/project/task/status/change-status', {
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

    async editStatusName(formData) {
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

    async deleteStatus(formData) {
        const response = await fetch(this.serverURL + '/api/organization/project/task/status/delete', {
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

    async completeSprint(formData) {
        const response = await fetch(this.serverURL + '/api/organization/project/sprint/complete', {
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