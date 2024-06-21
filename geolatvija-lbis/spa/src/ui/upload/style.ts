import styled from 'styled-components/macro';
import { Upload } from 'antd';

export const StyledUpload = styled(Upload)`
  .ant-upload-list {
    max-width: 200px; //todo for now it's enough
    .ant-upload-list-text-container {
      &:first-child {
        .ant-upload-list-item {
          margin-top: 5px;
        }
      }
      .ant-upload-list-item {
        margin-bottom: 5px;
        margin-top: 0;
        background: ${({ theme }) => theme.gray01};
        border-radius: 2px;
        .ant-upload-list-item-name {
          padding: 0;
        }
      }
    }
  }
  .upload-label {
    margin-right: 15px;
  }
`;
