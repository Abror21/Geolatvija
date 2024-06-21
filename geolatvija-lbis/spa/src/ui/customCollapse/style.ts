import styled from 'styled-components/macro';

export const StyledCustomCollapse = styled.div`
  .collapse {
    display: flex;
    padding: 16px;
    gap: 10px;
    background-color: ${({ theme }) => theme.gray02};

    .header {
      flex-grow: 1;
      font-weight: ${({ theme }) => theme.fontWeightBold};
      color: ${({ theme }) => theme.textColor01};
    }

    .action {
      cursor: pointer;
      font-weight: ${({ theme }) => theme.fontWeightBold};
      color: ${({ theme }) => theme.textColor04};
    }
  }

  .content {
    transition: height 0.5s ease;
    overflow: hidden;
    font-size: ${({ theme }) => theme.p3Size};

    .content-wrapper {
      padding: 14px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;

      .collapse-entry {
        padding: 8px 12px;
        color: ${({ theme }) => theme.textColor02};
        border-radius: 6px;

        &:hover {
          font-weight: ${({ theme }) => theme.fontWeightBold};
          color: ${({ theme }) => theme.textColor01};
          background-color: ${({ theme }) => theme.portalBackground};
        }
      }

      .action {
        display: flex;
        justify-content: center;
        font-weight: ${({ theme }) => theme.fontWeightBold};
        color: ${({ theme }) => theme.textColor04};
        cursor: pointer;
      }
    }
  }
`;
