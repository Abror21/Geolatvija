import styled from 'styled-components/macro';
import { VARIABLES } from 'styles/globals';

export const StyledMeasure = styled.div`
  bottom: calc(${VARIABLES.mapButtonMargin} + 3 * ${VARIABLES.mapButtonSize});
  right: ${VARIABLES.mapButtonMargin};
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  .length {
    border-top-left-radius: ${VARIABLES.mapButtonBorderRadius} !important;
    border-top-right-radius: ${VARIABLES.mapButtonBorderRadius} !important;
    &.expanded {
      border-top-left-radius: 0px !important;
    }
  }
  .area {
    border-top-left-radius: ${VARIABLES.mapButtonBorderRadius} !important;
    border-bottom-left-radius: ${VARIABLES.mapButtonBorderRadius} !important;
  }

  .measure-button:hover {
    background-color: ${({ theme }) => theme.brand02} !important;
    color: ${({ theme }) => theme.textColor03} !important;
  }
`;
