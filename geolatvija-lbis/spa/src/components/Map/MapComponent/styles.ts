import styled, { css } from 'styled-components/macro';
import { VARIABLES } from 'styles/globals';

interface StyledMapComponentProps {
  embeded?: boolean;
}

const measureTooltip = css`
  background-color: ${({ theme }) => theme.gray01};
  border: 1px solid ${({ theme }) => theme.gray03};
  color: ${({ theme }) => theme.textColor01};
  border-radius: ${VARIABLES.mapButtonBorderRadius};
  padding: 5px;
`;

export const StyledMapComponent = styled.div<StyledMapComponentProps>`
  width: 100%;
  height: 100%;
  position: relative;

  .ol-control {
    z-index: 20;
    background-color: transparent;

    button {
      background-color: ${({ theme }) => theme.gray01};
      border: 1px solid ${({ theme }) => theme.gray03};
      color: ${({ theme }) => theme.textColor01};
      border-radius: 0px;
      font-size: ${({ theme }) => theme.p2Size};
      font-style: normal;
      font-weight: 400;
      width: ${VARIABLES.mapButtonSize};
      height: ${VARIABLES.mapButtonSize};
      cursor: pointer;
      margin: 0px;
    }

    button.active {
      background-color: ${({ theme }) => theme.brand03};
      color: ${({ theme }) => theme.brand02};
      i {
        color: ${({ theme }) => theme.brand02};
      }
    }

    button:hover {
      background-color: ${({ theme }) => theme.brand02};
      color: ${({ theme }) => theme.textColor03};
      outline: none;
    }
  }

  .ol-zoom {
    top: auto;
    left: auto;
    bottom: calc(${VARIABLES.mapButtonMargin} + ${VARIABLES.mapButtonSize});
    right: ${VARIABLES.mapButtonMargin};
    button {
      font-family: 'Font Awesome 6 Pro';
    }
    .ol-zoom-in {
      ${({ embeded }) =>
        embeded === true
          ? css`
              border-top-left-radius: ${VARIABLES.mapButtonBorderRadius} !important;
              border-top-right-radius: ${VARIABLES.mapButtonBorderRadius} !important;
            `
          : css`
              border-top: 0px !important;
            `}
    }
    .ol-zoom-out {
      border-top: 0px !important;
    }
  }
  &.zoom-buttons-only .ol-zoom{
    bottom: ${VARIABLES.mapButtonMargin};
    border-radius: 6px;
    .ol-zoom-in{
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        border-top: 1px solid ${({theme}) => theme.border2} !important;
    }
    .ol-zoom-out{
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
    }
  }
  .ol-scale-line {
    border-radius: 2px;
    left: auto;
    right: calc(2 * ${VARIABLES.mapButtonMargin} + ${VARIABLES.mapButtonSize});
    bottom: ${VARIABLES.mapButtonMargin};
    background: ${({ theme }) => theme.gray01};
    color: ${({ theme }) => theme.textColor01};
    .ol-scale-line-inner {
      background: ${({ theme }) => theme.gray01};
      color: ${({ theme }) => theme.textColor01};
      border-color: ${({ theme }) => theme.textColor01};
    }
  }

  .ol-attribution {
    background: ${({ theme }) => theme.gray01};
    color: ${({ theme }) => theme.textColor01};
    bottom: 1px;
    right: calc(2 * ${VARIABLES.mapButtonMargin} + ${VARIABLES.mapButtonSize});
    display: flex;
    align-items: flex-end;
    button {
      border-radius: 2px;
      background: ${({ theme }) => theme.gray01};
      color: ${({ theme }) => theme.textColor01};
      width: auto;
      height: auto;
      padding: 2px;
      border: 0px !important;
      span {
        font-size: ${({ theme }) => parseFloat(theme.p4Size) + 0.15 + 'rem'};
      }
    }
    button.active {
      background: ${({ theme }) => theme.gray01};
      color: ${({ theme }) => theme.textColor01};
      border: 0px !important;
    }
    button:hover {
      background: ${({ theme }) => theme.gray01};
      color: ${({ theme }) => theme.textColor01};
      border: 0px !important;
      outline: 0px;
    }
    button:focus {
      outline: 0px;
    }
    ul {
      background: ${({ theme }) => theme.gray01};
      color: ${({ theme }) => theme.textColor01};
      font-size: ${({ theme }) => parseFloat(theme.p4Size) + 0.15 + 'rem'};
      li {
        display: block;
      }
    }
  }

  .ol-embed {
    top: auto;
    bottom: ${VARIABLES.mapButtonMargin};
    right: ${VARIABLES.mapButtonMargin};
    button {
      border-bottom-left-radius: ${VARIABLES.mapButtonBorderRadius} !important;
      border-bottom-right-radius: ${VARIABLES.mapButtonBorderRadius} !important;
      border-top: 0;
    }
  }

  .measure-static-tooltip {
    ${measureTooltip}
    font-size: ${({ theme }) => theme.p1Size};
  }

  .measure-dynamic-tooltip {
    ${measureTooltip}
    font-size: ${({ theme }) => theme.p2Size};
  }

  .ol-popup {
    position: absolute;
    background-color: white;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    bottom: 12px;
    left: -50px;
    min-width: 180px;
    max-width: 420px;
    font-size: ${({ theme }) => theme.p2Size};
  }
  .ol-popup:after,
  .ol-popup:before {
    top: 100%;
    border: solid transparent;
    content: ' ';
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }
  .ol-popup:after {
    border-top-color: white;
    border-width: 10px;
    left: 48px;
    margin-left: -10px;
  }
  .ol-popup:before {
    border-top-color: #cccccc;
    border-width: 11px;
    left: 48px;
    margin-left: -11px;
  }
  .ol-popup-closer {
    color: ${({ theme }) => theme.textColor01};
    text-decoration: none;
    position: absolute;
    top: 2px;
    right: 8px;
  }
  .ol-popup-closer:after {
    content: '✖';
  }
`;
