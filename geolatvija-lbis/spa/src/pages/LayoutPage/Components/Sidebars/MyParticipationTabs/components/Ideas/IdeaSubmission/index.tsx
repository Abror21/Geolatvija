import React, { useState } from 'react';
import { Button, ImageUploader, Input, TextArea, Upload, FileUploadCards } from 'ui';
import { StyledIdeaSubmission } from './style';
import { useIntl } from 'react-intl';
import { Form, message } from 'antd';
import { UploadFile } from 'antd/lib';
import { UploadChangeParam } from 'antd/es/upload';
import { getBase64 } from 'utils/globalFunctions';
import { useNavigate } from 'react-router-dom';
export const IdeaSubmisson = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [imageList, setImageList] = useState<any[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);

  const handleDocumentUpload = async (info: UploadChangeParam<UploadFile<any>>) => {
    const isFileAvailable = fileList.find((file: any) => file.name === info.file.name);
    if (isFileAvailable) {
      message.warning(intl.formatMessage({ id: 'submit_project.such_file_uploaded' }));
      return;
    }
    const id = Date.now();
    const res = await getBase64(info.file.originFileObj as any);
    setFileList([...fileList, { data: res, filename: info.file?.name, id }]);
  };

  const handleRemove = (removingFile: any) => {
    setFileList([...fileList.filter((file: any) => file.id != removingFile.id)]);
  };

  const handleOnFinish = () => {
    navigate('/main?my-participation=open&tab=ideas_tab');
  };

  const handleCancel = () => {
    navigate('/main?my-participation=open&tab=ideas_tab');
  };

  return (
    <StyledIdeaSubmission>
      <Form layout="vertical" onFinish={handleOnFinish}>
        <Input
          size="middle"
          name="name"
          label={intl.formatMessage({ id: 'my_participation.idea_name' })}
          validations="required"
          className="idea_field"
        />
        <div className=" idea_field submition_textarea">
          <TextArea
            rules={[
              { required: true, message: intl.formatMessage({ id: 'validation.field_required' }) },
              { max: 1000, message: intl.formatMessage({ id: 'general.max_number_symbols' }, { limit: 1000 }) },
            ]}
            rows={4}
            name="concept_description"
            maxLength={1000}
            label={intl.formatMessage({ id: 'participation_budget.desc_idea' })}
          />
          <span className="max-length">
            {intl.formatMessage({ id: 'general.max_number_symbols' }, { limit: 1000 })}
          </span>
        </div>
        <div className="document-upload">
          <div className="title">
            <p>{intl.formatMessage({ id: 'my_participation.materials' })}</p>
            <div className="upload_btn">
              <Upload
                onChange={(info) => handleDocumentUpload(info)}
                showUploadList={false}
                fileList={[]}
                geoClassifer={true}
              >
                <span>{intl.formatMessage({ id: 'general.upload' })}</span>
              </Upload>
            </div>
          </div>
          <FileUploadCards handleRemove={handleRemove} fileList={fileList} />
        </div>
        <ImageUploader imageList={imageList} setImageList={setImageList} />

        <div className="submit_project_btn">
          <Button onClick={handleCancel} label={intl.formatMessage({ id: 'general.cancel' })} />
          <Button type="primary" htmlType="submit" label={intl.formatMessage({ id: 'my_participation.submit_idea' })} />
        </div>
      </Form>
    </StyledIdeaSubmission>
  );
};
