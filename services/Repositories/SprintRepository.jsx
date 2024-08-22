import { 
    apiRequest,
    createSPrint,
    startSprint,
    deleteSprint,
    getProjectList,
    getTask,
    getSprint,
    getBacklog,
} from "../adapters/sprint";

class SprintRepository {
    
    async formattedDate(dateData) {

        var today = new Date(dateData);
        today.setUTCHours(0);
        today.setUTCMinutes(0);
        today.setUTCSeconds(0);
        today.setUTCMilliseconds(0);
        today = today.getTime();
        return today;
    }

    fetchCreateSPrint = async ( query, cancelToken ) => {
        // console.log('masuk repo', createSPrint);
        return await apiRequest(
            "post",
            { path: createSPrint, pathKey: null },
            {project_key: query},
        );
        // return await { result: {data: 'masuk', success: true} }
    }
    
    fetchGetTask = async ( query, cancelToken ) => {
        return await apiRequest(
            "get",
            { path: getTask, pathKey: query.sprint_key }
        );
    }
    
    fetchGetSprint = async ( query, cancelToken ) => {
        const sprints = await apiRequest(
            "get",
            { path: getSprint, pathKey: query.project_key }
        );
        
        let sprintData = [];
        let sprintOrder = [];
        await Promise.all(
            sprints.data.map(async (sprint) => {
                const task = await this.fetchGetTask({sprint_key: sprint.sprint_key});
                // sprint.tasks = task;
                sprintData.push({ ...sprint, tasks: task.data });
            })

        )

        const updatedSprintData = sprintData.map((sprint) => {
            const taskId = sprint.tasks.map((task) => task.id);
            return { ...sprint, taskIds: taskId, type: 'sprint' }
        });
        
        const backlog = await apiRequest(
            "get",
            { path: getBacklog, pathKey: query.project_key }
        );
        let backlogData = [];

        const task = await this.fetchGetTask({sprint_key: backlog.data.sprint_key});
        backlog.data.tasks = task.data;
        backlogData.push(backlog.data);

        const updatedBacklogData = backlogData.map((sprint) => {
            const taskId = sprint.tasks.map((task) => task.id);
            return { ...sprint, taskIds: taskId, type: 'backlog' }
        });
        updatedBacklogData[0].sort_index = updatedSprintData.length + 1;
        updatedSprintData.push(updatedBacklogData[0]);

        const sortedSprints = updatedSprintData.sort((a, b) => a.sort_index - b.sort_index)
        return { success: true, data: { sprint: sortedSprints, sprintOrder } }
    }

    fetchStartSprint = async ( query, cancelToken ) => {
        return await apiRequest(
            "post",
            { path: startSprint, pathKey: null },
            query
        );
    }
    
    fetchDeleteSprint = async ( query, cancelToken ) => {
        return await apiRequest(
            "post",
            { path: deleteSprint, pathKey: query },
            query
        );
    }

    fetchGetRoadmapSprint = async ( query, cancelToken ) => {
        const sprints = await apiRequest(
            "get",
            { path: getSprint, pathKey: query },
        );
        
        const backlog = await apiRequest(
            "get",
            { path: getBacklog, pathKey: query },
        );

        sprints.data.push(backlog.data);

        let sprintData = [];
        await Promise.all(
            sprints.data.map(async (sprint) => {

                const getTask = await this.fetchGetTask({sprint_key: sprint.sprint_key});
                const task = getTask.data;
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
        return {success: sprints.success && backlog.success, data: roadmapData};
    }
    
    // fetchGetProjectList = async ( query, cancelToken ) => {
    //     return await apiRequest(
    //         "get",
            
    //     );
    // }
}

export default SprintRepository;