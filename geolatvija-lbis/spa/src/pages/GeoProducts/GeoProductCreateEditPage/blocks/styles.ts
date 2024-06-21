import styled from 'styled-components/macro';
import { Space } from 'antd';

export const StyledFTPSyncInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  .label {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-bottom: 2px;
  }
`;

export const ServiceRestrictionClassifierSelectWrapper = styled(Space)`
  width: 100%;
  height: 100%;
  justify-content: space-between;
`;

export const PaymentPrePayWrapper = styled.div<{ disabled: boolean }>`
  margin-top: 9.5rem;

  .disabled-label-wrapper {
    label {
      padding-top: 12px;
      padding-bottom: 16px;
      color: ${({ theme }) => theme.tag02};
    }
  }

  label span {
    color: ${({ disabled, theme }) => (disabled ? theme.placeholder : theme.textColor01)} !important;
  }
`;

export const PaymentPrePayInputWrapper = styled.div<{ disabled: boolean }>`
  .ant-form-item-label label {
    color: ${({ disabled, theme }) => (disabled ? theme.placeholder : theme.gray06)} !important;
  }
`;
