import styled from 'styled-components';

export const StyledIdeaSubmission = styled.div`
  .submition_textarea {
    label {
      margin-bottom: 8px;
    }
    .max-length {
      color: ${({ theme }) => theme.textColor09};
      font-size: ${({ theme }) => theme.p2Size};
    }
  }
  .idea_field {
    margin: 10px 0;

    label {
      margin: 10px 0;
    }
  }
  .ant-upload-hint {
    margin: 5px 0;
  }
  .upload_btn {
    span {
      color: ${({ theme }) => theme.brand02};
      font-size: ${({ theme }) => theme.p2Size};
      text-decoration: underline;
      cursor: pointer;
    }
    .ant-form-item .ant-form-item-control-input {
      min-height: 25px;
    }
  }
  .submit_project_btn {
    display: flex;
    align-items: center;
    justify-content: end;
    gap: 10px;
    border-top: 1px solid ${({ theme }) => theme.border};
    padding: 20px 0;
  }
  .document-upload {
    margin-top: 10px;
    .title {
      display: flex;
      align-items: center;
      gap: 5px;
      p {
        color: ${({ theme }) => theme.textColor09};
        font-size: ${({ theme }) => theme.p2Size};
        font-weight: ${({ theme }) => theme.fontWeightRegular};
      }
      .ant-form-item {
        margin-bottom: 0 !important;
      }
    }
  }
`;
