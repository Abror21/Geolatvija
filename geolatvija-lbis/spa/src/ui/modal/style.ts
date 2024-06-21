import styled from 'styled-components/macro';
import { Modal } from 'antd';
import { VARIABLES } from '../../styles/globals';

export const StyledModal = styled(Modal)`
  @media (max-width: ${VARIABLES.mobileWidthThreshold}) {
    &.ant-modal {
      top: 25px;
    }
  }

  &.modal-secondary {
    .ant-modal-content {
      padding: 0px;
      .modal-header {
        background-color: ${({ theme }) => theme.portalBackground};
        border-bottom: none !important;
        padding: 15px 30px !important;
        .title {
          color: ${({ theme }) => theme.textColor02};
          font-weight: ${({ theme }) => theme.fontWeightBold};
          font-size: ${({ theme }) => theme.p2Size};
          line-height: ${({ theme }) => theme.h3Size};
        }
      }
      .actual-content {
        padding: 0px 30px;
      }
      .ant-modal-footer {
        padding: 15px 30px !important;
      }
    }
  }
  .ant-modal-content {
    border: 1px solid ${({ theme }) => theme.customBorder};
    background-color: ${({ theme }) => theme.gray01};
    padding: 30px;

    .ant-modal-header {
      background-color: ${({ theme }) => theme.gray01};
    }

    .ant-modal-close {
      display: none;
    }

    .ant-modal-body {
      .modal-header {
        display: flex;
        padding-bottom: 30px;
        margin-bottom: 30px;
        border-bottom: 1px solid ${({ theme }) => theme.border};

        .title {
          flex-grow: 1;
        }

        .actions {
          display: flex;
          justify-content: center;
          align-items: center;

          & > * {
            padding: 0 20px;
            border-right: 1px solid ${({ theme }) => theme.border2};
            cursor: pointer;

            &:last-child {
              border-right: none;
              padding-right: 0;
            }
          }
        }
      }
    }

    .ant-modal-footer {
      border-top: none;
      display: flex;
      justify-content: end;
      gap: 12px;
    }

    .title {
      color: ${({ theme }) => theme.textColor01};
    }
    .confirm-title {
      color: ${({ theme }) => theme.textColor01};
      font-size: ${({ theme }) => theme.p1Size};

      .portal-icon {
        color: ${({ theme }) => theme.alertIcon03};
        margin-right: 15px;
        font-size: ${({ theme }) => theme.p1Size};
      }
    }
  }
  &.submit_project_modal {
    .ant-modal-content {
      padding-top: 20px;
      padding-bottom: 20px;
    }
  }
`;
