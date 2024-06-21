import styled from 'styled-components/macro';
import { Checkbox, List } from 'antd';

export const StyledEmbedCheckboxContainer = styled.div`
  padding: 12px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.grayLight};
`;

export const StyledUserEmbedListContainer = styled.div`
  background-color: ${({ theme }) => theme.gray01};
  border: 1px solid ${({ theme }) => theme.grayLight};
  border-radius: 6px;
  margin-bottom: 20px;
`;

export const StyledUserEmbedListWrapper = styled.div`
  overflow: hidden;

  .no-data-found-wrapper {
    padding: 12px 0;
    display: flex;
    justify-content: center;
    font-weight: bold;
  }
`;

export const StyledEmbedList = styled(List)`
  overflow-y: auto;
`;

export const StyledEmbedListItem = styled.div`
  background: transparent;
  padding: 18px 12px;
  width: 100%;
  display: flex;
  gap: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.grayLight};

  &:last-child {
    border: none;
  }

  .delete-checkbox-wrapper {
    height: 100%;
  }

  .image {
    width: 200px;
    height: 135px;
    border-radius: 8px;
    object-fit: cover;
  }

  .content-container {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 12px;
    .button-wrapper {
      display: flex;
      gap: 12px;
    }

    .content-wrapper {
      display: flex;
      gap: 12px;
      font-size: ${({ theme }) => theme.p2Size};
      .label-wrapper {
        display: flex;
        flex-direction: column;
        gap: 4px;
        .label {
          font-weight: bold;
          white-space: nowrap;
        }
      }

      .text-wrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 4px;
        .iframe-wrapper {
          display: flex;
          gap: 12px;
          padding-top: 4px;
          .iframe-textarea {
            border: solid ${({ theme }) => theme.black} 1px;
            height: 100px;
            width: 100%;
            border-radius: 8px;
            resize: none;
            font-size: ${({ theme }) => theme.p2Size};
          }
          .icon {
            cursor: pointer;
            &:hover {
              color: ${({ theme }) => theme.brand02};
            }
          }
        }
      }
    }
  }
`;

export const StyledEmbedListCheckbox = styled(Checkbox)`
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${({ theme }) => theme.brand02};
    border: none;
  }

  .ant-radio-inner::after {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: rotate(45deg) scale(1) translate(-50%, -50%);
  }

  .ant-checkbox-inner {
    width: ${({ theme }) => theme.h3Size} !important;
    height: ${({ theme }) => theme.h3Size} !important;
  }

  .ant-checkbox-inner::after {
    width: ${({ theme }) => theme.iconSize4} !important;
    height: ${({ theme }) => theme.iconSize4} !important;
  }

  &:hover {
    .ant-checkbox .ant-checkbox-inner {
      background-color: transparent;
      border-color: ${({ theme }) => theme.brand02};
    }
    .ant-checkbox::after {
      color: ${({ theme }) => theme.button01};
      border-color: ${({ theme }) => theme.button01};
    }
  }
`;
