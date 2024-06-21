import React, { useEffect, useState } from 'react';
import { Collapse, Input, Button, TimePicker, Switch } from 'ui';
import { FormattedMessage, useIntl } from 'react-intl';
import { Col, Collapse as AntdCollapse, Row, Space } from 'antd';
import DocumentFormItem from 'components/DocumentFormItem';
import { ClassifierSelect } from 'components/Selects';
import useQueryApiClient from 'utils/useQueryApiClient';
import { FormInstance } from 'antd/es/form/hooks/useForm';
import FtpFilesModal from '../modals/FtpFilesModal';
import ProcessingSelect from '../../../../components/Selects/ProcessingSelect';
import { StyledFTPSyncInputWrapper } from './styles';
import { ClassifierKL15Input } from './ClassifierKL15Input';
import toastMessage from '../../../../utils/toastMessage';

interface AddFilesProps {
  form: FormInstance;
  dynamicRow: number;
  fileMethodType?: string;
  panelKey: string;
  isPublic: boolean;
  removedPanel: number;
}

interface BasicCell {
  id: string;
}

const AddFilesBlock = ({ form, dynamicRow, fileMethodType, panelKey, isPublic, removedPanel }: AddFilesProps) => {
  const [ftpLoading, setFtpLoading] = useState(false);
  const [openFilesModal, setOpenFilesModal] = useState(false);
  const [files, setFiles] = useState<Object[]>([]);
  const [dynamicRowId, setDynamicRowId] = useState(0);
  const [syncNeeded, setSyncNeeded] = useState(form.getFieldValue([panelKey, dynamicRow, 'updateIsNeeded']));

  const intl = useIntl();
  const { Panel } = AntdCollapse;

  useEffect(() => {
    const values = form.getFieldsValue();
    setDynamicRowId(values.filesData[dynamicRow].id);
  }, [dynamicRow]);

  const { data } = useQueryApiClient({
    request: {
      url: `api/v1/classifiers/select/KL10`,
    },
  });

  const { appendData: FtpLoad } = useQueryApiClient({
    request: {
      url: '/api/v1/ftp/load',
      method: 'POST',
    },
    onFinally() {
      setFtpLoading(false);
      toastMessage.success(intl.formatMessage({ id: 'geoproducts.ftp_success' }));
    },
  });

  const handleFtpLoad = () => {
    const values = form.getFieldsValue();
    setFtpLoading(true);
    FtpLoad({
      ftpAddress: values.filesData[dynamicRow].ftpAddress,
      ftpUsername: values.filesData[dynamicRow].ftpUsername,
      ftpPassword: values.filesData[dynamicRow].ftpPassword,
      processingTypeClassifierValueId: values.filesData[dynamicRow].processingTypeClassifierValueId,
    });
  };

  return (
    <>
      {data.find((entry: BasicCell) => entry.id === fileMethodType)?.code === 'ADD' && (
        <Collapse>
          <Panel
            forceRender
            key={'add-file'}
            header={<label className="fake-required">{intl.formatMessage({ id: 'geoproducts.add_file' })}</label>}
          >
            <DocumentFormItem
              fieldName={[dynamicRow, 'file']}
              label={intl.formatMessage({ id: 'geoproducts.add_file_1' })}
              fieldList={panelKey}
              disabled={isPublic}
              reRenderAttachments={removedPanel}
              mandatory
            />
          </Panel>
        </Collapse>
      )}

      {data.find((entry: BasicCell) => entry.id === fileMethodType)?.code === 'LOAD_ON_FTP' && (
        <Collapse>
          <Panel
            forceRender
            key={'add-file-ftp'}
            header={<label className="fake-required">{intl.formatMessage({ id: 'geoproducts.file_ftp' })}</label>}
          >
            <Space direction="vertical" size={24} style={{ width: '100%' }}>
              <Row gutter={[20, 15]}>
                <Col span={12}>
                  <Input
                    label={intl.formatMessage({ id: 'geoproducts.ftp_address' })}
                    name={[dynamicRow, 'ftpAddress']}
                    disabled={isPublic}
                    validations="required"
                  />
                </Col>
                <Col span={12}>
                  <Input
                    label={intl.formatMessage({ id: 'geoproducts.ftp_username' })}
                    name={[dynamicRow, 'ftpUsername']}
                    disabled={isPublic}
                    validations="required"
                  />
                </Col>
                <Col span={12}>
                  <Input
                    label={intl.formatMessage({ id: 'geoproducts.ftp_password' })}
                    name={[dynamicRow, 'ftpPassword']}
                    disabled={isPublic}
                    type="password"
                    validations="required"
                  />
                </Col>
                <Col span={12}>
                  <ProcessingSelect validations="required" name={[dynamicRow, 'processingTypeClassifierValueId']} />
                </Col>
              </Row>
              <Switch
                name={[dynamicRow, 'updateIsNeeded']}
                label={intl.formatMessage({ id: 'geoproducts.file_update' })}
                disabled={isPublic}
                onChange={(v) => setSyncNeeded(v)}
              />
              <div>
                <Col>
                  <Row gutter={5}>
                    <Col span={10}>
                      <StyledFTPSyncInputWrapper>
                        <Col span={13}>
                          <div className="label">
                            <div>
                              <FormattedMessage id="geoproducts.ftp_update_interval" />
                            </div>
                            <div>
                              <FormattedMessage id="geoproducts.ftp_update_after_every" />
                            </div>
                          </div>
                        </Col>
                        <Col span={9}>
                          <ClassifierKL15Input
                            name={[panelKey, dynamicRow, 'frequencyNumberClassifierValueId']}
                            placeholder={intl.formatMessage({ id: 'geoproducts.ftp_update_interval_placeholder' })}
                            disabled={isPublic || !syncNeeded}
                          />
                        </Col>
                        <Col span={9}>
                          <ClassifierSelect
                            allowClear
                            code="KL14"
                            name={[dynamicRow, 'frequencyTypeClassifierValueId']}
                            disabled={isPublic || !syncNeeded}
                          />
                        </Col>
                      </StyledFTPSyncInputWrapper>
                    </Col>
                  </Row>
                  <Row gutter={5}>
                    <Col span={10}>
                      <StyledFTPSyncInputWrapper>
                        <Col span={13}>
                          <div className="label">
                            <FormattedMessage id="geoproducts.ftp_update_time" />
                          </div>
                        </Col>
                        <Col span={9}>
                          <TimePicker
                            size="large"
                            name={[dynamicRow, 'frequencyDate']}
                            suffixIcon={<i className="fa-regular fa-clock" />}
                            disabled={isPublic || !syncNeeded}
                          />
                        </Col>
                      </StyledFTPSyncInputWrapper>
                    </Col>
                  </Row>
                </Col>
              </div>
              <Row justify="end" gutter={10}>
                <Col>
                  <Button onClick={() => setOpenFilesModal(true)} label={intl.formatMessage({ id: 'general.files' })} />
                </Col>
                <Col>
                  <Button
                    loading={ftpLoading}
                    onClick={() => handleFtpLoad()}
                    type="primary"
                    label={intl.formatMessage({ id: 'geoproducts.load_ftp' })}
                  />
                </Col>
              </Row>
            </Space>
          </Panel>
        </Collapse>
      )}
      <FtpFilesModal
        setFiles={setFiles}
        id={dynamicRowId}
        files={files}
        isOpen={openFilesModal}
        setIsOpen={setOpenFilesModal}
      />
    </>
  );
};

export default AddFilesBlock;
