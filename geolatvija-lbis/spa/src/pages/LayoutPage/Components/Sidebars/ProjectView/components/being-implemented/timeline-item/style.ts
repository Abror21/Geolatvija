import styled from 'styled-components';
export const StyledTimelineItem = styled.div`
    margin-bottom: 20px;
    display: flex;
    gap: 30px;
    .timeline__text{
        padding-top: 5px;
        span{
            display: inline-block;
            margin-bottom: 15px;
        }
        label{
            font-weight: 500;
        }
    }
`;