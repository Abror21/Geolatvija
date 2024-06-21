import styled from 'styled-components';
export const StyledEventSection = styled.div`
  .events {
    display: flex;
    flex-direction: column;
    row-gap: 15px;
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
