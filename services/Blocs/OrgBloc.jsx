import { Subject } from "rxjs"
import apiResponse from "../apiResponse";
import OrgRepository from "../Repositories/OrgRepository";

class OrgBloc {
    getOrgByKey = new Subject();
    getOrgLogo = new Subject();
    changeUserRole = new Subject();
    nonTeamMember = new Subject();
    searchMember = new Subject();
    getUserList = new Subject();
    createClient = new Subject();
    getClient = new Subject();
    updateClient = new Subject();
    deleteClient = new Subject();
    editOrgDetail = new Subject();
    editUserRole = new Subject();
    deleteUser = new Subject();
    importUser = new Subject();

    repository = new OrgRepository();

    constructor() {
        this.getOrgByKey.next({ status: apiResponse.INITIAL });
        this.getOrgLogo.next({ status: apiResponse.INITIAL });
        this.changeUserRole.next({ status: apiResponse.INITIAL });
        this.nonTeamMember.next({ status: apiResponse.INITIAL });
        this.searchMember.next({ status: apiResponse.INITIAL });
        this.getUserList.next({ status: apiResponse.INITIAL });
        this.createClient.next({ status: apiResponse.INITIAL });
        this.getClient.next({ status: apiResponse.INITIAL });
        this.updateClient.next({ status: apiResponse.INITIAL });
        this.deleteClient.next({ status: apiResponse.INITIAL });
        this.editOrgDetail.next({ status: apiResponse.INITIAL });
        this.editUserRole.next({ status: apiResponse.INITIAL });
        this.deleteUser.next({ status: apiResponse.INITIAL });
        this.importUser.next({ status: apiResponse.INITIAL });
    }

    fetchGetOrgByKey = async (query) => {
        this.getOrgByKey.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchGetOrgByKey(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.getOrgByKey.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getOrgByKey.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getOrgByKey.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }
    fetchGetOrgLogo = async (query) => {
        this.getOrgLogo.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchGetOrgLogo(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.getOrgLogo.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getOrgLogo.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getOrgLogo.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }
    fetchChangeUserRole = async (query) => {
        this.changeUserRole.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchChangeUserRole(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.changeUserRole.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.changeUserRole.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.changeUserRole.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }
    fetchNonTeamMember = async (query) => {
        this.nonTeamMember.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchNonTeamMember(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.nonTeamMember.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.nonTeamMember.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.nonTeamMember.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }
    fetchSearchMember = async (query) => {
        this.searchMember.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchSearchMember(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
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
    fetchGetUserList = async (query) => {
        this.getUserList.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchGetUserList(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.getUserList.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getUserList.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getUserList.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }
    fetchCreateClient = async (query) => {
        this.createClient.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchCreateClient(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.createClient.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.createClient.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.createClient.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }
    fetchGetClient = async (query) => {
        this.getClient.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchGetClient(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.getClient.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getClient.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getClient.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }
    fetchUpdateClient = async (query) => {
        this.updateClient.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchUpdateClient(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.updateClient.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.updateClient.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.updateClient.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }
    fetchDeleteClient = async (query) => {
        this.deleteClient.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchDeleteClient(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.deleteClient.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.deleteClient.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.deleteClient.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }
    fetchEditOrgDetail = async (query) => {
        this.editOrgDetail.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchEditOrgDetail(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.editOrgDetail.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.editOrgDetail.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.editOrgDetail.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }
    fetchEditUserRole = async (query) => {
        this.editUserRole.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchEditUserRole(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.editUserRole.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.editUserRole.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.editUserRole.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }
    fetchDeleteUser = async (query) => {
        this.deleteUser.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchDeleteUser(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.deleteUser.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.deleteUser.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.deleteUser.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }

    fetchImportUser = async (query) => {
        this.importUser.next({ status: apiResponse.LOADING });
        try {
            await this.repository.fetchImportUser(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.importUser.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.importUser.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.importUser.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }
}

export default OrgBloc;