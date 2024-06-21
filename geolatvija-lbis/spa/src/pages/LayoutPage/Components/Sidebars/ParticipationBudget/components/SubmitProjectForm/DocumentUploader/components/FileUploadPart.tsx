import React from 'react';
import { useIntl } from 'react-intl';
import { Upload } from 'ui';

const FileUploadPart = ({ title, onChange }: { title: string; onChange: any }) => {
  const intl = useIntl();
  return (
    <div className="upload">
      <span>{title}</span>
      <div className="upload_btn">
        <Upload onChange={(info) => onChange(info)} showUploadList={false} fileList={[]} geoClassifer={true}>
          <span>{intl.formatMessage({ id: 'general.upload' })}</span>
        </Upload>
      </div>
    </div>
  );
};

export default FileUploadPart;
