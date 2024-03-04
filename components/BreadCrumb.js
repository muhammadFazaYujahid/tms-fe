import React, { useRef, useState } from 'react';

import { BreadCrumb } from 'primereact/breadcrumb';
import { useRouter } from 'next/router';

// const url_path = () => {

//     const router = useRouter();
//     // const plited_route = router.split("/");
//     const url = router.query;
//     const updatedUrl = url.map((item) => {
//         const { route, ...rest } = item;
//         return { label: route, ...rest };
//     });
//     return router.query;
// }

const Breadcrumb = ({ breadClass, orgKey, projectKey, section }) => {
    const items = [{ label: orgKey }, { label: projectKey }, { label: section }];
    const home = { icon: 'pi pi-home', url: '/' + orgKey }

    return (<>
        <BreadCrumb model={items} home={home} className={breadClass + " border-none"} />
    </>
    );
};

export default Breadcrumb;
