import { apiWrapper } from "../wrapper";

export const getTeams = "/api/organization/workspace/team?work_key=";
export const getMemberByTeam = "/api/organization/workspace/member-workspace?work_key=";
export const getTeamDetail = "/api/organization/workspace/team/detail?team_key=";
export const getTeamMember = "/api/organization/workspace/team/get-member?team_key=";
export const getTeamProject = "/api/organization/workspace/team/get-project?team_key=";
export const editName = "/api/organization/workspace/team/edit-name";
export const deleteTeam = "/api/organization/workspace/team/";

export const apiRequest = async (method, routes = {path: '/', pathKey: null}, body, header, stringifyBody, cancelToken) => {
    const route = (routes.pathKey !== null) ? routes.path + routes.pathKey : routes.path;
    return apiWrapper(route, method, body, header, stringifyBody);
}