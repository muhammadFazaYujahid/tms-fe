import { apiWrapper, fileWrapper } from "../wrapper";

export const me = "/api/auth/me";
export const usePhoto = "/api/auth/my-photo";
export const editProfile = "/api/user/edit-profile";
export const login = "/api/user/edit-profile";
export const getNotif = "/api/auth/get-notif";
export const getDetail = "/api/organization/members/detail?user_key=";
export const getMemberTask = "/api/organization/members/task?user_key=";
export const getMemberProject = "/api/organization/members/project?user_key=";

export const apiRequest = async (method, routes = {path: '/', pathKey: null}, body, header, stringifyBody, cancelToken) => {
    const route = (routes.pathKey !== null) ? routes.path + routes.pathKey : routes.path;
    return apiWrapper(route, method, body, header, stringifyBody);
}

export const fileRequest = async (method, routes = {path: '/', pathKey: null}, body, header, stringifyBody, cancelToken) => {
    const route = (routes.pathKey !== null) ? routes.path + routes.pathKey : routes.path;
    return fileWrapper(route, method, body, header, stringifyBody);
}