import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import styled from 'styled-components/macro';

const StyledSnackbar = styled(Snackbar)`
    margin-left: 50px;
    color: ${props => props.theme.palette.contrastText};
    background: ${props => props.theme.palette.backgroundHighContrast};
    
    @media(max-width: 1500px) {
        transform:scale(0.75);
        transform-origin:left bottom;
    }
    
    @media(max-width: 1080px) { 
        transform:scale(0.65);
        transform-origin:left bottom;
    }
    
    @media(max-width: 940px) {
        transform:scale(0.55);
        transform-origin:left bottom;
    }
    
    @media(max-width: 790px) {
        transform:scale(0.45);
        transform-origin:left bottom;
    }
    
    @media(max-width: 700px) {
        transform:scale(0.35);
        transform-origin:left bottom;
    }
`;

const SimpleSnackbar = ({
    open,
    message,
    onClose,
    ...props
}) => {
    const msg = typeof message === 'function' ? message : () => message;

    return (
        <StyledSnackbar
            {...props}
            key={new Date().toString()}
            open={open}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            autoHideDuration={4000}
            onClose={onClose}
            message={
                <React.Fragment>
                    <span>{msg()}</span>
                </React.Fragment>
            }
            action={[
                <IconButton key={new Date().toString()} color="inherit" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ]}
        />
    );
};

export default SimpleSnackbar;
