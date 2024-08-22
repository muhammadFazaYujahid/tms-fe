import { apiWrapper } from "../wrapper";

export const getTask = "/api/organization/project/task/status/task?project_key=";
export const getStatus = "/api/organization/project/task/status?project_key=";
export const createStatus = "/api/organization/project/task/status";
export const changeStatus = "/api/organization/project/task/status/change-status";
export const editStatusName = "/api/organization/project/task/status/change-name";
export const deleteStatus = "/api/organization/project/task/status/delete";
export const completeSprint = "/api/organization/project/sprint/complete";

export const apiRequest = async (method, routes = {path: '/', pathKey: null}, body, header, stringifyBody, cancelToken) => {
    const route = (routes.pathKey !== null) ? routes.path + routes.pathKey : routes.path;
    return apiWrapper(route, method, body, header, stringifyBody);
}