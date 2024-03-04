import React from 'react';
import { Divider } from 'primereact/divider';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Skeleton } from 'primereact/skeleton';

const TaskLoading = () => {

    return (<>


        <div className='grid'>
            <div className='col'>
                <ScrollPanel style={{ height: "85vh" }}>

                    <div className='flex'>
                        <Skeleton width="8rem" height="2rem" className='p-1 m-2 px-2 ' ></Skeleton>
                        <Skeleton width="8rem" height="2rem" className='p-1 m-2 px-2 ' ></Skeleton>
                        <Skeleton width="8rem" height="2rem" className='p-1 m-2 px-2 ' ></Skeleton>

                    </div>
                    <Skeleton width="8rem" height="2rem" className='p-1 m-2 px-2 mt-5' ></Skeleton>
                    <Skeleton width="100%" height="10rem" className='p-1 m-2 px-2 ' ></Skeleton>

                    <Skeleton width="8rem" height="2rem" className='p-1 m-2 px-2 mt-5' ></Skeleton>
                    <Skeleton width="100%" height="10rem" className='p-1 m-2 px-2 ' ></Skeleton>

                    <Skeleton width="8rem" height="2rem" className='p-1 m-2 px-2 mt-5' ></Skeleton>
                    <Skeleton width="8rem" height="2rem" className='p-1 m-2 px-2 ' ></Skeleton>
                    <Skeleton width="100%" height="3rem" className='p-1 m-2 px-2 ' ></Skeleton>
                    <Skeleton width="100%" height="3rem" className='p-1 m-2 px-2 ' ></Skeleton>

                    {/* {addChildClicked == true ? (<>
                        <AddChild />
                    </>
                    ) : (<>
                    </>
                    )} */}


                    <div className='col-12 mt-5 '>
                        <Skeleton width="8rem" height="2rem" className='p-1 m-2 px-2 ' ></Skeleton>
                        <Skeleton width="100%" height="3rem" className='p-1 m-2 px-2 ' ></Skeleton>
                        <Skeleton width="100%" height="3rem" className='p-1 m-2 px-2 ' ></Skeleton>
                    </div>

                    <div className='col-12 mt-6 '>

                        <Skeleton width="8rem" height="2rem" className='p-1 m-2 px-2 ' ></Skeleton>
                        <Skeleton width="100%" height="3rem" className='p-1 m-2 px-2 ' ></Skeleton>
                        <Skeleton width="100%" height="3rem" className='p-1 m-2 px-2 ' ></Skeleton>

                    </div>
                </ScrollPanel>

            </div>
            <Divider layout='vertical'></Divider>
            <div className='col lg:col-4'>


                <Skeleton width="6rem" height="2rem" className='p-1 m-2 px-2 ' ></Skeleton>
                <Skeleton width="6rem" height="2rem" className='p-1 m-2 px-2 mt-5 ' ></Skeleton>
                <Skeleton width="100%" height="2rem" className='p-1 m-2 px-2 mt-5 ' ></Skeleton>
                <Skeleton width="100%" height="2rem" className='p-1 m-2 px-2 mt-5 ' ></Skeleton>
                <Skeleton width="100%" height="2rem" className='p-1 m-2 px-2 mt-5 ' ></Skeleton>
                <Skeleton width="100%" height="2rem" className='p-1 m-2 px-2 mt-5 ' ></Skeleton>
                <Skeleton width="100%" height="2rem" className='p-1 m-2 px-2 mt-5 ' ></Skeleton>
                <Skeleton width="100%" height="2rem" className='p-1 m-2 px-2 mt-5 ' ></Skeleton>

            </div>
        </div>
    </>);
};

export default TaskLoading;
