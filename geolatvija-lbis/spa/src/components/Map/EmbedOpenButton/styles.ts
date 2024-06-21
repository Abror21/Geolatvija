import styled from 'styled-components/macro';
import { COLORS, VARIABLES } from 'styles/globals';

export const StyledEmbedOpenButton = styled.div<{ embedViewPort?: boolean }>`
  bottom: ${VARIABLES.mapButtonMargin};
  right: ${VARIABLES.mapButtonMargin};
  button {
    background-color: ${({ embedViewPort }) =>
      embedViewPort ? `${COLORS.gray03} !important` : `${COLORS.white} !important`};
    border-bottom-left-radius: ${VARIABLES.mapButtonBorderRadius} !important;
    border-bottom-right-radius: ${VARIABLES.mapButtonBorderRadius} !important;
    border-top: 0px !important;
  }
`;
