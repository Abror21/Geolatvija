import styled from 'styled-components/macro';
export const StyledOrders = styled.div`
  .disable-row {
    background-color: ${({ theme }) => theme.gray03} !important;
  }

  .geoproducts-name {
    color: ${({ theme }) => theme.brand02};
    font-weight: ${({ theme }) => theme.fontWeightBold};
  }

  .geoproducts-disabled {
    color: ${({ theme }) => theme.grayInactive};
  }

  .geoproduct-name {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;
