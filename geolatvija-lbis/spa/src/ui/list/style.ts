import styled from 'styled-components/macro';
import { List } from 'antd';

export const StyledList = styled(List)`
  .rc-virtual-list-holder-inner {
    padding-right: 8px;
  }
`;

export const StyledListItem = styled.div`
  padding: 16px;
  margin-bottom: 10px;
  display: flex;
  overflow: hidden;
  color: ${({ theme }) => theme.textColor01};

  background: transparent;
  border: 1px solid ${({ theme }) => theme.border3};
  border-radius: 6px;

  .box {
    width: 100%;
    height: auto;

    div {
      height: auto;
    }
  }

  .title {
    margin-top: 0.7rem;
    margin-bottom: 0.4rem;
    line-height: ${({ theme }) => theme.lineHeight8};
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    font-size: ${({ theme }) => theme.p2Size};
  }

  &.selected {
    border-color: ${({ theme }) => theme.brand02};
    color: ${({ theme }) => theme.textColor04};
    background-color: ${({ theme }) => theme.brand02Light};
  }

  p {
    margin: 0;
    font-weight: ${({ theme }) => theme.fontWeightBold};
    font-size: ${({ theme }) => theme.p2Size};
    line-height: ${({ theme }) => theme.lineHeight4};

    &.list__subtitle {
      font-weight: ${({ theme }) => theme.fontWeightRegular};
      line-height: ${({ theme }) => theme.lineHeight8};
    }
  }
`;

export const StyledListTagWrapper = styled.span`
  float: right;
  display: flex;
  padding-left: 8px;
  width: fit-content;
  height: fit-content;
  shape-outside: inset(calc(100% - 100px) 0 0);
`;

export const PlannedDocumentWrapper = styled.div`
  padding: 15px;
  max-width: 300px;
  font-weight: bold;
  color: ${({ theme }) => theme.textColor01};
  font-size: ${({ theme }) => theme.p3Size};
`;
