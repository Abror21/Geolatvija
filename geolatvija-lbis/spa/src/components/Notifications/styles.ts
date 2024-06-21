import styled, { keyframes, css } from 'styled-components';

export const StyledNotificationList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const fadeIn = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

interface NotificationProps {
  isOpen: boolean;
  isClosing: boolean;
}

export const FullWidthNotification = styled.div<NotificationProps>`
  position: relative;
  background-color: ${({ theme }) => theme.brand02};
  color: ${({ theme }) => theme.gray01};
  padding: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  &:last-child {
    border-bottom: none;
  }
  animation: ${({ isOpen, isClosing }) =>
    isOpen && !isClosing
      ? css`
          ${fadeIn} 0.5s ease
        `
      : isClosing
      ? css`
          ${fadeOut} 0.5s ease forwards
        `
      : 'none'};
  display: ${({ isOpen, isClosing }) => (isOpen || isClosing ? 'block' : 'none')};

  .notification-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 64px;

    .notification-wrapper {
      display: flex;
      gap: 12px;
      padding-right: 12px;

      .text-wrapper {
        margin: 14px 0px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: ${({ theme }) => theme.p3Size};
        color: ${({ theme }) => theme.gray01};

        p {
          margin: 0;
          color: ${({ theme }) => theme.gray01};
        }

        a {
          color: ${({ theme }) => theme.gray01};
          text-decoration: underline;
        }
      }

      .info-icon-wrapper {
        display: flex;
        gap: 12px;
        padding-right: 12px;
        align-items: center;
        border-right: 1px solid ${({ theme }) => theme.border};
        font-size: ${({ theme }) => theme.p3Size};
      }
    }

    .portal-icon {
      color: ${({ theme }) => theme.gray01} !important;
    }

    .close {
      cursor: pointer;
    }
  }
`;
