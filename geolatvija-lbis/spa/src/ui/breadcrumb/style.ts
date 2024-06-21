import styled from 'styled-components/macro';
import { Breadcrumb } from 'antd';

export const StyledBreadcrumb = styled(Breadcrumb)`
    white-space: nowrap;

    &.ant-breadcrumb {
      margin: 0;
      font-weight: ${({ theme }) => theme.fontWeightBold};
      color: ${({ theme }) => theme.textColor01};
      display: inline-block;

      li {
        line-height: ${({ theme }) => theme.lineHeight6};

        &.ant-breadcrumb-separator {
          display: flex;
          justify-content: center;
          align-items: center;
          color: ${({ theme }) => theme.border2};
          margin-inline: 12px;

          i {
            font-size: ${({ theme }) => theme.p4Size};
            color: ${({ theme }) => theme.breadcumpColor};

          }
        }
        :last-child{
            color: ${({ theme }) => theme.gray06};
        }
      }
    }
  }

    .ant-breadcrumb-link {
      font-size: ${({ theme }) => theme.p2Size};
      font-weight: ${({ theme }) => theme.fontWeightBold};
      line-height: ${({ theme }) => theme.lineHeight6};
      color: ${({ theme }) => theme.textColor02};

      a {
        color: ${({ theme }) => theme.gray07};
        height: ${({ theme }) => theme.lineHeight6};
      }
      span{
        color: ${({ theme }) => theme.gray07};
        height: ${({ theme }) => theme.lineHeight6};
        cursor: pointer;
      }
`;
