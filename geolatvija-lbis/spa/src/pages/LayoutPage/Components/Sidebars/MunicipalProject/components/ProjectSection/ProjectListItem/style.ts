import styled from 'styled-components';
export const StyledProjectListItem = styled.div`
  .card_inner {
    .ant-card-body {
      display: flex;
      justify-content: space-between;
    }
    .card_image {
      width: 120px;
      height: auto;
      max-height: 75px;
      object-fit: cover;
    }
    .content_side {
      width: 100%;
      margin-left: 20px;
      .ant-typography {
        color: ${({ theme }) => theme.textColor09};
        margin-top: 0;
      }
      .status_side {
        display: flex;
        justify-content: space-between;
        .status {
          padding: 2px 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          border: 1px solid ${({ theme }) => theme.borderColor};
          font-size: ${({ theme }) => theme.p2Size};
          &.supported {
            color: ${({ theme }) => theme.brand02};
            background-color: ${({ theme }) => theme.statusSupportedBg};
          }
          &.realized {
            color: ${({ theme }) => theme.statusRealizedColor};
            background-color: ${({ theme }) => theme.brand04Light};
          }
          &.in_progress {
            color: ${({ theme }) => theme.brand05};
            background-color: ${({ theme }) => theme.brand05Light};
          }
          &.unsupported {
            color: ${({ theme }) => theme.statusUnsupportedColor};
            background-color: ${({ theme }) => theme.brand06Light};
          }
        }
        .desc_btn {
          color: ${({ theme }) => theme.button01};
          span {
            text-decoration: underline;
          }
        }
      }
      .project_date {
        border-top: 1px solid ${({ theme }) => theme.border};
        margin-top: 20px;
        padding-top: 23px;
        display: flex;
        justify-content: space-between;
        .dates {
          font-size: ${({ theme }) => theme.p2Size};
          font-weight: ${({ theme }) => theme.fontWeightRegular};
          line-height: ${({ theme }) => theme.lineHeight5};
          color: ${({ theme }) => theme.gray06};
        }
        .voited {
          margin-left: auto;
          margin-bottom: 0;
        }
      }
    }
  }
`;
