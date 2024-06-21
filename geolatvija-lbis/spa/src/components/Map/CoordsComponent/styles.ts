import styled from 'styled-components/macro';
import { VARIABLES } from 'styles/globals';

export const StyledCoordsComponent = styled.div`
  .coordinate-window {
    background-color: ${({ theme }) => theme.white};
    border-radius: ${VARIABLES.coordinateWindowBorderRadius};
    width: ${VARIABLES.coordinateWindowWidth};
    position: absolute;
    z-index: 100;
    overflow: hidden;
    box-shadow: 0 0 30px rgb(0 0 0 / 0.2);

    .options-wrapper {
      display: flex;
      flex-direction: column;
      flex-grow: 1;

      .option-label {
        padding: ${VARIABLES.coordinateWindowPaddings};
        color: ${({ theme }) => theme.textColor01};
        cursor: pointer;
        font-weight: ${({ theme }) => theme.fontWeightBold};
        width: ${VARIABLES.coordinateWindowWidth};
        font-size: ${({ theme }) => theme.p2Size};
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: start;
        &:hover {
          background: ${({ theme }) => theme.brand02};
          color: ${({ theme }) => theme.textColor03};
        }
      }

      .disabled-option-tooltip {
        cursor: not-allowed;
      }

      .disabled-option {
        cursor: not-allowed !important;
        pointer-events: none !important;
        background-color: transparent !important;
        color: ${({ theme }) => theme.disabledText};

        &:hover {
          color: ${({ theme }) => theme.disabledText};
        }
      }
    }
  }
`;
