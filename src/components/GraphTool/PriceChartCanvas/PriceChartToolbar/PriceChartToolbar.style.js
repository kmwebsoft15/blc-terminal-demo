import styled, { keyframes } from 'styled-components/macro';

export const ToolbarWrapper = styled.div`
    display: flex;
    width: 100%;
    height: 30px;
`;

export const ToolbarGroupWrapper = styled.div`
    display: flex;
`;

export const ToolbarItem = styled.div`
    position: relative;
    min-width: 50px;
    font-size: 14px;
    font-weight: bold;
    background: ${props => props.isActive ? 'transparent' : props.theme.palette.clrMainWindow};
    color: ${({ isActive }) => (isActive ? '#fff' : '#7f8bc2')};
    text-align: center;
    padding: 4px 10px;
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: ${({ disabled }) => (disabled ? '0.3' : '1')};
    &:hover {
        ${({ disabled }) => (!disabled && `
            color: white;
            border-color: white;
        `)}
    }
`;

export const ToolbarLiveItem = styled(ToolbarItem)`
    width: 72px;
    justify-content: space-between;
`;

const pulsateRing = keyframes`
    0% {
        transform: scale(.33);
    }
    80%, 100% {
        opacity: 0;
    }
`;

const pulsateDot = keyframes`
    0% {
        transform: scale(.8);
    }
    50% {
        transform: scale(1);
    }
    100% {
        transform: scale(.8);
    }
`;

export const PulsateDot = styled.div`
    position: relative;
    width: 10px;
    height: 10px;

    &:before {
        content: '';
        position: relative;
        display: block;
        width: 300%;
        height: 300%;
        box-sizing: border-box;
        margin-left: -100%;
        margin-top: -100%;
        border-radius: 45px;
        background-color: #01a4e9;
        animation: ${pulsateRing} 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
    }

    &:after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        display: block;
        width: 100%;
        height: 100%;
        background-color: white;
        border-radius: 15px;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
        animation: ${pulsateDot} 1.25s cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite;
    }
`;


export const SVG = styled.svg`
    width: 18px;
    height: 18px;
    fill: ${({ isActive }) => (isActive ? '#fff' : '#7f8bc2')};
    &:hover {
        fill: #fff;
    }

    > g {
        fill: ${({ isActive }) => (isActive ? '#fff' : '#7f8bc2')};
        &:hover {
            fill: #fff;
        }
    }
`