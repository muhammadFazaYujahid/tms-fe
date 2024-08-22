import { Component, Fragment } from "react";
import { WorkspaceServices } from "../../services/WorkspaceServices";
import { ScrollPanel } from "primereact/scrollpanel";
import { LayoutContext } from "../../layout/context/layoutcontext";
import { Divider } from "primereact/divider";
import { Avatar } from "primereact/avatar";
import { AvatarGroup } from "primereact/avatargroup";
import Link from "next/link";
import getConfig from "next/config";
import { InputText } from "primereact/inputtext";
import { on } from "../../utils/EventEmitter";

class Workspace extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            userRole: null,
            workspaceList: [],
            listedWorkspace: [],
            workspaces: [],
            loading: true,
            orgKey: this.props.orgKey
        }
    }
    componentDidMount() {
        this.props.getWorkspaceCount({nama: 'faza'});
        const workspaceServices = new WorkspaceServices();
        workspaceServices.getWorkspaceList().then((response) => {
            const workspaceList = response;
            
            this.props.getWorkspaceCount({wk_count: workspaceList.length});
            this.setState({
                userRole: sessionStorage.getItem('userRole'),
                workspaceList,
                workspaces: workspaceList,
                loading: false,
                listedWorkspace: JSON.parse(sessionStorage.getItem('listedWorkspace')).map(wp => wp.work_key)
            })
        });

        on('refreshOrgPage', async () => {
            try {
                const workspaceServices = new WorkspaceServices();
                const workspaceList = await workspaceServices.getWorkspaceList();
                this.setState({ workspaceList });
            } catch (error) {
                console.error('Error refreshing workspace list:', error);
            }
        });
    }

    filterResult = (text) => {
        const newWorkspace = (text.length > 0) ? this.state.workspaces.filter(wp => wp.workspace_name.includes(text)) : this.state.workspaces;
        this.setState({
            workspaceList: newWorkspace
        })
    }

    render() {
        const { contextPath } = getConfig().publicRuntimeConfig;
        const { orgKey } = this.state;
        return (
            <Fragment>
                <div className='col-12' style={{ marginBottom: "-1em" }}>
                    <h5>Workspaces</h5>
                    <div className='mb-4'>
                        {/* <InputText type="text" placeholder="Search Workspace..." className='p-inputtext-sm w-2 mb-4' /> */}
                        <span className="p-input-icon-right w-full">
                            <i className="pi pi-search" />
                            <InputText placeholder="Search Workspace" onChange={(e) => this.filterResult(e.target.value)} className='w-full' />
                        </span>
                    </div>
                </div>

                <ScrollPanel style={{ height: "20.5em" }} className='w-full'>
                    <div className='grid'>
                        {(this.state.loading) ?
                            <div className="mt-4 ml-3">
                                <p>loading...</p>
                            </div>
                        :   (this.state.workspaceList.length > 0) ?
                            this.state.workspaceList.filter(wp => (this.state.userRole !== 'superadmin') ? this.state.listedWorkspace.includes(wp.work_key) : true).map((workspace, idx) => (

                                <div className="col-12 lg:col-12 xl:col-6" key={idx}>
                                    {/* {console.log('data wp', workspace)} */}
                                    <Link href={orgKey + "/workspace/" + workspace.work_key}>

                                        <div className="card mb-0" style={{ cursor: "pointer" }}>

                                            <div className="">
                                                <span className="block text-900 font-medium mb-3">{workspace.workspace_name}</span>
                                                <Divider />
                                                <div className="text-500 font-small  text-sm">Team member :</div>

                                                <AvatarGroup className="mt-3">
                                                    {(workspace.workspace_members.length <= 4) ? (
                                                        workspace.workspace_members.map((member, idx) => (
                                                            <Avatar key={idx} image={`${contextPath}/demo/images/avatar/${(member.user.photo == null) ? 'default-photo.png' : member.user.photo}`} size="large" shape="circle" style={{backgroundColor: '#fff0', border: 'none'}}></Avatar>
                                                        ))) : (<>
                                                            {workspace.workspace_members.slice(0, 4).map((member, idx) => (
                                                                <Avatar key={idx} image={`${contextPath}/demo/images/avatar/${(member.user.photo == null) ? 'default-photo.png' : member.user.photo}`} size="large" shape="circle" style={{backgroundColor: '#fff0', border: 'none'}}></Avatar>
                                                            ))}
                                                            <Avatar label={'+' + workspace.workspace_members.length - 4} shape="circle" size="large" className='bg-gray-800' style={{ color: '#ffffff', backgroundColor: '#fff0', border: 'none' }}></Avatar>
                                                        </>
                                                    )}
                                                </AvatarGroup>
                                            </div>
                                        </div>

                                    </Link>
                                </div>
                            ))
                             : <div className="mt-4 ml-3">
                                <p>no data</p>
                            </div>
                        }

                    </div>

                </ScrollPanel>
            </Fragment>
        )
    }
}

Workspace.contextType = LayoutContext;

export default Workspace