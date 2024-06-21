import styled from 'styled-components/macro';

export const StyledFilter = styled.div`
  .filter-fields {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px 30px;
  }

  .actions-list {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid ${({ theme }) => theme.border};
    padding-bottom: 30px;

    .left-side {
      display: flex;
      gap: 10px;
    }

    .right-side {
      display: flex;
      gap: 10px;
    }
  }

  .actions-list-table {
    display: flex;
    justify-content: space-between;

    .left-side {
      display: flex;
      gap: 10px;
    }

    .right-side {
      display: flex;
      gap: 10px;
    }
  }
`;
