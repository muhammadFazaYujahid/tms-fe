import { Subject } from "rxjs"
import WorkspaceRepository from "../Repositories/WorkspaceRepository";
import apiResponse from "../apiResponse";

class WorkspaceBloc {
    getWorkspaceList = new Subject();
    getActivity = new Subject();
    getMember = new Subject();
    getNoTeamMember = new Subject();
    kickMember = new Subject();
    addMemberToTeam = new Subject();
    createWorkspace = new Subject();
    deleteWorkspace = new Subject();
    createTeam = new Subject();
    inviteUser = new Subject();
    bulkInvite = new Subject();
    getUserReport = new Subject();
    getStoryPoint = new Subject();

    repository = new WorkspaceRepository();

    constructor() {
        this.getWorkspaceList.next({ status: apiResponse.INITIAL })
        this.getActivity.next({ status: apiResponse.INITIAL })
        this.getMember.next({ status: apiResponse.INITIAL })
        this.getNoTeamMember.next({ status: apiResponse.INITIAL })
        this.kickMember.next({ status: apiResponse.INITIAL })
        this.addMemberToTeam.next({ status: apiResponse.INITIAL })
        this.createWorkspace.next({ status: apiResponse.INITIAL })
        this.deleteWorkspace.next({ status: apiResponse.INITIAL })
        this.createTeam.next({ status: apiResponse.INITIAL })
        this.inviteUser.next({ status: apiResponse.INITIAL })
        this.bulkInvite.next({ status: apiResponse.INITIAL })
        this.getUserReport.next({ status: apiResponse.INITIAL })
        this.getStoryPoint.next({ status: apiResponse.INITIAL })
    }
    fetchGetWorkspaceList = async (query) => {
        this.getWorkspaceList.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchGetWorkspaceList(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.getWorkspaceList.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getWorkspaceList.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getWorkspaceList.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }
    fetchGetActivity = async (query) => {
        this.getActivity.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchGetActivity(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.getActivity.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getActivity.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getActivity.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }
    fetchGetMember = async (query) => {
        this.getMember.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchGetMember(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.getMember.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getMember.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getMember.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }
    fetchGetNoTeamMember = async (query) => {
        this.getNoTeamMember.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchGetNoTeamMember(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.getNoTeamMember.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getNoTeamMember.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getNoTeamMember.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }
    fetchKickMember = async (query) => {
        this.kickMember.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchKickMember(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.kickMember.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.kickMember.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.kickMember.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }
    fetchAddMemberToTeam = async (query) => {
        this.addMemberToTeam.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchAddMemberToTeam(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.addMemberToTeam.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.addMemberToTeam.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.addMemberToTeam.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }
    fetchCreateWorkspace = async (query) => {
        this.createWorkspace.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchCreateWorkspace(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.createWorkspace.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.createWorkspace.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.createWorkspace.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }
    fetchDeleteWorkspace = async (query) => {
        this.deleteWorkspace.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchDeleteWorkspace(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.deleteWorkspace.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.deleteWorkspace.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.deleteWorkspace.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }
    fetchCreateTeam = async (query) => {
        this.createTeam.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchCreateTeam(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.createTeam.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.createTeam.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.createTeam.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }
    fetchInviteUser = async (query) => {
        this.inviteUser.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchInviteUser(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
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

    fetchBulkInvite = async (query) => {
        this.bulkInvite.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchBulkInvite(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.bulkInvite.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.bulkInvite.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.bulkInvite.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }
    fetchGetUserReport = async (query) => {
        this.getUserReport.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchGetUserReport(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.getUserReport.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getUserReport.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getUserReport.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }
    fetchGetStoryPoint = async (query) => {
        this.getStoryPoint.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchGetStoryPoint(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.getStoryPoint.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getStoryPoint.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getStoryPoint.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }
}

export default WorkspaceBloc;