import styled from 'styled-components/macro';

export const StyledPage = styled.div`
  display: flex;

  .header-wrapper {
    flex-grow: 1;
  }

  .right-side-options {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .breadcrumb-wrapper {
    white-space: nowrap;

    .ant-breadcrumb {
      margin: 0;
      padding: 35px 0 30px;
      font-weight: ${({ theme }) => theme.fontWeightBold};
      color: ${({ theme }) => theme.textColor01};
      display: inline-block;

      li {
        &.ant-breadcrumb-separator {
          display: flex;
          justify-content: center;
          align-items: center;
          color: ${({ theme }) => theme.border2};
          margin-inline: 12px;

          i {
            font-size: ${({ theme }) => theme.p3Size};
          }
        }
      }
    }

    .ant-breadcrumb-link {
      font-size: ${({ theme }) => theme.p2Size};
      font-weight: ${({ theme }) => theme.fontWeightBold};
      line-height: ${({ theme }) => theme.lineHeight6};
      color: ${({ theme }) => theme.textColor02};

      a {
        color: ${({ theme }) => theme.textColor01};
      }
    }

    .ant-breadcrumb-separator {
      font-size: ${({ theme }) => theme.p2Size};
      color: ${({ theme }) => theme.textColor01};
    }

    /* .breadcrumb-right-side {
      padding: 8px 0 0;
    } */
  }

  .header {
    display: flex;
    background-color: ${({ theme }) => theme.portalBackground};

    .left-side-header {
      display: flex;
      flex-grow: 1;
      flex-wrap: wrap;

      .left-side-options {
        padding-top: 20px;
      }

      .left-side-options > * {
        margin-left: 12px;
        vertical-align: middle;
      }

      label {
        color: ${({ theme }) => theme.textColor01};
        font-size: ${({ theme }) => theme.h3Size};
        font-weight: ${({ theme }) => theme.fontWeightBolder};
      }

      h1 {
        i {
          font-size: ${({ theme }) => theme.iconSize2};
          color: ${({ theme }) => theme.textColor01};
          padding-right: 10px;
        }
        color: ${({ theme }) => theme.textColor01};
        font-size: ${({ theme }) => theme.h1Size};
        margin-top: 0;
        margin-bottom: 28px;
        font-weight: ${({ theme }) => theme.fontWeightBold};
      }

      & .subtitle {
        font-size: ${({ theme }) => theme.p1Size};
        padding-top: 16px;
        padding-left: 12px;
        margin-bottom: 0;
        color: ${({ theme }) => theme.textColor06};
        line-height: 16px;
        display: flex;
        align-items: center;
      }

      .status-tag {
        padding-top: 20px;
      }

      & .ant-tag {
        margin-left: 12px;
      }
    }
  }

  &.loading {
    visibility: hidden;
  }

  @media (max-width: 480px) {
    .breadcrumb-wrapper {
      overflow: auto;
    }
    .header {
      .left-side-header {
        h1 {
          width: 100%;
          padding-right: 16px;
        }

        & .subtitle {
          padding-top: 0;
        }

        .status-tag {
          padding-top: 0;
        }
      }
    }
  }

  @media (max-width: 875px) {
    .header {
      flex-direction: column;

      .right-side-options {
        display: flex;
        flex-direction: column;
        margin-bottom: 0;

        .ant-input-search {
          margin-right: 0;
        }

        .ant-input-search + .ant-btn {
          margin-top: 16px;
        }
      }
    }
  }
`;
