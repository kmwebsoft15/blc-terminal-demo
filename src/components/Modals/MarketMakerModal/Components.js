import React from 'react';
import styled from 'styled-components/macro';

export const ModalWrapper = styled.div`
    position: absolute;
    left: 0;
    top: 72px;
    right: 0;
    bottom: 0;
    z-index: 100000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.theme.palette.clrBackground}7f;
`;

export const InnerWrapper = styled.div`
    position: relative;
    width: 76%;
    height: 76%;
    padding: 30px 50px;
    background: ${props => props.theme.palette.clrMainWindow};
    border: 2px solid ${props => props.theme.palette.clrHighContrast};
    border-radius: ${props => props.theme.palette.borderRadius};
`;

export const HeaderWrapper = styled.div`
    height: 50px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid ${props => props.theme.palette.clrBorder};
    
    > span {
        font-size: 20px;
        font-weight: 600;
        line-height: 50px;
    }
`;

export const DropdownWrapper = styled.div`
    position: relative;
    width: 220px;
    height: 50px;
    font-size: 20px;
    font-weight: 600;
    line-height: 50px;
    color: ${props => props.theme.palette.clrHighContrast};
`;

export const CurrentItem = styled.div`
    width: 100%;
    height: 100%;
    padding: 0 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-transform: uppercase;
    cursor: pointer;
    
    &.opened {
        svg {
            transform: rotate(180deg);
        }
    }
`;

export const DropdownList = styled.ul`
    position: absolute;
    left: -10px;
    top: 100%;
    right: 0;
    z-index: 100;
    margin: 0;
    padding: 0;
    background: ${props => props.theme.palette.clrMainWindow};
    border: 1px solid ${props => props.theme.palette.clrBorder};
    border-top: 0;
    border-radius: 0 0 ${props => props.theme.palette.borderRadius} ${props => props.theme.palette.borderRadius};
    list-style-type: none;
`;

export const ListItem = styled.li`
    height: 50px;
    padding: 0 15px;
    border-bottom: 1px solid ${props => props.theme.palette.clrBorder};
    cursor: pointer;
    
    &:last-child {
        border-bottom: 0;
    }
    
    &:hover {
        background-color: ${props => props.theme.palette.clrBorder};
    }
`;

const DropIconSvg = styled.svg`
    width: 15px;
    height: 9px;
    fill: ${props => props.theme.palette.clrBorder};
    transform: rotate(0deg);
    transition: all 100ms;
`;

export const DropIcon = (props) => (
    <DropIconSvg
        viewBox="0 0 15 8.9"
        {...props}
    >
        <path
            d="M7.5,8.9L0.3,1.7c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l5.8,5.8l5.8-5.8c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4L7.5,8.9z"
        />
    </DropIconSvg>
);

export const ModalBody = styled.div`
    position: relative;
    height: calc(100% - 50px);
    
    > div {
        width: 100% !important;
        height: 100% !important;
    }
`;

export const StyleWrapper = styled.div`
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    color: ${props => props.theme.palette.clrPurple};
    
    .scrollbar-container {
        padding-right: 15px;
    }

    .ps__rail-y {
        right: 0 !important;
        background: ${props => props.theme.palette.clrMainWindow} !important;    
    
        .ps__thumb-y:before {
            background: ${props => props.theme.palette.clrPurple} !important;
        }
    }
    
    .ReactVirtualized__Grid {
        outline: none;
    }
    
    .ReactVirtualized__Table__headerColumn,
    .ReactVirtualized__Table__rowColumn {
        text-align: center;

        &:last-child {
            margin: 0;
        }
        
        &:first-of-type {
            margin-left: 0;
        }
    }
    
    .ReactVirtualized__Table__headerRow,
    .ReactVirtualized__Table__row {
        border-bottom: 1px solid ${props => props.theme.palette.clrBorder};
    }
`;

export const TableHeader = styled.div`
    width: 100%;
    height: 100%;
    text-transform: uppercase;
`;

export const TableFooter = styled.div`
    height: 50px;
    display: flex;
    align-items: center;
    border-top: 2px solid ${props => props.theme.palette.clrHighContrast};
    box-sizing: border-box;
`;

export const FooterColumn = styled.div`
    margin-right: 10px;
    flex: 0 1 ${props => props.width}px;
    color: ${props => props.theme.palette.clrPurple};
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    box-sizing: border-box;

    &:first-child {
        font-size: 20px;
        font-weight: 600;
        color: ${props => props.theme.palette.clrHighContrast};
    }
    
    &:last-child {
        margin-right: 0;
    }
`;

export const AccountCell = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
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
        flex: 1;
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
    width: 100%;
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