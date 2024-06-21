import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button, Icon, Spinner, Upload } from 'ui';
import { Col, Form, UploadProps } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';

import { useIntl } from 'react-intl';
import { StyledUploadList } from './styles';
import FileDownload from 'js-file-download';
import { useSystemSettingState } from '../../contexts/SystemSettingContext';
import useQueryApiClient from '../../utils/useQueryApiClient';
import useForceUpdate from 'antd/es/_util/hooks/useForceUpdate';
import useTooltip from '../../utils/useTooltip';
import { Tooltip } from '../../constants/Tooltip';
import toastMessage from '../../utils/toastMessage';

interface DocumentUploadProps extends UploadProps {
  disabled?: boolean;
  maxCount?: number;
  setFilesToBeDeleted?: Dispatch<SetStateAction<string[]>>;
  fieldName?: (string | number)[] | string | number;
  label?: string;
  mandatory?: boolean;
  dontDeleteExisting?: boolean;
  fieldList?: string;
  tooltip?: React.ReactNode;
  removeAllAttachments?: boolean;
  reRenderAttachments?: number;
}

interface AttachmentsProps {
  id: number;
  displayName: string;
}

const DocumentFormItem = ({
  disabled,
  maxCount,
  setFilesToBeDeleted,
  fieldName,
  accept,
  label,
  mandatory,
  dontDeleteExisting,
  fieldList,
  onChange,
  tooltip,
  removeAllAttachments,
  reRenderAttachments,
}: DocumentUploadProps) => {
  const form = Form.useFormInstance();

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [activeName, setActiveName] = useState('');
  const [attachments, setAttachments] = useState(
    form.getFieldValue(Array.isArray(fieldName) ? ([fieldList, ...fieldName] as any) : (fieldName as any))
  );

  const settings = useSystemSettingState();
  const forceUpdate = useForceUpdate();
  const tooltipText = useTooltip(fieldName);

  const intl = useIntl();
  const config = {
    document_file_format: settings.fileFormat,
    document_upload_max_filesize: settings.fileSize,
  };

  const { appendData } = useQueryApiClient({
    request: {
      url: `api/v1/storage/:id`,
      method: 'GET',
      multipart: true,
      disableOnMount: true,
    },
    onSuccess: (response) => {
      FileDownload(response, activeName);
      setIsDownloadLoading(false);
    },
  });

  useEffect(() => {
    if (removeAllAttachments) {
      setAttachments(undefined);
      setFileList([]);

      if (!!attachments) {
        form.setFieldValue(
          'toBeDeleted',
          attachments?.map((attachment: any) => attachment?.id)
        );
      }

      form.setFieldValue(Array.isArray(fieldName) ? ([fieldList, ...fieldName] as any) : (fieldName as any), null);
    }
  }, [removeAllAttachments, attachments]);

  // Re-set attachments list
  useEffect(() => {
    if (!!reRenderAttachments) {
      setAttachments(
        form.getFieldValue(Array.isArray(fieldName) ? ([fieldList, ...fieldName] as any) : (fieldName as any))
      );
    }
  }, [reRenderAttachments]);

  const normFile = (e: UploadChangeParam) => {
    if (e.file?.status) {
      let copiedUploadedFiles = [...fileList];
      const toBeDeleted = copiedUploadedFiles.find((file: UploadFile) => file.uid === e.file.uid);
      const index = copiedUploadedFiles.indexOf(toBeDeleted!);
      copiedUploadedFiles.splice(index, 1);
      setFileList(copiedUploadedFiles);
      return copiedUploadedFiles;
    }

    const fileName = e.file.name.split('.');

    if (!config.document_file_format.includes(fileName[fileName.length - 1])) {
      toastMessage.error(
        intl.formatMessage(
          { id: 'error.file_format_unsupported' },
          {
            attribute: fileName[fileName.length - 1],
          }
        )
      );
      return fileList;
    }

    if (config.document_upload_max_filesize * 1024 * 1024 < (e?.file?.size || 0)) {
      toastMessage.error(
        intl.formatMessage(
          { id: 'error.file_size_unsupported' },
          {
            attribute: config.document_upload_max_filesize + ' MB',
          }
        )
      );

      return fileList;
    }

    if (attachments?.length && setFilesToBeDeleted && !dontDeleteExisting) {
      setFilesToBeDeleted((old) => [...old, attachments[0].id.toString()]);
    }

    setFileList(e.fileList);
    return e.fileList;
  };

  const onDeleteClick = (value: number) => {
    let copiedAttachments = [...attachments!];
    const toBeDeleted = copiedAttachments.find((entry) => entry.id === value);
    const index = copiedAttachments.indexOf(toBeDeleted!);
    copiedAttachments.splice(index, 1);

    form.setFieldValue(
      Array.isArray(fieldName) ? ([fieldList, ...fieldName] as any) : (fieldName as any),
      copiedAttachments
    );

    let toBeDeletedExisting = form.getFieldValue('toBeDeleted') || [];
    form.setFieldValue('toBeDeleted', [...toBeDeletedExisting, value.toString()]);
    setAttachments(copiedAttachments);

    forceUpdate();
  };

  const download = async (id: number, name: string) => {
    setIsDownloadLoading(true);
    setActiveName(name);
    appendData([], { id: id });
  };

  return (
    <>
      <Form.Item
        name={fieldName}
        label={label}
        getValueFromEvent={(e) => normFile(e)}
        tooltip={tooltip || tooltipText ? { ...Tooltip, title: tooltip ? tooltip : tooltipText } : undefined}
        rules={[
          {
            required: mandatory ? !attachments?.length || !!fileList?.length : false,
            message: intl.formatMessage(
              { id: 'validation.required' },
              {
                attribute: '',
              }
            ),
          },
        ]}
      >
        <Upload
          beforeUpload={() => false}
          multiple
          accept={accept}
          fileList={fileList}
          showUploadList={{
            removeIcon: <Icon icon="trash" />,
            showRemoveIcon: true,
          }}
          maxCount={maxCount}
          onChange={onChange}
        >
          <Button label={intl.formatMessage({ id: 'general.choose' })} disabled={disabled} />
        </Upload>
      </Form.Item>
      <Col>
        {!!attachments &&
          attachments.map((entry: AttachmentsProps) => {
            if (!entry?.id) {
              return <></>;
            }

            return (
              <StyledUploadList key={entry.id}>
                <Spinner spinning={isDownloadLoading}>
                  <div className="entry">
                    <span onClick={() => download(entry.id, entry.displayName)}>{entry.displayName}</span>
                    <Icon icon="download" onClick={() => download(entry.id, entry.displayName)} />
                    {!disabled && <Icon icon="trash" onClick={() => onDeleteClick(entry.id)} />}
                  </div>
                </Spinner>
              </StyledUploadList>
            );
          })}
      </Col>
    </>
  );
};

export default DocumentFormItem;
