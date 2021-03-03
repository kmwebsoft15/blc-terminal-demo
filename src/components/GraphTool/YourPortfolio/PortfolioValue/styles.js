import styled from 'styled-components/macro';

export const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 33px;
    font-weight: 500;
    height: 65px;
    color: ${props => props.theme.palette.clrPurple};

    .dropdown-wrapper {
        position: relative;
    }
    .btc-wrapper{
        height: 100%;
        display: flex;
        align-items: center;
        cursor: pointer;
    }
    .exch-dropdown__icon{
        width: 34px;
        height: 34px;
    }    
    span {
        display: block;
        padding-left: 2px;
    }

    .lastChange {
        padding-left: 5px;
    }
`;

export const LabelPrice = styled.div`
    display: flex;
    align-items: center;
    margin-left: 2px;
    font-size: 30px;
    font-weight: 500;
    color: ${props => props.theme.palette.clrPurple};
    ${props => !props.disableTouch ?
        `
        pointer-events: auto;
        cursor: pointer;
    ` :
        `
        pointer-events: none;
    `
    }
`;

export const WalletActionWrapper = styled.div`
    margin-left: 12px;
    display: flex;
`;

export const WalletAction = styled.div`
    position: relative;
    font-size: 14px;
    background: '#1a1b3d';
    border: 1px solid #454c73;
    color: '#fff';
    text-align: center;
    padding: 7px 10px;
    margin-left: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
`;
