import React, { useState } from 'react';

export const CustomContext = React.createContext();

export const CustomProvider = (props) => {

    const [addIssueDialog, setAddIssueDialog] = useState(false)
    const value = {
        addIssueDialog,
        setAddIssueDialog
    };

    return <CustomContext.Provider value={value}>{props.children}</CustomContext.Provider>;
};
