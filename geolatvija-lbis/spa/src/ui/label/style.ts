import styled from 'styled-components/macro';

export const StyledLabel = styled.label`
  font-size: ${({ theme }) => theme.p2Size} !important;
  color: ${({ theme }) => theme.textColor01};
  display: flex;

  &.heading {
    font-size: ${({ theme }) => theme.h2Size} !important;
  }

  &.title {
    font-size: ${({ theme }) => theme.h3Size} !important;
  }

  &.sub-title {
    font-size: ${({ theme }) => theme.p1Size} !important;
  }

  &.extra-bold {
    font-weight: 600;
  }

  &.regular-bold {
    font-weight: 500;
  }

  &.regular {
    font-weight: 400;
  }

  &.center {
    justify-content: center;
    text-align: center;
  }

  &.end {
    justify-content: center;
    text-align: end;
  }

  &.theme-color {
    color: $theme-color;
  }

  .theme-color {
    color: $theme-color;
  }

  .red {
    color: #ff8383;
  }

  &.italic {
    font-style: italic;
  }

  &.white {
    color: ${({ theme }) => theme.textColor03};
  }

  &.primary {
    color: ${({ theme }) => theme.brand02} !important;
  }
  &.light {
    color: ${({ theme }) => theme.textColor02};
  }

  &.clickable {
    cursor: pointer;
  }
`;
