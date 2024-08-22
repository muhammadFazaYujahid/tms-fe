import { 
    apiRequest,
    me,
    editProfile,
    login,
    getNotif,
    getDetail,
    getMemberTask,
    getMemberProject,
    fileRequest
 } from "../adapters/user";
import TaskRepository from "./TaskRepository";

class UserRepository {
    
    getStoryPoint = async (optimistic_time, mostlikely_time, pessimistic_time) => {
        const Pertsum = (optimistic_time + (4 * mostlikely_time) + pessimistic_time) / 6;
        return Pertsum;
    }

    fetchMe = async (query) => {
        const data = await apiRequest(
            "GET",
            { path: me, pathKey: null }
        );

        const userPhoto = await fileRequest(
            "GET",
            { path: me, pathKey: null }
        );

        data.data.photoUrl = userPhoto.url;
        return data;
        
    }

    fetchEditProfile = async (query) => {
        
        const bodyData = new FormData();
        bodyData.append('user_key', query.user_key);
        bodyData.append('username', query.username);
        bodyData.append('avatar', query.avatar[0]);
        bodyData.append('oldPhoto', query.oldPhoto);

        return await fileRequest(
            "POST",
            { path: login, pathKey: null },
            bodyData
        );
    }

    fetchLogin = async (query) => {
        const response = await apiRequest(
            "POST",
            { path: login, pathKey: null },
            query
        );
        
        sessionStorage.setItem('org_key', response.org);
        Cookies.set('accesToken', response.token, { expires: 1 });
        Cookies.set('logged_in', true, { expires: 1 });
        Cookies.set('org_key', response.org, { expires: 1 });
        Cookies.set('authData', response, { expires: 1 });

        if (!response.success) {
            return data;
        }
        response.redirectUrl = '/' + response.org;
        return data;
    }

    fetchGetNotif = async (query) => {
        return await apiRequest(
            "GET",
            { path: me, pathKey: null }
        );
    }

    fetchGetDetail = async (query) => {
        return await apiRequest(
            "GET",
            { path: getDetail, pathKey: query }
        );
    }

    fetchGetMemberTask = async (query) => {
        const response = await apiRequest(
            "GET",
            { path: getMemberTask, pathKey: query }
        );
        const taskRepo = new TaskRepository;
        const getTask = response.data.map(async (taskData) => {
            const task = await taskRepo.fetchGetDetail(taskData.task_key);
            const handlerType = task.task_handlers.filter(data => data.handler == user_key);
            return { task_key: task.task_key, task_name: task.task_name, handler_type: handlerType[0].type, story_point: await this.getStoryPoint(task.mostlikely_time, task.optimistic_time, task.pessimistic_time) }

        })
        const taskList = await Promise.all(getTask);

        return taskList;
    }

    fetchGetMemberProject = async (query) => {
        return await apiRequest(
            "GET",
            { path: getMemberProject, pathKey: query }
        );
    }


}

export default UserRepository;