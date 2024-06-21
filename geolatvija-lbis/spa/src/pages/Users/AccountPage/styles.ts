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
export const StyledEmailInput = styled.div`
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
`;
