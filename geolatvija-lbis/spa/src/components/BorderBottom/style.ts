import styled from 'styled-components/macro';

export const StyledFormBottomBorder = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding-bottom: 26px;
  margin-bottom: 26px;

  &.modal {
    margin-bottom: 16px;
    padding-bottom: 16px;
  }

  &.dropdown {
    display: flex;
    padding-bottom: 0;
    margin: 5px 0;
  }
`;
