import { Subject } from "rxjs"
import apiResponse from "../apiResponse";
import ProjectRepository from "../Repositories/ProjectRepository";
import { LayoutContext } from "../../layout/context/layoutcontext";

class ProjectBloc {
    static contextType = LayoutContext;

    createProject = new Subject();
    inviteToProject = new Subject();
    getUserPhoto = new Subject();
    getPhoto = new Subject();
    getProjectList = new Subject();
    getProjectDetail = new Subject();
    getprojectHandler = new Subject();
    editProjectName = new Subject();
    deleteProject = new Subject();
    removeMember = new Subject();
    createTask = new Subject();
    editSprint = new Subject();
    searchMember = new Subject();
    inviteUser = new Subject();

    repository = new ProjectRepository();

    constructor() {
        this.createProject.next({ status: apiResponse.INITIAL });
        this.inviteToProject.next({ status: apiResponse.INITIAL });
        this.getUserPhoto.next({ status: apiResponse.INITIAL });
        this.getPhoto.next({ status: apiResponse.INITIAL });
        this.getProjectList.next({ status: apiResponse.INITIAL });
        this.getProjectDetail.next({ status: apiResponse.INITIAL });
        this.getprojectHandler.next({ status: apiResponse.INITIAL });
        this.editProjectName.next({ status: apiResponse.INITIAL });
        this.deleteProject.next({ status: apiResponse.INITIAL });
        this.removeMember.next({ status: apiResponse.INITIAL });
        this.createTask.next({ status: apiResponse.INITIAL });
        this.editSprint.next({ status: apiResponse.INITIAL });
        this.searchMember.next({ status: apiResponse.INITIAL });
        this.inviteUser.next({ status: apiResponse.INITIAL });
    }

    fetchCreateProject = async (query) => {
        this.createProject.next({ statue: apiResponse.LOADING });
        try {
            await this.repository.fetchCreateProject(query).then((result) => {
                if (result.success) {
                    this.createProject.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.createProject.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.createProject.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchInviteToProject = async (query) => {
        console.log('masuk ke bloc')
        this.inviteToProject.next({ statue: apiResponse.LOADING });

        try {
            await this.repository.fetchInviteToProject(query).then((result) => {
                console.log('masuk ke bloc dari repo', result)
                if (result.success) {
                    console.log('bloc success', result)
                    // emit('inviteMemberSuccess');
                    this.context.showToast({
                        severity: 'success',
                        summary: 'Added',
                        detail: 'Member Added Successfully',
                        sticky: false
                    });
                    this.inviteToProject.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.inviteToProject.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.inviteToProject.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchGetUserPhoto = async (query) => {
        this.getUserPhoto.next({ statue: apiResponse.LOADING });
        try {
            await this.repository.fetchGetUserPhoto(query).then((result) => {
                if (result.success) {
                    this.getUserPhoto.next({ status: apiResponse.COMPLETED, data: result.data })
                } else {
                    this.getUserPhoto.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getUserPhoto.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchGetPhoto = async (query) => {
        this.getPhoto.next({ statue: apiResponse.LOADING });
        try {
            await this.repository.fetchGetPhoto(query).then((result) => {
                if (result.success) {
                    this.getPhoto.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getPhoto.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getPhoto.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchGetProjectList = async (query) => {
        this.getProjectList.next({ statue: apiResponse.LOADING });
        try {
            await this.repository.fetchGetProjectList(query).then((result) => {
                if (result.success) {
                    this.getProjectList.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getProjectList.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getProjectList.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchGetProjectDetail = async (query) => {
        this.getProjectDetail.next({ statue: apiResponse.LOADING });
        try {
            await this.repository.fetchGetProjectDetail(query).then((result) => {
                if (result.success) {
                    this.getProjectDetail.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getProjectDetail.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getProjectDetail.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchGetprojectHandler = async (query) => {
        this.getprojectHandler.next({ statue: apiResponse.LOADING });
        try {
            await this.repository.fetchGetprojectHandler(query).then((result) => {
                if (result.success) {
                    this.getprojectHandler.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getprojectHandler.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getprojectHandler.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchEditProjectName = async (query) => {
        this.editProjectName.next({ statue: apiResponse.LOADING });
        try {
            await this.repository.fetchEditProjectName(query).then((result) => {
                if (result.success) {
                    this.editProjectName.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.editProjectName.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.editProjectName.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchDeleteProject = async (query) => {
        this.deleteProject.next({ statue: apiResponse.LOADING });
        try {
            await this.repository.fetchDeleteProject(query).then((result) => {
                if (result.success) {
                    this.deleteProject.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.deleteProject.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.deleteProject.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchRemoveMember = async (query) => {
        this.removeMember.next({ statue: apiResponse.LOADING });
        try {
            await this.repository.fetchRemoveMember(query).then((result) => {
                if (result.success) {
                    this.removeMember.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.removeMember.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.removeMember.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchCreateTask = async (query) => {
        this.createTask.next({ statue: apiResponse.LOADING });
        try {
            await this.repository.fetchCreateTask(query).then((result) => {
                if (result.success) {
                    this.createTask.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.createTask.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.createTask.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchEditSprint = async (query) => {
        this.editSprint.next({ statue: apiResponse.LOADING });
        try {
            await this.repository.fetchEditSprint(query).then((result) => {
                if (result.success) {
                    this.editSprint.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.editSprint.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.editSprint.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchSearchMember = async (query) => {
        this.searchMember.next({ statue: apiResponse.LOADING });
        try {
            await this.repository.fetchSearchMember(query).then((result) => {
                if (result.success) {
                    this.searchMember.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.searchMember.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.searchMember.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchInviteUser = async (query) => {
        this.inviteUser.next({ statue: apiResponse.LOADING });
        try {
            await this.repository.fetchInviteUser(query).then((result) => {
                if (result.success) {
                    this.inviteUser.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.inviteUser.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.inviteUser.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
}

export default ProjectBloc;