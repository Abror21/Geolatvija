import React, { type Dispatch, type SetStateAction, useState } from 'react';
import { Button, Icon, Modal, Select, SelectOption } from 'ui';
import { Form } from 'antd';
import ServicesPanel from '../panels/ServicesPanel';
import FilePanel from '../panels/FilePanel';
import OtherPanel from '../panels/OtherPanel';
import NonePanel from '../panels/NonePanel';
import { FormInstance } from 'antd/es/form/hooks/useForm';
import DeleteModal from '../../../../components/Modals/DeleteModal';
import { FormattedMessage, useIntl } from 'react-intl';
import { type DivEndIndex } from '../index';

interface SecondStepProps {
  form: FormInstance;
  id?: string;
  divEndIndex: DivEndIndex;
  setDivEndIndex: Dispatch<SetStateAction<DivEndIndex>>;
}

const SecondStep = ({ form, id, divEndIndex, setDivEndIndex }: SecondStepProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showPublicWarningModal, setShowPublicWarningModal] = useState<boolean>(false);
  const [type, setType] = useState<string>();
  const [index, setIndex] = useState<number>();
  const [removedPanel, setRemovedPanel] = useState(0);

  const intl = useIntl();

  const removePanel = (type: string, index: number) => {
    const isPublic = form.getFieldValue([type, index, 'isPublic']);

    if (isPublic) {
      setShowPublicWarningModal(true);
      return;
    }

    setShowModal(true);
    setType(type);
    setIndex(index);
  };

  const updateIndexes = (prev: DivEndIndex, type: string, operation: number): DivEndIndex => {
    const updates: Record<string, Partial<DivEndIndex>> = {
      services: {
        servicesEndIndex: prev.servicesEndIndex + operation,
        filesEndIndex: prev.filesEndIndex + operation,
        othersEndIndex: prev.othersEndIndex + operation,
      },
      filesData: {
        filesEndIndex: prev.filesEndIndex + operation,
        othersEndIndex: prev.othersEndIndex + operation,
      },
      others: {
        othersEndIndex: prev.othersEndIndex + operation,
      },
    };

    return { ...prev, ...updates[type] };
  };

  const onConfirm = () => {
    let existingPanel = form.getFieldValue(type!);

    existingPanel.splice(index, 1);

    form.setFieldsValue({ [type!]: existingPanel });

    setShowModal(false);
    setType(undefined);
    setIndex(undefined);

    setRemovedPanel((prev) => prev + 1);

    !!type && setDivEndIndex((prev) => updateIndexes(prev, type, -1));
  };

  const addPanel = (type: string) => {
    let existingPanel = form.getFieldValue(type);

    existingPanel.push({});

    form.setFieldsValue({ [type]: existingPanel, addTabs: null });

    !!type && setDivEndIndex((prev) => updateIndexes(prev, type, 1));
  };

  //reset specific fields
  const clearFields = (type: string, fields: string[], index: number) => {
    let existingPanel = form.getFieldValue(type);

    fields.forEach((field) => {
      existingPanel[index][field] = null;
    });

    form.setFieldsValue({ [type]: existingPanel });
  };

  return (
    <>
      <Select
        placeholder="Pievienot jaunu datu izplatīšanas veidu"
        onChange={(value: string) => addPanel(value)}
        name="addTabs"
      >
        <SelectOption value={'services'}>Pakalpe</SelectOption>
        <SelectOption value={'filesData'}>Datne</SelectOption>
        <SelectOption value={'others'}>Cits</SelectOption>
        <SelectOption value={'none'}>Nav</SelectOption>
      </Select>
      <Form.List name="services" initialValue={[]}>
        {(fields) => (
          <>
            {fields.map(({ name }, index) => (
              <ServicesPanel
                key={index}
                id={id}
                panelKey="services"
                dynamicRow={index}
                removePanel={() => removePanel('services', index)}
                clearFields={(fields: string[], index: number) => clearFields('services', fields, index)}
              />
            ))}
          </>
        )}
      </Form.List>

      <Form.List name="filesData" initialValue={[]}>
        {(fields) => (
          <>
            {fields.map(({ name }, index) => (
              <FilePanel
                key={index}
                panelKey="filesData"
                dynamicRow={index}
                removePanel={() => removePanel('filesData', index)}
                previousEndIndex={divEndIndex.servicesEndIndex}
                removedPanel={removedPanel}
                clearFields={(fields: string[], index: number) => clearFields('filesData', fields, index)}
              />
            ))}
          </>
        )}
      </Form.List>

      <Form.List name="others" initialValue={[]}>
        {(fields) => (
          <>
            {fields.map(({ name }, index) => (
              <OtherPanel
                key={index}
                panelKey="others"
                dynamicRow={index}
                previousEndIndex={divEndIndex.filesEndIndex}
                removePanel={() => removePanel('others', index)}
              />
            ))}
          </>
        )}
      </Form.List>

      <Form.List name="none" initialValue={[]}>
        {(fields) => (
          <>
            {fields.map(({ name }, index) => (
              <NonePanel
                key={index}
                panelKey="none"
                dynamicRow={index}
                previousEndIndex={divEndIndex.othersEndIndex}
                removePanel={() => removePanel('none', index)}
              />
            ))}
          </>
        )}
      </Form.List>

      <DeleteModal setShowModal={setShowModal} showModal={showModal} manualOnModalOk={onConfirm} />
      <Modal
        onCancel={() => setShowPublicWarningModal(!showPublicWarningModal)}
        open={showPublicWarningModal}
        closable={false}
        disableHeader
        footer={
          <>
            <Button
              label={intl.formatMessage({
                id: 'general.cancel',
              })}
              onClick={() => setShowPublicWarningModal(false)}
            />
          </>
        }
      >
        <h3 className="confirm-title">
          <Icon faBase="fal" icon="exclamation-circle" />
          <FormattedMessage id="geoproducts.public_warning" />
        </h3>
      </Modal>
    </>
  );
};

export default SecondStep;
