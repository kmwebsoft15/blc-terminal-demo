import styled, { keyframes } from 'styled-components/macro';

const growAnim = keyframes`
    0% { width: 0; }
    100% { width: 100%; }
`;

const fillAnim = (start) => keyframes`
    0% { width: 0; }
    ${start}% { width: 0; }
    ${start + 20}% { width: 100%; }
    100% { width: 100%; }
`;

export const WalletGroupButtonWrapper = styled.div`
    position: relative;
    width: ${props => props.width || 260}px;
    height: 100%;
    ${({ isMobileLandscape }) => {
        if (isMobileLandscape) {
            return `
                @media (max-width: 1400px) {
                    width: 600px;
                }
                @media (max-width: 1100px) {
                    width: 500px;
                }
                @media (max-width: 900px) {
                    width: 360px;
                }
                @media (max-width: 700px) {
                    width: 300px;
                }
                @media (max-width: 600px) {
                    width: 260px;
                }
            `;
        }
        return `
            @media (max-width: 1200px) {
                width: 620px;
            }
            
            @media (max-width: 800px) {
                width: 440px;
            }
            
            @media (max-width: 450px) {
                width: 320px;
            }
            
            @media (max-width: 380px) {
                width: 280px;
            }
            
            @media (max-width: 350px) {
                 width: 320px;
            }
        `;
    }};
`;

export const WalletButtonWrapper = styled.div.attrs({ className: 'wallet-btn-wrapper' })`
    position: absolute;
    width: ${props => props.width}%;
    height: 100%;
    top: 0;
    overflow: ${props => props.isOverFlow ? 'visible' : 'hidden'};
    ${props => props.direction === 'Left' ? `
        left: 0;
    ` : `
        right: 0;
    `};
    display: flex;
    align-items: ${props => props.isBuy ? 'flex-end' : 'flex-start'};
    padding-bottom: ${props => (props.isBuy && props.isHistory) && '15px'};
    padding-top: ${props => (!props.isBuy && props.isHistory) && '15px'};
    justify-content: center;
    
    &.progress {
        animation: ${growAnim} 2s linear;
    }
    
    &.fill {
        animation: ${props => fillAnim(props.start)} 5s linear;
    }
`;

