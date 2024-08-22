import { apiWrapper, fileWrapper } from "../wrapper";

export const createProject = "/api/organization/project";
export const inviteToProject = "/api/organization/project/invite-member";
export const getUserPhoto = "/api/organization/project/user-photo";
export const getPhoto = "/api/organization/project/user-photo?photo=";
export const getProjectList = "/api/organization/project/list?org_key=";
export const getProjectDetail = "/api/organization/project/detail?project_key=";
export const getprojectHandler = "/api/organization/project/handler?project_key=";
export const editProjectName = "/api/organization/project/edit-name";
export const deleteProject = "/api/organization/project/";
export const removeMember = "/api/organization/project/remove-member";
export const createTask = "/api/organization/project/task";
export const editSprint = "/api/organization/project/edit-sprint";
export const searchMember = "/api/organization/project/search-member?email=";
export const inviteUser = "/api/organization/project/search-member?project_key=";

export const cancelToken = () => {
    return apiCancel();
}

export const apiRequest = async (method, routes = {path: '/', pathKey: null}, body, header, cancelToken) => {
    const route = (routes.pathKey !== null) ? routes.path + routes.pathKey : routes.path;
    return apiWrapper(route, method, body);
}

export const fileRequest = async (method, routes = {path: '/', pathKey: null}, body, header, stringifyBody, cancelToken) => {
    const route = (routes.pathKey !== null) ? routes.path + routes.pathKey : routes.path;
    return fileWrapper(route, method, body, header, stringifyBody);
}