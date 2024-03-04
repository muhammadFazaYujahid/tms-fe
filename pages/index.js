import { useContext, useEffect } from 'react';
import { LayoutContext } from '../layout/context/layoutcontext';


const Dashboard = () => {
    const { setShowSidebar } = useContext(LayoutContext);

    useEffect(() => {
        window.location.href = '/auth/login';
        setShowSidebar(false);

        return () => {
            setShowSidebar(true);
        }
    }, [])

    // const contextPath = getConfig().publicRuntimeConfig.contextPath;

    // return (
    //     <div className="grid">
    //         <div className='col-12'>
    //             <div className='col-12' style={{ marginBottom: "-1em" }}>

    //                 <h5>Workspaces</h5>
    //             </div>

    //             <div className='grid'>

    //                 <div className="col-12 lg:col-6 xl:col-3">
    //                     <Link href="/workspace/dashboard">

    //                         <div className="card mb-0" style={{ cursor: "pointer" }}>

    //                             <div className="">
    //                                 <span className="block text-900 font-medium mb-3">Workspace 1</span>
    //                                 <Divider />
    //                                 <div className="text-500 font-small  text-sm">Team member :</div>

    //                                 <AvatarGroup className="mt-3">
    //                                     <Avatar image={`${contextPath}/demo/images/avatar/amyelsner.png`} size="large" shape="circle"></Avatar>
    //                                     <Avatar image={`${contextPath}/demo/images/avatar/asiyajavayant.png`} size="large" shape="circle"></Avatar>
    //                                     <Avatar image={`${contextPath}/demo/images/avatar/asiyajavayant.png`} size="large" shape="circle"></Avatar>
    //                                     <Avatar image={`${contextPath}/demo/images/avatar/asiyajavayant.png`} size="large" shape="circle"></Avatar>
    //                                     <Avatar label="+2" shape="circle" size="large" className='bg-gray-800' style={{ color: '#ffffff' }}></Avatar>
    //                                 </AvatarGroup>
    //                             </div>
    //                         </div>

    //                     </Link>
    //                 </div>

    //                 <div className="col-12 lg:col-6 xl:col-3">
    //                     <Link href="/workspace/dashboard">

    //                         <div className="card mb-0" style={{ cursor: "pointer" }}>

    //                             <div className="">
    //                                 <span className="block text-900 font-medium mb-3">Workspace 1</span>
    //                                 <Divider />
    //                                 <div className="text-500 font-small text-sm">Team member :</div>

    //                                 <AvatarGroup className="mt-3">
    //                                     <Avatar image={`${contextPath}/demo/images/avatar/amyelsner.png`} size="large" shape="circle"></Avatar>
    //                                     <Avatar image={`${contextPath}/demo/images/avatar/asiyajavayant.png`} size="large" shape="circle"></Avatar>
    //                                     <Avatar image={`${contextPath}/demo/images/avatar/asiyajavayant.png`} size="large" shape="circle"></Avatar>
    //                                     <Avatar image={`${contextPath}/demo/images/avatar/asiyajavayant.png`} size="large" shape="circle"></Avatar>
    //                                     <Avatar label="+2" shape="circle" size="large" className='bg-gray-800' style={{ color: '#ffffff' }}></Avatar>
    //                                 </AvatarGroup>
    //                             </div>
    //                         </div>

    //                     </Link>
    //                 </div>

    //             </div>


    //         </div>
    //         <div className='col-12'>
    //             <div className='col-12 mt-6' style={{ marginBottom: "-1em" }}>

    //                 <h5>Recent Projects</h5>
    //             </div>

    //             <div className='grid'>

    //                 <div className="col-12 lg:col-6 xl:col-3">
    //                     <Link href="/projects/roadmap">
    //                         <div className="card mb-0" style={{ cursor: "pointer" }}>
    //                             <div className="">
    //                                 <span className="block text-900 font-medium mb-3">Project 1</span>
    //                                 <Divider />
    //                                 <div className="text-500 font-small text-sm">Worked by :</div>

    //                                 <AvatarGroup className="mt-3">
    //                                     <Avatar image={`${contextPath}/demo/images/avatar/amyelsner.png`} size="large" shape="circle"></Avatar>
    //                                     <Avatar image={`${contextPath}/demo/images/avatar/asiyajavayant.png`} size="large" shape="circle"></Avatar>
    //                                     <Avatar image={`${contextPath}/demo/images/avatar/asiyajavayant.png`} size="large" shape="circle"></Avatar>
    //                                     <Avatar image={`${contextPath}/demo/images/avatar/asiyajavayant.png`} size="large" shape="circle"></Avatar>
    //                                     <Avatar label="+2" shape="circle" size="large" className='bg-gray-800' style={{ color: '#ffffff' }}></Avatar>
    //                                 </AvatarGroup>
    //                             </div>
    //                         </div>

    //                     </Link>
    //                 </div>

    //             </div>

    //         </div>

    //     </div>
    // );
    // router.replace('/auth/login');
    return false;
};

export default Dashboard;
