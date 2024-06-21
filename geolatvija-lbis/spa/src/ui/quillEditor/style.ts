import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components/macro';

export const StyledQuillEditor = styled.div<{ showValidationBorder?: boolean }>`
  margin: 4px 0;

  .ql-editor {
    min-height: 100px;
    padding: 12px 14px;
    font-size: ${({ theme }) => theme.p1Size};
    box-shadow: ${({ theme }) => theme.formItemsBoxShadowDefault};
    //border-color: ${(props) => (props.showValidationBorder ? '#ff4d4f' : '#D0D5DD')} !important;
  }

  .ql-picker.ql-placeholder {
    width: 120%;
  }

  .ql-picker.ql-placeholder > span.ql-picker-label::before {
    content: 'Placeholders';
  }

  .ql-picker.ql-placeholder
  > span.ql-picker-options
  > span.ql-picker-item::before {
    content: attr(data-label);
  }

  .ql-disabled {
    background-color: ${({ theme }) => theme.disabledBackground};
    border-color: ${({ theme }) => theme.disabledBorder} !important;
  }

  .ql-container:hover .ql-editor {
    border: 1px solid ${({ theme, showValidationBorder }) =>
      showValidationBorder ? '#ff4d4f' : theme.brand02} !important;
  }

  .ql-container .ql-editor {
    border: 1px solid ${({ theme }) => theme.border2};
    border-radius: 4px;
    transition: all 0.2s linear;
  }

  .ant-form-item-has-error {
    .ql-editor {
      border: 1px solid #ff4d4f} !important;
  }
}

.ql-container .ql-editor:focus {
    border: 1px solid ${({ theme }) => theme.brand02} !important;
    box-shadow: ${({ theme }) => theme.formItemsBoxShadow};
  }

  .ql-container .ql-editor:focus {
    border: 1px solid ${({ theme, showValidationBorder }) =>
      showValidationBorder ? '#ff4d4f' : theme.brand02} !important;
    box-shadow: ${({ theme }) => theme.formItemsBoxShadow};
  }

  .ql-disabled > * {
    cursor: not-allowed;
    user-select: none;
  }
  .ql-disabled .ql-editor > * {
    cursor: not-allowed;
    user-select: none;
  }

  .ql-disabled .ql-editor {
    color: ${({ theme }) => theme.disabledText};
  }

  .ql-toolbar {
    border: 1px solid ${({ theme }) => theme.border2};
    border-radius: 2px 2px 0 0;
    background-color: ${({ theme }) => theme.gray01};
  }

  .ql-container {
    background-color: ${({ theme }) => theme.gray01};
    border: none;
  }

  .ql-toolbar.ql-snow {
    padding: 14px;
    border-radius: 4px;
    margin-bottom: 10px;
  }

  .ql-toolbar .ql-formats {
    display: flex;
    align-items: center;
    gap: 10px;

    button {
      height: ${({ theme }) => theme.iconSize1};
      width: ${({ theme }) => theme.iconSize1};
    }
  }

  .ql-toolbar button:hover svg path {
    stroke: ${({ theme }) => theme.brand02} !important;
  }

  .ql-toolbar .ql-strike:hover svg path {
    fill: ${({ theme }) => theme.brand02} !important;
  }

  .ql-toolbar button:hover svg rect {
    fill: ${({ theme }) => theme.brand02} !important;
  }

  .ql-toolbar button:hover svg line {
    stroke: ${({ theme }) => theme.brand02} !important;
  }

  .ant-picker-suffix {
    color: ${({ theme }) => theme.gray08};
  }

  &.LV .ql-snow {
    .ql-tooltip::before {
      content: "Atvērt saiti:"
    }

    .ql-tooltip[data-mode=link]::before {
      content: 'Saite:';
    }

    .ql-tooltip.ql-editing a.ql-action::after {
      content: 'Saglabāt';
    }

    .ql-tooltip a.ql-action::after {
      content: 'Rediģēt';
    }

    .ql-tooltip a.ql-remove::before {
      content: 'Dzēst';
    }

    .ql-picker.ql-placeholder > span.ql-picker-label::before {
      content: 'Mainīgie';
    }
  }

  &.RU .ql-snow {
    .ql-tooltip::before {
      content: "Открыть ссылку:"
    }

    .ql-tooltip[data-mode=link]::before {
      content: 'Ссылка:';
    }

    .ql-tooltip.ql-editing a.ql-action::after {
      content: 'Сохранить';
    }

    .ql-tooltip a.ql-action::after {
      content: 'Изменять';
    }

    .ql-tooltip a.ql-remove::before {
      content: 'Удалить';
    }
  }
}
`;

export const QuillFooter = styled.span`
  font-size: ${({ theme }) => theme.p2Size};
  line-height: ${({ theme }) => theme.lineHeight6};
  color: ${({ theme }) => theme.textColor02};
  display: flex;
  justify-content: space-between;

  .remaining-length-wrapper {
    margin-left: auto;
  }

  .required {
    color: #ff4d4f;
  }
`;
