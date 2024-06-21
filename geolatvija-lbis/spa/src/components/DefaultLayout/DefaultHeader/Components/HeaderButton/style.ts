import styled from 'styled-components/macro';

export const StyledButton = styled.button`
  padding: 0;
  cursor: pointer;
  border: 0 solid transparent;
  border-bottom-width: 3px;
  height: 100%;
  font-size: ${({ theme }) => theme.p2Size};
  font-weight: 500;
  line-height: ${({ theme }) => theme.lineHeight6};
  background-color: transparent;
  transition: 0.3s;
  font-family: 'Ubuntu';

  &:hover {
    span {
      color: ${({ theme }) => theme.switchColor01};
    }
  }
  &.active {
    span {
      color: ${({ theme }) => theme.switchColor01};
    }
    border-bottom-color: ${({ theme }) => theme.switchColor01};
  }

  span {
    color: ${({ theme }) => theme.gray07};
    padding: 0 24px;
    display: flex;
    align-items: center;
    width: 100%;
  }
`;
