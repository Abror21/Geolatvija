import styled from 'styled-components';

export const StyledSubmitedProjects = styled.div`
  .title {
    margin-bottom: 15px;
  }
  .status{
    font-size: ${({ theme }) => theme.p2Size};
  }
  .project_list {
    .project-item__swiper {
      height: 215px;
    }
    .project_button {
      display: flex;
      gap: 10px;
      align-items: center;
      .info {
        svg {
          color: ${({ theme }) => theme.brand02};
          font-size: ${({ theme }) => theme.p1Size};
        }
      }
    }
  }
  .pagination {
    margin: 15px 0;
  }
`;

export const StyledProjectPopOver = styled.div`
  padding: 8px 12px;
  font-size: ${({ theme }) => theme.p2Size};
  font-weight: 600;
`;
