import { Subject } from "rxjs"
import AuthRepository from "../Repositories/AuthRepository";
import apiResponse from "../apiResponse";

class AuthBloc {
    sessionCheck = new Subject();
    login = new Subject();
    register = new Subject();
    setupAccount = new Subject();
    requestResetPassword = new Subject();
    resetPassword = new Subject();
    logout = new Subject();
    inviteUser = new Subject();

    repository = new AuthRepository();

    constructor() {
        this.sessionCheck.next({ status: apiResponse.INITIAL });
        this.loginsessionCheck.next({ status: apiResponse.INITIAL });
        this.registersessionCheck.next({ status: apiResponse.INITIAL });
        this.setupAccountsessionCheck.next({ status: apiResponse.INITIAL });
        this.requestResetPasswordsessionCheck.next({ status: apiResponse.INITIAL });
        this.resetPasswordsessionCheck.next({ status: apiResponse.INITIAL });
        this.logoutsessionCheck.next({ status: apiResponse.INITIAL });
        this.inviteUsersessionCheck.next({ status: apiResponse.INITIAL });
    }

    fetchSessionCheck = async (query) => {
        this.sessionCheck.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchSessionCheck(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.sessionCheck.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.sessionCheck.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.sessionCheck.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }

    fetchLogin = async (query) => {
        this.login.next({ status: apiResponse.LOADING });
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

    fetchRegister = async (query) => {
        this.register.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchRegister(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.register.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.register.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.register.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }

    fetchSetupAccount = async (query) => {
        this.setupAccount.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchSetupAccount(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.setupAccount.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.setupAccount.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.setupAccount.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }

    fetchRequestResetPassword = async (query) => {
        this.requestResetPassword.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchRequestResetPassword(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.requestResetPassword.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.requestResetPassword.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.requestResetPassword.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }

    fetchResetPassword = async (query) => {
        this.resetPassword.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchResetPassword(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.resetPassword.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.resetPassword.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.resetPassword.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }

    fetchLogout = async (query) => {
        this.logout.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchLogout(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.logout.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.logout.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.logout.next({ status: apiResponse.ERROR, data: error })
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

}

export default AuthBloc;