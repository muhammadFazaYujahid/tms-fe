import { Subject } from "rxjs"
import apiResponse from "../apiResponse";
import TaskRepository from "../Repositories/TaskRepository";

class TaskBloc {
    changeSprint = new Subject();
    getDetail = new Subject();
    getTaskStatus = new Subject();
    changeStatus = new Subject();
    editDesc = new Subject();
    getChildTask = new Subject();
    searchTask = new Subject();
    removeChild = new Subject();
    getIssue = new Subject();
    createIssue = new Subject();
    uploadAttachment = new Subject();
    getAttachment = new Subject();
    getAttachFile = new Subject();
    EditAttachmentName = new Subject();
    removeAttachment = new Subject();
    addComment = new Subject();
    getHistory = new Subject();
    removeIssue = new Subject();
    editAssigPoint = new Subject();
    watchTask = new Subject();
    stopWatchTask = new Subject();
    getWatcher = new Subject();
    voteTask = new Subject();
    unvoteTask = new Subject();
    getVote = new Subject();
    shareTask = new Subject();
    addFlag = new Subject();
    removeFlag = new Subject();
    editParent = new Subject();
    deleteTask = new Subject();
    deleteComment = new Subject();
    importTasks = new Subject();

    repository = new TaskRepository();

    constructor() {
        this.changeSprint.next({ status: apiResponse.INITIAL });
        this.getDetail.next({ status: apiResponse.INITIAL });
        this.getTaskStatus.next({ status: apiResponse.INITIAL });
        this.changeStatus.next({ status: apiResponse.INITIAL });
        this.editDesc.next({ status: apiResponse.INITIAL });
        this.getChildTask.next({ status: apiResponse.INITIAL });
        this.searchTask.next({ status: apiResponse.INITIAL });
        this.removeChild.next({ status: apiResponse.INITIAL });
        this.getIssue.next({ status: apiResponse.INITIAL });
        this.createIssue.next({ status: apiResponse.INITIAL });
        this.uploadAttachment.next({ status: apiResponse.INITIAL });
        this.getAttachment.next({ status: apiResponse.INITIAL });
        this.getAttachFile.next({ status: apiResponse.INITIAL });
        this.EditAttachmentName.next({ status: apiResponse.INITIAL });
        this.removeAttachment.next({ status: apiResponse.INITIAL });
        this.addComment.next({ status: apiResponse.INITIAL });
        this.getHistory.next({ status: apiResponse.INITIAL });
        this.removeIssue.next({ status: apiResponse.INITIAL });
        this.editAssigPoint.next({ status: apiResponse.INITIAL });
        this.watchTask.next({ status: apiResponse.INITIAL });
        this.stopWatchTask.next({ status: apiResponse.INITIAL });
        this.getWatcher.next({ status: apiResponse.INITIAL });
        this.voteTask.next({ status: apiResponse.INITIAL });
        this.unvoteTask.next({ status: apiResponse.INITIAL });
        this.getVote.next({ status: apiResponse.INITIAL });
        this.shareTask.next({ status: apiResponse.INITIAL });
        this.addFlag.next({ status: apiResponse.INITIAL });
        this.removeFlag.next({ status: apiResponse.INITIAL });
        this.editParent.next({ status: apiResponse.INITIAL });
        this.deleteTask.next({ status: apiResponse.INITIAL });
        this.deleteComment.next({ status: apiResponse.INITIAL });
        this.importTasks.next({ status: apiResponse.INITIAL });
    }

