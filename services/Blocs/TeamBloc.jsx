import { Subject } from "rxjs"
import TeamRepository from "../Repositories/TeamRepository";
import apiResponse from "../apiResponse";

class TeamBloc {
    getTeams = new Subject();
    getMemberByTeam = new Subject();
    getTeamDetail = new Subject();
    getTeamMember = new Subject();
    getTeamProject = new Subject();
    editName = new Subject();
    deleteTeam = new Subject();

    repository = new TeamRepository();

    constructor() {
        this.getTeams.next({ status: apiResponse.INITIAL });
        this.getMemberByTeam.next({ status: apiResponse.INITIAL });
        this.getTeamDetail.next({ status: apiResponse.INITIAL });
        this.getTeamMember.next({ status: apiResponse.INITIAL });
        this.getTeamProject.next({ status: apiResponse.INITIAL });
        this.editName.next({ status: apiResponse.INITIAL });
        this.deleteTeam.next({ status: apiResponse.INITIAL });
    }

    fetchGetTeams = async () => {
        this.getTeams.next({ status: apiResponse.LOADING })
        try {
            await this.repository.fetchGetTeams(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.getTeams.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getTeams.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getTeams.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }

    fetchGetMemberByTeam = async () => {
        this.getMemberByTeam.next({ status: apiResponse.LOADING })
        try {
            await this.repository.fetchGetMemberByTeam(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.getMemberByTeam.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getMemberByTeam.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getMemberByTeam.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }

    fetchGetTeamDetail = async () => {
        this.getTeamDetail.next({ status: apiResponse.LOADING })
        try {
            await this.repository.fetchGetTeamDetail(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.getTeamDetail.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getTeamDetail.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getTeamDetail.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }

    fetchGetTeamMember = async () => {
        this.getTeamMember.next({ status: apiResponse.LOADING })
        try {
            await this.repository.fetchGetTeamMember(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.getTeamMember.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getTeamMember.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getTeamMember.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }

    fetchGetTeamProject = async () => {
        this.getTeamProject.next({ status: apiResponse.LOADING })
        try {
            await this.repository.fetchGetTeamProject(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.getTeamProject.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getTeamProject.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getTeamProject.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }

    fetcheditName = async () => {
        this.editName.next({ status: apiResponse.LOADING })
        try {
            await this.repository.fetcheditName(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.editName.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.editName.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.editName.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }

    fetchDeleteTeam = async () => {
        this.deleteTeam.next({ status: apiResponse.LOADING })
        try {
            await this.repository.fetchDeleteTeam(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.deleteTeam.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.deleteTeam.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.deleteTeam.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }

}

export default TeamBloc;