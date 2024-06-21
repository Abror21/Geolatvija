import styled from 'styled-components/macro';

export const StyledMapClickResultsComponent = styled.div`
  display: flex;
  flex-direction: column;

  .sub-content {
    border-bottom: 1px solid ${({ theme }) => theme.border};
    font-size: ${({ theme }) => theme.p3Size};
  }

  .sub-content:last-child {
    border-bottom: none;
  }

  .list {
    padding-left: 18px;
  }

  .link {
    color: ${({ theme }) => theme.brand02};
  }

  .functional-p {
    cursor: pointer;
    color: ${({ theme }) => theme.brand02};
  }

  .other-p {
    cursor: pointer;
  }

  .button-container {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 10px;

    .button {
      padding: 8px;

      .text {
        text-align: center !important;
        white-space: normal;
        height: auto;
      }
    }

    .notification-button {
      border: 1px solid ${({ theme }) => theme.border};
    }

    .more-info-button {
      background-color: ${({ theme }) => theme.brand02};
      color: ${({ theme }) => theme.textColor03};
    }
  }

  .feature-link {
    color: ${({ theme }) => theme.brand02};
    cursor: pointer;
  }
`;
export const StyledInfoTapisDocsComponent = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.portalBackground};
  padding: 12px;
  margin-bottom: 20px;
  display: flex;
  gap: 12px;
`;

export const StyledGeoResponseResultsComponent = styled.div`
  display: flex;
  flex-direction: column;
  .item {
    border-bottom: 1px solid ${({ theme }) => theme.border};
    padding-bottom: 20px;

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .grid {
      gap: 8px;
      border-bottom: 1px solid ${({ theme }) => theme.border};
      padding-bottom: 10px;
      padding-top: 10px;

      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      .field-name {
        font-style: italic;
        font-weight: normal;
      }
    }
  }
`;
export const SmallerTooltipWrapper = styled.div`
  .ant-tooltip-inner {
    max-width: 300px;
  }
`;

export const SmallerTooltipTitleWrapper = styled.div`
  font-size: ${({ theme }) => theme.p3Size} !important;
`;
