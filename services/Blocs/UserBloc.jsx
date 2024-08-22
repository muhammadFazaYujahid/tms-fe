import { Subject } from "rxjs";
import UserRepository from "../Repositories/UserRepository";
import apiResponse from "../apiResponse";

class UserBloc {
    me = new Subject();
    editProfile = new Subject();
    login = new Subject();
    getNotif = new Subject();
    getDetail = new Subject();
    getMemberTask = new Subject();
    getMemberProject = new Subject();

    repository = new UserRepository;

    constructor() {
        this.me.next({ status: apiResponse.INITIAL })
        this.editProfile.next({ status: apiResponse.INITIAL })
        this.login.next({ status: apiResponse.INITIAL })
        this.getNotif.next({ status: apiResponse.INITIAL })
        this.getDetail.next({ status: apiResponse.INITIAL })
        this.getMemberTask.next({ status: apiResponse.INITIAL })
        this.getMemberProject.next({ status: apiResponse.INITIAL })
        this.getStoryPoint.next({ status: apiResponse.INITIAL })
    }
    fetchMe = async (query) => {
        this.me.next({ status: apiResponse.LOADING })
        try {
            await this.repository.fetchMe(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.me.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.me.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.me.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }

    fetchEditProfile = async (query) => {
        this.editProfile.next({ status: apiResponse.LOADING })
        try {
            await this.repository.fetchEditProfile(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.editProfile.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.editProfile.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.editProfile.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }

    fetchLogin = async (query) => {
        this.login.next({ status: apiResponse.LOADING })
        try {
            await this.repository.fetchLogin(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.login.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.login.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.login.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }

    fetchGetNotif = async (query) => {
        this.getNotif.next({ status: apiResponse.LOADING })
        try {
            await this.repository.fetchGetNotif(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.getNotif.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getNotif.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getNotif.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }

    fetchGetDetail = async (query) => {
        this.getDetail.next({ status: apiResponse.LOADING })
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

    fetchGetMemberTask = async (query) => {
        this.getMemberTask.next({ status: apiResponse.LOADING })
        try {
            await this.repository.fetchGetMemberTask(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.getMemberTask.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getMemberTask.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getMemberTask.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }

    fetchGetMemberProject = async (query) => {
        this.getMemberProject.next({ status: apiResponse.LOADING })
        try {
            await this.repository.fetchGetMemberProject(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.getMemberProject.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getMemberProject.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getMemberProject.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }

}

export default UserBloc;