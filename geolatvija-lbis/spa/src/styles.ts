import { createGlobalStyle } from 'styled-components';
import { FontType } from './styles/theme/fonts';
import { ThemeType } from './styles/theme/theme';
import { COLORS, VARIABLES } from './styles/globals';

type GlobalThemeType = ThemeType & FontType;

export const GlobalStyles = createGlobalStyle<{ theme: GlobalThemeType }>`
body{
  overflow-x: hidden;
}
  //scrollbar styles
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.scroll};
    border-radius: 100px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.brand02} !important;
    border-radius: 100px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.scroll};
  }

  .ant-form-item-label {
    padding-bottom: 0;
    line-height: ${({ theme }) => theme.lineHeight6} !important;
    display: flex;

    label {
      font-size: ${({ theme }) => theme.p2Size} !important;
      color: ${({ theme }) => theme.textColor02} !important;
      font-weight: ${({ theme }) => theme.fontWeightBold} !important;
      line-height: ${({ theme }) => theme.lineHeight6} !important;
      overflow-wrap: break-word;
      white-space: normal;
      text-align: start;
      height: auto !important;

      &:before {
        color: ${({ theme }) => theme.alertIcon04} !important;
      }
    }
  }

  .form-item-and-button-one-row {
    margin-bottom: 0 !important;
    display: flex;
    flex-grow: 1;

    .ant-row {
      display: flex;
      flex-grow: 1;
    }

    .ant-form-item-control-input-content {
      display: flex;
      gap: 20px;
      justify-content: space-between;
    }

    .ant-form-item {
      flex-grow: 1;
      margin-bottom: 0;
    }
  }

  .ant-tooltip .ant-tooltip-inner {
    background: ${({ theme }) => theme.gray12};
    color: ${({ theme }) => theme.textColor07};
    border: 1px solid ${({ theme }) => theme.customBorder};
    font-size: ${({ theme }) => theme.p2Size} !important;

    i {
      color: ${({ theme }) => theme.iconColor05};
    }
  }

  .ant-form-item {
    margin-bottom: 8px;

    &.padding-top {
      padding-top: 4px;
    }
  }

  .ant-form-item .ant-form-item-label {
    padding-bottom: 0;
  }

  .hide .ant-result-image {
    display: none
  }

  & .ant-form-item-label > label::after {
    margin-left: 0;
  }

  .ant-form-item-explain-error {
    font-size: ${({ theme }) => theme.p2Size} !important;
  }


  .ant-menu-submenu-popup {
    .ant-menu {
      background-color: ${({ theme }) => theme.componentsBackground};

      a {
        color: ${({ theme }) => theme.textColor01};
      }

      a:hover {
        color: ${({ theme }) => theme.brand02};
      }

      .ant-menu-submenu .ant-menu-submenu-title {
        color: ${({ theme }) => theme.textColor01};

        &:hover {
          color: ${({ theme }) => theme.brand02};
        }

        &:active {
          background-color: ${({ theme }) => theme.brand02Light};
        }

        .ant-menu-submenu-arrow {
          color: ${({ theme }) => theme.textColor01};

          &:hover {
            color: ${({ theme }) => theme.brand02Light};
          }
        }
      }
    }

    .ant-menu-item-active {
      &:active {
        background-color: ${({ theme }) => theme.brand02Light};
      }
    }

    .ant-menu-item-selected {
      background-color: ${({ theme }) => theme.brand02Light} !important;
    }
  }

  .ant-message-notice-content {
    background-color: ${({ theme }) => theme.gray01} !important;
    color: ${({ theme }) => theme.textColor01} !important;
    border: solid 1px ${({ theme }) => theme.customBorder} !important;
    font-size: ${({ theme }) => theme.p3Size} !important;

    .ant-message-error .anticon {
      color: ${({ theme }) => theme.alertIcon04};
    }

    .ant-message-success .anticon {
      color: ${({ theme }) => theme.alertIcon01};
    }
  }

  h2 {
    color: ${({ theme }) => theme.textColor01};
  }

  h3 {
    color: ${({ theme }) => theme.textColor01};
  }

  h4 {
    color: ${({ theme }) => theme.textColor01};
  }

  .ant-col {
    color: ${({ theme }) => theme.textColor01};
  }

  .flex {
    display: flex;
  }

  .gap-20 {
    gap: 0 20px;
  }

  .gap-30 {
    gap: 0 30px;
  }

  .panel-row .input-container {
    width: 100%;
  }

  .grid {
    display: grid;
  }

  .align-end {
    align-items: flex-end;
  }

  .grid-cols-2 {
    grid-template-columns: 1fr 1fr;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .ant-popover .ant-popover-arrow {
    &:after {
      background: ${({ theme }) => theme.gray01};;
    }
  }

  .ant-popover .ant-popover-inner {
    padding: 0 !important;
    background-color: ${({ theme }) => theme.gray01};
    border: 1px solid ${({ theme }) => theme.customBorder} !important;
    font-size: ${({ theme }) => theme.p2Size} !important;

    .popover-item {
      padding: 8px;
      min-width: 100px;
      color: ${({ theme }) => theme.textColor01};

      :hover {
        background-color: ${({ theme }) => theme.brand02Light2};
        cursor: pointer;
      }
    }

    p {
      margin: 0;
    }
  }

  .mt-20 {
    margin-top: 20px;
  }

  .mb-12 {
    margin-bottom: 12px;
  }

  .cursor {
    cursor: pointer;
  }

  .fake-required {
    font-size: ${({ theme }) => theme.p2Size} !important;
    &:before {
      font-family: SimSun, sans-serif;
      display: inline-block;
      margin-inline-end: 4px;
      color: #ff4d4f;
      font-size: ${({ theme }) => theme.p2Size};
      line-height: 1;
      content: "*";
    }
  }

  .full-spinner {
    height: calc(100vh - ${VARIABLES.headerHeight} - ${VARIABLES.footerHeight});
  }

  .ant-spin-dot-item {
    background-color: ${({ theme }) => theme.brand02} !important;
  }

  .ant-select-dropdown {
    background-color: ${({ theme }) => theme.gray01};
    border: 1px solid ${({ theme }) => theme.customBorder};

    .ant-empty-description {
      font-size: ${({ theme }) => theme.p1Size} !important;
      color: ${({ theme }) => theme.textColor09} !important;
    }

    .rc-virtual-list-holder {
      overflow-y: scroll !important;
      &::-webkit-scrollbar-track {
       background: transparent !important; 
      }
      .ant-select-item {
        color: ${({ theme }) => theme.textColor01};
        font-size: ${({ theme }) => theme.p1Size};
        line-height: ${({ theme }) => theme.lineHeight6};

        &:hover {
          color: ${({ theme }) => theme.switchColor04};
          background-color: ${({ theme }) => theme.selectOptionColor} !important;
        }
      }

      .ant-select-item-option-selected {
        font-size: ${({ theme }) => theme.p1Size};
        background-color:${({ theme }) => theme.selectOptionColor} !important;
        color: ${({ theme }) => theme.switchColor04} ;
      }
    }
  }


  @media (max-width: 768px) {
    .grid-cols-2 {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 480px) {
    .ant-form-item-label {
      label {
        height: auto;
      }
    }

    .ant-form-item {
      margin-bottom: 6px;
    }
  }

  .tooltip-white {
    .ant-tooltip-inner {
      color: ${({ theme }) => theme.textColor01};
      background-color: ${({ theme }) => theme.gray01};
    }
  }
  .profile-tooltip{
    max-width: 100% !important;
  }
  h4.ant-typography{
    color: ${({ theme }) => theme.textColor09};
  }
  .ant-message-custom-content {
    display: flex;

    .toast-message-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 6px;
      width: auto;

      .close {
        cursor: pointer;
      }
    }
  }
  .projects__info-text{
    padding: 10px;
    max-width: 300px;
    color: ${({ theme }) => theme.textColor09};
   
  }
  .ant-tooltip.white-background{
    .ant-tooltip-inner{
      color: ${({ theme }) => theme.textColor09}; 
      background-color: ${({ theme }) => theme.gray01}; 
    }
  }
  .ant-tooltip.white-background.five-hundred{
    .ant-tooltip-inner{
      width: max-content;
      max-width: 500px;
    }
  }

.ant-select-item.project-status-in_voting{
  color: ${({ theme }) => theme.statusGreen} !important;  
  &.ant-select-item-option-selected{
    background-color: ${({ theme }) => theme.statusGreenLight} !important;
  }

}
.ant-select-item.project-status-voting_ended{
  color: ${({ theme }) => theme.statusBrown}  !important;
  &.ant-select-item-option-selected{
    background-color: ${({ theme }) => theme.statusGreenLight} !important;
  }
}
.ant-select-item.project-status-supported{
  color: ${({ theme }) => theme.statusDarkGreen}  !important;  
   &.ant-select-item-option-selected{
    background-color: ${({ theme }) => theme.statusDarkGreenLight} !important;
  }
}
.ant-select-item.project-status-in_progress{
  color: ${({ theme }) => theme.statusBlue} !important;
   &.ant-select-item-option-selected{
    background-color: ${({ theme }) => theme.statusBlueLight} !important;
  }
}
.ant-select-item.project-status-realized{
  color: ${({ theme }) => theme.statusDarkBlue}  !important;
   &.ant-select-item-option-selected{
    background-color: ${({ theme }) => theme.statusDarkBlueLight} !important;
  }
}

.ant-select-item.project-status-unsupported{
  color: ${({ theme }) => theme.statusRed} !important;
   &.ant-select-item-option-selected{
    background-color: ${({ theme }) => theme.statusRedLight} !important;
  }
}


.status-in_voting {
    background-color: ${({ theme }) => theme.statusGreenLight}  !important;
  }
  .status-in_voting,
  .status-in_voting span {
    color: ${({ theme }) => theme.statusGreen}  !important;
    &:hover {
      color: ${({ theme }) => theme.statusGreen}  !important;
    }
  }
  .status-voting_ended {
    background-color: ${({ theme }) => theme.statusGreenLight}  !important;
  }
  .status-voting_ended,
  .status-voting_ended span {
    color: ${({ theme }) => theme.statusBrown}  !important;
    &:hover {
      color: ${({ theme }) => theme.statusBrown} !important;
    }
  }
  .status-supported {
    background-color: ${({ theme }) => theme.statusDarkGreenLight} !important;
  }
  .status-supported,
  .status-supported span {
    color: ${({ theme }) => theme.statusDarkGreen} !important;
    &:hover {
      color: ${({ theme }) => theme.statusDarkGreen} !important;
    }
  }
  .status-in_progress {
    background-color: ${({ theme }) => theme.statusBlueLight} !important;
  }
  .status-in_progress,
  .status-in_progress span {
    color: ${({ theme }) => theme.statusBlue} !important;
    &:hover {
      color: ${({ theme }) => theme.statusBlue} !important;
    }
  }
  .status-realized {
    background-color: ${({ theme }) => theme.statusDarkBlueLight} !important;
  }
  .status-realized,
  .status-realized span {
    color: ${({ theme }) => theme.statusDarkBlue} !important;
    &:hover {
      color: ${({ theme }) => theme.statusDarkBlue} !important;
    }
  }

  .status-unsupported {
    background-color: ${({ theme }) => theme.statusRedLight} !important;
  }
  .status-unsupported,
  .status-unsupported span {
    color: ${({ theme }) => theme.statusRed} !important;
    &:hover {
      color: ${({ theme }) => theme.statusRed} !important;
    }
  }


   .status {
    padding: 5px 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    color: ${({ theme }) => theme.brand07};
    background-color: ${({ theme }) => theme.brand07Light};
    border: 1px solid ${({ theme }) => theme.borderColor};
    &.voting_is_closed {
      padding: 5px 8px;    
    }
    
    &.supported {
      color: ${({ theme }) => theme.brand02};
      background-color: ${({ theme }) => theme.brand02Light3};
    }
    &.realized {
      color: ${({ theme }) => theme.statusRealizedColor};
      background-color: ${({ theme }) => theme.brand04Light};
    }
    &.in_progress {
      color: ${({ theme }) => theme.brand05};
      background-color: ${({ theme }) => theme.brand05Light};
    }
    &.unsupported {
      color: ${({ theme }) => theme.statusUnsupportedColor};
      background-color: ${({ theme }) => theme.brand06Light};  
    }
    &.in_voting{
      background-color: ${({ theme }) => theme.statusGreenLight}  ;
      color: ${({ theme }) => theme.statusGreen}  ;
    }
  }

.project_list{
  display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    row-gap: 15px;
    column-gap: 30px;
    margin-top: 15px;
    @media screen and (max-width: 1950px) {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }
    @media screen and (max-width: 1450px) {
      grid-template-columns: repeat(auto-fill, minmax(255px, 1fr));
    }
}
`;
