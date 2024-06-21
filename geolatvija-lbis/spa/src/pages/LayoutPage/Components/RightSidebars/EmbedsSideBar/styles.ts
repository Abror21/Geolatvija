import styled from 'styled-components/macro';
import { Label } from '../../../../../ui';

export const StyledEmbedMarkersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 150px;
  overflow-y: auto;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.border2};
  border-radius: 4px;

  .item-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;

    .ant-form-item {
      margin-bottom: 0;
    }

    .trash-icon {
      cursor: pointer;

      &:hover {
        color: ${({ theme }) => theme.brand02};
      }
    }
  }
`;

export const AddMarkerButtonWrapper = styled.div`
  .button {
    margin-bottom: 0;
  }
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  .icon {
    cursor: pointer;
  }

  .required-symbol {
    color: red;
  }
`;

export const LayersNotIncludedLabel = styled(Label)`
  display: flex;
  justify-content: center;
  font-size: 0.8rem !important;
  color: ${({ theme }) => theme.rowRed};
`;

export const TextAreaWrapper = styled.div<{ disableCopyIcon?: boolean }>`
  display: flex;
  gap: 8px;

  .text-area {
    width: 100%;
  }

  .copy-icon {
    cursor: ${({ disableCopyIcon }) => (disableCopyIcon ? 'not-allowed' : 'pointer')};
    color: ${({ disableCopyIcon }) => (disableCopyIcon ? ({ theme }) => theme.gray06 : ({ theme }) => theme.black)};
  }
`;
