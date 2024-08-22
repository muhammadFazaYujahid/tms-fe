import { Subject } from "rxjs"
import TaskStatusRepository from "../Repositories/TaskStatusRepository";
import apiResponse from "../apiResponse";

class TaskStatusBloc {
    getTask = new Subject();
    getStatus = new Subject();
    createStatus = new Subject();
    changeStatus = new Subject();
    editStatusName = new Subject();
    deleteStatus = new Subject();
    completeSprint = new Subject();

    repository = new TaskStatusRepository();

    constructor() {
        this.getTask.next({ status: apiResponse.INITIAL })
        this.getStatus.next({ status: apiResponse.INITIAL })
        this.createStatus.next({ status: apiResponse.INITIAL })
        this.changeStatus.next({ status: apiResponse.INITIAL })
        this.editStatusName.next({ status: apiResponse.INITIAL })
        this.deleteStatus.next({ status: apiResponse.INITIAL })
        this.completeSprint.next({ status: apiResponse.INITIAL })
    }
    fetchGetTask = async (query) => {
        this.getTask.next({ status: apiResponse.LOADING });
        
        try {
            await this.repository.fetchGetTask(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.getTask.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getTask.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getTask.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }

    fetchGetStatus = async (query) => {
        this.getStatus.next({ status: apiResponse.LOADING });
        
        try {
            await this.repository.fetchGetStatus(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.getStatus.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.getStatus.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getStatus.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }

    fetchCreateStatus = async (query) => {
        this.createStatus.next({ status: apiResponse.LOADING });
        
        try {
            await this.repository.fetchCreateStatus(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.createStatus.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.createStatus.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.createStatus.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }

    fetchChangeStatus = async (query) => {
        this.changeStatus.next({ status: apiResponse.LOADING });
        
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

    fetchEditStatusName = async (query) => {
        this.editStatusName.next({ status: apiResponse.LOADING });
        
        try {
            await this.repository.fetchEditStatusName(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.editStatusName.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.editStatusName.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.editStatusName.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }

    fetchDeleteStatus = async (query) => {
        this.deleteStatus.next({ status: apiResponse.LOADING });
        
        try {
            await this.repository.fetchDeleteStatus(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.deleteStatus.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.deleteStatus.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.deleteStatus.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }

    fetchCompleteSprint = async (query) => {
        this.completeSprint.next({ status: apiResponse.LOADING });
        
        try {
            await this.repository.fetchCompleteSprint(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.completeSprint.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.completeSprint.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.completeSprint.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }


}

export default TaskStatusBloc;