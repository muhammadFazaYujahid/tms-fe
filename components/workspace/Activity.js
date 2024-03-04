import React, { useEffect, useRef, useState } from 'react';

import { BreadCrumb } from 'primereact/breadcrumb';
import { useRouter } from 'next/router';
import { Chip } from 'primereact/chip';
import { WorkspaceServices } from '../../services/WorkspaceServices';
import { ScrollPanel } from 'primereact/scrollpanel';
import { on } from '../../utils/EventEmitter';


const Activity = ({ workKey }) => {

    const [work_key, setwork_key] = useState(workKey);
    const [workActivity, setWorkActivity] = useState([]);
    useEffect(() => {
        const workspaceServices = new WorkspaceServices;
        workspaceServices.getActivity(workKey).then((res) => setWorkActivity(res));

        on('refreshWorkActivity', () => {
            workspaceServices.getActivity(workKey).then((res) => setWorkActivity(res));
        })
    }, [])

    return (<>
        <h5>Workspace Activity</h5>

        <div className="grid mb-3 task-card">
            <ScrollPanel style={{ height: "15rem" }} className='w-full'>
                {workActivity.map((activity) => (
                    <div className='col-12 mt-3' key={activity.id}>
                        <span className='text-lg'><i className='pi pi-user border-1 p-2 mr-1' style={{ borderRadius: "100%" }}> </i> <b>{activity.username}</b> {activity.action}</span>
                    </div>

                ))}
            </ScrollPanel>



        </div>
    </>
    );
};

export default Activity;
