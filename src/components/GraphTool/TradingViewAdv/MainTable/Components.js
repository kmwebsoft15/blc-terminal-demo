import React from 'react';
import styled from 'styled-components/macro';

export const Wrapper = styled.div`
    width: 100%;
    display: block;
    .TableViewItems{
    justify-content: center;
    display: flex;
    align-items: center;
    }
`;

export const HeaderWrapper = styled.div`
    border-collapse: collapse;
    box-sizing: border-box;
    font-size: 13px;
    font-weight: 700;
    font-family: 'open_sans',sans-serif;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 36px;
    color: ${props => props.theme.palette.clrPurple};
    z-index: 3;
    -webkit-border-horizontal-spacing: 2px;
    -webkit-border-vertical-spacing: 2px;
    white-space: nowrap;
`;
export const ContentWrapper = styled.div`
    height: calc(100% - 100px);
    border: 1px solid #454c73;
    border-radius: 2px;
    display: block;
    position: relative;
    background: ${props => props.theme.palette.clrMainWindow};
    text-align: center;
    margin: 0;
    overflow: hidden;
`;
export const ExchangesWrapper = styled.div`
    max-height: calc(100% - 70px);
    overflow: auto;
`
export const StyleWrapper = styled.div`
    width: ${props => props.width}px;
    height: 40px;
    font-family: 'open_sans',sans-serif;
    .up, .down{
    background-image: url(https://exchange.globitec.com/resources/assets/images/sort.svg);
    width: 12px;
    height: 6px;
    opacity: .6;
    cursor: pointer;
    }
    .controls{
    display: inline-block;
    margin: 0 5px -4px 0;
    }
`;

export const Main = styled.div`
    display: flex;
    width: 100%;
`;
export const TableName = styled.div`
    width: 100%;
    padding: 26px 0;
    height: 70px;
    border-bottom: 1px solid rgba(69,76,115,0.498);
`;
export const LeftAccount = styled.div`
    width: 20%;
    vertical-align: top;
    display: flex;
    flex-align: center;
    justify-content: center;
    align-items: center;
    border-right: 1px solid rgba(69,76,115,0.498);
    border-bottom: 1px solid rgba(69,76,115,0.498);
    color: ${props => props.theme.palette.clrPurple};
    font-size: 13px;
    font-weight: 700;
    font-family: 'open_sans',sans-serif;
    
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
`;


export const AccountCell = styled.div`
    position: relative;
    width: 70%;
    height: 100%;
    padding-left: 20px;
    margin: 0;
    display: flex;
    align-items: center;
    background: transparent;
    border: none;
    font-size: ${props => props.isMobile ? '24px' : '17px'};
    font-weight: 600;
    line-height: 1em;
    color: ${props => props.theme.palette.clrPurple};
    white-space: normal;
    cursor: pointer;
    
    .exchange-icon {
        width: 30px;
        height: 30px;
        margin-right: 8px;
        flex-shrink: 0;
    }

    span {
        line-height: 33px !important;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .api-link {
        margin-left: auto;
        margin-right: 0;
        cursor: pointer;

        &:hover {
            a {
                filter: brightness(1.5);
            }
        }
    }
    
    .info {
        width: 16px;
        height: 16px;
        background-color: ${props => props.theme.palette.clrPurple};
        border-radius: 50%;
    }
`;

export const APICell = styled.div`
    width: 30%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const LogoWrapper = styled.div.attrs({ className: 'exchange-icon' })`
    width: ${props => props.size ? props.size : 30}px;
    height: ${props => props.size ? props.size : 30}px;
    // background: ${props => props.theme.palette.clrBackground};
    margin-right: 15px;
    border-radius: 50%;
    overflow: hidden;
`;

export const Logo = styled.img`
    margin: 0 !important;
    border: none !important;
    padding: 0 !important;
    width: 100% !important;
    height: 100% !important;
`;


export const MainTable = styled.div`
    width: 80%;
`;
export const CreateAccount = styled.div`
    display: table;
    margin: 15px auto;
    .CreateAccountCon:hover{
        color: #2680ff;
        cursor: pointer;
        font-weight: 700;
        font-family: 'open_sans',sans-serif;
    }
    .CreateAccountCon{
        background-position: 0 5px;
        background-size: 15.1px;
        padding: 3px 0 0 20px;
        float: none;
        width: auto;
        height: 20px;
        font-size: 16px;
        color: ${props => props.theme.palette.clrPurple};font-weight: 700;
        font-family: 'open_sans',sans-serif;
        margin: 0;
        background-image: url(https://exchange.globitex.com/resources/assets/images/add.svg);
        background-position-x: 0px;
        background-position-y: 5px;
        background-repeat: no-repeat;
    }
`;

export const MainTableCon = styled.div.attrs({ className: 'dropmenu-wrapper' })`
    font-size: 13px;
    font-weight: 600;
    font-family: 'open_sans',sans-serif;
    display: block;
    height: 35px;
    color: ${props => props.theme.palette.clrPurple};
    border-bottom: 1px solid rgba(69,76,115,0.498);
    padding: 0;
    align-items: center;
    
   .currency{
    width: 8%;
    margin: 0 -4px 0 0;
    padding: 9px 0;
    }
   
    .RowNumber{
    width: 19%;
    padding: 0 15px 0 0;
    padding: 3px 0;
    margin: 0 -4px 0 0;
    }
    
    .TableViewItems{
    justify-content: center;
    display: flex;
    align-items: center;
    }
    
    .PayinImage{
    background-image: url(https://exchange.globitex.com/resources/assets/images/components/accounts/fund.svg);
    background-position-x: 50%;
    background-position-y: -22px;
    background-repeat-x: ;
    background-repeat-y: ;
    background-size: 17px;
    width: 23px;
    height: 23px;
    background-repeat: no-repeat;
    margin: auto;
    bottom: -6px;
    left: 0;
    right: 0;
    cursor: pointer;
    }
    
    .TableViewItems{
    justify-content: center;
    display: flex;
    align-items: center;
    }
    
    .PayoutImage{
    background-image: url(https://exchange.globitex.com/resources/assets/images/components/accounts/withdraw.svg);
    background-position-x: 50%;
    background-position-y: -22px;
    background-repeat-x: ;
    background-repeat-y: ;
    background-size: 17px;
    width: 23px;
    height: 23px;
    background-repeat: no-repeat;
    margin: auto;
    bottom: -6px;
    left: 0;
    right: 0;
    cursor: pointer;
    }
`;