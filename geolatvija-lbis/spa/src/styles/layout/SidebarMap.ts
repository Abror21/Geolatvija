import styled from 'styled-components/macro';
import { VARIABLES } from 'styles/globals';

export const StyledPage = styled.div<{ notificationHeight?: number }>`
  display: flex;
  flex-grow: 1;
  width: 100%;

  height: calc(
    100vh - ${VARIABLES.headerHeight} - ${VARIABLES.footerHeight} - ${(props) => props.notificationHeight}px
  );
`;

export const StyledEmbedPage = styled.div`
  display: flex;
  flex-grow: 1;
  width: 100%;

  height: 100vh;
`;

export const StyledContent = styled.div`
  flex: 2 2 100%;
  .geoprodukti-button {
    z-index: 10;
    position: absolute;
    top: ${VARIABLES.mapButtonMargin};
    left: calc(${VARIABLES.mapButtonMargin} + ${VARIABLES.mapButtonMargin} + ${VARIABLES.searchSize});
  }
`;