export const WalletButton = styled.div`
    width: ${props => props.width || 220}px;
    margin: 0 20px;
    position: absolute;
    ${props => props.direction === 'Left' ? 'left: 0;' : 'right: 0;'}
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid ${props => props.type === 'inactive'
        ? props.theme.palette.clrMouseClick
        : props.masterColor
            ? props.masterColor
            : (props.type === 'active')
                ? props.theme.palette.clrHighContrast
                : (props.type === 'buy')
                    ? props.theme.palette.btnPositiveBg
                    : props.theme.palette.btnNegativeBg};
    border-radius: 7px;
    border-right: 4px solid ${props => props.type === 'inactive'
        ? props.theme.palette.clrMouseClick
        : props.masterColor
            ? props.masterColor
            : (props.type === 'active')
                ? props.theme.palette.clrHighContrast
                : (props.type === 'buy')
                    ? props.theme.palette.btnPositiveBg
                    : props.theme.palette.btnNegativeBg};
    outline: 2px dashed ${props => props.type === 'inactive'
        ? props.theme.palette.clrMouseClick
        : props.masterColor
            ? props.masterColor
            : (props.type === 'active')
                ? props.theme.palette.clrHighContrast
                : (props.type === 'buy')
                    ? props.theme.palette.btnPositiveBg
                    : props.theme.palette.btnNegativeBg};
    outline-offset: -10px;
    padding: 5px 12px;
    height: 65px;
    color: ${props => props.theme.palette.clrPurple};
    font-size: 33px;
    text-align: right;
    opacity: 1 !important;
    word-break: break-all;
    white-space: nowrap;
    background: ${props => props.theme.palette.clrBackground};
    
    border: 2px solid ${props => props.theme.palette.clrMouseClick} !important;
    border-right: 4px solid ${props => props.theme.palette.clrMouseClick} !important;
    outline: 2px dashed ${props => props.theme.palette.clrMouseClick} !important;
    
    svg {
        display: ${props => props.isDefaultCrypto ? 'none' : ''};
    }
    
    > span {
        font-size: 27px;
        display: block;
        margin-right: -12px !important;
        // overflow: hidden;
        color: ${props => props.type === 'inactive'
        ? props.theme.palette.clrMouseClick
        : props.masterColor
            ? props.masterColor
            : (props.type === 'active')
                ? props.theme.palette.clrHighContrast
                : (props.type === 'buy')
                    ? props.theme.palette.btnPositiveBg
                    : props.theme.palette.btnNegativeBg};
        fill: ${props => props.type === 'inactive'
        ? props.theme.palette.clrMouseClick
        : props.masterColor
            ? props.masterColor
            : (props.type === 'active')
                ? props.theme.palette.clrHighContrast
                : (props.type === 'buy')
                    ? props.theme.palette.btnPositiveBg
                    : props.theme.palette.btnNegativeBg};
        &.failed {
            font-size: 20px;
            color: ${props => props.theme.palette.clrDarkRed};
        }
    }

    .infoIcon {
        position: absolute;
        // ${props => props.isLeft ? 'left: -40px;' : 'right: -40px;'}
        left: 9px;
        width: 40px;                                                                                        
        height: 40px;
        display: flex;                                                                                      
        align-items: center;
        justify-content: center;

        img {
            filter: ${props => props.type === 'active'
        ? props.theme.palette.coinActiveFilter
        : (props.type === 'inactive')
            ? props.theme.palette.coinInactiveFilter
            : (props.type === 'buy')
                ? props.theme.palette.coinBuyFilter
                : props.theme.palette.coinSellFilter};
        }
    }
     .exch-dropdown__icon{
        width: 26px;
        height: 26px;
        background-size: cover !important;
        position: absolute;
        left: 9px;
        margin: 0 3px;
    }

    div {
        overflow: inherit;
        white-space: initial;
        word-break: break-word;
    }
    
    .wallet-side-icon {
        stroke: ${props => props.type === 'inactive'
        ? props.theme.palette.clrMouseClick
        : props.masterColor
            ? props.masterColor
            : (props.type === 'active')
                ? props.theme.palette.clrHighContrast
                : (props.type === 'buy')
                    ? props.theme.palette.btnPositiveBg
                    : props.theme.palette.btnNegativeBg};
        stroke: ${props => props.theme.palette.clrMouseClick} !important;
    }
    .wallet-side-icon circle{
        fill: ${props => props.type === 'inactive'
        ? props.theme.palette.clrMouseClick
        : props.masterColor
            ? props.masterColor
            : (props.type === 'active')
                ? props.theme.palette.clrHighContrast
                : (props.type === 'buy')
                    ? props.theme.palette.btnPositiveBg
                    : props.theme.palette.btnNegativeBg};
        fill: ${props => props.theme.palette.clrMouseClick} !important;
    }

    &:hover {
        color: ${props => props.theme.palette.clrHighContrast};
        opacity: 0.5;
    }

    &:active {
        background: ${props => props.theme.palette.clrBackground};
        color: ${props => props.theme.palette.clrHighContrast};
    }
    ${({ isMobileLandscape }) => {
        if (isMobileLandscape) {
            return `
                @media (max-width: 1400px) {
                    width: 560px;
                    height: 150px;
                    & > svg {
                        top: calc(50% - 30px);
                        height: 60px;  
                    }
                    .exch-dropdown__icon{
                        width: 60px;
                        height: 60px;
                    }
                    .infoIcon {
                        width: 70px;                                                                                        
                        height: 70px;
                    }
                    .infoIcon svg {
                        width: 50px;                                                                                        
                        height: 50px;
                    }
                }
                @media (max-width: 1100px) {
                    width: 460px;
                    height: 150px;
                    & > svg {
                        top: calc(50% - 30px);
                        height: 60px;  
                    }
                    .exch-dropdown__icon{
                        width: 60px;
                        height: 60px;
                    }
                    .infoIcon {
                        width: 70px;                                                                                        
                        height: 70px;
                    }
                    .infoIcon svg {
                        width: 50px;                                                                                        
                        height: 50px;
                    }
                }
                @media (max-width: 900px) {
                    width: 320px;
                    height: 80px;
                    & > svg {
                        top: calc(50% - 15px);
                        height: 30px;  
                    }
                    .exch-dropdown__icon{
                        width: 30px;
                        height: 30px;
                    }
                    .infoIcon {
                        width: 40px;                                                                                        
                        height: 40px;
                    }
                    .infoIcon svg {
                        width: 25px;                                                                                        
                        height: 25px;
                    }
                }
                @media (max-width: 700px) {
                    width: 260px;
                }
                @media (max-width: 600px) {
                    width: 220px;
                    height: 65px;
                }
            `;
        }
        return `
             @media (max-width: 1200px) {
                width: 580px;
                height: 90px;
             }
             @media (max-width: 800px) {
                 width: 400px;
                 height: 90px;
             }
             @media (max-width: 450px) {
                 width: 280px;
                 height: 80px;
             }
             @media (max-width: 380px) {
                 width: 240px;
                 height: 80px;
             }
             @media (max-width: 350px) {
                  width: 280px;
                  height: 90px;
             }
        `;

    }};

`;
