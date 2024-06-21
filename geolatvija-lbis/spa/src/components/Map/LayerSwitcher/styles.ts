import styled, { css } from 'styled-components/macro';
import { COLORS, VARIABLES } from 'styles/globals';

const darkButtonText = css`
  color: ${({ theme }) => theme.textColor01};
  border: 2px solid ${({ theme }) => theme.textColor01};
  &:hover {
    color: ${({ theme }) => theme.textColor01} !important;
  }
  i {
    color: ${({ theme }) => theme.textColor01};
  }
`;

const lightButtonText = css`
  color: ${({ theme }) => theme.textColor03};
  border: 2px solid ${({ theme }) => theme.textColor03};
  &:hover {
    color: ${({ theme }) => theme.textColor03} !important;
  }
  i {
    color: ${({ theme }) => theme.textColor03};
  }
`;

export const StyledLayerSwitcher = styled.div<{ embedViewPort?: boolean }>`
  bottom: ${VARIABLES.mapButtonMargin};
  left: ${VARIABLES.mapButtonMargin};
  display: flex;
  align-items: center;
  background-color: ${({ embedViewPort, theme }) =>
    embedViewPort ? `${COLORS.gray03} !important` : `${theme.gray01}!important`};
  button {
    background-color: ${({ embedViewPort, theme }) =>
      embedViewPort ? `${COLORS.gray03} !important` : `${theme.gray01}!important`};
    border-radius: ${VARIABLES.mapButtonBorderRadius} !important;
    width: ${VARIABLES.mapLayerButtonSize} !important;
    height: ${VARIABLES.mapLayerButtonSize} !important;
    border: 1px solid ${({ theme }) => theme.border};
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    i {
      margin: 0px !important;
    }
    background-size: ${VARIABLES.mapLayerButtonSize} ${VARIABLES.mapLayerButtonSize};
    &.osm {
      background-image: url('/img/map/osm.png');
      ${darkButtonText}
    }
    &.topo {
      background-image: url('/img/map/topo.png');
      ${lightButtonText}
    }
    &.orto {
      background-image: url('/img/map/orto.png');
      ${lightButtonText}
    }
    &.more {
      color: ${({ theme }) => theme.brand02} !important;
      border-color: ${({ theme }) => theme.brand02} !important;
    }
    &.options {
      margin-right: 10px !important;
      border: 1px solid ${({ theme }) => theme.gray03};
    }
  }
  &.expanded {
    padding: 8px;
    border-radius: ${VARIABLES.mapButtonBorderRadius} !important;
    bottom: calc(${VARIABLES.mapButtonMargin} - 8px);
    left: calc(${VARIABLES.mapButtonMargin} - 8px);
  }

  .layer-button:hover {
    background-color: ${({ theme }) => theme.brand02} !important;
    color: ${({ theme }) => theme.textColor03} !important;
  }
`;

export const VerticalLine = styled.div`
  border-left: 1px solid ${({ theme }) => theme.gray03};
  width: 1px;
  height: ${VARIABLES.mapLayerButtonSize};
  margin: 0px 15px 0px 15px;
`;
