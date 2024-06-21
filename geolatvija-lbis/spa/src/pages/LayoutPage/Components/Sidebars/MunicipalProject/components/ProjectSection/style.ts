import styled from 'styled-components';

export const StyledProjectSection = styled.div`
  padding-bottom: 20px;
  .year_tabs {
    .ant-tabs-nav {
      padding-top: 5px !important;
      padding-bottom: 0 !important;
      &::before {
        border: none;
      }
    }
  }

  .block_title {
    margin-top: 10px;
    margin-bottom: 20px;
  }
  .municipal_project_list {
    margin-bottom: 20px;
    .first_block{
      margin-top: 15px;
    }
    .projects {
      display: flex;
      flex-direction: column;
      row-gap: 10px;
    }
  }
  .ant-pagination{
    display: flex;
    justify-content: center;
  }
`;
