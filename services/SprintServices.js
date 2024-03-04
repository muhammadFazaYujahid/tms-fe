import getConfig from "next/config";

export class SprintService {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
        this.serverURL = process.env.SERVER_URL;
    }

    async createSprint(project_key) {

        const response = await fetch(this.serverURL + '/api/organization/project/sprint', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify({ project_key: project_key })
        });
        return await response.json();

    }
    async startSprint(sprint_key) {

        const response = await fetch(this.serverURL + '/api/organization/project/sprint/start', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify({ sprint_key: sprint_key })
        });
        return await response.json();

    }
    async deleteSprint(formData) {
        const response = await fetch(this.serverURL + '/api/organization/project/delete-sprint', {
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

    async getProjectList() {
        return await fetch(this.serverURL + '/api/organization/project/list', {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        })
            .then((res) => res.json())
            .then((d) => d.data);
    }

    async getTask(sprint_key) {

        return await fetch(this.serverURL + '/api/organization/project/task?sprint_key=' + sprint_key, {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        })
            .then((res) => res.json())
            .then((d) => d.data);
    }

    async getSprint(project_key) {
        const getSprint = await fetch(this.serverURL + '/api/organization/project/sprint?project_key=' + project_key, {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        });
        const sprints = await getSprint.json();
        let sprintData = [];
        let sprintOrder = [];
        await Promise.all(
            sprints.data.map(async (sprint) => {
                const task = await this.getTask(sprint.sprint_key);
                // sprint.tasks = task;
                sprintData.push({ ...sprint, tasks: task });
            })

        )
        const updatedSprintData = sprintData.map((sprint) => {
            const taskId = sprint.tasks.map((task) => task.id);
            return { ...sprint, taskIds: taskId, type: 'sprint' }
        });

        const getBacklog = await fetch(this.serverURL + '/api/organization/project/backlog?project_key=' + project_key, {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        })

        const backlog = await getBacklog.json();
        let backlogData = [];

        const task = await this.getTask(backlog.data.sprint_key);
        backlog.data.tasks = task;
        backlogData.push(backlog.data);

        const updatedBacklogData = backlogData.map((sprint) => {
            const taskId = sprint.tasks.map((task) => task.id);
            return { ...sprint, taskIds: taskId, type: 'backlog' }
        });
        updatedBacklogData[0].sort_index = updatedSprintData.length + 1;
        updatedSprintData.push(updatedBacklogData[0]);

        const sortedSprints = updatedSprintData.sort((a, b) => a.sort_index - b.sort_index)

        return { sprint: sortedSprints, sprintOrder };
    }

    async getRoadmapSprint(project_key) {
        const getSprint = await fetch(this.serverURL + '/api/organization/project/sprint?project_key=' + project_key, {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        });
        const sprints = await getSprint.json();


        const getBacklog = await fetch(this.serverURL + '/api/organization/project/backlog?project_key=' + project_key, {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        })

        const backlog = await getBacklog.json();
        sprints.data.push(backlog.data);

        // console.log('sprints', sprints)

        // let formattedSprint = [];

        let sprintData = [];
        await Promise.all(
            sprints.data.map(async (sprint) => {

                const task = await this.getTask(sprint.sprint_key);
                // sprint.tasks = task;
                sprintData.push({ ...sprint, tasks: task });
            })
        )
        const formattedSprint = sprintData.map((sprint) => {
            return { name: sprint.sprint_name, id: sprint.sprint_key }
        })
        const day = 1000 * 60 * 60 * 24;

        let formattedTask = sprintData.filter(sprint => sprint.tasks.length > 0).map((sprint) => {
            sprint.tasks.map(async (task) => {
                formattedSprint.push({ name: task.task_name, id: task.task_key, parent: ((task.parent_key == null) ? task.sprint_key : task.parent_key), start: await this.formattedDate(task.createdAt), end: (await this.formattedDate(task.createdAt) + (task.pessimistic_time * day)), owner: (task.task_handlers.map((handler) => handler.handler_name)), status: task.status_key })
            })

        })
        const roadmapData = [{
            name: 'Project roadmap',
            data: formattedSprint
        }]
        // console.log('rdataaa', formattedSprint);
        return roadmapData;

    }

    async formattedDate(dateData) {

        var today = new Date(dateData);
        today.setUTCHours(0);
        today.setUTCMinutes(0);
        today.setUTCSeconds(0);
        today.setUTCMilliseconds(0);
        today = today.getTime();
        return today;
    }

}