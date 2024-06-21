import styled from 'styled-components/macro';
import { VARIABLES } from 'styles/globals';

export const StyledEmbedCreateButton = styled.div`
  bottom: ${VARIABLES.mapButtonMargin};
  right: ${VARIABLES.mapButtonMargin};

  .embed-create-button:hover {
    background-color: ${({ theme }) => theme.brand02} !important;
    color: ${({ theme }) => theme.textColor03} !important;
  }

  button {
    border-bottom-left-radius: ${VARIABLES.mapButtonBorderRadius} !important;
    border-bottom-right-radius: ${VARIABLES.mapButtonBorderRadius} !important;
    border-top: 0px !important;
  }
`;
