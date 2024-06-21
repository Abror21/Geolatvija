import React from 'react';
import { UploadProps } from 'antd';
import { StyledUpload } from './style';
import { Form, message } from 'antd'; // Import message for displaying error messages
import { useIntl } from 'react-intl';
import { useSystemSettingState } from '../../contexts/SystemSettingContext';
export interface ExtraUploadProps extends UploadProps {
  children: React.ReactNode;
  geoClassifer?: boolean;
}

export const Upload = ({
  beforeUpload,
  multiple,
  accept,
  fileList,
  children,
  onChange,
  onDownload,
  onPreview,
  onRemove,
  customRequest,
  showUploadList,
  maxCount,
  name,
  disabled,
  geoClassifer = false,
}: ExtraUploadProps) => {
  const intl = useIntl();
  const { fileFormat } = useSystemSettingState();

  const validateFileTypeWithGeoClassifer = (file: File): boolean => {
    const fileType = file.name.split('.').pop()?.toLowerCase();
    const isValidFileType = !!fileType && fileFormat.includes(fileType);
    if (!isValidFileType) {
      message.error(
        intl.formatMessage({ id: 'validation.invalid_file_type_geo_classifer' }, { fileTypes: fileFormat.join(', ') })
      );
    }
    return isValidFileType;
  };


  const handleUpload = (info: any) => {
    if (geoClassifer) {
      const file = info.file.originFileObj;
      if (!validateFileTypeWithGeoClassifer(file)) {
        return false;
      }
    }
    if (onChange) {
      onChange(info);
    }
    return true;
  };

  return (
    <Form.Item name={name}>
      <StyledUpload
        beforeUpload={beforeUpload}
        multiple={multiple}
        accept={accept}
        fileList={fileList}
        onChange={handleUpload} // Pass the custom upload handler
        onDownload={onDownload}
        onPreview={onPreview}
        onRemove={onRemove}
        customRequest={customRequest}
        showUploadList={showUploadList}
        maxCount={maxCount}
        disabled={disabled}
      >
        {children}
      </StyledUpload>
    </Form.Item>
  );
};
