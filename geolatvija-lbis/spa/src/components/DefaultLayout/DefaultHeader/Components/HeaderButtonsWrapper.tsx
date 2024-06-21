import styled from 'styled-components/macro';

const HeaderButtonsWrapper = styled.div`
  height: 80px;
  button:not(:last-child) {
    span {
      border-right: 1px solid ${({ theme }) => theme.border};
    }
  }
  & > * {
    a {
      border-right: 1px solid;
      border-color: ${({ theme }) => theme.gray03};
    }
    &:last-child {
      a {
        border: none;
      }
    }
  }
`;

export default HeaderButtonsWrapper;
