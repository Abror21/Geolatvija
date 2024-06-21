import 'react-quill/dist/quill.snow.css';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import ReactQuill, { Quill, UnprivilegedEditor } from 'react-quill';
import { QuillFooter, StyledQuillEditor } from './style';
import { CustomToolbar } from './CustomToolbar';
import { Form } from 'antd';
import { useIntl } from 'react-intl';
import { Validations } from '../../interfaces/shared';
import useFormValidation from '../../utils/useFormValidation';
import { Rule } from 'rc-field-form/lib/interface';
import { DeltaStatic, Sources } from 'quill';

interface OnChangeHandler {
  (value: string, delta: DeltaStatic, source: Sources, editor: UnprivilegedEditor): void;
}

export interface QuillEditorProps extends Validations {
  onChange?: OnChangeHandler;
  readOnly?: boolean;
  defaultValue?: string;
  value?: string;
  enableImages?: boolean;
  enableLinks?: boolean;
  enableSubscript?: boolean;
  enableStrikethrough?: boolean;
  enableTextAlign?: boolean;
  enableTextColor?: boolean;
  enableBulletList?: boolean;
  enableHeadingSize?: boolean;
  enableNumberList?: boolean;
  formSet?: boolean;
  label?: string | ReactNode;
  rules?: Rule[];
  name?: (string | number)[] | string | number;
  noStyle?: boolean;
  maxLength?: number;
  toolbarKey?: string;
}

export const QuillEditor = ({
  readOnly,
  defaultValue,
  onChange,
  value,
  enableImages,
  enableLinks,
  enableSubscript,
  enableStrikethrough,
  enableTextAlign,
  enableTextColor,
  enableBulletList,
  enableHeadingSize,
  enableNumberList,
  formSet,
  label,
  rules,
  name,
  noStyle,
  maxLength,
  validations,
  toolbarKey,
}: QuillEditorProps) => {
  const [isConstructed, setIsConstructed] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [copiedValue, setCopiedValue] = useState('');
  const quillRef = useRef<any>(null);
  const intl = useIntl();
  const { formValidations } = useFormValidation();

  // This ensures char count gets set after render has completed and quillRef is set.
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (quillRef.current) {
        setCharCount(quillRef.current.getEditor().getLength() - 1);
        clearInterval(intervalId);
      }
    }, 0);
    return () => clearInterval(intervalId);
  }, [quillRef.current]);

  useEffect(() => {
    Quill.register(Quill.import('attributors/attribute/direction'), true);
    Quill.register(Quill.import('attributors/class/align'), true);
    Quill.register(Quill.import('attributors/class/background'), true);
    Quill.register(Quill.import('attributors/class/color'), true);
    Quill.register(Quill.import('attributors/class/direction'), true);
    Quill.register(Quill.import('attributors/class/font'), true);
    Quill.register(Quill.import('attributors/class/size'), true);
    Quill.register(Quill.import('attributors/style/align'), true);
    Quill.register(Quill.import('attributors/style/background'), true);
    Quill.register(Quill.import('attributors/style/color'), true);
    Quill.register(Quill.import('attributors/style/direction'), true);
    Quill.register(Quill.import('attributors/style/font'), true);
    Quill.debug('error');
    setIsConstructed(true);
    if (formSet) {
      setCharCount(quillRef.current.getEditor().getLength() - 1);
    }
  }, [formSet]);

  const onTextChange = (maxLength: number) => {
    const quill = quillRef?.current?.getEditor();
    if (quill) {
      const count = quill?.getLength() - 1;
      if (maxLength && count > maxLength) {
        quill?.deleteText(maxLength, count);
        setCharCount(maxLength);
      } else {
        setCharCount(count);
      }
    }
  };

  const onInnerChange = (value: string, delta: DeltaStatic, source: Sources, editor: UnprivilegedEditor) => {
    setCopiedValue(value);

    if (maxLength) {
      onTextChange(maxLength);
    }

    onChange && onChange(value, delta, source, editor);
  };

  let modules = {
    toolbar: '#toolbar_' + toolbarKey,
  };

  if (!isConstructed) {
    return null;
  }

  const onBlur = () => {
    if (maxLength) {
      onTextChange(maxLength);
    }
  };

  return (
    <Form.Item label={label} noStyle={noStyle}>
      <StyledQuillEditor>
        <CustomToolbar
          enableImages={enableImages}
          enableStrikethrough={enableStrikethrough}
          enableLinks={enableLinks}
          enableSubscript={enableSubscript}
          enableTextAlign={enableTextAlign}
          enableTextColor={enableTextColor}
          enableBulletList={enableBulletList}
          enableHeadingSize={enableHeadingSize}
          enableNumberList={enableNumberList}
          toolbarKey={toolbarKey}
        />
        <Form.Item name={name} rules={validations ? formValidations(validations) : rules}>
          <ReactQuill
            ref={quillRef}
            modules={modules}
            readOnly={readOnly}
            defaultValue={defaultValue}
            onChange={onInnerChange}
            value={value || ''}
            onBlur={onBlur}
          />
        </Form.Item>
      </StyledQuillEditor>
      <QuillFooter>
        {maxLength && (
          <div className="remaining-length-wrapper">
            {`${intl.formatMessage({ id: 'ui_menu.remaining_characters' })} ${maxLength - charCount}`}
          </div>
        )}
      </QuillFooter>
    </Form.Item>
  );
};
