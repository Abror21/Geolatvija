import styled from 'styled-components';
export const StyledFileUploadCard = styled.div`
  .uploaded_file {
    position: relative;
    margin: 10px 0;
    .ant-card-body {
      padding: 0px 15px;
    }
    p {
      font-size: ${({ theme }) => theme.p2Size};
      color: ${({ theme }) => theme.gray07};
      font-weight: ${({ theme }) => theme.fontWeightBold};
      span {
        font-weight: ${({ theme }) => theme.fontWeightRegular};
        display: block;
        color: ${({ theme }) => theme.gray06};
        font-size: ${({ theme }) => theme.p3Size};
      }
    }
    .remove_btn {
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
      color: ${({ theme }) => theme.textColor09};
      font-size: ${({ theme }) => theme.p2Size};
    }
  }
`;
