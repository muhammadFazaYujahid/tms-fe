import Link from "next/link";
import getConfig from 'next/config';
import { Button } from "primereact/button";
import React, { Component, Fragment } from "react";
import { OrgServices } from "../../../services/OrgServices";
import { Badge } from "primereact/badge";
import { Dialog } from "primereact/dialog";
import EditOrgData from "../../../components/dialog-content/EditOrgData";
import { emit, on } from "../../../utils/EventEmitter";
import { OverlayPanel } from "primereact/overlaypanel";
import EditUserRole from "../../../components/dialog-content/EditUserRole";
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import OrgBloc from "../../../services/Blocs/OrgBloc";
import apiResponse from "../../../services/apiResponse";
import { Sidebar } from "primereact/sidebar";
import ImportUser from "../../../components/importData/ImportUser";

class Setting extends Component {
    userRole = 'user';
    orgBloc = new OrgBloc();
    constructor(props) {
        super(props);
        this.state = {
            orgData: [],
            orgMember: [],
            contentDialog: false,
            editUserRoleOp: React.createRef(),
            selectedUser: [],
            removeUser: false,
            toastOrgDetail: React.createRef(),
            visibleFullScreen: false
        };
    }

    fetchOrg = () => {
        this.orgBloc.fetchGetOrgByKey();
    }

    componentDidMount() {
        this.userRole = sessionStorage.getItem('userRole');
        this.fetchOrg();
        
        this.orgBloc.getOrgByKey.subscribe((result) => {
            switch (result.status) {
                case apiResponse.COMPLETED:
                    const response = result.data.data
                    const member = response.users.map((user) => {
                        return {
                            username: user.username,
                            photo: user.photo,
                            createdAt: user.user_has_org.createdAt,
                            role: user.user_has_org.role,
                            user_key: user.user_key
                        }
                    })
                    this.setState({
                        orgData: response,
                        orgMember: member
                    })
                    break
                case apiResponse.ERROR:
                    console.error('error', result.data)
                    break
                default:
                    break
            }
        })

        on('refreshOrgDetail', () => {
            this.fetchOrg();
        })

        on('refreshRoleOp', () => {
            this.state.editUserRoleOp.current.toggle(false)
        })

    }
    toggleDialogStatus = (stastus) => {
        this.setState({
            contentDialog: stastus
        })
    }
    
    accept = () => {
        // this.state.toastOrgDetail.current.show({ severity: 'success', summary: 'Removed', detail: 'User Removed', life: 3000 });
        const data = {
            user_key: this.state.selectedUser.user_key,
            org_key: this.state.orgData.org_key,
            activity: {
                action: `Remove ${this.state.selectedUser.username} From`,
                object_one: this.state.orgData.organization_name,
                object_two: null,
                type: 'organization',
                related_code: this.state.orgData.org_key,
                url: window.location.href,
                additional_text: ''
            }
        }

        const orgServices = new OrgServices;
        orgServices.deleteUser(data)
        .then((res) => {
            if (!res.success) {
                return this.state.toastOrgDetail.current.show({ severity: 'error', summary: 'Failed', detail: res.message, life: 3000 });
            }
            emit('refreshOrgDetail');
            this.state.toastOrgDetail.current.show({ severity: 'success', summary: 'Removed', detail: 'User Removed', life: 3000 });
        });
        // console.log('data', data)
    };

    reject = () => {
        console.log('direject')
    };

