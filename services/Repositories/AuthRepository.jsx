import { 
    apiRequest,
    sessionCheck,
    login,
    register,
    setupAccount,
    requestResetPassword,
    resetPassword,
    logout,
    inviteUser
 } from "../adapters/auth"

class AuthRepository {
    
    loggedIn() {
        const logged_in = Cookies.get('logged_in');
        if (logged_in == undefined) window.location = '/auth/login';
    }
    
    fetchSessionCheck = async (query) => {
        return await apiRequest(
            "GET",
            { path: sessionCheck, pathKey: null }
        )
    }

    fetchLogin = async (query) => {
        const response = await apiRequest(
            "POST",
            { path: login, pathKey: null },
            query
        )
         // sessionStorage.setItem('org_key', data.org);
         sessionStorage.setItem('loggedInEmail', response.email);
         sessionStorage.setItem('user_key', response.user_key);
         sessionStorage.setItem('userRole', response.user_role);
         sessionStorage.setItem('username', response.username);
         sessionStorage.setItem('user_photo', response.user_photo);
         Cookies.set('accesToken', response.token, { expires: 1 });
         Cookies.set('logged_in', true, { expires: 1 });
         // Cookies.set('org_key', response.org, { expires: 1 });
         Cookies.set('authData', response, { expires: 1 });
 
         if (!response.success) {
             return response;
         }
         response.redirectUrl = '/' + response.org;
         return response;
    }

    fetchRegister = async (query) => {
        return await apiRequest(
            "POST",
            { path: register, pathKey: null },
            query
        )
    }

    fetchSetupAccount = async (query) => {
        return await apiRequest(
            "POST",
            { path: setupAccount, pathKey: null },
            query
        )
    }

    fetchRequestResetPassword = async (query) => {
        return await apiRequest(
            "POST",
            { path: requestResetPassword, pathKey: null },
            query
        )
    }

    fetchResetPassword = async (query) => {
        return await apiRequest(
            "POST",
            { path: resetPassword, pathKey: null },
            query
        )
    }

    fetchLogout = async (query) => {
        const response = await apiRequest(
            "GET",
            { path: logout, pathKey: null }
        )
        
        Cookies.remove('logged_in');
        sessionStorage.clear();
        window.location = '/auth/login';
    }

    fetchInviteUser = async (query) => {
        
        query.org_key = this.org_key;
        if (query.role == '') {
            query.role = 'user';
        } else {
            query.role = query.role.code;
        }

        return await apiRequest(
            "POST",
            { path: inviteUser, pathKey: null },
            query
        )
    }

}

export default AuthRepository;