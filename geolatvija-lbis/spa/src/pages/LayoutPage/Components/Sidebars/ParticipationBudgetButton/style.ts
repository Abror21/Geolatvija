import styled from 'styled-components/macro';

export const StyledButton = styled.button`
  cursor: pointer;
  border: none;
  background-color: transparent;
  padding: 20px 0;
  font-size: ${({ theme }) => theme.p2Size};
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.border};
  }
  color: ${({ theme }) => theme.textColor01};
  i {
    display: block;
    margin-bottom: 10px;
  }
  img {
    width: 27px;
    height: 27px;
    margin-bottom: 5px;
  }
  &.disabled {
    opacity: 0.5;
  }
`;
