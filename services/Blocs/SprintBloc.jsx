import { Subject } from "rxjs";
import apiResponse from "../apiResponse";
import SprintRepository from "../Repositories/SprintRepository";

class SprintBloc {

    createSPrint = new Subject()
    startSprint = new Subject()
    deleteSprint = new Subject()
    getProjectList = new Subject()
    getTask = new Subject()
    getSprint = new Subject()
    getRoadmapSprint = new Subject()

    repository = new SprintRepository();

    constructor() {
        this.createSPrint.next({ status: apiResponse.INITIAL })
        this.startSprint.next({ status: apiResponse.INITIAL })
        this.deleteSprint.next({ status: apiResponse.INITIAL })
        this.getProjectList.next({ status: apiResponse.INITIAL })
        this.getTask.next({ status: apiResponse.INITIAL })
        this.getSprint.next({ status: apiResponse.INITIAL })
        this.getRoadmapSprint.next({ status: apiResponse.INITIAL })
    }

    fetchCreateSPrint = async ( query, cancelToken ) => {
        // console.log('masuk bloc')
        this.createSPrint.next({ status: apiResponse.LOADING })
        try {
            await this.repository.fetchCreateSPrint(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.createSPrint.next({ status: apiResponse.COMPLETED, data: result })
                } else {
                    this.createSPrint.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.createSPrint.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
         }
    }
    
    fetchGetSprint = async ( query, cancelToken ) => {
        this.getSprint.next({ status: apiResponse.LOADING })
        try {
            await this.repository.fetchGetSprint(query).then((result) => {
                if (result.success) {
                    this.getSprint.next({ status: apiResponse.COMPLETED, data: result.data })
                } else {
                    this.getSprint.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getSprint.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) { 
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }

    fetchStartSprint = async ( query, cancelToken ) => {
        this.startSprint.next({ status: apiResponse.LOADING })
        try {
            await this.repository.fetchStartSprint(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.startSprint.next({ status: apiResponse.COMPLETED, data: result.data })
                } else {
                    this.startSprint.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.startSprint.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    fetchDeleteSprint = async ( query, cancelToken ) => {
        this.deleteSprint.next({ status: apiResponse.LOADING })
        try {
            await this.repository.fetchDeleteSprint(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.deleteSprint.next({ status: apiResponse.COMPLETED, data: result.data })
                } else {
                    this.deleteSprint.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.deleteSprint.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }

    fetchGetRoadmapSprint = async ( query, cancelToken ) => {
        this.getRoadmapSprint.next({ status: apiResponse.LOADING })
        try {
            await this.repository.fetchGetRoadmapSprint(query).then((result) => {
                // console.log('hasil bloc', result);
                if (result.success) {
                    // console.log('success bloc');
                    this.getRoadmapSprint.next({ status: apiResponse.COMPLETED, data: result.data })
                } else {
                    this.getRoadmapSprint.next({ status: apiResponse.ERROR, data: result.message })
                }
            }).catch((error) => {
                this.getRoadmapSprint.next({ status: apiResponse.ERROR, data: error })
            })
        } catch (error) {
            console.log('rxjs', 'Channel Unsubscribed');
        }
    }
    // fetchGetProjectList = async ( query, cancelToken ) => {
    //     this.getProjectList.next({ status: apiResponse.LOADING })
    //     try {
            
    //     } catch (error) { }
    // }
    // fetchGetTask = async ( query, cancelToken ) => {
    //     this.getTask.next({ status: apiResponse.LOADING })
    //     try {
            
    //     } catch (error) { }
    // }
}

export default SprintBloc