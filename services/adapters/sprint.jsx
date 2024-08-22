import { apiWrapper } from "../wrapper";

export const createSPrint = "/api/organization/project/sprint";
export const startSprint = "/api/organization/project/sprint/start";
export const deleteSprint = "/api/organization/project/delete-sprint";
export const getProjectList = "/api/organization/project/list";
export const getTask = "/api/organization/project/task?sprint_key=";
export const getSprint = "/api/organization/project/sprint?project_key=";
export const getBacklog = "/api/organization/project/backlog?project_key=";

export const cancelToken = () => {
    return apiCancel();
}

export const apiRequest = async (method, routes = {path: '/', pathKey: null}, body, header, cancelToken) => {
    const route = (routes.pathKey !== null) ? routes.path + routes.pathKey : routes.path;
    return apiWrapper(route, method, body);
}