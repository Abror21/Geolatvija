import styled from 'styled-components/macro';

export const StyledProfile = styled.div`
  display: flex;
  gap: 12px;

  .profile-image {
    height: 40px;
    width: 40px;

    border-radius: 50%;
  }

  .name {
    color: ${({ theme }) => theme.textColor01};
    font-weight: ${({ theme }) => theme.fontWeightBolder};
    line-height: 20px;
  }

  .email {
    color: ${({ theme }) => theme.textColor02};
    line-height: 20px;
  }
`;
