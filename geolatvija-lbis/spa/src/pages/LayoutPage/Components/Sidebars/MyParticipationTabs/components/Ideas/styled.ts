import styled from 'styled-components';

export const StyledIdeas = styled.div`
  padding-bottom: 20px;
  .ant-select-lg .ant-select-selector .ant-select-selection-item {
    color: ${({ theme }) => theme.brand08};
  }
  .ideas_heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .search_title {
    margin-top: 10px;
    margin-bottom: 0.5rem;
  }
  .ideas_search {
    display: flex;
    align-items: center;
    gap: 10px;
    .ant-form-item {
      width: 100%;
    }
    .ant-input::placeholder {
      font-size: ${({ theme }) => theme.p1Size};
    }
  }
  .ideas_select {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .project_list {
    margin-bottom: 20px;
    .status {
      display: flex;
      align-items: center;
      color: ${({ theme }) => theme.brand07};
      font-size: ${({ theme }) => theme.p2Size};
      background-color: ${({ theme }) => theme.brand07Light};
      padding: 2px 10px;
      border-radius: 16px;
      max-height: 24px;
    }
    .project-item__swiper {
      height: 215px;
    }
  }
`;
