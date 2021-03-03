import styled, { css } from 'styled-components/macro';

export const Container = styled.div`
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const FlexWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const ZoomButton = styled.img`
    width: ${props => (props.isMobile ? '22px' : '36px')};
    height: ${props => (props.isMobile ? '22px' : '36px')};
    border: 2px solid ${props => props.theme.palette.clrBorder};
    background-color: ${props => props.theme.palette.clrBackground};
    padding: ${props => (props.isMobile ? '3px' : '8px')};
    border-radius: 50%;
    cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
    filter: ${props => (props.disabled ? 'brightness(70%)' : '')};
    opacity: ${props => (props.disabled ? '0.9' : '1')};
    margin-left: ${props => (props.type === 'in' ? '2px' : '0')};
    ${props =>
        !props.disabled &&
        css`
            &:hover {
                filter: brightness(150%);
            }
        `}
`;

export const PriceWrapper = styled.div`
    width: 114px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

export const Price = styled.div`
    overflow: hidden;
    white-space: nowrap;
    text-align: center;
    color: ${props => props.theme.palette.clrPurple};
`;

export const Label = styled.div`
    font-size: 12px;
    color: ${props => props.theme.palette.clrPurple};
    text-transform: uppercase;
`;

export const Row = styled.div`
    display: flex;
`;

export const ArbLabel = styled.div`
    font-size: 26px;
    color: ${props => props.theme.palette.clrPurple};
`;
