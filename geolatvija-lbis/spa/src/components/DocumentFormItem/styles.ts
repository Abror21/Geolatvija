import styled from 'styled-components/macro';

export const StyledUploadList = styled.div`
  display: flex;
  flex-shrink: 1;

  .entry {
    cursor: pointer;
    span {
      color: ${({ theme }) => theme.textColor08};
      text-decoration: underline;
    }

    i {
      margin-left: 8px;
    }
  }
`;
