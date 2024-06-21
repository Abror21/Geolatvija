import styled from 'styled-components/macro';
import { COLORS, VARIABLES } from 'styles/globals';

interface StyledEmbedViewportProps {
  width: number;
  height: number;
  embedViewPort?: boolean;
}

export const StyledEmbedViewport = styled.div<StyledEmbedViewportProps>`
  height: ${(props) => `${props.height}px`};
  width: ${(props) => `${props.width}px`};
  top: calc(50% - 5px - ${(props) => `${props.height / 2}px`});
  left: calc(50% - 5px - ${(props) => `${props.width / 2}px`});
  position: absolute;
  border: 10px solid white;
  border-radius: 0px;
  box-shadow: 0 0 0 2000px rgba(0, 0, 0, 0.5);
  pointer-events: none;
  button {
    font-family: Ubuntu, serif !important;
  }
  .ol-zoom {
    button {
      font-size: 130% !important;
      background-color: ${({ embedViewPort }) =>
        embedViewPort ? `${COLORS.gray03} !important` : `${COLORS.white} !important`};
    }
    .ol-zoom-in {
      border-top-left-radius: ${VARIABLES.mapButtonBorderRadius} !important;
      border-top-right-radius: ${VARIABLES.mapButtonBorderRadius} !important;
      border-bottom: 1px solid
        ${({ embedViewPort }) => (embedViewPort ? `${COLORS.white} !important` : `${COLORS.gray06} !important`)};
    }

    .ol-zoom-out {
      border-bottom: 1px solid
        ${({ embedViewPort }) => (embedViewPort ? `${COLORS.white} !important` : `${COLORS.gray06} !important`)};
    }
  }
`;
