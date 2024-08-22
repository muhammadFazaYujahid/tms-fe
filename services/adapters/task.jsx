import { apiWrapper, fileWrapper } from "../wrapper";

export const changeSprint = "/api/organization/project/task/change-sprint";
export const getDetail = "/api/organization/project/task/detail?task_key=";
export const getTaskStatus = "/api/organization/project/task/task-status?project_key=";
export const changeStatus = "/api/organization/project/task/change-status";
export const editDesc = "/api/organization/project/task/update-desc";
export const getChildTask = "/api/organization/project/task/child?task_key=";
export const searchTask = "/api/organization/project/task/search-task";
export const removeChild = "/api/organization/project/task/remove-child";
export const getIssue = "/api/organization/project/task/issue?task_key=";
export const createIssue = "/api/organization/project/task/create-issue";
export const uploadAttachment = "/api/organization/project/task/upload/attachment";
export const getAttachment = "/api/organization/project/task/attachment?task_key=";
export const getAttachFile = "/api/organization/project/task/attach-file?attach_id=";
export const EditAttachmentName = "/api/organization/project/task/attachment/change-name";
export const removeAttachment = "/api/organization/project/task/attachment/";
export const addComment = "/api/organization/project/task/comment";
export const getHistory = "/api/organization/project/task/history?task_key=";
export const removeIssue = "/api/organization/project/task/delete-issue";
export const editAssigPoint = "/api/organization/project/task/edit-detail";
export const watchTask = "/api/organization/project/task/watch";
export const stopWatchTask = "/api/organization/project/task/stop-watch";
export const getWatcher = "/api/organization/project/task/watch?task_key=";
export const voteTask = "/api/organization/project/task/vote";
export const unvoteTask = "/api/organization/project/task/unvote";
export const getVote = "/api/organization/project/task/vote?task_key=";
export const shareTask = "/api/organization/project/task/share";
export const addFlag = "/api/organization/project/task/flag";
export const removeFlag = "/api/organization/project/task/unflag";
export const editParent = "/api/organization/project/task/edit-parent";
export const deleteTask = "/api/organization/project/task/";
export const deleteComment = "/api/organization/project/task/delete-comment";
export const importTask = "/api/organization/project/task/import";

export const cancelToken = () => {
    return apiCancel();
}

export const apiRequest = async (method, routes = {path: '/', pathKey: null}, body, header, stringifyBody, cancelToken) => {
    const route = (routes.pathKey !== null) ? routes.path + routes.pathKey : routes.path;
    return apiWrapper(route, method, body, header, stringifyBody);
}

export const fileRequest = async (method, routes = {path: '/', pathKey: null}, body, header, stringifyBody, cancelToken) => {
    const route = (routes.pathKey !== null) ? routes.path + routes.pathKey : routes.path;
    return fileWrapper(route, method, body, header, stringifyBody);
}