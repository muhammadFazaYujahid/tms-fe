import React, { useContext, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';

import { LayoutContext } from '../layout/context/layoutcontext';

const ModalDialog = ({ dialogType, dialogHeader }) => {

    const { modalDialog, setModalDialog, contentDialog, setContentDialog } = useContext(LayoutContext);

    const maskStyles = {
        backgroundColor: 'rgb(0 0 0 / 50%)',
    };

    useEffect(() => {
        if (contentDialog) {
            setModalDialog(false);
        } else if (modalDialog) {
            setContentDialog(false);
        }
    }, [])


    return (<>

        <Dialog header={dialogHeader} maskStyle={maskStyles} visible={modalDialog} className='p-dialog' style={{ width: '30vw', backgroundColor: "#fff" }} modal onHide={() => setModalDialog(false)}>
            {dialogType}
        </Dialog>
    </>
    );
};

export default ModalDialog;
