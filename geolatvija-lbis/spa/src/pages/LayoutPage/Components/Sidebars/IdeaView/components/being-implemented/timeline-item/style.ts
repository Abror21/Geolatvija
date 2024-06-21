import styled from 'styled-components';
export const StyledTimelineItem = styled.div`
    margin-bottom: 20px;
    display: flex;
    gap: 30px;
    .timeline__text{
        padding-top: 5px;
        span{
            font-size: ${({ theme }) => theme.p2Size};
            display: inline-block;
            margin-bottom: 15px;
            color: ${({ theme }) => theme.brand07};
        }
        label{
            font-weight: 500;
        }
    }
`;