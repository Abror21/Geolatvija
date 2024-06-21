import styled from 'styled-components/macro';
import { VARIABLES } from 'styles/globals';

interface StyledButtonProps {
  show: boolean;
}

export const StyledMapSearch = styled.div<StyledButtonProps>`
  .map-search {
    z-index: 10;
    position: absolute;
    top: ${VARIABLES.mapButtonMargin};
    left: ${VARIABLES.mapButtonMargin};
    width: ${VARIABLES.searchSize};
    max-width: ${(props) => (props.show ? VARIABLES.searchSize : '120px')};
    transition: all 0.2s ease-out;
  }
`;

export const StyledPopoverContent = styled.div`
  z-index: 10;
  position: absolute;
  top: calc(${VARIABLES.mapButtonMargin} + 40px + 10px); //top - input size - margin
  left: ${VARIABLES.mapButtonMargin};
  height: 75%;
  overflow-y: auto;

  box-shadow: 0 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03);
  background: ${({ theme }) => theme.gray01};
  border-radius: 6px;
  width: ${VARIABLES.searchSize};

  .collapse-entry {
    cursor: pointer;
  }
`;
