import styled from 'styled-components';

export const StyledImageUploader = styled.div`
  margin: 20px 0;
  .ant-upload-hint,
  .ant-upload-text {
    color: ${({ theme }) => theme.textColor11} !important;
    font-size: ${({ theme }) => theme.p2Size} !important;
  }
  .ant-upload-text {
    span {
      font-weight: 600;
      color: ${({ theme }) => theme.brand02} !important;
    }
  }

  .ant-upload-wrapper .ant-upload-drag {
    background-color: ${({ theme }) => theme.gray01};
    border-style: solid;
    border-color: ${({ theme }) => theme.border3};
    &:hover {
      border-color: ${({ theme }) => theme.brand02};
    }
  }
  .image_list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    row-gap: 15px;
    margin-top: 30px;
    .image_item {
      position: relative;
      .image_item.grabbing {
        cursor: grabbing;
      }
      img {
        width: 100%;
        max-height: 174px;
        object-fit: cover;
      }
      .index {
        position: absolute;
        width: 100%;
        height: 97%;
        color: ${({ theme }) => theme.gray14};
        display: flex;
        align-items: center;
        justify-content: center;
        top: 0;
        left: 0;
        font-size: 4rem;
        background-color: #00000012;
      }
      .delete_icon {
        position: absolute;
        right: -15px;
        top: -15px;
        border-radius: 100px;
        background-color: ${({ theme }) => theme.blackBg};
        cursor: pointer;
        i {
          color: ${({ theme }) => theme.gray01};
          padding: 10px 12px;
        }
      }
    }
  }
`;
