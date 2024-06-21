import styled from 'styled-components';
export const StyledIdeaView = styled.div`
  .section_title {
    margin: 20px 0;
  }
  a {
    color: ${({ theme }) => theme.brand02};
    text-decoration: underline;
  }
  &:hover {
    .pictures {
      .project-view_swipper {
        .swiper-button-prev,
        .swiper-button-next {
          opacity: 1;
        }
      }
    }
  }
  .idea-pictures {
    .project-view_swipper {
      height: 420px;
      margin-top: 20px;
      .swiper-slide {
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .swiper-button-prev,
      .swiper-button-next {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.6);
        &::after {
          font-size: ${({ theme }) => theme.p3Size};
          color: ${({ theme }) => theme.white};
        }
        opacity: 0;
        transition: 0.5s ease;
      }
      .swiper-pagination {
        .swiper-pagination-bullet {
          background-color: ${({ theme }) => theme.gray01};
          opacity: 0.5;
        }
        .swiper-pagination-bullet-active {
          background-color: ${({ theme }) => theme.gray01};
          opacity: 1;
        }
      }
      &:hover {
        .swiper-button-prev,
        .swiper-button-next {
          opacity: 1;
        }
      }
    }
  }
  .idea-description {
    p {
      font-weight: ${({ theme }) => theme.fontWeightRegular};
      line-height: 24px;
      font-size: ${({ theme }) => theme.p2Size};
    }
  }
  .idea-files {
    .data_list {
      display: flex;
      flex-direction: column;
      row-gap: 15px;
      margin: 10px 0;
      .file {
        &_name {
          color: ${({ theme }) => theme.brand02};
          text-decoration: underline;
          cursor: pointer;
        }
        label {
          margin-bottom: 5px;
        }
      }
    }
  }
  .idea-status {
    .status{
      font-size: ${({ theme }) => theme.p2Size};
      background-color: ${({ theme }) => theme.statusGrayLight};
      padding: 5px 8px;
      border-radius: 16px;
      display: inline-block;
      margin-bottom: 20px;
    }
  }
`;
