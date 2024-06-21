import styled from 'styled-components';

export const StyledNotificationSide = styled.div`
  background-color: ${({ theme }) => theme.tagBackground04};
  border: 1px solid ${({ theme }) => theme.tagBorder04};
  padding: 0 16px;
  border-radius: 6px;
  margin-top: 20px;
  p {
    font-size: ${({ theme }) => theme.p2Size};
    font-weight: ${({ theme }) => theme.fontWeightRegular};
    line-height: ${({ theme }) => theme.lineHeight6};
    color: ${({ theme }) => theme.textColor09};

  }
`;
