import { Component, Fragment } from "react";
import { WorkspaceServices } from "../../services/WorkspaceServices";
import { ScrollPanel } from "primereact/scrollpanel";
import { LayoutContext } from "../../layout/context/layoutcontext";
import { Divider } from "primereact/divider";
import { Avatar } from "primereact/avatar";
import { AvatarGroup } from "primereact/avatargroup";
import Link from "next/link";
import getConfig from "next/config";
import { ProjectService } from "../../services/ProjectServices";
import { Badge } from "primereact/badge";
import { InputText } from "primereact/inputtext";
import { on } from "../../utils/EventEmitter";

class Projects extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userRole: null,
            workspaceList: [],
            listedProject: [],
            projectList: [],
            loading: true,
            projects: [],
            orgKey: this.props.orgKey
        }
    }
    componentDidMount() {
        try {
            const projectService = new ProjectService();
            projectService.getProjectList().then((response) => {
                const projectList = response;
                this.props.getProjectCount({pj_count: projectList.length});
                this.setState({
                    userRole: sessionStorage.getItem('userRole'),
                    projectList,
                    loading: false,
                    projects: projectList,
                    listedProject: JSON.parse(sessionStorage.getItem('listedProject')).map(pj => pj.project_key)
                })
            })

            on('refreshOrgPage', async () => {
                try {
                    const projectService = new ProjectService();
                    const projectList = await projectService.getProjectList();
                    this.setState({ projectList });
                } catch (error) {
                    console.error('Error refreshing project list:', error);
                }
            });
            
        } catch (error) {
            
        }
    }

    filterResult = (text) => {
        const newProjects = (text.length > 0) ? this.state.projects.filter(wp => wp.project_name.includes(text)) : this.state.projects;
        
        this.setState({
            projectList: newProjects
        })
    }

    render() {
        const { contextPath } = getConfig().publicRuntimeConfig;
        const { userRole } = this.context;
        const { orgKey } = this.state;
        return (
            <Fragment>
                <div className='col-12' style={{ marginBottom: "-1em" }}>
                    <h5>Projects</h5>
                    <div className='mb-4'>
                        {/* <InputText type="text" placeholder="Search Project..." onChange={filterMember} className='p-inputtext-sm w-2 mb-4' /> */}
                        <span className="p-input-icon-right w-full">
                            <i className="pi pi-search" />
                            <InputText placeholder="search Project" onChange={(e) => this.filterResult(e.target.value)} className='w-full' />
                        </span>
                    </div>
                </div>

                <ScrollPanel style={{ height: "21.5em" }} className='w-full'>
                    <div className='grid'>
                    {(this.state.loading) ?
                            <div className="mt-4 ml-3">
                                <p>loading...</p>
                            </div> 
                    : 
                        (this.state.projectList.length > 0) ? 
                            this.state.projectList.filter(pj => (this.state.userRole !== 'superadmin') ? this.state.listedProject.includes(pj.project_key) : true).map((project) => (
                                <div className="col-12 lg:col-12 xl:col-6" key={project.project_key}>

                                    <Link href={orgKey + "/project/" + project.project_key + "/backlog"}>
                                        <div className="card mb-0" style={{ cursor: "pointer" }}>
                                            <div className="">
                                                <span className="block text-900 font-medium mb-3">{project.project_name}</span>
                                                <Divider />
                                                <div className='py-0'>
                                                    <div className="my-1 text-500 font-small text-sm">Worked by : <Badge value={project.workspace_name} className='m-1' severity="info"></Badge></div>
                                                </div>

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

Projects.contextType = LayoutContext;

export default Projects