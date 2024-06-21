import styled from "styled-components/macro";

export const StyledLink = styled.a`
  color: ${({ theme }) => theme.brand02};
  font-weight: ${({ theme }) => theme.fontWeightBold};
  font-size: ${({ theme }) => theme.p2Size};
  line-height: ${({ theme }) => theme.lineHeight4};

  &:hover {
    color: ${({ theme }) => theme.brand02};
  }
`
