import styled from 'styled-components';

export const StyledMyVotesProjects = styled.div`
  .title {
    margin-bottom: 15px;
  }
  .project_list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    row-gap: 15px;
    column-gap: 30px;
    margin-top: 15px;
    @media screen and (max-width: 1950px) {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }
    @media screen and (max-width: 1450px) {
      grid-template-columns: repeat(auto-fill, minmax(255px, 1fr));
    }
    .project-item__swiper {
      height: 215px;
    }
  }
  .pagination {
    margin: 15px 0;
  }
`;
