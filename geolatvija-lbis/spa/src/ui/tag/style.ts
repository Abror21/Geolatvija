import styled from 'styled-components/macro';
import { Tag } from 'antd';

export const StyledTag = styled(Tag)`
  font-size: ${({ theme }) => theme.p2Size};
  font-weight: ${({ theme }) => theme.fontWeightBold};
  line-height: inherit;
  padding: 2px 8px;
  height: auto;
  border-radius: 4px;
  width: fit-content;
  white-space: normal;

  &.ant-tag-gray {
    color: ${({ theme }) => theme.textColor06};
    background-color: ${({ theme }) => theme.gray01} !important;
    border-color: ${({ theme }) => theme.disabledBorder};
  }

  &.ant-tag-green {
    color: ${({ theme }) => theme.tag01};
    background-color: ${({ theme }) => theme.tagBackground01};
    border-color: ${({ theme }) => theme.tagBorder01};
  }

  &.ant-tag-red {
    color: ${({ theme }) => theme.tag02};
    background-color: ${({ theme }) => theme.tagBackground02};
    border-color: ${({ theme }) => theme.tagBorder02};
  }

  &.ant-tag-orange {
    color: ${({ theme }) => theme.tag03};
    background-color: ${({ theme }) => theme.tagBackground03};
    border-color: ${({ theme }) => theme.tagBorder04};
  }
`;
