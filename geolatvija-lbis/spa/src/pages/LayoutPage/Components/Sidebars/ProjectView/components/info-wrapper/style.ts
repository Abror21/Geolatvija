import styled from 'styled-components';
export const StyledInfoWrapper = styled.div`
  .not-supported_text {
    margin-top: 30px;
    border: 1px solid ${({ theme }) => theme.tagBorder04};
    border-radius: 6px;
    padding: 30px;
    background-color: ${({ theme }) => theme.tagBackground04};
  }
  .unsupported-status {
    padding: 10px 12px;
    border-radius: 16px;
    color: ${({ theme }) => theme.brand06};
    background-color: ${({ theme }) => theme.brand06Light};
  }
  .in-progress-status {
    margin-bottom: 30px;
    display: inline-block;
    padding: 10px 12px;
    border-radius: 16px;
    background: ${({ theme }) => theme.tagBackground05};
    color: ${({ theme }) => theme.brand05};
  }
  .submitted-status{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;
