import { forEach } from "lodash";
import getConfig from "next/config";
import { Router } from "next/router";


export class TaskServices {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
        this.serverURL = process.env.SERVER_URL;
        this.project_key = sessionStorage.getItem('project_key');

        // this.socket = io('http://localhost:9000', {
        //     withCredentials: true,
        //     extraHeaders: {
        //         'Content-Type': 'application/json',
        //         'Control-Allow-Credentials': 'true'
        //     }
        // });
    }

    async changeSprint(formData) {
        const response = await fetch(this.serverURL + '/api/organization/project/task/change-sprint', {
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

    async getDetail(task_key) {
        const response = await fetch(this.serverURL + '/api/organization/project/task/detail?task_key=' + task_key, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            }
        });
        const data = await response.json();
        return data.data;
    }

    async getTaskStatus(project_key) {
        const response = await fetch(this.serverURL + '/api/organization/project/task/task-status?project_key=' + project_key, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            }
        });
        const status = await response.json();
        return status.data;
    }


    async changeStatus(formData) {
        formData.url = window.location.href;
        // this.socket.emit('updateStatus');
        const response = await fetch(this.serverURL + '/api/organization/project/task/change-status', {
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

    async editDesc(formData) {
        const response = await fetch(this.serverURL + '/api/organization/project/task/update-desc', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        return data;
    }

    async getChildTask(task_key) {
        const response = await fetch(this.serverURL + '/api/organization/project/task/child?task_key=' + task_key, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            }
        });
        const data = await response.json();
        return data;
    }

    async searchTask(formData) {
        formData.project_key = this.project_key
        const response = await fetch(this.serverURL + '/api/organization/project/task/search-task', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        return data.data;
    }

    async removeChild(formData) {
        const response = await fetch(this.serverURL + '/api/organization/project/task/remove-child', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        return data;
    }

    async getIssue(taskKey) {
        const response = await fetch(this.serverURL + '/api/organization/project/task/issue?task_key=' + taskKey, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            },
        });
        const data = await response.json();
        return data;
    }

    async createIssue(formData) {
        const response = await fetch(this.serverURL + '/api/organization/project/task/create-issue', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        return data;
    }

    async uploadAttachment(formData) {
        const activity = formData.activity
        const bodyData = new FormData();
        Object.keys(activity).forEach(key => {
            bodyData.append(key, activity[key]);
        });
        bodyData.append('task_key', formData.task_key);
        formData.attachments.forEach((file) => {
            bodyData.append('attachments', file);
        })
        const response = await fetch(this.serverURL + '/api/organization/project/task/upload/attachment', {
            method: 'POST',
            credentials: 'include',
            headers: {
                // 'Content-Type': 'multipart/form-data',
                'Control-Allow-Credentials': 'true'
            },
            body: bodyData,
        });
        const data = await response.json();
        return data;
    }

    async getAttachment(taskKey) {
        const response = await fetch(this.serverURL + '/api/organization/project/task/attachment?task_key=' + taskKey, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            }
        });
        const data = await response.json();

        let attachFile = [];
        // const fileData = await Promise.all(data.data.map(file => this.getAttachFile(file.id)));
        const fileData = [];
        return { data, fileData };
    }

    async getAttachFile(fileId) {
        const response = await fetch(this.serverURL + '/api/organization/project/task/attach-file?attach_id=' + fileId, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            }
        });
        const data = await response;
        return data.url.toString();
    }

    async EditAttachmentName(formData) {
        const response = await fetch(this.serverURL + '/api/organization/project/task/attachment/change-name', {
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
    async removeAttachment(formData) {
        const response = await fetch(this.serverURL + '/api/organization/project/task/attachment/' + formData.attachId, {
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

    async addComment(formData) {
        formData.url = window.location.href;
        const response = await fetch(this.serverURL + '/api/organization/project/task/comment', {
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

    async getHistory(taskKey) {
        const response = await fetch(this.serverURL + '/api/organization/project/task/history?task_key=' + taskKey, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            }
        });
        const data = await response.json();
        return data.data;
    }

    async removeIssue(formData) {
        const response = await fetch(this.serverURL + '/api/organization/project/task/delete-issue', {
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

    async editAssigPoint(formData) {
        const response = await fetch(this.serverURL + '/api/organization/project/task/edit-detail', {
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
    // watch section start
    async watchTask(formData) {
        const response = await fetch(this.serverURL + '/api/organization/project/task/watch', {
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

    async stopWatchTask(formData) {
        const response = await fetch(this.serverURL + '/api/organization/project/task/stop-watch', {
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

    async getWatcher(task_key) {
        const response = await fetch(this.serverURL + '/api/organization/project/task/watch?task_key=' + task_key, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            },
        });
        const data = await response.json();
        return data.data;
    }

    //watch section End

    // Vote section start
    async voteTask(formData) {
        const response = await fetch(this.serverURL + '/api/organization/project/task/vote', {
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

    async unvoteTask(formData) {
        const response = await fetch(this.serverURL + '/api/organization/project/task/unvote', {
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

    async getVote(task_key) {
        const response = await fetch(this.serverURL + '/api/organization/project/task/vote?task_key=' + task_key, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            },
        });
        const data = await response.json();
        return data.data;
    }

    // Vote section start

    // Share section start
    async shareTask(formData) {
        const response = await fetch(this.serverURL + '/api/organization/project/task/share', {
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
    // Share section start

    // Flag section start
    async addFlag(formData) {
        const response = await fetch(this.serverURL + '/api/organization/project/task/flag', {
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

    async removeFlag(formData) {
        const response = await fetch(this.serverURL + '/api/organization/project/task/unflag', {
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
    // Flag section end

    // Parent Section start
    async editParent(formData) {
        const response = await fetch(this.serverURL + '/api/organization/project/task/edit-parent', {
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
    // Parent Section end

    // Delete Task Section start
    async deleteTask(taskKey) {
        const response = await fetch(this.serverURL + '/api/organization/project/task/' + taskKey, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            },
        });
        const data = await response.json();
        return data;
    }
    // Delete Task Section end

    // Delete Task Section start
    async deleteComment(formData) {
        const response = await fetch(this.serverURL + '/api/organization/project/task/delete-comment', {
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
    // Delete Task Section end
}