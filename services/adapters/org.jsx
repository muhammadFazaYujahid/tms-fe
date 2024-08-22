import { apiWrapper, fileWrapper } from "../wrapper";

export const getOrgByKey = "/api/organization/myorg?orgKey=";
export const getOrgLogo = "/api/organization/org-logo?org_key=";
export const changeUserRole = "/api/organization/project/task/status/change-name";
export const nonTeamMember = "/api/organization/nonteam-member?org_key=";
export const searchMember = "/api/organization/search-member?email=";
export const getUserList = "/api/organization/users/user-list?email=";
export const createClient = "/api/organization/client";
export const getClient = "/api/organization/get-client?org_key=";
export const updateClient = "/api/organization/client/edit";
export const deleteClient = "/api/organization/client/";
export const editOrgDetail = "/api/organization/edit-detail";
export const editUserRole = "/api/organization/change-user-role";
export const deleteUser = "/api/organization/delete-user";
export const importUser = "/api/organization/import-user";

export const apiRequest = async (method, routes = {path: '/', pathKey: null}, body, header, stringifyBody, cancelToken) => {
    const route = (routes.pathKey !== null) ? routes.path + routes.pathKey : routes.path;
    return apiWrapper(route, method, body, header);
}

export const fileRequest = async (method, routes = {path: '/', pathKey: null}, body, header, stringifyBody, cancelToken) => {
    const route = (routes.pathKey !== null) ? routes.path + routes.pathKey : routes.path;
    return fileWrapper(route, method, body, header, stringifyBody);
}