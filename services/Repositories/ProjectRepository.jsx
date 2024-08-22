import { 
    apiRequest,
    createProject,
    inviteToProject,
    getUserPhoto,
    getPhoto,
    getProjectList,
    getProjectDetail,
    getprojectHandler,
    editProjectName,
    deleteProject,
    removeMember,
    createTask,
    editSprint,
    searchMember,
    inviteUser,
    fileRequest,
} from "../adapters/project"

class ProjectRepository {

    getSession = (key) => {
        if (typeof window !== 'undefined' && window.sessionStorage) {
            return sessionStorage.getItem(key);
        }
        return null;
    };

    constructor() {
        this.org_key = this.getSession('org_key');
        this.project_key = this.getSession('project_key');
    }

    fetchCreateProject = async (query) => {        
        return await apiRequest(
            "POST",
            {path: createProject, pathKey: null},
            query
        )
    }

    fetchInviteToProject = async (query) => {
        query.project_key = this.project_key;

        return await apiRequest(
            "POST",
            {path: inviteToProject, pathKey: null},
            query
        )
    }

    fetchGetUserPhoto = async (query) => {
        return await apiRequest(
            "POST",
            {path: getUserPhoto, pathKey: null},
            { project_key: this.project_key }
        )
    }
    
    fetchGetPhoto = async (query) => {
        const response = await fileRequest(
            "GET",
            {path: getPhoto, pathKey: query}
        )
        return { success: (response.status === 200), data: response.url.toString() }
    }

    fetchGetProjectList = async (query) => {
        return await apiRequest(
            "GET",
            {path: getProjectList, pathKey: this.project_key}
        )
    }

    fetchGetProjectDetail = async (query) => {
        return await apiRequest(
            "GET",
            {path: getProjectDetail, pathKey: this.project_key}
        )
    }

    fetchGetprojectHandler = async (query) => {
        const response = await apiRequest(
            "GET",
            {path: getprojectHandler, pathKey: this.project_key}
        )
        const user = response.data;
        let editedData = [];
        Promise.all(
            user.map((data) => {
                editedData.push({
                    code: data.team_key, label: data.team_name, items: data.workspace_members.map((member) => {
                        return { value: member.user_key, label: member.user.username }
                    })
                    //checkbox version
                    // key: data.team_key, label: data.team_name, children: data.workspace_members.map((member) => {
                    //     return { key: member.user_key, label: member.user.username }
                    // })
                })
            })
        )
        
        return { success: response.success, data: {editedData, workspace: d.workspace} };
    }

    fetchEditProjectName = async (query) => {
        return await apiRequest(
            "POST",
            {path: editProjectName, pathKey: null},
            query
        )
    }

    fetchDeleteProject = async (query) => {
        return await apiRequest(
            "DELETE",
            {path: deleteProject, pathKey: query.project_key},
            query
        )
    }

    fetchRemoveMember = async (query) => {
        return await apiRequest(
            "POST",
            {path: removeMember, pathKey: null},
            query
        )
    }

    fetchCreateTask = async (query) => {
        return await apiRequest(
            "POST",
            {path: createTask, pathKey: null},
            query
        )
    }

    fetchEditSprint = async (query) => {
        return await apiRequest(
            "POST",
            {path: editSprint, pathKey: null},
            query
        )
    }

    fetchSearchMember = async (query) => {
        const response = await apiRequest(
            "GET",
            {path: searchMember, pathKey: `${query}&project_key=${this.project_key}`},
        )

        const userData = response.data;
        const allUser = [];
        Promise.all(
            userData.map((user) => {
                allUser.push({ email: user.user.email, user_key: user.user_key, member_key: user.member_key, username: user.user.username });
            })
        )

        return { success: response.success, data: allUser };
    }

    fetchInviteUser = async (query) => {
        const response = await apiRequest(
            "GET",
            {path: inviteUser, pathKey: this.project_key},
            query
        )

        
        const user = response.data;
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
        return { success: response.success, data: {editedData, workspace: response.workspace} };
    }
}

export default ProjectRepository;