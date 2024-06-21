import React, { useState } from 'react';
import { Button, Collapse, Switch, Input, Label, Icon } from 'ui';
import { Collapse as AntdCollapse, Row, Space, Col, Form } from 'antd';
import { useIntl } from 'react-intl';
import { StyledPanelExtra } from 'ui/collapse/style';
import { QuillEditor } from 'ui/quillEditor';
import toastMessage from '../../../../utils/toastMessage';

interface OtherPanelProps {
  panelKey: string;
  removePanel: Function;
  dynamicRow: number;
  previousEndIndex: number;
}

const OtherPanel = ({ removePanel, panelKey, dynamicRow, previousEndIndex }: OtherPanelProps) => {
  const form = Form.useFormInstance();

  const [isPublic, setIsPublic] = useState<boolean>(form.getFieldValue([panelKey, dynamicRow, 'isPublic']));

  // Required to trick QuillEditor to set ref when Collapse opens.
  const [_, setCollapseChanged] = useState(false);

  const intl = useIntl();
  const { Panel } = AntdCollapse;

  const onCollapseChange = () => {
    // onChange required for QuillEditor to set ref when collapse opens.
    // Does not re-render other components in collapse.
    setCollapseChanged((prev) => !prev);
  };

  const onServicesSetPublic = async (v: boolean) => {
    if (!v) return setIsPublic(v);

    await form
      .validateFields()
      .then(() => {
        setIsPublic(v);
      })
      .catch((e) => {
        form.setFieldValue([panelKey, dynamicRow, 'isPublic'], false);
        form.setFieldValue([panelKey, dynamicRow, 'serviceLinkValidated'], false);
        toastMessage.error(intl.formatMessage({ id: 'message.geoproduct_service_validation_error' }));
      });
  };

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

  return (
    <Collapse onChange={onCollapseChange}>
      <Panel
        key={panelKey}
        header={intl.formatMessage({ id: 'geoproducts.other' }) + ` #${previousEndIndex + dynamicRow + 1}`}
        extra={extra}
        forceRender
      >
        <Space size={20} direction="vertical" style={{ width: '100%' }}>
          <QuillEditor
            enableLinks
            enableSubscript
            maxLength={600}
            name={[dynamicRow, 'description']}
            label={<label className="fake-required">{intl.formatMessage({ id: 'geoproducts.div_description' })}</label>}
            validations="requiredRichText"
            toolbarKey={panelKey + dynamicRow}
          />
          <Form.List name={[dynamicRow, 'sites']}>
            {(fields, { add, remove }) => (
              <>
                <Row gutter={[20, 20]}>
                  {fields.map((field, index) => (
                    <React.Fragment key={field.key}>
                      <Col span={12}>
                        <Input
                          label={intl.formatMessage({ id: 'general.name' })}
                          name={[index, 'name']}
                          disabled={isPublic}
                          validations="required"
                        />
                      </Col>
                      <Col span={10}>
                        <Input
                          label={intl.formatMessage({ id: 'general.link' })}
                          name={[index, 'site']}
                          type="url"
                          disabled={isPublic}
                          validations="required"
                        />
                      </Col>
                      <Col span={2}>
                        <Form.Item label=" " colon={false}>
                          <Button
                            className="mt-1"
                            label={intl.formatMessage({ id: 'general.delete' })}
                            onClick={() => remove(index)}
                            disabled={isPublic}
                          />
                        </Form.Item>
                      </Col>
                    </React.Fragment>
                  ))}
                  <Col span={12}>
                    <label className="fake-required">{intl.formatMessage({ id: 'geoproducts.new_link' })}: </label>
                    <Button
                      label={intl.formatMessage({ id: 'general.add' })}
                      onClick={() => add()}
                      disabled={isPublic}
                    />
                  </Col>
                  <Col span={12}></Col>
                </Row>
              </>
            )}
          </Form.List>
        </Space>
      </Panel>
    </Collapse>
  );
};

export default OtherPanel;
