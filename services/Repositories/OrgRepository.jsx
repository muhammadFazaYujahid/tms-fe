import { 
    apiRequest,
    getOrgByKey,
    getOrgLogo,
    changeUserRole,
    nonTeamMember,
    searchMember,
    getUserList,
    createClient,
    getClient,
    updateClient,
    deleteClient,
    editOrgDetail,
    editUserRole,
    deleteUser,
    fileRequest,
    importUser,
} from "../adapters/org";
import WorkspaceRepository from "./WorkspaceRepository";

class OrgRepository {
    
    getSession = (key) => {
        if (typeof window !== 'undefined' && window.sessionStorage) {
            return sessionStorage.getItem(key);
        }
        return null;
    };

    constructor() {
        this.org_key = this.getSession('org_key');
    }

    fetchGetOrgByKey = async (query) => {
        const orgResponse = await apiRequest(
            "GET",
            { path: getOrgByKey, pathKey: this.org_key },
        );
        const orgLogo = await this.fetchGetOrgLogo();
        orgResponse.data.logo = orgLogo.data;

        return  orgResponse;
    }
    fetchGetOrgLogo = async (query) => {
        const response = await fileRequest(
            "GET",
            { path: getOrgLogo, pathKey: this.org_key },
        );
        
        const logoURL = (response.status === 200) ? response.url : null;

        return { success: (response.status === 200), data: logoURL }
    }
    fetchChangeUserRole = async (query) => {
        return await apiRequest(
            "POST",
            { path: changeUserRole, pathKey: null },
            query
        );
    }
    fetchNonTeamMember = async (query) => {
        return await apiRequest(
            "GET",
            { path: nonTeamMember, pathKey: this.org_key },
        );
    }
    fetchSearchMember = async (query) => {
        const response = await apiRequest(
            "GET",
            { path: searchMember, pathKey: null },
            query
        );
        const userData = response.data;
        const allUser = [];
        Promise.all(
            userData.map((user) => {
                const filteredOrgKey = user.user_has_orgs.map(orgKey => orgKey.org_key);
                user.orgKeyList = filteredOrgKey;
                if (user.orgKeyList.includes(this.org_key)) {
                    user.sameOrg = true;
                }
                else {
                    user.sameOrg = false;
                }
                allUser.push(user);
            })
        )
        const workspaceRepo = new WorkspaceRepository;
        const getMember = await workspaceRepo.fetchGetMember();
        const alreadyExistMember = getMember.allMember.map(member => member.user_key);
        const filteredUser = allUser.filter(user => !alreadyExistMember.includes(user.user_key));
        
        return filteredUser;

    }
    fetchGetUserList = async (query) => {
        return await apiRequest(
            "GET",
            { path: getUserList, pathKey: `${query}&org_key=${this.org_key}` }
        );
    }
    fetchCreateClient = async (query) => {
        return await apiRequest(
            "POST",
            { path: createClient, pathKey: null },
            query
        );
    }
    fetchGetClient = async (query) => {
        return await apiRequest(
            "POST",
            { path: getClient, pathKey: query }
        );
    }
    fetchUpdateClient = async (query) => {
        return await apiRequest(
            "POST",
            { path: updateClient, pathKey: null },
            query
        );
    }
    fetchDeleteClient = async (query) => {
        return await apiRequest(
            "DELETE",
            { path: deleteClient, pathKey: query.client_key },
            query
        );
    }
    fetchEditOrgDetail = async (query) => {
        
        const bodyData = new FormData();
        bodyData.append('org_key', query.org_key);
        bodyData.append('organization_name', query.organization_name);
        bodyData.append('oldPhoto', query.oldPhoto);
        bodyData.append('org_logo', query.org_logo[0]);

        return await fileRequest(
            "POST",
            { path: editOrgDetail, pathKey: null },
            query,
            {'Control-Allow-Credentials': 'true'},
            false
        );
    }

    fetchEditUserRole = async (query) => {
        query.org_key = this.org_key;
        return await apiRequest(
            "POST",
            { path: editUserRole, pathKey: null },
            query
        );
    }

    fetchDeleteUser = async (query) => {
        return await apiRequest(
            "POST",
            { path: deleteUser, pathKey: null },
            query
        );
    }

    fetchImportUser = async (query) => {
        query.org_key = this.org_key;
        console.log('org data', query)
        return await apiRequest(
            "POST",
            { path: importUser, pathKey: null },
            query
        );
    }
}

export default OrgRepository;