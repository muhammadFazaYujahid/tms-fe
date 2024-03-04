import getConfig from "next/config";
import Cookies from 'js-cookie';
import Router from "next/router";
import upload from "../utils/UploadMulter";
import { TaskServices } from "./TaskServices";
// import { useRouter } from 'next/router';

export class UserServices {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
        this.serverURL = process.env.SERVER_URL;
        // this.router = useRouter();
    }

    loggedIn() {
        const logged_in = Cookies.get('logged_in');
        if (logged_in == undefined) window.location = '/auth/login';

    }


    async me() {
        // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcl9rZXkiOiJVU0VSLTEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODM5MTg0NjcsImV4cCI6MTc3MjA0NjQ2N30.Rr2OLfAOUGe68lpZIsCwafiwHkZ8jbdiAL7IUoZ-NZ4";
        const userData = await fetch(this.serverURL + '/api/auth/me', {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        });
        const data = await userData.json();

        const userPhoto = await fetch(this.serverURL + '/api/auth/my-photo', {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        });
        const photo = await userPhoto;
        data.data.photoUrl = photo.url;

        return data;
    }

    async editProfile(data) {

        const bodyData = new FormData();
        bodyData.append('user_key', data.user_key);
        bodyData.append('username', data.username);
        bodyData.append('avatar', data.avatar[0]);
        bodyData.append('oldPhoto', data.oldPhoto);

        const response = await fetch(this.serverURL + '/api/user/edit-profile', {
            method: 'POST',
            credentials: 'include',
            headers: {
                // 'Content-Type': 'multipart/form-data',
                'Control-Allow-Credentials': 'true'
            },
            body: bodyData,
        });
        return await response.json();
    }

    async login(formData) {

        const response = await fetch(this.serverURL + '/api/auth/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();

        sessionStorage.setItem('org_key', data.org);
        Cookies.set('accesToken', data.token, { expires: 1 });
        Cookies.set('logged_in', true, { expires: 1 });
        Cookies.set('org_key', data.org, { expires: 1 });
        Cookies.set('authData', data, { expires: 1 });

        if (!data.success) {
            return data;
        }
        data.redirectUrl = '/' + data.org;
        return data;
    }


    async getNotif() {
        const userData = await fetch(this.serverURL + '/api/auth/get-notif', {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        });
        const data = await userData.json();
        return data;
    }

    async getDetail(user_key) {
        const userData = await fetch(this.serverURL + '/api/organization/members/detail?user_key=' + user_key, {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        });
        const data = await userData.json();
        return data;
    }

    async getMemberTask(user_key) {
        const userData = await fetch(this.serverURL + '/api/organization/members/task?user_key=' + user_key, {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        });
        const data = await userData.json();


        const taskService = new TaskServices;
        const getTask = data.data.map(async (taskData) => {
            const task = await taskService.getDetail(taskData.task_key);
            const handlerType = task.task_handlers.filter(data => data.handler == user_key);
            return { task_key: task.task_key, task_name: task.task_name, handler_type: handlerType[0].type, story_point: await this.getStoryPoint(task.mostlikely_time, task.optimistic_time, task.pessimistic_time) }

        })
        const taskList = await Promise.all(getTask);

        return taskList;
    }

    async getMemberProject(user_key) {
        const userData = await fetch(this.serverURL + '/api/organization/members/project?user_key=' + user_key, {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        });
        const data = await userData.json();


        return data.data;
    }

    async getStoryPoint(mostlikely_time, optimistic_time, pessimistic_time) {

        const Pertsum = (optimistic_time + (4 * mostlikely_time) + pessimistic_time) / 6;
        return Pertsum;
    }


}