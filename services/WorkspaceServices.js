import getConfig from "next/config";
import Cookies from 'js-cookie';
import { TaskServices } from "./TaskServices";

export class WorkspaceServices {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
        this.serverURL = process.env.SERVER_URL;
        this.org_key = sessionStorage.getItem('org_key');
        this.work_key = Cookies.get('work_key');
        // this.router = useRouter();
    }

    loggedIn() {
        const logged_in = Cookies.get('logged_in');
        if (logged_in == undefined) window.location = '/auth/login';
    }


    async getWorkspaceList() {
        return await fetch(this.serverURL + '/api/organization/workspace/list?org_key=' + this.org_key, {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        })
            .then((res) => res.json())
            .then((d) => d.data);
    }

    async getActivity(work_key) {
        return await fetch(this.serverURL + '/api/organization/workspace/activity?work_key=' + work_key, {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        })
            .then((res) => res.json())
            .then((d) => d.data);
    }

    async getMember() {

        return await fetch(this.serverURL + '/api/organization/workspace/get-member?work_key=' + this.work_key, {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        })
            .then((res) => res.json())
            .then((d) => {
                const allMember = d.data
                const noTeamMember = d.data.filter((data) => data.team_key == null);


                return { allMember, noTeamMember }
            });
    }

    async getNoTeamMember() {

        return await fetch(this.serverURL + '/api/organization/workspace/get-member?work_key=' + this.work_key, {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        })
            .then((res) => res.json())
            .then((d) => d.data);
    }


    async kickMember(formData) {
        const response = await fetch(this.serverURL + '/api/organization/workspace/kick-member?org_key=' + Cookies.get('org_key'), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify(formData)
        })
        return await response.json();
    }

    async addMemberToTeam(formData) {
        formData.team_key = formData.team.team_key

        const response = await fetch(this.serverURL + '/api/organization/workspace/add-to-team?org_key=' + Cookies.get('org_key'), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify(formData)
        })
        return await response.json();
    }

    async createWorkspace(formData) {
        formData.org_key = Cookies.get('org_key');
        const response = await fetch(this.serverURL + '/api/organization/workspace?org_key=' + Cookies.get('org_key'), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();


    }

    async deleteWorkspace(work_key) {
        const response = await fetch(this.serverURL + '/api/organization/workspace/delete-workspace?org_key=' + Cookies.get('org_key'), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify({ work_key: work_key })
        });

        return await response.json();

    }

    async createTeam(formData) {
        formData.work_key = Cookies.get('work_key');
        formData.activity.related_code = Cookies.get('work_key');
        const response = await fetch(this.serverURL + '/api/organization/workspace/team', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();

    }

    async inviteUser(formData) {

        formData.work_key = Cookies.get('work_key');
        formData.activity.related_code = Cookies.get('work_key');
        if (formData.role == '') {
            formData.role = 'admin';
        } else {
            formData.role = formData.role.code;
        }


        const response = await fetch(this.serverURL + '/api/organization/workspace/invite-to-workspace', {
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

    async getUserReport(work_key) {
        const response = await fetch(this.serverURL + '/api/organization/workspace/member-report?work_key=' + work_key, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            }
        });
        const data = await response.json();


        const taskService = new TaskServices;
        const userData = data.data.map(async (user) => {
            const tasks = user.taskKeys.map(async (key) => {
                const taskData = await taskService.getDetail(key);
                const handlerType = taskData.task_handlers.filter(task => task.handler == user.user_key);
                return { task_key: taskData.task_key, task_name: taskData.task_name, handler_type: handlerType[0].type, story_point: await this.getStoryPoint(taskData.mostlikely_time, taskData.optimistic_time, taskData.pessimistic_time) }
            });
            let taskList = await Promise.all(tasks);
            const storyPointList = taskList.map(task => task.story_point);
            const total_story_point = storyPointList.reduce((a, b) => a + b, 0);

            return { user_key: user.user_key, username: user.user.username, task_count: taskList.length, project_count: user.project_count, total_story_point: total_story_point };

        })
        let reportData = await Promise.all(userData);

        console.log('reportt', reportData);

        return reportData;
    }

    async getStoryPoint(mostlikely_time, optimistic_time, pessimistic_time) {

        const Pertsum = (optimistic_time + (4 * mostlikely_time) + pessimistic_time) / 6;
        return Pertsum;
    }


}