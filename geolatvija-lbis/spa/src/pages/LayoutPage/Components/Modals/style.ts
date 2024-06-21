import styled from 'styled-components/macro';

export const StyledGeoProductOrderConfirmationModalContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
`;

export const StyledCustomTextPart = styled.div`
  .label {
    color: ${({ theme }) => theme.brand02};
    cursor: pointer;
  }
`;

export const StyledFilesListWrapper = styled.div`
  max-height: 70px;
  overflow-y: auto;
`;
