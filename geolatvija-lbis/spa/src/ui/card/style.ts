import styled from 'styled-components/macro';
import { Card } from 'antd';

export const StyledCard = styled(Card)`
  background-color: ${({ theme }) => theme.gray01};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  &.full-height{
    height: 100%;
  }
`;
