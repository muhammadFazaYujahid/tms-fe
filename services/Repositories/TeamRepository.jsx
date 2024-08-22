import { 
    apiRequest,
    getTeams,
    getMemberByTeam,
    getTeamDetail,
    getTeamMember,
    getTeamProject,
    editName,
    deleteTeam
} from "../adapters/team";

class TeamRepository {
    constructor() {
        this.org_key = sessionStorage.getItem('org_key');
        this.work_key = sessionStorage.getItem('work_key');
        this.team_key = sessionStorage.getItem('team_key');
    }

    fetchGetTeams = async (query) => {
        let workKey = this.work_key;
        if (query != undefined) {
            workKey = query
        }

        return await apiRequest(
            "GET",
            { path: getTeams, pathKey: workKey }
        );
    }

    fetchGetMemberByTeam = async (query) => {
        let workKey = this.work_key;
        if (query != undefined) {
            workKey = query
        }
        const response = await apiRequest(
            "GET",
            { path: getMemberByTeam, pathKey: workKey }
        );
        const user = response.data;
                let editedData = [];
                Promise.all(
                    user.map((data) => {
                        editedData.push({
                            key: data.team_key, label: data.team_name, children: data.workspace_members.map((member) => {
                                return { key: member.member_key, label: member.user.username }
                            })
                        })
                    })
                )
                return editedData;
    }

    fetchGetTeamDetail = async (query) => {
        return await apiRequest(
            "GET",
            { path: getTeamDetail, pathKey: query }
        );
    }

    fetchGetTeamMember = async (query) => {
        return await apiRequest(
            "GET",
            { path: getTeamMember, pathKey: query }
        );
    }

    fetchGetTeamProject = async (query) => {
        return await apiRequest(
            "GET",
            { path: getTeamProject, pathKey: query }
        );
    }

    fetcheditName = async (query) => {
        return await apiRequest(
            "POST",
            { path: editName, pathKey: null },
            query
        );
    }

    fetchDeleteTeam = async (query) => {
        return await apiRequest(
            "DELETE",
            { path: deleteTeam, pathKey: query.team_key },
            query
        );
    }

}

export default TeamRepository;