    confirmDelete = (event) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Remove User From Organization?',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept: this.accept,
        });
    };

    componentWillUnmount() {
        this.orgBloc.getOrgByKey.unsubscribe();
    }

    handleCloseSidebar = () => {
        this.setState({
            visibleFullScreen: false
        })
    };
    render() {
        const { contextPath } = getConfig().publicRuntimeConfig;
        const maskStyles = {
            backgroundColor: 'rgb(0 0 0 / 50%)',
        };
        return (
            <Fragment>
                
            <Toast ref={this.state.toastOrgDetail} />
            <div className="grid">
            <div className='col-12'>
                <div className='grid'>
                    <div className='col'></div>
                    <div className='col-12 lg:col-8 m-0 mix-blend-difference' style={{ position: "", background: "url('https://primefaces.org/cdn/primereact/images/galleria/galleria12.jpg')", height: "25vh" }}>
                        {/* <Avatar image={profile.photoUrl} className='img-profile' shape="circle" /> */}
                        {/* <img style={{position: '', top: '8rem', left: '40px', maxWidth:"200px" }} className="relative" src={this.state.orgData.logo} alt="logo" /> */}
                        {/* <img style={{position: 'relative', top: '8rem', left: '40px'}} src={`${contextPath}/layout/images/logo-milennia.png`} width="200px" alt="logo" /> */}
                        <h1 className="text-white uppercase mix-blend-difference" style={{position: 'relative', top: '8rem', left: '40px'}} >Organization Detail</h1>
                    </div>
                    <div className='col'></div>

                </div>
            </div>
            <div className='col-12 mt-4'>
                <div className='grid'>
                    <div className='col'></div>
                    <div className='col-12 lg:col-6 m-0'>

                        <div className="card bg-transparent border-none">
                            {/* <h5>{this.state.orgData.organization_name}</h5> */}
                            <div className='col-12 task-card'>
                                <div className="grid">

                                    <div className='col-12'>
                                        <span className='font-small text-500'>Organization Name</span>

                                        <div className=''>
                                            <Link href="">
                                                <div className='flex'>
                                                    <span className='text-lg mt-1'>
                                                        {this.state.orgData.organization_name}
                                                    </span>
                                                </div>

                                            </Link>
                                        </div>

                                    </div>
                                    <div className='col-12'>

                                        <span className='font-small text-500'>Owner</span>

                                        <div className=''>
                                            <Link href="">
                                                <div className='flex'>
                                                    <span className='text-lg mt-1'>
                                                        {this.state.orgMember.find(user => user.role === 'superadmin')?.username}
                                                    </span>
                                                </div>

                                            </Link>
                                        </div>

                                    </div>
                                    <div className='col-12'>

                                        <span className='font-small text-500'>Logo</span>

                                        <div className=''>
                                            <Link href="">
                                                <div className='flex'>
                                                    <span className='text-lg mt-1'>
                                                    <img style={{maxWidth:"100px" }} className="relative" src={this.state.orgData.logo} alt="logo" />
                                                    </span>
                                                </div>

                                            </Link>
                                        </div>

                                    </div>

                                    <div className='col-12'>
                                        <Button style={{ float: "right" }}  visible={(this.userRole !== 'user')} onClick={() => this.setState({contentDialog: true})} className='mx-2 p-button-sm' label="Edit Org Detail" />
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="card bg-transparent border-none">
                            <div className="block lg:flex" style={{justifyContent: "space-between"}}>
                                <h5>Organization Member</h5>
                                <Button
                                    type="button" 
                                    icon="pi pi-upload" 
                                    severity="primary" 
                                    rounded 
                                    onClick={() => {
                                        this.setState({
                                            visibleFullScreen: true
                                        })
                                    }} 
                                />
                            </div>
                            <div className='col-12 task-card mt-3'>
                                <div className="grid">
                                    
                                    <div className='col-12'>
                                        {this.state.orgMember.filter(user => user.role !== 'superadmin').map((user, idx) => (
                                            <div className='task-card p-3 my-2' key={idx}>
                                                <div className="surface-0 bg-transparent border">
                                                    <div className="flex align-items-center flex-column lg:justify-content-between lg:flex-row">
                                                        <div>
                                                            <div className="font-medium text-xl text-900">
                                                                <span className='ml-2  text-lg'>{user.username}</span>
                                                                <Badge value={user.role} className="ml-2"></Badge>
                                                            </div>
                                                        </div>
                                                        <div style={{ float: "right" }} className='flex-grow-1 flex align-items-end justify-content-end font-bold text-white m-2 px-5' onClick={(e) => e.stopPropagation()}>
                                                            <Button visible={(this.userRole === 'superadmin')} onClick={(e) => {this.state.editUserRoleOp.current.toggle(e), this.setState({ selectedUser: user })}} icon="pi pi-user-edit" tooltip="Change Role" tooltipOptions={{ position: 'bottom' }} style={{ margin: "-0.6em 0", paddingBottom: '0.6em' }} className={`p-button-rounded p-button-success p-button-outlined mr-1`} />
                                                            
                                                            <OverlayPanel ref={this.state.editUserRoleOp} showCloseIcon>
                                                                <EditUserRole data={this.state.selectedUser} />
                                                            </OverlayPanel>

                                                            <Button visible={(this.userRole === 'superadmin')} onClick={(e) => {this.confirmDelete(e); this.setState({ selectedUser: user })}} icon="pi pi-trash" tooltip="Remove User" tooltipOptions={{ position: 'bottom' }} style={{ margin: "-0.6em 0", paddingBottom: '0.6em' }} className={`p-button-rounded p-button-danger p-button-outlined ml-1`} />
                                                            <ConfirmPopup visible={this.state.removeUser} dismissable reject={() => this.setState({removeUser: false})} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col'></div>

                    <Dialog header={'Edit Organization Detail'} maskStyle={maskStyles} visible={this.state.contentDialog} className='p-dialog' style={{ width: '40vw', backgroundColor: "#fff" }} modal onHide={() => this.setState({contentDialog: false})}>
                        <EditOrgData orgData={this.state.orgData} toggleDialog={this.toggleDialogStatus} />
                    </Dialog>

                    <Sidebar visible={this.state.visibleFullScreen} onHide={() => this.handleCloseSidebar()} baseZIndex={9000} fullScreen>
                        <ImportUser />
                    </Sidebar>
                </div>
            </div>

        </div >
            </Fragment>
        )
    }
}

export default Setting;