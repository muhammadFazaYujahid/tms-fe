import { Component, Fragment } from "react";
import { WorkspaceServices } from "../../services/WorkspaceServices";
import { ScrollPanel } from "primereact/scrollpanel";
import { LayoutContext } from "../../layout/context/layoutcontext";
import { Divider } from "primereact/divider";
import { Avatar } from "primereact/avatar";
import { AvatarGroup } from "primereact/avatargroup";
import Link from "next/link";
import getConfig from "next/config";

class SummaryCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            workspaceList: [],
            listedWorkspace: [],
            orgKey: this.props.orgKey
        }
    }
    async componentDidMount() {
    }
    render() {
        const { contextPath } = getConfig().publicRuntimeConfig;
        const { userRole } = this.context;
        const { orgKey } = this.state;
        return (
            <div className="col">
                <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">{this.props.title}</span>
                            <div className="text-900 font-medium text-xl">{this.props.number}</div>
                        </div>
                        <div className={`flex align-items-center justify-content-center bg-${this.props.color}-100 border-round`} style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className={`${this.props.icon} text-${this.props.color}-500 text-xl`}></i>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

SummaryCard.contextType = LayoutContext;

export default SummaryCard