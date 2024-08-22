import getConfig from "next/config";
import Cookies from 'js-cookie';

export class AuthServices {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
        this.serverURL = process.env.SERVER_URL;
    }

    loggedIn() {
        const logged_in = Cookies.get('logged_in');
        if (logged_in == undefined) window.location = '/auth/login';
    }


    async sessionCheck() {
        return await fetch(this.serverURL + '/api/auth/me', {
            method: 'GET', credentials: 'include', headers: {
                'Control-Allow-Credentials': 'true'
            }
        })
            .then((res) => res.json())
            .then((d) => d.data);
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
        // sessionStorage.setItem('org_key', data.org);
        sessionStorage.setItem('loggedInEmail', data.email);
        sessionStorage.setItem('user_key', data.user_key);
        sessionStorage.setItem('userRole', data.user_role);
        sessionStorage.setItem('username', data.username);
        sessionStorage.setItem('user_photo', data.user_photo);
        Cookies.set('accesToken', data.token, { expires: 1 });
        Cookies.set('logged_in', true, { expires: 1 });
        // Cookies.set('org_key', data.org, { expires: 1 });
        Cookies.set('authData', data, { expires: 1 });

        if (!data.success) {
            return data;
        }
        data.redirectUrl = '/' + data.org;
        return data;
    }

    async register(formData) {

        const response = await fetch(this.serverURL + '/api/auth/register', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify(formData)
        });
        return await response.json();
    }

    async setupAccount(formData) {
        const response = await fetch(this.serverURL + '/api/user/setup-account', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (data.success == true) {
            return data.success;
        }
    }

    async requestResetPassword(formData) {

        const response = await fetch(this.serverURL + '/api/auth/request-reset-password', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify(formData)
        });
        return await response.json();
        // (data.success == true) ? window.location = '/auth/verify-send' : 
    }

    async resetPassword(formData) {
        const response = await fetch(this.serverURL + '/api/user/reset-password', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (data.success == true) {
            return data.success;
        }
    }

    async logout() {
        const response = await fetch(this.serverURL + '/api/auth/logout', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            },
        });
        const data = await response.json();
        Cookies.remove('logged_in');
        sessionStorage.clear();
        window.location = '/auth/login';
    }

    async inviteUser(formData) {
        formData.org_key = this.org_key;
        if (formData.role == '') {
            formData.role = 'admin';
        } else {
            formData.role = formData.role.code;
        }

        const response = await fetch(this.serverURL + '/api/user/invite-user', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify(formData)
        });
        return await response.json();
    }


}