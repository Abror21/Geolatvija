import styled from 'styled-components/macro';

export const StyledPreviewWrapper = styled.div`
  .preview__description {
    display: flex;
    flex-direction: column;

    & > * {
      margin: 0;
    }
  }
`;

export const StyledPreviewDivider = styled.div`
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.border};
  margin: 25px 0;
`;

export const StyledImage = styled.img`
  object-fit: contain;
  width: 330px;
`;
