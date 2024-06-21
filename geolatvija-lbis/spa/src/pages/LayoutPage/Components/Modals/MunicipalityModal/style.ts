import styled from 'styled-components/macro';

export const StyledProjectModal = styled.div`
  .modal {
    width: ${({ theme }) => theme.projectModalWith};
    position: absolute;
    left: 42%;
    top: 42%;
    background-color: ${({ theme }) => theme.gray01};
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    padding: 30px;
    border-radius: 5px;
    transform: scale(0);
    transition: all 0.2s ease-in-out;
    z-index: 1;
  }
  .modal.open {
    transform: scale(1);
  }
  .project-item__swiper {
    .swiper-slide {
      width: 276px;
      height: 276px;
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
  .project-item__content-wrapper {
    .title_project_modal {
      color: ${({ theme }) => theme.textColor09};
      font-size: ${({ theme }) => theme.p2Size};
    }

    button {
      width: 100%;
      margin-bottom: 10px;
    }
    a {
      color: ${({ theme }) => theme.brand02};
      font-size: ${({ theme }) => theme.p2Size};

      i {
        color: ${({ theme }) => theme.gray06};
      }
    }
  }
`;
