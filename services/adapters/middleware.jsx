import { apiWrapper } from "../wrapper";

export const apiRequest = async (method, routes = {path: '/', pathKey: null}, body, header, stringifyBody, cancelToken) => {
    const route = (routes.pathKey !== null) ? routes.path + routes.pathKey : routes.path;
    return apiWrapper(route, method, body, header, stringifyBody);
}