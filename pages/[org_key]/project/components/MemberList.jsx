import { Avatar } from "primereact/avatar"
import { AvatarGroup } from "primereact/avatargroup"
import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { Fragment, useContext, useEffect, useMemo, useState } from "react"
import InviteProjectDialog from '@components/dialog-content/InviteProjectDialog';
import ProjectBloc from "../../../../services/Blocs/projectBloc"
import { emit, on } from '@utils/EventEmitter';
import apiResponse from "../../../../services/apiResponse"
import { LayoutContext } from "../../../../layout/context/layoutcontext"
import { Controller, useForm } from "react-hook-form"
import { InputText } from "primereact/inputtext"
import { TreeSelect } from "primereact/treeselect"

const MemberList = () => {
    
    const { setContentDialog, showToast } = useContext(LayoutContext);

    const [memberList, setMemberList] = useState([]);
    const [memberPhotos, setMemberPhotos] = useState([]);
    const [inviteDialog, setInviteDialog] = useState(false);
    const [workspace, setWorkspace] = useState([])

    const projectBloc = new ProjectBloc;
    const blocForInvite = useMemo(() => new ProjectBloc(), []);;
    const maskStyles = {
        backgroundColor: 'rgb(0 0 0 / 50%)',
    };
    
    const fetchUserPhoto = () => {
        projectBloc.fetchGetUserPhoto(sessionStorage.getItem('project_key'));
    }
    useEffect(() => {
        fetchUserPhoto();
        projectBloc.fetchInviteUser();
        const getUserPhoto = projectBloc.getUserPhoto.subscribe((result) => {
            switch (result.status) {
                case apiResponse.COMPLETED:
                    setMemberList(result.data)
                    // emit('refreshBacklog');
                    break
                case apiResponse.ERROR:
                    console.error('error', result.data)
                    break
                default:
                    break
            }
        })
        
        const fetchUser = projectBloc.inviteUser.subscribe((result) => {
            switch (result.status) {
                case apiResponse.COMPLETED:
                    const { editedData, workspace } = result.data.data
                    setTeamList(editedData);
                    setTeamFormActive(true),
                    setWorkspace(workspace)
                    break
                case apiResponse.ERROR:
                    console.error('error', result.data)
                    break
                default:
                    break
            }
        })
    
      return () => {
        getUserPhoto.unsubscribe();
        fetchUser.unsubscribe();
      }
    }, [])

    
    useEffect(() => {
        console.log('use efect should render only when blocForInvite change')   
        const invite = projectBloc.inviteToProject.subscribe((result) => {
            console.log('masuk callbak', result)
            switch (result.status) {
                case apiResponse.LOADING:
                    setContentDialog(false);
                    emit('inviteMemberSuccess');
                    showToast({
                        severity: 'success',
                        summary: 'Added',
                        detail: 'Member Added Successfully',
                        sticky: false
                    });
                    break
                case apiResponse.ERROR:
                    console.error('error', result.data)
                    showToast({
                        severity: 'error',
                        summary: 'Invitation Failed',
                        detail: res.message,
                        sticky: false
                    });
                    break
                default:
                    break
            }
        })
        
        return () => {
            invite.unsubscribe();
        }
    }, [blocForInvite])
        

    const defaultValues = {
        workspace: {},
    };
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        const selectedMemberId = Object.keys(selectedNodeKeys);
        const selectedTeam = teamList.filter(team => selectedMemberId.includes(team.key));
        const selectedMember = workspace.workspace_members.filter((user) => selectedMemberId.includes(user.member_key))
        data.selectedTeam = selectedTeam;
        data.selectedMember = selectedMember;
        data.workspace = workspace;
        blocForInvite.fetchInviteToProject(data);
    };

    const [selectedTeam, setSelectedTeam] = useState([]);
    const [teamList, setTeamList] = useState([]);
    const [teamFormActive, setTeamFormActive] = useState(false);
    const [selectedNodeKeys, setSelectedNodeKeys] = useState(null);

    useEffect(() => {
        
        on('inviteMemberSuccess', () => {
            fetchUserPhoto();
            setInviteDialog(false);
        })
    
        return () => {
        
        }
    }, [])
    
    const fetchPhoto = async (photo) => {
        projectBloc.fetchGetPhoto(photo);
    }

    useEffect(() => {
        if (memberList.length > 0) {
            memberList.slice(0, 4).map((member) => fetchPhoto(member.photo))
        }
        projectBloc.getPhoto.subscribe((result) => {
            switch (result.status) {
                case apiResponse.COMPLETED:
                    setMemberPhotos([...memberPhotos, result.data.data]);
                    // emit('refreshBacklog');
                    break
                case apiResponse.ERROR:
                    console.error('error', result.data)
                    break
                default:
                    break
                }
        })
    
      return () => {
        
      }
    }, [memberList])

    return (
        <Fragment>
            <AvatarGroup className="mb-3" style={{ marginTop: "-0.4em" }}>
                {memberList.slice(0, 4).map((member, index) => (
                    <Avatar image={memberPhotos[index]} size="large" shape="circle" key={index}></Avatar>
                ))}
                {(memberList.length - 4 >= 1) ? <Avatar label={memberList.length - 4} shape="circle" size="large" className='bg-gray-800' style={{ color: '#ffffff' }}></Avatar> : <></>}
                <Button icon="pi pi-user-plus" onClick={() => { setInviteDialog(true) }} className='p-button-rounded ml-2 p-button-secondary' aria-label="Filter" />
            </AvatarGroup>

            <Dialog header="Invite People" maskStyle={maskStyles} visible={inviteDialog} className='p-dialog' style={{ width: '30vw', backgroundColor: "#fff" }} modal onHide={() => setInviteDialog(false)}>
                {/* <InviteProjectDialog /> */}
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className='grid'>

                        <div className="col-12">
                            <div className="card border-none p-fluid">
                                <div className="field">
                                    <Controller
                                        name='project_name'
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <InputText {...field} value={workspace.workspace_name} readOnly placeholder='Project Name' type="text" className='mb-3' />
                                            </>
                                        )}
                                    />
                                </div>

                                <div className="field">
                                    <TreeSelect
                                        value={selectedNodeKeys}
                                        disabled={(!teamFormActive) ? true : false}
                                        onChange={(e) => { setSelectedNodeKeys(e.value); setSelectedTeam(e) }} options={teamList}
                                        filter
                                        selectionMode="checkbox"
                                        display="chip"
                                        placeholder="Choose Member"></TreeSelect>
                                    <small>*only member from {workspace.workspace_name} that can be invited. if you want to invite outsiders, please invite to workspace first</small>
                                </div>

                            </div>

                        </div>
                        <div className='col-12'>
                            <Button style={{ float: "right" }} className='mx-2' label="Invite" />
                        </div>
                    </div>
                </form>
            </Dialog>
        </Fragment>
    )
}

export default MemberList;