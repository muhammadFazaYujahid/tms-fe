import { 
    apiRequest,
    getTask,
    getStatus,
    createStatus,
    changeStatus,
    editStatusName,
    deleteStatus,
    completeSprint
} from "../adapters/taskstatus";

class TaskStatusRepository {
    fetchGetTask = async (query) => {
        
        return await apiRequest(
            "GET",
            { path: getTask, pathKey: `${query.project_key}&status_key=${query.status_key}` },
        );
    }

    fetchGetStatus = async (query) => {
        
        const response = await apiRequest(
            "GET",
            { path: getStatus, pathKey: query },
        );
        let statusData = [];
        // let sprintOrder = [];
        await Promise.all(
            response.data.map(async (status) => {
                const task = await this.fetchGetTask({project_key:query, status_key:status.status_key});
                statusData.push({ ...status, tasks: task.data });
            })

        )
        const updatedStatusData = statusData.map((status) => {
            const taskId = status.tasks.map((task) => task.id);
            return { ...status, taskIds: taskId }
        });
        
        const sortedData = updatedStatusData.sort((a, b) => a.sort_index - b.sort_index)

        return {success: response.success, data: sortedData};
    }

    fetchCreateStatus = async (query) => {
        
        return await apiRequest(
            "POST",
            { path: createStatus, pathKey: null },
            query
        );
    }

    fetchChangeStatus = async (query) => {
        query.url = window.location.href;
        
        return await apiRequest(
            "POST",
            { path: changeStatus, pathKey: null },
            query
        );
    }

    fetchEditStatusName = async (query) => {
        
        return await apiRequest(
            "POST",
            { path: editStatusName, pathKey: null },
            query
        );
    }

    fetchDeleteStatus = async (query) => {
        
        return await apiRequest(
            "POST",
            { path: deleteStatus, pathKey: null },
            query
        );
    }

    fetchCompleteSprint = async (query) => {
        
        return await apiRequest(
            "POST",
            { path: completeSprint, pathKey: null },
            query
        );
    }

}

export default TaskStatusRepository;