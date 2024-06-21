import styled from 'styled-components/macro';

export const StyledProjects = styled.div`
  padding-top: 20px;
  button {
    i {
      margin-right: 6px;
    }
  }
  .circile-info {
    i {
      margin-right: 0px;
    }
  }
  .projects__input-button-wrapper {
    display: flex;
    gap: 10px;
    align-items: end;
    margin-bottom: 20px;
    .projects__input {
      margin-bottom: 0;
      flex: 1;
    }
  }
  .projects__selects-wrapper {
    display: flex;
    flex-wrap: wrap;
    column-gap: 30px;
    row-gap: 10px;
    padding-bottom: 10px;
    & > * {
      min-width: 40%;
      flex: 1;
    }
  }
  .projects__clear-selects {
    display: flex;
    justify-content: end;
    padding-bottom: 15px;
  }
  .projects__content {
    padding: 20px 0;
    border-top: 1px solid ${({ theme }) => theme.border};
    .projects__content-header {
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        font-size: ${({ theme }) => theme.p2Size};
      }
      .projects__content-header-btns {
        display: flex;
        align-items: center;
        gap: 6px;
      }
    }
    .projects__content-body {
      display: grid;
      grid-template-columns: 50% 50%;
      gap: 30px;
      padding-right: 30px;
      margin-bottom: 30px;
    }
    .projects__content-body.list-view {
      padding-right: 0;
      display: flex;
      flex-direction: column;
      gap: 30px;
    }
  }
  .close-filter-button i {
    margin-right: unset;
  }
  .ant-tag.status {
    border: none;
    border-radius: 10px;
  }
  .ant-tag.status,
  .ant-tag.status span {
    font-weight: 700;
    font-size: ${({ theme }) => theme.p3Size};
    padding: 3px 6px;
  }
`;
