import styled from 'styled-components/macro';

export const StyledLabelWrapper = styled.div`
  display: flex;
  gap: 4px;

  .not-verified {
    color: ${({ theme }) => theme.brand02};
  }
`;

export const StyledVerifyButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

export const StyledTabNotifications = styled.div`
  .icon-warning {
    display: flex;
    align-items: center;
    margin-top: 3px;
  }
  .field-email-icon-exclamation-triangle {
    color: ${({ theme }) => theme.iconColor06};
    font-size: ${({ theme }) => theme.h4Size};
    line-height: ${({ theme }) => theme.h4Size};
    padding-left: 8px;
  }

  .field-email-icon-edit {
    color: ${({ theme }) => theme.gray06};
    font-size: ${({ theme }) => theme.h4Size};
    line-height: ${({ theme }) => theme.h4Size};
    padding-left: 8px;
    cursor: pointer;
  }
  .ant-form {
    label {
      line-height: ${({ theme }) => theme.h3Size};
      padding-bottom: 6px;
    }

    .ant-form-item {
      line-height: 24px;

      .ant-input-affix-wrapper {
        border-color: ${({ theme }) => theme.border2};
        background-color: ${({ theme }) => theme.disabledBackground};
        padding: 10px 14px;
        .ant-input {
          background-color: ${({ theme }) => theme.disabledBackground};
          font-size: ${({ theme }) => theme.p2Size};
          &-disabled {
            color: ${({ theme }) => theme.gray13};
            &::placeholder {
              color: ${({ theme }) => theme.placeholder};
            }
          }
        }
      }
    }
  }
  .notifications_sec {
    margin: 30px 0;
    .title_notication {
      margin-bottom: 20px;
    }
    .action_btn {
      display: flex;
      gap: 20px;
      align-items: center;
      justify-content: end;
    }
    .ant-table-row {
      &:hover {
        .ant-btn-link {
          color: ${({ theme }) => theme.switchColor04} !important;
        }
      }
    }
  }
`;

export const StyledMessageWrapper = styled.div`
  padding: 16px;
  gap: 16px;
  color: ${({ theme }) => theme.gray06};
  line-height: ${({ theme }) => theme.h3Size};
  background: ${({ theme }) => theme.tagBackground04};
  border: 1px solid ${({ theme }) => theme.tagBorder04};
  border-radius: 6px;
  font-size: ${({ theme }) => theme.p2Size};
`;
