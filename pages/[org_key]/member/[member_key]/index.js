import React, { useState, useEffect, useContext } from 'react';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';

import getConfig from 'next/config';

import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { Divider } from 'primereact/divider';
import Link from 'next/link';
import { ScrollPanel } from 'primereact/scrollpanel';
import { UserServices } from '../../../../services/UserServices';

const Member = ({ myQuery }) => {

    const { setShowSidebar } = useContext(LayoutContext);

    const [userDetail, setUserDetail] = useState([]);
    const [taskList, setTaskList] = useState([]);
    const [projectList, setProjectList] = useState([]);

    useEffect(() => {
        setShowSidebar(false);

        const userService = new UserServices;
        userService.getDetail(myQuery.member_key).then((res) => setUserDetail(res.data));
        userService.getMemberTask(myQuery.member_key).then((res) => setTaskList(res));
        userService.getMemberProject(myQuery.member_key).then((res) => setProjectList(res));
        return () => {
            setShowSidebar(true);
        }
    }, [])

    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    if (userDetail == null) {
        return <>loading...</>
    }

    return (<>
        <div className="grid">
            <div className='col-12 m-0' style={{ position: "", background: "url('https://primefaces.org/cdn/primereact/images/galleria/galleria12.jpg')", height: "25vh" }}>
                {/* <Avatar image={`${contextPath}/demo/images/avatar/face16.jpg`} className='img-profile' shape="circle" /> */}
            </div>

            <div className='col-12 mt-4'>
                <div className='grid'>

                    <div className='col lg:col-3'>
                        <div className="card bg-transparent border-none">
                            <h5>{userDetail.username}</h5>
                            <div className='col-12 task-card'>
                                <div className="grid">
                                    <div className='col-12 mt-2'>

                                        <span className='font-medium text-900'>Contact</span>

                                        <div className='mt-3'>
                                            <Link href="">
                                                <div className='flex'>
                                                    <i className='pi pi-envelope p-2 mr-1'> </i>
                                                    <span className='text-lg ml-2 mt-1'>
                                                        {userDetail.email}
                                                    </span>
                                                </div>

                                            </Link>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="col lg:col-4">
                        <div className="card bg-transparent border-none">
                            <div className='grid'>

                                <div className='col-12'>
                                    <h5>Handled Issues</h5>

                                    <ScrollPanel style={{ height: "50vh" }} className="grid c mb-3 task-card">
                                        {taskList.map((task) => (
                                            <div className='col-12 mt-3 p-0'>

                                                <Link href="#">
                                                    <div className='w-full hover:bg-gray-200 p-2' style={{ cursor: "pointer", borderRadius: "5px" }}>
                                                        <div className='flex -mb-3'>
                                                            <p className='text-md text-gray-900 -ml-2 col-8'>
                                                                {task.task_name}
                                                            </p>
                                                            <p className='text-md text-gray-900 col-4 text-right'>
                                                                {task.story_point} point
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <h5 className='text-sm text-gray-500'>
                                                                {task.task_key}
                                                            </h5>

                                                        </div>
                                                    </div>
                                                </Link>

                                            </div>

                                        ))}
                                    </ScrollPanel>

                                </div>

                            </div>

                        </div>
                    </div>
                    <div className="col lg:col-4">
                        <div className="card bg-transparent border-none">
                            <div className='grid'>

                                <div className='col-12'>
                                    <h5>Handled Projects</h5>

                                    <ScrollPanel style={{ height: "50vh" }} className="grid c mb-3 task-card">
                                        {projectList.map((project) => (

                                            <div className='col-12 mt-3 p-0'>

                                                <Link href="#">
                                                    <div className='w-full hover:bg-gray-200 p-2' style={{ cursor: "pointer", borderRadius: "5px" }}>
                                                        <p className='text-md text-gray-900'>
                                                            {project.project_name}
                                                        </p>
                                                        <h5 className='text-sm text-gray-500' style={{ marginTop: "-1em", marginBottom: "0" }}>
                                                            {project.project_key}
                                                        </h5>
                                                    </div>
                                                </Link>

                                            </div>
                                        ))}
                                    </ScrollPanel>

                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div >
    </>
    );
};

export async function getServerSideProps(context) {
    const { query } = context;
    return {
        props: {
            myQuery: query
        },
    };
}

export default Member;
