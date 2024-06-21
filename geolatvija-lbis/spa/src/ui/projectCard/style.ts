import styled from 'styled-components';
export const StyledProjectCard = styled.div`
  cursor: pointer;
  &.list-view {
    .ant-card-body {
      flex-direction: row;
      gap: 30px;
      img {
        width: 100px;
        height: auto;
        max-height: 75px;
        object-fit: cover;
      }
      .project-item__content-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        h4 {
          margin: 0;
          margin-bottom: 10px;
          -webkit-line-clamp: 1;
          &::first-letter {
            text-transform: uppercase;
          }
        }
      }
      .project-item__swiper-btns {
        display: flex;
        justify-content: unset;
        gap: 15px;
      }
    }
  }
  .project-item__desc-btn {
    color: ${({ theme }) => theme.button01};
    span {
      text-decoration: underline;
    }
  }
  &:hover {
    .project-item__swiper {
      .swiper-button-prev,
      .swiper-button-next {
        opacity: 1;
      }
    }
  }
  .project-item__swiper {
    height: 315px;
    .swiper-slide {
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .swiper-button-prev,
    .swiper-button-next {
      opacity: 0;
      transition: 0.4s ease;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.6);
      &::after {
        font-size: ${({ theme }) => theme.p3Size};
        color: ${({ theme }) => theme.white};
      }
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
  }
  .project-item__swiper-btns {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    @media screen and (max-width: 1570px) {
      width: 107%;
    }
    align-items: center;
  }
  .ant-card-body {
    height: 100%;
    display: flex;
    flex-direction: column;
    &::after {
      display: none;
    }
    .swiper.swiper-initialized {
      margin: unset;
    }
    &::before {
      display: none;
    }
  }

  .ant-typography {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: ${({ theme }) => theme.textColor09};
    text-overflow: ellipsis;
  }

  &:hover {
    .ant-card {
      border-color: ${({ theme }) => theme.brand02};
    }
  }

  .project-item__content-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .project_title {
      font-size: ${({ theme }) => theme.h3Size};
      margin-top: 20px;
      margin-bottom: 20px;
    }
  }
  .disabled-button {
    cursor: not-allowed;
  }
  .swiper-wrapper {
    overflow-y: hidden !important;
  }
  .bordered {
    .ant-card {
      border-color: ${({ theme }) => theme.brand02} !important;
    }
  }

 
`;
