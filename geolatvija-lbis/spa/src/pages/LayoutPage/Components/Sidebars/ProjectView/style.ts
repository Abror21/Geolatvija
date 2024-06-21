import styled from 'styled-components';
export const StyledProjectView = styled.div`
  .section_title {
    margin: 20px 0;
  }
  a {
    color: ${({ theme }) => theme.brand02};
    text-decoration: underline;
  }
  .title_info {
    display: flex;
    align-items: center;
    gap: 18px;
    border-bottom: 1px solid ${({ theme }) => theme.border};
    padding-bottom: 30px;
    .info_item {
      cursor: pointer;
      font-weight: ${({ theme }) => theme.fontWeightBold};
      font-size: ${({ theme }) => theme.p2Size};
      padding: 5px 10px;
      border-radius: 16px;
      &.green {
        color: ${({ theme }) => theme.switchColor04};
        background-color: ${({ theme }) => theme.brand02Light};
      }
      &.gray {
        color: ${({ theme }) => theme.brand07};
        background-color: ${({ theme }) => theme.brand07Light};
      }
    }
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
  .pictures {
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
  .description {
    p {
      font-weight: ${({ theme }) => theme.fontWeightRegular};
      line-height: 24px;
      font-size: ${({ theme }) => theme.p2Size};
    }

    .price_side {
      display: flex;
      border-top: 1px solid ${({ theme }) => theme.border};
      border-bottom: 1px solid ${({ theme }) => theme.border};
      padding: 20px 0;
      margin: 20px 0;
      gap: 10px;
      label {
        margin-bottom: 5px;
      }
      .price {
        color: ${({ theme }) => theme.brand02};
      }
    }
  }
  .files {
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

  .information {
    padding: 20px 0;
    border-top: 1px solid ${({ theme }) => theme.border};
    border-bottom: 1px solid ${({ theme }) => theme.border};
    margin-top: 20px;
    margin-bottom: 10px;
    .section_title {
      margin-top: 0;
    }

    .text_side {
      display: flex;
      justify-content: space-between;
      align-items: center;
      p {
        margin: 5px 0;
        font-weight: ${({ theme }) => theme.fontWeightRegular};
        font-size: ${({ theme }) => theme.p2Size};
        span {
          font-weight: ${({ theme }) => theme.fontWeightBolder};
        }
      }
    }

    .unsupported {
      .first_block {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 30px;
        .status {
          color: ${({ theme }) => theme.brand06};
          background-color: ${({ theme }) => theme.brand06Light};
          padding: 5px 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
        }
      }
      .second_block {
        background-color: ${({ theme }) => theme.tagBackground04};
        border: 1px solid ${({ theme }) => theme.tagBorder04};
        padding: 0 16px;
        border-radius: 6px;
        p {
          font-size: ${({ theme }) => theme.p2Size};
          font-weight: ${({ theme }) => theme.fontWeightRegular};
          line-height: ${({ theme }) => theme.lineHeight6};
        }
      }
    }
    .in_progress {
      .status {
        padding: 5px 12px;
        display: inline-block;
        border-radius: 16px;
        color: ${({ theme }) => theme.brand05};
        background-color: ${({ theme }) => theme.brand05Light};
        margin-bottom: 15px;
      }
      p {
        font-size: ${({ theme }) => theme.p1Size};
        font-weight: ${({ theme }) => theme.fontWeightRegular};
        line-height: ${({ theme }) => theme.lineHeight6};
        color: ${({ theme }) => theme.gray06};
      }
      .ant-steps {
        .ant-steps-item-container {
          padding-bottom: 15px;
          .ant-steps-item-tail {
            top: 30px;
            left: 12px;
            height: 83%;
            width: 2px;
          }
        }
        .ant-steps-item-process,
        .ant-steps-item-wait {
          .ant-steps-item-icon {
            width: 30px;
            height: 30px;
            border: 1px solid ${({ theme }) => theme.border3};
            padding: 10px;
            .ant-steps-icon .ant-steps-icon-dot {
              background-color: ${({ theme }) => theme.brand07};
            }
          }
          .ant-steps-item-content {
            padding-top: 12px;
            .ant-steps-item-title {
              font-size: ${({ theme }) => theme.p2Size};
              font-weight: ${({ theme }) => theme.fontWeightRegular};
              line-height: ${({ theme }) => theme.lineHeight6};
              color: ${({ theme }) => theme.gray06};
            }
            .ant-steps-item-description {
              font-weight: ${({ theme }) => theme.fontWeightBold};
              color: ${({ theme }) => theme.gray07};
              font-size: ${({ theme }) => theme.p1Size};
            }
          }
        }
      }
    }
    .btn_disabled {
      cursor: no-drop;
    }
  }
  .project_view_footer {
    display: flex;

    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    i {
      color: ${({ theme }) => theme.iconColor07};
      font-size: ${({ theme }) => theme.h4Size};
      font-weight: ${({ theme }) => theme.fontWeightRegular};
    }
    p {
      font-size: ${({ theme }) => theme.p1Size};
      font-weight: ${({ theme }) => theme.fontWeightRegular};
      line-height: ${({ theme }) => theme.lineHeight6};
      color: ${({ theme }) => theme.gray06};
    }
  }
`;
