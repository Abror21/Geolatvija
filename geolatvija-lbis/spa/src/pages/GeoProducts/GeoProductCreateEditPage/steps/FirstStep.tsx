import React, { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import {
  Alert,
  Input,
  Select,
  Collapse,
  Switch,
  Radio,
  DatePicker,
  RadioGroup,
  QuillEditor,
  InputNumber,
  Button,
  Tooltip,
  Drawer,
} from 'ui';
import { Col, Collapse as AntdCollapse, Row } from 'antd';
import { useIntl } from 'react-intl';
import { ClassifierSelect } from 'components/Selects';
import DocumentFormItem from 'components/DocumentFormItem';
import dayjs from 'dayjs';
import Preview from '../preview/Preview';

type FirstStepProps = {
  form: any;
  setInspireMetadata: Dispatch<SetStateAction<boolean>>;
  inspireMetadata: boolean;
  openTabs: number[];
};

const FirstStep = ({ form, setInspireMetadata, inspireMetadata, openTabs }: FirstStepProps) => {
  const [accessUseConditions, setAccessUseConditions] = useState<boolean>(false);
  const [accessUseRestrictions, setAccessUseRestrictions] = useState<boolean>(false);
  const [priorityDataTopic, setPriorityDataTopic] = useState<boolean>(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  const today = dayjs();
  const formValues = form.getFieldsValue(true);

  const intl = useIntl();
  const status = form.getFieldValue('status');
  const enablePriority = form.getFieldValue('enablePrimaryDataThemeClassifier');
  const enableRestrictions = form.getFieldValue('enableAccessAndUseRestrictions');
  const enableConditions = form.getFieldValue('enableAccessAndUseConditions');

  const { Panel } = AntdCollapse;

  useEffect(() => {
    setPriorityDataTopic(enablePriority === 1);
    setAccessUseRestrictions(enableRestrictions === 1);
    setAccessUseConditions(enableConditions === 1);
  }, [enablePriority, enableConditions, enableRestrictions]);

  return (
    <div>
      <Alert
        message={
          <>
            {intl.formatMessage({ id: 'geoproducts.status' })}
            {': '}
            <span className="ant-alert-info-span">
              {intl.formatMessage({ id: `geoproducts.${status || 'DRAFT'}` })}
            </span>
            <Tooltip className="initial" title={intl.formatMessage({ id: 'geoproducts.preview_tooltip' })}>
              <Button
                className="ml-4"
                label={intl.formatMessage({ id: 'geoproducts.preview' })}
                onClick={() => setIsPreviewOpen(true)}
              />
            </Tooltip>
          </>
        }
        type="info"
      />
      <Input label={intl.formatMessage({ id: 'geoproducts.name' })} name="name" validations="required" />
      <QuillEditor
        enableLinks
        enableSubscript
        maxLength={600}
        name="description"
        label={<label className="fake-required">{intl.formatMessage({ id: 'geoproducts.description' })}</label>}
        validations="requiredRichText"
      />
      <ClassifierSelect
        allowClear
        code="KL2"
        name="coordinateSystemClassifierValueId"
        validations="required"
        label={intl.formatMessage({ id: 'geoproducts.coordinate_system' })}
      />
      <ClassifierSelect
        allowClear
        code="KL1"
        name="regularityRenewalClassifierValueId"
        label={intl.formatMessage({ id: 'geoproducts.data_update' })}
        validations="required"
      />
      <DocumentFormItem fieldName="photo" label={intl.formatMessage({ id: 'geoproducts.image' })} maxCount={1} />
      <Select label={intl.formatMessage({ id: 'geoproducts.tags' })} mode="tags" name="tags" validations="required" />
      <DocumentFormItem
        fieldName="dataSpecification"
        label={intl.formatMessage({ id: 'geoproducts.data_specification' })}
        maxCount={1}
      />
      <Collapse defaultActiveKey={openTabs}>
        <Panel key={1} header={intl.formatMessage({ id: 'geoproducts.contact_person_data' })} forceRender>
          <div className="grid grid-cols-2 gap-20">
            <Input
              label={intl.formatMessage({ id: 'geoproducts.organization_name' })}
              name="organizationName"
              validations="required"
            />
            <Input
              label={intl.formatMessage({ id: 'geoproducts.email' })}
              name="email"
              type="email"
              validations="required"
            />
          </div>
        </Panel>
      </Collapse>
      <Collapse defaultActiveKey={openTabs}>
        <Panel key={1} header={intl.formatMessage({ id: 'geoproducts.inspire_question' })} forceRender>
          <div className="grid grid-cols-2 align-end gap-20">
            <Switch
              label={intl.formatMessage({ id: 'geoproducts.is_inspire_metadata' })}
              name="isInspired"
              onChange={setInspireMetadata}
            />

            <ClassifierSelect
              allowClear
              code="KL2"
              name="coordinateSystemClassifierValueId"
              label={intl.formatMessage({ id: 'geoproducts.coordinate_system' })}
              disabled={!inspireMetadata}
              validations={inspireMetadata ? 'required' : undefined}
            />

            <ClassifierSelect
              allowClear
              code="KL3"
              name="scaleClassifierValueId"
              label={intl.formatMessage({ id: 'geoproducts.scale' })}
              validations={inspireMetadata ? 'required' : undefined}
            />

            <DatePicker
              size="large"
              label={intl.formatMessage({ id: 'geoproducts.data_release_date' })}
              name="dataReleaseDate"
              initialValue={today}
            />

            {!inspireMetadata && (
              <Row gutter={20}>
                <Col span={12}>
                  <InputNumber
                    name="precision"
                    label={intl.formatMessage({ id: 'geoproducts.precision' })}
                    disabled={inspireMetadata}
                    precision={2}
                    min={0.01}
                    max={100}
                    parser={(str) => {
                      if (str === '') {
                        return undefined;
                      }

                      return parseFloat(str?.replace(',', '.') || '');
                    }}
                    step={0.01}
                  />
                </Col>
                <Col span={12}>
                  <InputNumber
                    name="completenessValue"
                    label={intl.formatMessage({ id: 'geoproducts.completeness_value' })}
                    disabled={inspireMetadata}
                    precision={0}
                    min={1}
                    max={100}
                  />
                </Col>
              </Row>
            )}

            <DatePicker
              size="large"
              label={intl.formatMessage({ id: 'geoproducts.data_change_date' })}
              name="dataUpdatedAt"
              initialValue={today}
            />
            <ClassifierSelect
              allowClear
              code="KL4"
              name="spatialDataClassifierValueId"
              label={intl.formatMessage({ id: 'geoproducts.spatial_data_classifcation' })}
              validations={inspireMetadata ? 'required' : undefined}
            />
            <ClassifierSelect
              allowClear
              code="KL5"
              name="inspiredDataClassifierValueId"
              label={intl.formatMessage({ id: 'geoproducts.inspire_data_topic' })}
              validations={inspireMetadata ? 'required' : undefined}
            />
            <ClassifierSelect
              allowClear
              code="KL6"
              name="keywordClassifierValueId"
              label={intl.formatMessage({ id: 'geoproducts.keywords' })}
              validations={inspireMetadata ? 'required' : undefined}
            />

            <Input
              label={intl.formatMessage({ id: 'geoproducts.data_origin' })}
              name="dataOrigin"
              validations={inspireMetadata ? 'required' : undefined}
            />
          </div>
          <div className="grid grid-cols-2 align-end gap-20">
            <RadioGroup
              size="middle"
              label={`${intl.formatMessage({ id: 'geoproducts.conditions_of_access_and_use_of_data' })}:`}
              name="enableAccessAndUseConditions"
              initialValue={0}
              onChange={(e) => {
                setAccessUseConditions(e.target.value);
                form.setFieldValue('accessAndUseConditions', null);
              }}
            >
              <Radio value={0} label={intl.formatMessage({ id: 'general.no' })} />
              <Radio value={1} label={intl.formatMessage({ id: 'general.yes' })} />
            </RadioGroup>
            <Input name="accessAndUseConditions" disabled={!accessUseConditions} />
            <RadioGroup
              size="middle"
              label={`${intl.formatMessage({ id: 'geoproducts.data_access_use_restrictions' })}:`}
              name="enableAccessAndUseRestrictions"
              initialValue={0}
              onChange={(e) => {
                setAccessUseRestrictions(e.target.value);
                form.setFieldValue('accessAndUseRestrictions', null);
              }}
            >
              <Radio value={0} label={intl.formatMessage({ id: 'general.no' })} />
              <Radio value={1} label={intl.formatMessage({ id: 'general.yes' })} />
            </RadioGroup>
            <Input name="accessAndUseRestrictions" disabled={!accessUseRestrictions} />
            <RadioGroup
              size="middle"
              label={`${intl.formatMessage({ id: 'geoproducts.priority_data_topic' })}:`}
              name="enablePrimaryDataThemeClassifier"
              initialValue={0}
              onChange={(e) => {
                setPriorityDataTopic(e.target.value);
                form.setFieldValue('primaryDataThemeClassifierValueId', null);
              }}
            >
              <Radio value={0} label={intl.formatMessage({ id: 'general.no' })} />
              <Radio value={1} label={intl.formatMessage({ id: 'general.yes' })} />
            </RadioGroup>
            <ClassifierSelect
              name="primaryDataThemeClassifierValueId"
              allowClear
              code="KL7"
              disabled={!priorityDataTopic}
            />
          </div>
        </Panel>
      </Collapse>

      <Drawer title={formValues.name} open={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
        <Preview form={form} />
      </Drawer>
    </div>
  );
};

export default FirstStep;
