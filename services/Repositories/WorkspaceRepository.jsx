import { 
    apiRequest,
    getWorkspaceList,
    getActivity,
    getMember,
    getNoTeamMember,
    kickMember,
    addMemberToTeam,
    createWorkspace,
    deleteWorkspace,
    createTeam,
    inviteUser,
    bulkInvite,
    getUserReport,
} from "../adapters/workspace";
import TaskRepository from "./TaskRepository";

class WorkspaceRepository {

    getSession = (key) => {
        if (typeof window !== 'undefined' && window.sessionStorage) {
            return sessionStorage.getItem(key);
        }
        return null;
    };

    constructor() {
        this.org_key = this.getSession('org_key');
        this.work_key = this.getSession('work_key');
    }
    
    getStoryPoint = async (mostlikely_time, optimistic_time, pessimistic_time) => {
        
        const Pertsum = (optimistic_time + (4 * mostlikely_time) + pessimistic_time) / 6;
        return Pertsum;
    }


    fetchGetWorkspaceList = async (query) => {
        return await apiRequest(
            "GET",
            { path: getWorkspaceList, pathKey: this.org_key },
        );
    }

    fetchGetActivity = async (query) => {
        return await apiRequest(
            "GET",
            { path: getActivity, pathKey: query },
        );
    }

    fetchGetMember = async (query) => {
        const response = await apiRequest(
            "GET",
            { path: getMember, pathKey: this.work_key },
        );
        const allMember = response.data
        const noTeamMember = response.data.filter((data) => data.team_key == null);

        return { success: response.success, data: { allMember, noTeamMember } }
    }

    fetchGetNoTeamMember = async (query) => {
        return await apiRequest(
            "GET",
            { path: getNoTeamMember, pathKey: this.work_key },
        );
    }

    fetchKickMember = async (query) => {
        return await apiRequest(
            "POST",
            { path: kickMember, pathKey: this.org_key },
            query
        );
    }

    fetchAddMemberToTeam = async (query) => {
        query.team_key = query.team.team_key;

        return await apiRequest(
            "POST",
            { path: addMemberToTeam, pathKey: this.org_key },
            query
        );
    }

    fetchCreateWorkspace = async (query) => {
        query.org_key = this.org_key;
        return await apiRequest(
            "POST",
            { path: createWorkspace, pathKey: this.org_key },
            query
        );
    }

    fetchDeleteWorkspace = async (query) => {
        return await apiRequest(
            "POST",
            { path: deleteWorkspace, pathKey: this.org_key },
            { work_key: query }
        );
    }

    fetchCreateTeam = async (query) => {
        query.work_key = this.work_key;
        query.activity.related_code = this.work_key;

        return await apiRequest(
            "POST",
            { path: createTeam, pathKey: null },
            query
        );
    }

    fetchInviteUser = async (query) => {
        
        query.work_key = this.work_key
        query.activity.related_code = this.work_key
        if (query.role == '') {
            query.role = 'user';
        } else {
            query.role = query.role.code;
        }

        return await apiRequest(
            "POST",
            { path: inviteUser, pathKey: null },
            query
        );
    }

    fetchBulkInvite = async (query) => {
        
        query.work_key = this.work_key
        query.activity.related_code = this.work_key
        return await apiRequest(
            "POST",
            { path: bulkInvite, pathKey: null },
            query
        );
    }

    fetchGetUserReport = async (query) => {
        const response = await apiRequest(
            "GET",
            { path: getUserReport, pathKey: null },
            query
        );
        
        const taskRepo = new TaskRepository();
        const userData = response.data.map(async (user) => {
            const tasks = user.taskKeys.map(async (key) => {
                const taskData = await taskRepo.fetchGetDetail(key);
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

}

export default WorkspaceRepository;