    fetchChangeSprint = async (query) => {
        try {
            await this.repository.fetchChangeSprint(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.changeSprint.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.changeSprint.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.changeSprint.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchGetDetail = async (query) => {
        try {
            await this.repository.fetchGetDetail(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.getDetail.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getDetail.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getDetail.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchGetTaskStatus = async (query) => {
        try {
            await this.repository.fetchGetTaskStatus(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.getTaskStatus.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getTaskStatus.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getTaskStatus.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchChangeStatus = async (query) => {
        try {
            await this.repository.fetchChangeStatus(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.changeStatus.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.changeStatus.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.changeStatus.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchEditDesc = async (query) => {
        try {
            await this.repository.fetchEditDesc(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.editDesc.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.editDesc.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.editDesc.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchGetChildTask = async (query) => {
        try {
            await this.repository.fetchGetChildTask(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.getChildTask.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getChildTask.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getChildTask.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchSearchTask = async (query) => {
        try {
            await this.repository.fetchSearchTask(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.searchTask.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.searchTask.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.searchTask.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchRemoveChild = async (query) => {
        try {
            await this.repository.fetchRemoveChild(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.removeChild.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.removeChild.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.removeChild.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchGetIssue = async (query) => {
        try {
            await this.repository.fetchGetIssue(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.getIssue.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getIssue.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getIssue.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchCreateIssue = async (query) => {
        try {
            await this.repository.fetchCreateIssue(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.createIssue.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.createIssue.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.createIssue.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchUploadAttachment = async (query) => {
        try {
            await this.repository.fetchUploadAttachment(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.uploadAttachment.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.uploadAttachment.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.uploadAttachment.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchGetAttachment = async (query) => {
        try {
            await this.repository.fetchGetAttachment(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.getAttachment.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getAttachment.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getAttachment.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchGetAttachFile = async (query) => {
        try {
            await this.repository.fetchGetAttachFile(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.getAttachFile.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getAttachFile.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getAttachFile.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchEditAttachmentName = async (query) => {
        try {
            await this.repository.fetchEditAttachmentName(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.EditAttachmentName.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.EditAttachmentName.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.EditAttachmentName.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchRemoveAttachment = async (query) => {
        try {
            await this.repository.fetchRemoveAttachment(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.removeAttachment.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.removeAttachment.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.removeAttachment.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchAddComment = async (query) => {
        try {
            await this.repository.fetchAddComment(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.addComment.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.addComment.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.addComment.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchGetHistory = async (query) => {
        try {
            await this.repository.fetchGetHistory(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.getHistory.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getHistory.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getHistory.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchRemoveIssue = async (query) => {
        try {
            await this.repository.fetchRemoveIssue(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.removeIssue.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.removeIssue.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.removeIssue.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchEditAssigPoint = async (query) => {
        try {
            await this.repository.fetchEditAssigPoint(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.editAssigPoint.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.editAssigPoint.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.editAssigPoint.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchWatchTask = async (query) => {
        try {
            await this.repository.fetchWatchTask(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.watchTask.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.watchTask.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.watchTask.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchStopWatchTask = async (query) => {
        try {
            await this.repository.fetchStopWatchTask(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.stopWatchTask.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.stopWatchTask.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.stopWatchTask.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchGetWatcher = async (query) => {
        try {
            await this.repository.fetchGetWatcher(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.getWatcher.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getWatcher.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getWatcher.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchVoteTask = async (query) => {
        try {
            await this.repository.fetchVoteTask(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.voteTask.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.voteTask.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.voteTask.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchUnvoteTask = async (query) => {
        try {
            await this.repository.fetchUnvoteTask(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.unvoteTask.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.unvoteTask.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.unvoteTask.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchGetVote = async (query) => {
        try {
            await this.repository.fetchGetVote(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.getVote.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getVote.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getVote.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchShareTask = async (query) => {
        try {
            await this.repository.fetchShareTask(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.shareTask.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.shareTask.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.shareTask.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchAddFlag = async (query) => {
        try {
            await this.repository.fetchAddFlag(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.addFlag.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.addFlag.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.addFlag.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchRemoveFlag = async (query) => {
        try {
            await this.repository.fetchRemoveFlag(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.removeFlag.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.removeFlag.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.removeFlag.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchEditParent = async (query) => {
        try {
            await this.repository.fetchEditParent(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.editParent.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.editParent.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.editParent.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchDeleteTask = async (query) => {
        try {
            await this.repository.fetchDeleteTask(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.deleteTask.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.deleteTask.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.deleteTask.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchDeleteComment = async (query) => {
        try {
            await this.repository.fetchDeleteComment(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.deleteComment.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.deleteComment.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.deleteComment.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchImportTasks = async (query) => {
        try {
            await this.repository.fetchImportTasks(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.importTasks.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.importTasks.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.importTasks.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
}

export default TaskBloc;