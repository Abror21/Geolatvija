import styled from 'styled-components/macro';

export const StyledDateRangePickerContainer = styled.div`
  .rmdp-container {
    width: 100%;
  }

  .rmdp-range-hover {
    background-color: ${({ theme }) => theme.brand02};
  }

  .rmdp-wrapper {
    background-color: ${({ theme }) => theme.gray01};
  }

  .rmdp-ep-arrow {
    background-color: ${({ theme }) => theme.gray01};
    border-color: ${({ theme }) => theme.portalBackground};

    &:after {
      background-color: ${({ theme }) => theme.gray01};
    }
  }

  --rmdp-primary-green: ${({ theme }) => theme.brand02};
  --rmdp-today-green: ${({ theme }) => theme.textColor01};
  --rmdp-hover-green: ${({ theme }) => theme.textColor02};

  .hover-tooltip[data-tooltip]:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    background: ${({ theme }) => theme.gray12};
    color: ${({ theme }) => theme.gray01};
    padding: 4px 8px;
    border-radius: 4px;
    top: -35px;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    z-index: 10;
  }

  .hover-tooltip[data-tooltip]:hover::before {
    content: '';
    position: absolute;
    bottom: 25px;
    left: 50%;
    border-width: 5px;
    border-style: solid;
    border-color: ${({ theme }) => theme.gray12} transparent transparent transparent;
    transform: translateX(-50%);
    z-index: 10;
  }

  .footer-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 12px;
    gap: 12px;
  }

  .input-wrapper {
    display: flex;

    .separator {
      height: auto;
      border-left: 1px solid ${({ theme }) => theme.border};
    }

    .ant-input-affix-wrapper {
      background-color: ${({ theme }) => theme.gray01};
      border-color: ${({ theme }) => theme.border};
      padding: 10px 14px;
      line-height: 22px;

      &:hover {
        border-color: ${({ theme }) => theme.brand02} !important;
      }

      input {
        background-color: ${({ theme }) => theme.textColor07};
      }
    }

    .first-input .ant-input-affix-wrapper,
    .first-input .ant-input {
      border-top-right-radius: 0px !important;
      border-bottom-right-radius: 0px !important;
      border-right: none !important;
    }

    .first-input,
    .last-input {
      margin: 0px;

      .ant-input-affix-wrapper:focus-within,
      .ant-input:focus-within {
        border-color: ${({ theme }) => theme.brand02} !important;
      }
    }

    .last-input .ant-input-affix-wrapper,
    .last-input .ant-input {
      border-top-left-radius: 0px !important;
      border-bottom-left-radius: 0px !important;
      border-left: none !important;
    }

    .clear-icon {
      cursor: pointer;
      visibility: hidden;
      color: ${({ theme }) => theme.textColor02} !important;
    }

    .clear-icon:hover {
      color: ${({ theme }) => theme.textColor01} !important;
    }

    &:hover .clear-icon {
      visibility: visible;
    }

    &:hover .separator {
      border-left: 1px solid ${({ theme }) => theme.brand02} !important;
    }

    &:focus-within .separator {
      border-left: 1px solid ${({ theme }) => theme.brand02} !important;
    }
  }
`;
