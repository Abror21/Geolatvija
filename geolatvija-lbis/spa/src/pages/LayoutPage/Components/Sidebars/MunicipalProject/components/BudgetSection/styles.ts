import styled from 'styled-components/macro';

export const StyledBudgetSection = styled.div`
    margin-top: 20px;
    padding: 20px 0 15px;
    border-top: 1px solid ${({ theme }) => theme.border};

    .events {
        display: flex;
        flex-direction: column;
        row-gap: 15px;
        margin-bottom: 15px;
        .event_item {
        .ant-card-body {
            display: flex;
            align-items: start;
        }
        .content_side {
            margin-left: 20px;
        }
        img {
            width: 100px;
            height: auto;
            max-height: 75px;
            object-fit: cover;
        }
        .desc_btn {
            color: ${({ theme }) => theme.button01};
            span {
            text-decoration: underline;
            }
        }
        a {
            color: ${({ theme }) => theme.button01};
            text-decoration: underline;
        }
        }
    }
`;