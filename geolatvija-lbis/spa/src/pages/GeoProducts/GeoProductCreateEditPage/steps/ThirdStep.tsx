import React from 'react';
import { FormInstance } from 'antd/es/form/hooks/useForm';
import { Collapse, Collapse as AntdCollapse, Space } from 'antd';
import { useIntl } from 'react-intl';
import { StyledSpace, StyledSummaryField } from '../../../../styles/layout/form';
import parse from 'html-react-parser';
import useQueryApiClient from '../../../../utils/useQueryApiClient';
import SummaryPanel from '../panels/SummaryPanel';
import { Label } from '../../../../ui';
import dayjs from 'dayjs';
import { StyledThirdStep } from './styles';

interface ThirdStepProps {
  form: FormInstance;
}

interface BasicDataType {
  id: number;
  isPublic: boolean;
  description: string;
  serviceLink?: string;
}

interface ServiceDataType extends BasicDataType {}

interface FilesDataType extends BasicDataType {}

interface OtherDataType extends BasicDataType {
  sites: OtherSites[];
}

interface OtherSites {
  name: string;
  site: string;
}

const ThirdStep = ({ form }: ThirdStepProps) => {
  const { Panel } = AntdCollapse;
  const formData = form.getFieldsValue(true);
  const intl = useIntl();
  const metaDataUrl =
    window?.runConfig?.backendUrl + `/geonetwork/srv/api/records/${formData.metadataUuid}/formatters/xml`;

  const { data: options, isLoading } = useQueryApiClient({
    request: {
      url: `api/v1/classifiers/select/KL1`,
    },
  });

  const { data: optionsCoord } = useQueryApiClient({
    request: {
      url: `api/v1/classifiers/select/KL2`,
    },
  });

  const generalInformation = () => {
    return [
      { key: 'name', labelKey: 'geoproducts.name' },
      { key: 'description', labelKey: 'geoproducts.description' },
      {
        key: 'coordinateSystemClassifierValueId',
        labelKey: 'geoproducts.coordinate_system',
        dataRetrieving: optionsCoord,
        dataRetrievingKey: 'translation',
      },
      {
        key: 'regularityRenewalClassifierValueId',
        labelKey: 'geoproducts.data_update',
        dataRetrieving: options,
        dataRetrievingKey: 'translation',
      },
      { key: 'tags', labelKey: 'geoproducts.tags', tags: formData.tags },
      { key: 'organizationName', labelKey: 'geoproducts.organization_name' },
      { key: 'email', labelKey: 'geoproducts.email' },
      { key: 'isInspired', labelKey: 'geoproducts.inspire_data', isBoolean: true },
    ];
  };

  return (
    <>
      {!isLoading && (
        <StyledThirdStep>
          <StyledSpace direction="vertical" size={20} className="mb-4">
            <Collapse>
              <Panel header={intl.formatMessage({ id: 'geoproducts.basic_information' })} key={1}>
                <Space direction="vertical">
                  <StyledSummaryField>
                    <div className="label">{intl.formatMessage({ id: 'geoproducts.status' })}</div>
                    <div className="value">
                      {intl.formatMessage({ id: 'geoproducts.' + (formData.status || 'DRAFT') })}
                    </div>
                  </StyledSummaryField>
                  {generalInformation().map((value) => {
                    if (value.key && formData[value.key] !== undefined) {
                      return (
                        <StyledSummaryField key={value.key}>
                          <div className="label">{intl.formatMessage({ id: value.labelKey })}</div>
                          <div className="value">
                            {(() => {
                              if (value.dataRetrieving !== undefined && value?.dataRetrievingKey) {
                                return value?.dataRetrieving?.find((val: any) => val?.id === formData?.[value?.key])?.[
                                  value?.dataRetrievingKey
                                ];
                              } else if (value.isBoolean) {
                                return intl.formatMessage({ id: `general.${formData[value.key] ? 'yes' : 'no'}` });
                              } else if (Array.isArray(value.tags)) {
                                return formData[value.key].join(', ');
                              } else {
                                return parse(formData[value.key] ?? '');
                              }
                            })()}
                          </div>
                        </StyledSummaryField>
                      );
                    }
                  })}
                </Space>
              </Panel>
            </Collapse>

            {formData.filesData?.length > 0 &&
              formData.filesData.map((event: FilesDataType, index: number) => {
                return (
                  <SummaryPanel
                    file
                    headerTitle={intl.formatMessage({ id: 'geoproducts.file' })}
                    isPublic={event.isPublic}
                    description={event.description}
                    key={index}
                  />
                );
              })}
            {formData.others?.length > 0 &&
              formData.others.map((event: OtherDataType, index: number) => {
                return (
                  <SummaryPanel
                    headerTitle={intl.formatMessage({ id: 'geoproducts.other' })}
                    isPublic={event.isPublic}
                    description={event.description}
                    serviceLink={event.sites?.map((s: any) => s?.site)}
                    key={index}
                  />
                );
              })}
            {formData.services?.length > 0 &&
              formData.services.map((event: ServiceDataType, index: number) => {
                return (
                  <SummaryPanel
                    headerTitle={intl.formatMessage({ id: 'geoproducts.service' })}
                    isPublic={event.isPublic}
                    description={event.description}
                    serviceLink={event.serviceLink}
                    key={index}
                  />
                );
              })}

            <Collapse>
              <Panel header={intl.formatMessage({ id: 'geoproducts.meta_data' })} key={2}>
                <StyledSummaryField>
                  <Label label={intl.formatMessage({ id: 'geoproducts.meta_data_url' })} />
                  <Label
                    className="label-break-all"
                    color="primary"
                    label={formData.metadataUuid ? metaDataUrl : ''}
                    clickable
                    onClick={() => window.open(metaDataUrl)}
                  />
                </StyledSummaryField>
                <StyledSummaryField>
                  <Label label={intl.formatMessage({ id: 'geoproducts.meta_data_id' })} />
                  <Label className="label-break-all" color="primary" label={formData.metadataUuid || ''} />
                </StyledSummaryField>
                <StyledSummaryField>
                  <Label label={intl.formatMessage({ id: 'geoproducts.meta_data_created_at' })} />
                  <Label
                    className="label-break-all"
                    color="primary"
                    label={formData.metadataUuid ? dayjs(formData.createdAt).format('DD.MM.YYYY HH:mm') : ''}
                  />
                </StyledSummaryField>

                {formData.services?.length > 0
                  ? formData.services.map((e: any, index: number) => (
                      <>
                        {
                          <div key={e.id} className="mt-20">
                            <StyledSummaryField>
                              <Label
                                label={intl.formatMessage(
                                  { id: 'geoproducts.meta_data_service_url' },
                                  { id: `#${(index += 1)}` }
                                )}
                              />
                              <Label
                                className="label-break-all"
                                color="primary"
                                label={
                                  e.metadataUuid
                                    ? window?.runConfig?.backendUrl +
                                      `/geonetwork/srv/api/records/${e.metadataUuid}/formatters/xml`
                                    : ''
                                }
                                clickable
                                onClick={() =>
                                  window.open(
                                    window?.runConfig?.backendUrl +
                                      `/geonetwork/srv/api/records/${e.metadataUuid}/formatters/xml`
                                  )
                                }
                              />
                            </StyledSummaryField>
                            <StyledSummaryField>
                              <Label label={intl.formatMessage({ id: 'geoproducts.meta_data_service_created_at' })} />
                              <Label
                                className="label-break-all"
                                color="primary"
                                label={
                                  formData.metadataUuid ? dayjs(formData.createdAt).format('DD.MM.YYYY HH:mm') : ''
                                }
                              />
                            </StyledSummaryField>
                            <StyledSummaryField>
                              <Label
                                label={intl.formatMessage({ id: 'geoproducts.meta_service_url' }, { id: `#${index}` })}
                              />
                              <Label className="label-break-all" color="primary" label={e.serviceLink} />
                            </StyledSummaryField>
                          </div>
                        }
                      </>
                    ))
                  : []}

                {formData.filesData?.length > 0
                  ? formData.filesData.map((e: any, index: number) => (
                      <>
                        {
                          <div key={e.id} className="mt-20">
                            <StyledSummaryField>
                              <Label
                                label={intl.formatMessage(
                                  { id: 'geoproducts.meta_data_file_url' },
                                  { id: `#${(index += 1)}` }
                                )}
                              />
                              <Label
                                color="primary"
                                label={
                                  e.metadataUuid
                                    ? window?.runConfig?.backendUrl +
                                      `/geonetwork/srv/api/records/${e.metadataUuid}/formatters/xml`
                                    : ''
                                }
                                clickable
                                onClick={() =>
                                  window.open(
                                    window?.runConfig?.backendUrl +
                                      `/geonetwork/srv/api/records/${e.metadataUuid}/formatters/xml`
                                  )
                                }
                              />
                            </StyledSummaryField>
                            <StyledSummaryField>
                              <Label label={intl.formatMessage({ id: 'geoproducts.meta_data_file_created_at' })} />
                              <Label
                                color="primary"
                                label={
                                  formData.metadataUuid ? dayjs(formData.createdAt).format('DD.MM.YYYY HH:mm') : ''
                                }
                              />
                            </StyledSummaryField>
                          </div>
                        }
                      </>
                    ))
                  : []}

                {formData.others?.length > 0
                  ? formData.others.map((e: any, index: number) => (
                      <>
                        {
                          <div key={e.id} className="mt-20">
                            <StyledSummaryField>
                              <Label
                                label={intl.formatMessage(
                                  { id: 'geoproducts.meta_data_other_url' },
                                  { id: `#${(index += 1)}` }
                                )}
                              />
                              <Label
                                color="primary"
                                label={
                                  e.metadataUuid
                                    ? window?.runConfig?.backendUrl +
                                      `/geonetwork/srv/api/records/${e.metadataUuid}/formatters/xml`
                                    : ''
                                }
                                clickable
                                onClick={() =>
                                  window.open(
                                    window?.runConfig?.backendUrl +
                                      `/geonetwork/srv/api/records/${e.metadataUuid}/formatters/xml`
                                  )
                                }
                              />
                            </StyledSummaryField>
                            <StyledSummaryField>
                              <Label label={intl.formatMessage({ id: 'geoproducts.meta_data_other_created_at' })} />
                              <Label
                                color="primary"
                                label={
                                  formData.metadataUuid ? dayjs(formData.createdAt).format('DD.MM.YYYY HH:mm') : ''
                                }
                              />
                            </StyledSummaryField>
                          </div>
                        }
                      </>
                    ))
                  : []}
              </Panel>
            </Collapse>
          </StyledSpace>
        </StyledThirdStep>
      )}
    </>
  );
};

export default ThirdStep;
