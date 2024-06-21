import styled from 'styled-components/macro';

export const StyledThirdStep = styled.div`
  .label-break-all {
    word-break: break-all;
  }

  .ant-collapse-header {
    align-items: center !important;
  }

  .ant-collapse-header-text {
    font-size: ${({ theme }) => theme.p2Size} !important;
    color: ${({ theme }) => theme.textColor01} !important;
  }

  .ant-collapse-expand-icon {
    height: auto !important;
    color: ${({ theme }) => theme.textColor01} !important;
  }

  .ant-collapse-content {
    background-color: ${({ theme }) => theme.componentsBackground}; !important;
    color: ${({ theme }) => theme.textColor01} !important;
  }
`;
