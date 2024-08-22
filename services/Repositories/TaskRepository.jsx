import { 
    apiRequest,
    changeSprint,
    getDetail,
    getTaskStatus,
    changeStatus,
    editDesc,
    getChildTask,
    searchTask,
    removeChild,
    getIssue,
    createIssue,
    uploadAttachment,
    getAttachment,
    getAttachFile,
    EditAttachmentName,
    removeAttachment,
    addComment,
    getHistory,
    removeIssue,
    editAssigPoint,
    watchTask,
    stopWatchTask,
    getWatcher,
    voteTask,
    unvoteTask,
    getVote,
    shareTask,
    addFlag,
    removeFlag,
    editParent,
    deleteTask,
    deleteComment,
    importTask,
} from "../adapters/task"

class TaskRepository {
    
    getSession = (key) => {
        if (typeof window !== 'undefined' && window.sessionStorage) {
            return sessionStorage.getItem(key);
        }
        return null;
    };

    constructor() {
        this.project_key = this.getSession('project_key');
    }

    fetchChangeSprint = async (query) => {
        return await apiRequest(
            "POST",
            { path: changeSprint, pathKey: null },
            query
        )
    }

    fetchGetDetail = async (query) => {
        return await apiRequest(
            "GET",
            { path: getDetail, pathKey: query },
        )
    }

    fetchGetTaskStatus = async (query) => {
        return await apiRequest(
            "GET",
            { path: getTaskStatus, pathKey: query },
        )
    }

    fetchChangeStatus = async (query) => {
        query.url = window.location.href;

        return await apiRequest(
            "POST",
            { path: changeStatus, pathKey: null },
            query
        )
    }

    fetchEditDesc = async (query) => {
        return await apiRequest(
            "POST",
            { path: editDesc, pathKey: null },
            query
        )
    }

    fetchGetChildTask = async (query) => {
        return await apiRequest(
            "GET",
            { path: getChildTask, pathKey: query },
        )
    }

    fetchSearchTask = async (query) => {
        query.project_key = this.project_key;

        return await apiRequest(
            "POST",
            { path: searchTask, pathKey: null },
            query
        )
    }

    fetchRemoveChild = async (query) => {
        return await apiRequest(
            "POST",
            { path: removeChild, pathKey: null },
            query
        )
    }

    fetchGetIssue = async (query) => {
        return await apiRequest(
            "GET",
            { path: getIssue, pathKey: query },
        )
    }

    fetchCreateIssue = async (query) => {
        return await apiRequest(
            "POST",
            { path: createIssue, pathKey: null },
            query
        )
    }

    fetchUploadAttachment = async (query) => {
        const activity = query.activity
        const bodyData = new FormData();

        Object.keys(activity).forEach(key => {
            bodyData.append(key, activity[key]);
        });
        bodyData.append('task_key', formData.task_key);
        query.attachments.forEach((file) => {
            bodyData.append('attachments', file);
        })

        return await apiRequest(
            "POST",
            { path: uploadAttachment, pathKey: null },
            bodyData,
            {'Control-Allow-Credentials': 'true'},
            false
        )
    }

    fetchGetAttachment = async (query) => {
        return await apiRequest(
            "GET",
            { path: getAttachment, pathKey: query },
        )
    }

    fetchGetAttachFile = async (query) => {
        const response = await apiRequest(
            "GET",
            { path: getAttachFile, pathKey: null },
        )

        return { success: response.success, data: response.data.url.toString() }
    }

    fetchEditAttachmentName = async (query) => {
        return await apiRequest(
            "POST",
            { path: EditAttachmentName, pathKey: null },
            query
        )
    }

    fetchRemoveAttachment = async (query) => {
        return await apiRequest(
            "DELETE",
            { path: removeAttachment, pathKey: query.attachId },
            query
        )
    }

    fetchAddComment = async (query) => {
        query.url = window.location.href;

        return await apiRequest(
            "POST",
            { path: addComment, pathKey: null },
            query
        )
    }

    fetchGetHistory = async (query) => {
        return await apiRequest(
            "GET",
            { path: getHistory, pathKey: query },
        )
    }

    fetchRemoveIssue = async (query) => {
        return await apiRequest(
            "POST",
            { path: removeIssue, pathKey: null },
            query
        )
    }

    fetchEditAssigPoint = async (query) => {
        return await apiRequest(
            "POST",
            { path: editAssigPoint, pathKey: null },
            query
        )
    }

    fetchWatchTask = async (query) => {
        return await apiRequest(
            "POST",
            { path: watchTask, pathKey: null },
            query
        )
    }

    fetchStopWatchTask = async (query) => {
        return await apiRequest(
            "POST",
            { path: stopWatchTask, pathKey: null },
            query
        )
    }

    fetchGetWatcher = async (query) => {
        return await apiRequest(
            "GET",
            { path: getWatcher, pathKey: query },
        )
    }

    fetchVoteTask = async (query) => {
        return await apiRequest(
            "POST",
            { path: voteTask, pathKey: null },
            query
        )
    }
    fetchUnvoteTask = async (query) => {
        return await apiRequest(
            "POST",
            { path: unvoteTask, pathKey: null },
            query
        )
    }
    fetchGetVote = async (query) => {
        return await apiRequest(
            "GET",
            { path: getVote, pathKey: query },
        )
    }

    fetchShareTask = async (query) => {
        return await apiRequest(
            "POST",
            { path: shareTask, pathKey: null },
            query
        )
    }

    fetchAddFlag = async (query) => {
        return await apiRequest(
            "POST",
            { path: addFlag, pathKey: null },
            query
        )
    }

    fetchRemoveFlag = async (query) => {
        return await apiRequest(
            "POST",
            { path: removeFlag, pathKey: null },
            query
        )
    }

    fetchEditParent = async (query) => {
        return await apiRequest(
            "POST",
            { path: editParent, pathKey: null },
            query
        )
    }
    
    fetchDeleteTask = async (query) => {
        return await apiRequest(
            "DELETE",
            { path: deleteTask, pathKey: query },
        )
    }
    
    fetchDeleteComment = async (query) => {
        return await apiRequest(
            "POST",
            { path: deleteComment, pathKey: null },
            query
        )
    }

    fetchImportTasks = async (query) => {
        return await apiRequest(
            "POST",
            { path: importTask, pathKey: null },
            query
        )
    }
}

export default TaskRepository;