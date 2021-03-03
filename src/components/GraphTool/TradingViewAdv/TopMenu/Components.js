import styled from 'styled-components/macro';

export const DropMenuWrapper = styled.div`
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    padding: 1rem;
    .label {
        color: ${props => props.theme.palette.clrPurple};
        font-weight: 700;
        margin: 0 10px;
    }
`;