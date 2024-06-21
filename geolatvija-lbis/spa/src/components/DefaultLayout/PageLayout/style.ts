import styled from 'styled-components/macro';
import { VARIABLES } from '../../../styles/globals';

export const StyledPage = styled.div`
  @media (max-width: ${VARIABLES.mobileWidthThreshold}) {
    overflow-y: hidden;
  }
`;
