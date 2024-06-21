import React, { useEffect, useState } from 'react';
import { Button, Collapse, Switch, Label, QuillEditor, Icon, Input } from 'ui';
import { Col, Collapse as AntdCollapse, Form, Row } from 'antd';
import { useIntl } from 'react-intl';
import { StyledPanelExtra } from 'ui/collapse/style';
import AddFilesBlock from '../blocks/AddFilesBlock';
import AvailabilityRestrictionBlock from '../blocks/AvailabilityRestrictionBlock';
import LicenseBlock from '../blocks/LicenseBlock';
import { ClassifierSelect } from '../../../../components/Selects';
import { PaymentTypeEnum } from '../blocks/PaymentBlock';
import toastMessage from '../../../../utils/toastMessage';

interface FilePanelProps {
  panelKey: string;
  removePanel: Function;
  dynamicRow: number;
  clearFields: Function;
  previousEndIndex: number;
  removedPanel: number;
}

const FilePanel = ({
  removePanel,
  panelKey,
  dynamicRow,
  clearFields,
  previousEndIndex,
  removedPanel,
}: FilePanelProps) => {
  const form = Form.useFormInstance();
  const fileMethod = form.getFieldValue([panelKey, dynamicRow, 'fileMethodClassifierValueId']);

  const [isPublic, setIsPublic] = useState<boolean>(form.getFieldValue([panelKey, dynamicRow, 'isPublic']));
  const [fileMethodType, setFileMethodType] = useState<string>(fileMethod);

  // Required to trick QuillEditor to set ref when Collapse opens.
  const [_, setCollapseChanged] = useState(false);

  const intl = useIntl();
  const isInspired = form.getFieldValue('isInspired');
  const { Panel } = AntdCollapse;

  //IF ANY NAMES AR CHANGED THEN NEED TO UPDATE THIS AS WELL
  const blockFields = [
    'files',
    'ftpAddress',
    'ftpUsername',
    'ftpPassword',
    'processingTypeClassifierValueId',
    'updateIsNeeded',
    'frequencyNumberClassifierValueId',
    'frequencyTypeClassifierValueId',
    'frequencyDate',
  ];

  const onCollapseChange = () => {
    // onChange required for QuillEditor to set ref when collapse opens.
    // Does not re-render other components in collapse.
    setCollapseChanged((prev) => !prev);
  };

  const onServicesSetPublic = async (v: boolean) => {
    if (!v) return setIsPublic(v);

    const requiredFields = [
      [panelKey, dynamicRow, 'file'],
      [panelKey, dynamicRow, 'fileMethodClassifierValueId'],
      [panelKey, dynamicRow, 'ftpUsername'],
      [panelKey, dynamicRow, 'ftpPassword'],
      [panelKey, dynamicRow, 'ftpAddress'],
      [panelKey, dynamicRow, 'processingTypeClassifierValueId'],
    ];

    const paymentType = form.getFieldValue([panelKey, dynamicRow, 'paymentType']);
    if (paymentType === PaymentTypeEnum.Prepay) {
      requiredFields.push([panelKey, dynamicRow, 'feeCost']);
      requiredFields.push([panelKey, dynamicRow, 'serviceStep']);
      requiredFields.push([panelKey, dynamicRow, 'position']);
    } else if (paymentType === PaymentTypeEnum.Fee) {
      requiredFields.push([panelKey, dynamicRow, 'feeCost']);
    }

    const licenseType = form.getFieldValue([panelKey, dynamicRow, 'licenseType']);
    const requiredField =
      licenseType === 'OPEN'
        ? 'institutionOpenLicenceId'
        : licenseType === 'PREDEFINED'
        ? 'institutionPredefinedLicenceId'
        : 'licence';

    if (!form.getFieldValue([panelKey, dynamicRow, requiredField])) {
      requiredFields.push([panelKey, dynamicRow, requiredField]);
    }

    const availableRestrictionType = form.getFieldValue([panelKey, dynamicRow, 'availableRestrictionType']);
    const requiredFieldB =
      availableRestrictionType === 'BY_BELONGING'
        ? 'institutionTypeClassifierIds'
        : availableRestrictionType === 'BELONG_TO_GROUP'
        ? 'thematicUserGroupId'
        : 'does';

    if (!form.getFieldValue([panelKey, dynamicRow, requiredFieldB])) {
      requiredFields.push([panelKey, dynamicRow, requiredFieldB]);
    }

    await form
      .validateFields(requiredFields)
      .then(() => {
        setIsPublic(v);
      })
      .catch(() => {
        setIsPublic(false);
        form.setFieldValue([panelKey, dynamicRow, 'isPublic'], false);
        toastMessage.error(intl.formatMessage({ id: 'validation.geoproduct_file_validation_error' }));
      });
  };

  // If any panel deleted set correct file method
  useEffect(() => {
    if (!!removedPanel) {
      setFileMethodType(form.getFieldValue([panelKey, dynamicRow, 'fileMethodClassifierValueId']));
    }
  }, [removedPanel]);

  const extra = (
    <StyledPanelExtra
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <Label label={intl.formatMessage({ id: 'general.published' })} />
      <Switch name={[dynamicRow, 'isPublic']} onChange={onServicesSetPublic} />
      <Button label={<Icon icon="trash" />} onClick={() => removePanel()} disabled={isPublic} />
    </StyledPanelExtra>
  );

  const onFileMethodChange = (value: string) => {
    setFileMethodType(value);
    clearFields(blockFields, dynamicRow);
  };

  const fileFormats = (
    <Row gutter={[20, 15]}>
      <Col span={12}>
        <ClassifierSelect
          allowClear
          code="KL30"
          name={[dynamicRow, 'fileFormatClassifierValueId']}
          label={intl.formatMessage({ id: 'geoproducts.file_format' })}
          disabled={isPublic}
        />
      </Col>
      <Col span={12}>
        <Input
          label={intl.formatMessage({ id: 'geoproducts.file_format_version' })}
          name={[dynamicRow, 'fileFormatVersion']}
          disabled={isPublic}
          maxLength={15}
          rules={[
            {
              pattern: /^[A-Za-z0-9.-]{1,15}$/,
              message: intl.formatMessage({ id: 'validation.file_version_not_valid_format' }),
            },
          ]}
        />
      </Col>
    </Row>
  );

  return (
    <Collapse onChange={onCollapseChange}>
      <Panel
        forceRender
        key={panelKey}
        header={intl.formatMessage({ id: 'geoproducts.file' }) + ` #${previousEndIndex + dynamicRow + 1}`}
        extra={extra}
      >
        <QuillEditor
          enableLinks
          enableSubscript
          maxLength={600}
          name={[dynamicRow, 'description']}
          label={<label className="fake-required">{intl.formatMessage({ id: 'geoproducts.div_description' })}</label>}
          toolbarKey={panelKey + dynamicRow}
          validations="requiredRichText"
        />
        <ClassifierSelect
          allowClear
          code="KL10"
          name={[dynamicRow, 'fileMethodClassifierValueId']}
          label={intl.formatMessage({ id: 'geoproducts.file_method' })}
          onChange={onFileMethodChange}
          disabled={isPublic}
          validations="required"
        />
        {!isInspired && fileFormats}
        <AddFilesBlock
          form={form}
          dynamicRow={dynamicRow}
          fileMethodType={fileMethodType}
          panelKey={panelKey}
          isPublic={isPublic}
          removedPanel={removedPanel}
        />
        <AvailabilityRestrictionBlock dynamicRow={dynamicRow} isPublic={isPublic} panelKey={panelKey} />
        <LicenseBlock
          dynamicRow={dynamicRow}
          clearFields={clearFields}
          showPriceForAll
          panelKey={panelKey}
          isPublic={isPublic}
        />
      </Panel>
    </Collapse>
  );
};

export default FilePanel;
