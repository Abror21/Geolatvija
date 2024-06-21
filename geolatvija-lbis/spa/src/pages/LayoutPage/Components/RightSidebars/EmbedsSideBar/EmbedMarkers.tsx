import React from 'react';
import { ColorPicker, Form, type FormListFieldData } from 'antd';
import { Icon, TextArea } from '../../../../../ui';
import { StyledEmbedMarkersContainer } from './styles';
import { COLORS } from '../../../../../styles/globals';
import { useIntl } from 'react-intl';

type EmbedMarkerItemProps = {
  fields: FormListFieldData[];
  remove: Function;
  onChangeMarkers: Function;
};

export const EmbedMarkers = ({ fields, onChangeMarkers, remove }: EmbedMarkerItemProps) => {
  const intl = useIntl();

  return (
    <StyledEmbedMarkersContainer>
      {fields.map(({ key, name, ...restField }) => (
        <div key={key} className="item-wrapper">
          <Form.Item {...restField} name={[name, 'description']}>
            <TextArea
              placeholder={intl.formatMessage({ id: 'general.description' })}
              onBlur={() => onChangeMarkers()}
            />
          </Form.Item>
          <Form.Item initialValue={COLORS.brand02} {...restField} name={[name, 'color']}>
            <ColorPicker onChange={() => onChangeMarkers()} />
          </Form.Item>
          <Icon
            className="trash-icon"
            onClick={() => {
              remove(name);
              onChangeMarkers();
            }}
            icon="trash"
          />
        </div>
      ))}
    </StyledEmbedMarkersContainer>
  );
};
