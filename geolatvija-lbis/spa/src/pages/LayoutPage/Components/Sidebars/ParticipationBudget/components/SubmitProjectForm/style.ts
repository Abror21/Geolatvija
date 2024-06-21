import styled from 'styled-components';
export const StyledSubmitProjectForm = styled.div`
  .documents_sec {
    padding: 16px 0;
    border-bottom: 1px solid ${({ theme }) => theme.border};
    ol {
      padding-left: 15px;
      display: flex;
      flex-direction: column;
      row-gap: 5px;
      li {
        color: ${({ theme }) => theme.brand02};
        font-size: ${({ theme }) => theme.p2Size};

        a {
          color: ${({ theme }) => theme.brand02};
          cursor: pointer;
          text-decoration: underline;
        }
      }
    }
    .confirmation-checkbox{
      font-weight: ${({ theme }) => theme.fontWeightBolder};
    }
  }
  .submit_documents_sec {
    border-bottom: 1px solid ${({ theme }) => theme.border};
    margin-bottom: 14px;
    padding: 10px 0;
    ol {
      padding-left: 13px;
      li {
        color: ${({ theme }) => theme.textColor09};
        font-size: ${({ theme }) => theme.p2Size};

        .upload {
          display: flex;
          column-gap: 5px;
          align-items: center;
          flex-wrap: wrap;
          span {
            color: ${({ theme }) => theme.textColor09};
            font-size: ${({ theme }) => theme.p2Size};
          }
          .upload_btn {
            span {
              color: ${({ theme }) => theme.brand02};
              text-decoration: underline;
              cursor: pointer;
            }
            .ant-form-item .ant-form-item-control-input {
              min-height: 25px;
            }
          }
        }
      }
      .ant-form-item {
        margin-bottom: 0;
      }
    }
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
  }

  .form_label {
    display: flex;
    align-items: center;
    gap: 5px;
    color: ${({ theme }) => theme.brand08};
    margin: 6px 0;
    .label_text {
      font-size: ${({ theme }) => theme.p2Size};
      font-weight: ${({ theme }) => theme.fontWeightBolder};
    }
    i {
      line-height: 20px;
    }
  }
  .submition_textarea {
    label {
      margin-bottom: 8px;
    }
    .max-length {
      color: ${({ theme }) => theme.textColor09};
      font-size: ${({ theme }) => theme.p2Size};
    }
  }
  
  .project_amount {
    margin-top: 15px;
  }
  .checkbox_project {
    margin: 20px 0;
  }

  .info_submitter_sec {
    border-top: 1px solid ${({ theme }) => theme.border};
    padding-top: 15px;
    margin-top: 15px;
    .inputs_box {
      display: flex;
      align-items: start;
      gap: 30px;
      margin-bottom: 10px;
      label {
        margin-bottom: 5px;
      }
      > div {
        width: 100%;
      }
    }
  }
  .submit_project_btn {
    display: flex;
    align-items: center;
    gap: 10px;
    border-top: 1px solid ${({ theme }) => theme.border};
    padding: 20px 0;
  }
`;
