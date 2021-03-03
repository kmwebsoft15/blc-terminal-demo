import React from 'react';
import ReactDOM from 'react-dom';
import { inject, observer } from 'mobx-react';
import SimpleSnackbar from '../../components-generic/Snackbar';
import { STORE_KEYS } from '../../stores';

const SnackbarPortal = inject(STORE_KEYS.SNACKBARSTORE, STORE_KEYS.VIEWMODESTORE)(observer(
    ({
        [STORE_KEYS.SNACKBARSTORE]: { SnackBarProps, open, onClose },
        [STORE_KEYS.VIEWMODESTORE]: { isPayApp },
    }) => {
        return (
            !isPayApp && <React.Fragment>
                {Object.keys(SnackBarProps).length > 0 && (
                    ReactDOM.createPortal(
                        <SimpleSnackbar
                            {...SnackBarProps}
                            open={open}
                            onClose={onClose}
                        />,
                        document.getElementById('snackbar'),
                    )
                )}
            </React.Fragment>
        );
    }
));

export default SnackbarPortal;
