import getConfig from 'next/config';
import React, { Component } from 'react';
import { LayoutContext } from '../../layout/context/layoutcontext';
import Link from 'next/link';
import { OrgServices } from '../../services/OrgServices';
import { emit, on } from '../../utils/EventEmitter';
import { listedOrg, requireAuth } from '../../middlewares/requireAuth';
import { debounce } from 'lodash';
import CreateClient from '../../components/CreateClient';
import EditClient from '../../components/EditCLient';
import socket from '../../utils/Socket';

import { Divider } from 'primereact/divider';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { ScrollPanel } from 'primereact/scrollpanel';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Messages } from 'primereact/messages';
import Workspace from '../../components/Dashboard/Workspace';
import Projects from '../../components/Dashboard/Projects';
import SummaryCard from '../../components/Dashboard/SummaryCard';
import { WorkspaceServices } from '../../services/WorkspaceServices';
import { ProjectService } from '../../services/ProjectServices';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userRole: null,
            workspaceList: [],
            projectList: [],
            msgs: React.createRef(),
            nonTeamMember: [],
            orgKey: this.props.myQuery.org_key,
            avaiableOrg: this.props.avaiableOrg,
            clientList: [],
            showDialog: false,
            listedWorkspace: [],
            dialogHeader: '',
            dialogContent: '',
            updatedCurrent: false,
            workspaceList: [],
            workspaceCount: 0,
            projectCount: 0,
            // summaryCardData: [
            //     { title: "Workspace", number: 0, color: "blue", icon: "pi pi-sitemap" },
            //     // { title: "Team", number: "12", color: "green", icon: "pi pi-users" },
            //     { title: "Member", number: "12", color: "teal", icon: "pi pi-user" },
            //     { title: "Project", number: "12", color: "orange", icon: "pi pi-briefcase" }
            // ]
        };
    }

    addMessages = async () => {
        if (this.state.msgs.current) {
            await this.state.msgs.current.show([
                { severity: 'info', summary: 'Info', detail: 'Message Content', sticky: true, closable: false },
            ]);
        }
    };

    async componentDidMount() {
        const { setOrgKeyLink } = this.context;
        const orgKey = this.props.myQuery.org_key;
        setOrgKeyLink(orgKey);
        sessionStorage.setItem('org_key', orgKey);
        try {
            const orgServices = new OrgServices();
            const nonTeamMember = await orgServices.nonTeamMember();
            const clientList = await orgServices.getClient(orgKey);

            
            const workspaceServices = new WorkspaceServices();
            const workspaceList = await workspaceServices.getWorkspaceList();
            this.setState({ 
                userRole: sessionStorage.getItem('userRole'),
                workspaceList,
                nonTeamMember, 
                clientList, 
                listedWorkspace: JSON.parse(sessionStorage.getItem('listedWorkspace')).map(wp => wp.work_key),
                avaiableOrg: JSON.parse(localStorage.getItem('orgList')),
                updatedCurrent: true
            }, () => {
                this.addMessages()
            });
        } catch (error) {
            console.error('Error fetching Data list:', error);
        }
        
        socket.emit('loggedIn', { org_key: orgKey, user_key: sessionStorage.getItem('user_key') });
    
        socket.on('getId', (res) => {
            sessionStorage.setItem('socket_id', res);
        });
    
        on('refreshOrgPage', async () => {
            try {
                const orgServices = new OrgServices();
                const nonTeamMember = await orgServices.nonTeamMember();
                this.setState({ nonTeamMember });
            } catch (error) {
                console.error('Error refreshing non-team members:', error);
            }
        });
    
        on('refreshMember', async () => {
            try {
                const orgServices = new OrgServices();
                const nonTeamMember = await orgServices.nonTeamMember();
                this.setState({ nonTeamMember });
            } catch (error) {
                console.error('Error refreshing non-team members:', error);
            }
        });
    
        on('refreshClient', async () => {
            this.setState({ showDialog: false });
            try {
                const orgServices = new OrgServices();
                const clientList = await orgServices.getClient(orgKey);
                this.setState({ clientList });
            } catch (error) {
                console.error('Error refreshing client list:', error);
            }
        });
    }
    
    componentWillUnmount() {
        // const { setShowSidebar } = this.context;
        // setShowSidebar(true);
        // Unsubscribe event listeners if any
    }

    filterMember = debounce((event) => {
        const eventValue = event.target.value;
        const filterednonTeamMember = this.state.nonTeamMember.filter((member) => {
            const tasks = member.tasks || [];
            return member.username.toLowerCase().includes(eventValue.toLowerCase()) || tasks.length > 0;
        });
        this.setState({ nonTeamMember: filterednonTeamMember });
        if (eventValue == '') {
            emit('refreshMember');
        }
    }, 1000);
    
    maskStyles = {
        backgroundColor: 'rgb(0 0 0 / 50%)',
    };

    changeOrgView = (event) => {
        window.location = `/${event.org_key}`;
    };

    countWorkspace = (data) => {
        this.setState({ workspaceCount: data.wk_count })
    }

    countProject = (data) => {
        this.setState({ projectCount: data.pj_count })
    }

    render() {
        const { contextPath } = getConfig().publicRuntimeConfig;
        const { nonTeamMember, showDialog, dialogHeader, dialogContent, orgKey, workspaceCount, projectCount } = this.state;

        if (nonTeamMember.length === 0) {
            return <>loading...</>;
        }
        
        const summaryCardData = [
            { title: "Workspace", number: workspaceCount, color: "blue", icon: "pi pi-sitemap" },
            // { title: "Team", number: "12", color: "green", icon: "pi pi-users" },
            { title: "Member", number: nonTeamMember.length, color: "teal", icon: "pi pi-user" },
            { title: "Project", number: projectCount, color: "orange", icon: "pi pi-briefcase" }];
        return (
            <div className="grid">
                <div className='col lg:mr-5'>
                    <div className='grid'>
                        <div className='col-12 grid'>
                            {/* <Messages ref={this.state.msgs} className='col-12' /> */}
                            {summaryCardData.map((summary, idx) => (
                                <SummaryCard key={idx} title={summary.title} number={summary.number} color={summary.color} icon={summary.icon} />
                            ))}
                        </div>
                        <div className='col-6'>
                            <Workspace data={this.state.workspaceList} orgKey={this.state.orgKey} getWorkspaceCount={this.countWorkspace} />
                        </div>
                        <div className='col-6'>
                            <Projects orgKey={this.state.orgKey} getProjectCount={this.countProject} />
                        </div>
                    </div>
                </div>
                <div className='col-3'>
                    <div className='col-12 task-card shadow'>
                        <div className="grid">
                            <div className='col-12'>
        
                                <Dropdown
                                    size="small"
                                    placeholder='Change Organization View'
                                    onChange={(e) => this.changeOrgView(e.value)}
                                    options={this.state.avaiableOrg}
                                    optionLabel="org_name"
                                    className="w-full bg-white p-inputtext-sm bg-gray-100 text-gray-900" />
                                <Divider />
        
                                <span className='font-medium text-900 mb-2'>Organization Members</span>
                                {/* <br />
                                <span className='font-medium text-500 text-sm'>{nonTeamMember.length} Members</span>
        
                                <Divider /> */}
        
                                <InputText type="text" placeholder="Search Member..." onChange={this.filterMember} className='p-inputtext-sm w-full mb-4 mt-3' />
                                <ScrollPanel style={{ height: "10em" }} className='w-full'>
                                    {
                                        (nonTeamMember.length > 0) ? nonTeamMember.map((user, idx) => (
                                            <div className='mt-3' key={idx}>
                                                <Link href={`${orgKey}/member/${user.user_key}`}>
                                                    <div className='flex hover:bg-gray-200 active:text-gray-100 active:bg-gray-400 p-2' style={{ cursor: "pointer", borderRadius: "5px" }}>
                                                        <Avatar image={`${contextPath}/demo/images/avatar/${(user.photo == null) ? 'default-photo.png' : 'user.photo'}`} shape="circle" />
                                                        <p className='text-lg ml-2 mt-1'>
                                                            {user.username}
                                                            {(!user.verified) ? (<>
                                                                <br></br>
                                                                <small className='text text-orange-400'>invited, waiting verified</small>
                                                            </>) : ('')}
        
                                                        </p>
                                                    </div>
        
                                                </Link>
                                            </div>
                                        )) : <></>
                                    }
        
                                </ScrollPanel>
        
                            </div>
        
                        </div>
                    </div>
                    <div className='col-12 task-card shadow'>
                        <div className="grid">
                            <div className='col-12'>
                                <div className='flex'>
                                    <div className='col-6'>
                                        <span className='font-medium text-900'>Clients</span>
                                        <br />
                                        <span className='font-medium text-500 text-sm'>{this.state.clientList.length} Client</span>
                                    </div>
                                    {(this.state.userRole !== 'user') && 
                                        <div className='col-6 text-right'>
                                            <Button icon="pi pi-plus"
                                                onClick={() => {
                                                    // setShowDialog(true);
                                                    // setDialogHeader("Add Client");
                                                    // setDialogContent(<CreateClient orgKey={orgKey} />)
                                                    this.setState({
                                                        showDialog: true,
                                                        dialogHeader: "Add Client",
                                                        dialogContent: <CreateClient orgKey={orgKey} />
                                                    })
                                                }} tooltip='add client' tooltipOptions={{ position: 'bottom' }} className='p-button-rounded' />
                                        </div>
                                    }
                                </div>
        
        
                                <Divider />
        
                                {/* <InputText type="text" placeholder="Search Member..." className='p-inputtext-sm w-full mb-4' /> */}
                                <ScrollPanel style={{ height: "10em" }} className='w-full'>
                                    {
                                        this.state.clientList.map((client) => (
        
                                            <div className='mt-3 pointer' key={client.client_key} onClick={() => {
                                                this.setState({
                                                    showDialog: true,
                                                    dialogHeader: "Edit Client",
                                                    dialogContent: <EditClient client={client} />
                                                })
                                                // setShowDialog(true);
                                                // setDialogHeader("Edit Client");
                                                // setDialogContent(<EditClient client={client} />)
                                            }}>
                                                <div className='flex hover:bg-gray-200 active:text-gray-100 active:bg-gray-400 p-2' style={{ cursor: "pointer", borderRadius: "5px" }}>
                                                    <p className='text-lg ml-2 mt-1'>
                                                        {client.name}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    }
        
                                </ScrollPanel>
        
                            </div>
        
                        </div>
                    </div>
        
                </div>
        
                <Dialog header={<div className='grid'>
                    <div className='col'>
                        <span>{dialogHeader}</span>
        
                    </div>
                    {/* <div className='col-1 mr-6'>
                                    <Button icon="pi pi-window-maximize" className="p-button-secondary p-button-text p-0 btn btn-sm" onClick={() => { setVisibleFullScreen(true) }} />
                                </div> */}
        
                </div>} maskStyle={this.maskStyles} modal={true} visible={showDialog} className='p-dialog' style={{ width: '30vw', backgroundColor: "#fff" }} onHide={() => this.setState({showDialog: false})}>
                    {dialogContent}
                </Dialog>
        
            </div>
        );
    }
}

Dashboard.contextType = LayoutContext;

export async function getServerSideProps(context) {
    const { query } = context;
    return {
        props: {
            myQuery: query
        },
    };
}

export default requireAuth(listedOrg(Dashboard));


