import { apiWrapper } from "../wrapper";

export const sessionCheck = "/api/auth/me";
export const login = "/api/auth/login";
export const register = "/api/auth/register";
export const setupAccount = "/api/user/setup-account";
export const requestResetPassword = "/api/auth/request-reset-password";
export const resetPassword = "/api/user/reset-password";
export const logout = "/api/auth/logout";
export const inviteUser = "/api/user/invite-user";

export const apiRequest = async (method, routes = {path: '/', pathKey: null}, body, header, stringifyBody, cancelToken) => {
    const route = (routes.pathKey !== null) ? routes.path + routes.pathKey : routes.path;
    return apiWrapper(route, method, body, header, stringifyBody);
}