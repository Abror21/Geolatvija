import styled from 'styled-components/macro';
import { VARIABLES } from 'styles/globals';

export const StyledPage = styled.div`
  .layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .ant-layout-content {
    background-color: ${({ theme }) => theme.portalBackground};
    width: initial !important;
  }

  .with-sidebar-width {
    padding-left: ${VARIABLES.sidebarWidth};
  }

  .with-small-sidebar-width {
    padding-left: 80px;
  }

  .ant-layout-content.without-page-header {
    margin-top: calc(${VARIABLES.headerHeight} + 16px);
  }

  .collapsed-layout {
    padding-left: 78px;
  }

  .site-header {
    width: 100%;
    background: ${({ theme }) => theme.gray01};
    color: ${({ theme }) => theme.textColor01};
    border-bottom: 1px solid ${({ theme }) => theme.border};
    height: 80px;
    line-height: ${({ theme }) => theme.lineHeight9};
    padding-left: 30px;
    padding-right: 10px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    .left-side-header {
      display: flex;
      align-items: center;
      justify-content: center;

      a {
        align-self: stretch;
        display: flex;
        align-items: center;

        .logo {
          margin: auto 0;
        }
      }

      .random-line {
        width: 1px;
        height: 20px;
        background: ${({ theme }) => theme.border2};

        margin-left: 25px;
      }
    }
  }

  .fake-language-select {
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    align-items: center;
    cursor: pointer;
    flex-grow: 1;
    color: ${({ theme }) => theme.textColor02};
  }

  @media (max-width: 480px) {
    .html-container {
      height: 300px;
      overflow: auto;
    }
  }
`;

export const StyledDivider = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  background-color: ${({ theme }) => theme.portalBackground};

  padding: 0 100px;
`;
