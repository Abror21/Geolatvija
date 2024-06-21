import styled from 'styled-components/macro';
import { Divider } from 'antd';

export const StyledDivider = styled(Divider)`
  margin: 0;
  border-block-start: 1px solid ${({ theme }) => theme.border};
`;
