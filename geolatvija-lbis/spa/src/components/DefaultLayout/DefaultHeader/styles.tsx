import styled from 'styled-components/macro';
import { VARIABLES } from '../../../styles/globals';

export const HeaderContainer = styled.div`
  @media (max-width: ${VARIABLES.mobileWidthThreshold}) {
    display: none;
  }

  .highlight-button {
    background-color: ${({ theme }) => theme.brand02};
    color: ${({ theme }) => theme.textColor03};
  }
`;

export const OptionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  margin: 8px 0;

  border-right: 1px solid ${({ theme }) => theme.border2};

  label {
    font-family: 'Ubuntu', serif;
  }

  span {
    font-weight: ${({ theme }) => theme.fontWeightBold};
    font-size: ${({ theme }) => theme.p2Size};
  }
  .header-text{
    display:${({ theme }) => theme.textVisible} ;
  }
  .header-item {
    cursor: pointer;
    margin-right: 10px;
    &:hover {
      color: ${({ theme }) => theme.brand02};
    }
  }
`;

export const MenuButtons = styled.div`
  display: flex;
  gap: 10px;
`;

export const ProfileTooltipContent = styled.div`
  position: relative;
  padding: 10px;
  padding-right: 15px;
  a {
    color: ${({ theme }) => theme.textColor09} !important;
    text-decoration: underline;
  }
  .close-btn {
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
  }
`;
export const RightSideHeader = styled.div`
  display: flex;

  @media (max-width: ${VARIABLES.mobileWidthThreshold}) {
    display: none;
  }



  .user-data {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 0 20px;
    cursor: pointer;

    span {
      font-weight: ${({ theme }) => theme.fontWeightBold};
      font-size: ${({ theme }) => theme.p2Size};
    }

    .user-name {
      font-weight: ${({ theme }) => theme.fontWeightBold};
      font-size: ${({ theme }) => theme.p2Size};
      margin-bottom: 4px;
    }

    .user-role {
      font-weight: ${({ theme }) => theme.fontWeightBold};
      font-size: ${({ theme }) => theme.p2Size};
      color: ${({ theme }) => theme.textColor02};
    }

    .ant-badge {
      .ant-badge-dot {
        width: 11px;
        height: 11px;
      }
    }
    .profile-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: ${({ theme }) => theme.brand02};
      border-radius: 50%;
      margin: 0;
      width: 38px;
      height: 38px;
      position: relative;
      color: ${({ theme }) => theme.gray01};
      font-weight: ${({ theme }) => theme.fontWeightBold};
      .notification-dot {
        width: 10px;
        height: 11px;
        background-color: ${({ theme }) => theme.brand06};
        position: absolute;
        top: -1px;
        left: 1px;
        border-radius: 100px;
      }
    }
  }
`;

export const ProfileMenuContainer = styled.div`
  background: transparent;
  margin-top: 30px;
  overflow: hidden;
  border-radius: 8px;
  width: 240px;

  .profile-menu-option {
    padding: 15px 21px;
    color: ${({ theme }) => theme.textColor01};
    font-weight: ${({ theme }) => theme.fontWeightBold};
    display: flex;
    gap: 10px;
    align-items: center;
    width: 240px;
    border: none;
    position: relative;
    font-size: ${({ theme }) => theme.p2Size};
    line-height: ${({ theme }) => theme.lineHeight9};

    span {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    i {
      text-align: center;
      font-size: ${({ theme }) => theme.p2Size};
      width: 20px;
    }

    &:hover {
      background: ${({ theme }) => theme.brand02};
      color: ${({ theme }) => theme.textColor03};

      .portal-icon {
        color: ${({ theme }) => theme.textColor03} !important;
      }

      &::after {
        background: ${({ theme }) => theme.brand02};
      }
    }

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      width: 85%;
      height: 1px;
      left: 50%;
      transform: translateX(-50%);
      background: ${({ theme }) => theme.solitude};
    }
  }

  .profile-menu-option-wrapper {
    &.is-disabled {
      cursor: not-allowed !important;

      a {
        pointer-events: none !important;
        color: ${({ theme }) => theme.disabledText};

        i {
          color: ${({ theme }) => theme.disabledText};
        }
      }
      div {
        pointer-events: none !important;
        color: ${({ theme }) => theme.disabledText};
        i {
          color: ${({ theme }) => theme.disabledText};
        }
      }
    }

    button {
      background: transparent;
    }
  }
`;
