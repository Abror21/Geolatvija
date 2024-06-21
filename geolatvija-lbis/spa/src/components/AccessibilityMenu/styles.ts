import styled from 'styled-components/macro';

export const SidebarHeaderContainer = styled.div`
  background: ${({ theme }) => theme.gray03};
  display: flex;
  flex-direction: row;
  min-width: 208px;
  align-items: center;
  justify-content: center;
  padding: 24px 24px 0 24px;

  .close-icon {
    cursor: pointer;
  }

  .title {
    font-weight: ${({ theme }) => theme.fontWeightBolder} !important;

    flex-grow: 1;
    label {
      font-size: ${({ theme }) => theme.h4Size};
    }
  }
`;

export const SettingsContainer = styled.div`
  background: ${({ theme }) => theme.gray03};
  padding: 24px;

  .semi-title {
    font-weight: ${({ theme }) => theme.fontWeightBolder};
  }

  .text-option {
    display: flex;
    padding: 8px;
    background: ${({ theme }) => theme.gray01};
    border: 1px solid ${({ theme }) => theme.border2};
    margin-bottom: 8px;
    cursor: pointer;
    min-height: 34px;

    label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      font-weight: ${({ theme }) => theme.fontWeightBolder};
      font-size: ${({ theme }) => theme.p1Size};
      cursor: pointer;
    }

    .portal-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .default {
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) => theme.white};
  }

  .black-on-yellow {
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) => theme.yellow};
  }

  .white-on-black {
    display: flex;
    align-items: center;
    justify-content: center;

    background: ${({ theme }) => theme.black};
    color: ${({ theme }) => theme.white};
  }
`;
