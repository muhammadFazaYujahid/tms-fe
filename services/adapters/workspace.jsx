import { apiWrapper } from "../wrapper";

export const getWorkspaceList = "/api/organization/workspace/list?org_key=";
export const getActivity = "/api/organization/workspace/activity?work_key=";
export const getMember = "/api/organization/workspace/get-member?work_key=";
export const getNoTeamMember = "/api/organization/workspace/get-member?work_key=";
export const kickMember = "/api/organization/workspace/kick-member?org_key=";
export const addMemberToTeam = "/api/organization/workspace/add-to-team?org_key=";
export const createWorkspace = "/api/organization/workspace?org_key=";
export const deleteWorkspace = "/api/organization/workspace/delete-workspace?org_key=";
export const createTeam = "/api/organization/workspace/team";
export const inviteUser = "/api/organization/workspace/invite-to-workspace";
export const bulkInvite = "/api/organization/workspace/bulk-invite";
export const getUserReport = "/api/organization/workspace/member-report?work_key=";

export const apiRequest = async (method, routes = {path: '/', pathKey: null}, body, header, stringifyBody, cancelToken) => {
    const route = (routes.pathKey !== null) ? routes.path + routes.pathKey : routes.path;
    return apiWrapper(route, method, body, header, stringifyBody);
}