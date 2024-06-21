import styled from 'styled-components/macro';

export const StyledTabMyProposals = styled.div`
  .pagination {
    margin: 15px 0;
    display: flex;
    justify-content: center;
  }
  .text-ellipse .ant-table .ant-table-tbody tr {
    cursor: pointer;
  }
  .proposals-table .ant-table-tbody tr td:nth-child(3) {
    max-width: 150px;
  }
  .badge_row {
    display: flex;
    align-items: center;
  }
  .table-badge {
    margin-right: 18px;
    .ant-badge-dot {
      height: 8px !important;
      width: 8px !important;
      position: absolute !important;
    }
  }
  .has_unseen_row {
    td {
      font-weight: ${({ theme }) => theme.fontWeightBolder} !important;
    }
  }
`;
