import React, { type Dispatch, type SetStateAction, useCallback, useContext, useEffect, useState } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Button, Icon, Input, InputNumber, Label, Radio, RadioGroup, Spinner, TextArea, Tooltip } from 'ui';
import { useIntl } from 'react-intl';
import { Col, Form, Row } from 'antd';
import { ButtonListFull } from 'styles/layout/form';
import useQueryApiClient from '../../../../../utils/useQueryApiClient';
import type { RadioChangeEvent } from 'antd/es/radio/interface';
import type { FormInstance } from 'antd/es/form/hooks/useForm';
import {
  applyEmbedMapState,
  clearMarkers,
  getCurrentMapState,
  getMarkersLayer,
  replaceMarkers,
  getNonIncludableInEmbedGeoproductLayers,
} from 'utils/embedMapUtils';
import MapContext from 'contexts/MapContext';
import { useOpenedTypeDispatch, useOpenedTypeState } from 'contexts/OpenedTypeContext';
import OlInteractionModify, { ModifyEvent } from 'ol/interaction/Modify';
import OlInteractionSelect from 'ol/interaction/Select';
import OlPoint from 'ol/geom/Point';
import EmbedViewport from '../../../../../components/Map/EmbedViewport';
import OlControl from 'ol/control/Control';
import { EmbedMarkers } from './EmbedMarkers';
import { AddMarkerButtonWrapper, IconWrapper, LayersNotIncludedLabel, TextAreaWrapper } from './styles';
import { useNavigate } from 'react-router-dom';
import toastMessage from '../../../../../utils/toastMessage';

type EmbeddedProps = {
  id?: number | null;
  form: FormInstance;
  setVisibleLayers: Dispatch<SetStateAction<string[] | undefined>>;
  isOpen: boolean;
  clearSearchParams: Function;
};

export const Embedded = ({ id, form, setVisibleLayers, isOpen, clearSearchParams }: EmbeddedProps) => {
  const [isCustom, setIsCustom] = useState(false);
  const [viewport, setViewport] = useState<Root | undefined>();
  const [nonIncludableGeoproducts, setNonIncludableGeoproducts] = useState<string[]>([]);

  const map = useContext(MapContext);
  const openedType = useOpenedTypeState();
  const dispatch = useOpenedTypeDispatch();
  const navigate = useNavigate();
  const intl = useIntl();

  const markers = Form.useWatch('markers', form);
  const iframe = Form.useWatch('iframe', form);

  const resetForm = () => {
    form.resetFields();
    if (map) clearMarkers(map);
  };

  const { appendData, isLoading } = useQueryApiClient({
    request: {
      url: `api/v1/user-embeds`,
      method: 'POST',
    },
    onSuccess: (response) => {
      form.setFieldsValue(response);
      navigate(`/main?embedId=${response.id}`);
      toastMessage.success(intl.formatMessage({ id: 'embedded.created_successfully' }));
    },
  });

  const { appendData: createPreview, isLoading: previewIsLoading } = useQueryApiClient({
    request: {
      url: `api/v1/user-embeds`,
      method: 'POST',
    },
    onSuccess: (response) => {
      if (response.uuid) {
        const height = response.height;
        const width = response.width;

        window.open(`/map?id=${response.uuid}`, 'IFRAME', `height=${height},width=${width}`);
      }
    },
  });

  const { appendData: updateAppendData, isLoading: updateIsLoading } = useQueryApiClient({
    request: {
      url: `api/v1/user-embeds/${id}?_method=PATCH`,
      method: 'POST',
    },
    onSuccess: () => {
      toastMessage.success(intl.formatMessage({ id: 'embedded.updated_successfully' }));
    },
  });

  const { isLoading: fetchingIsLoading } = useQueryApiClient({
    request: {
      url: `api/v1/user-embeds/${id}`,
      disableOnMount: !id,
    },
    onSuccess: (response) => {
      form.setFieldsValue(response);

      if (response.data) {
        const embedData = JSON.parse(response.data);
        form.setFieldValue('markers', embedData.markers);
      }

      if (map && response.data) {
        const embedData = JSON.parse(response.data);
        const visibleLayers = applyEmbedMapState(map, embedData, dispatch);
        setVisibleLayers(visibleLayers);
      }
    },
  });

  function uuidv4() {
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: any) =>
      (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
    );
  }

  const validateAndGetFormValues = async () => {
    await form.validateFields();

    const values = { ...form.getFieldsValue(true) };

    if (map) {
      const mapState = getCurrentMapState(map, openedType);

      setNonIncludableGeoproducts(getNonIncludableInEmbedGeoproductLayers(map));

      mapState.markers =
        values.markers?.map((marker: any) => ({
          ...marker,
          color: typeof marker.color === 'string' ? marker.color : marker.color?.toHexString(),
        })) ?? [];
      console.log({ mapState });
      values.data = JSON.stringify(mapState);
    }

    return values;
  };

  const onSubmit = async () => {
    const values = await validateAndGetFormValues();

    if (!id) {
      const parsed = {
        ...values,
        uuid: uuidv4(),
      };

      appendData(parsed);
    } else {
      updateAppendData(values);
    }
  };

  const onPreview = async () => {
    if (id) {
      const uuid = form.getFieldValue('uuid');
      const height = form.getFieldValue('height');
      const width = form.getFieldValue('width');

      window.open(`/map?id=${uuid}`, 'IFRAME', `height=${height},width=${width}`);
    } else {
      const values = await validateAndGetFormValues();

      if (!id) {
        const parsed = {
          ...values,
          temp: true,
          uuid: uuidv4(),
        };

        createPreview(parsed);
      }
    }
  };

  const onCreateAdditionalNew = async () => {
    if (!id) return;

    const values = await validateAndGetFormValues();

    const parsed = {
      ...values,
      uuid: uuidv4(),
    };

    appendData(parsed);
  };

  const copyIframe = () => {
    if (navigator.clipboard && !!iframe) {
      navigator.clipboard.writeText(iframe);
      toastMessage.success(intl.formatMessage({ id: 'embedded.copied_to_clipboard' }));
    }
  };

  const onSizeChange = (value: RadioChangeEvent) => {
    if (value.target.value === 'CUSTOM') {
      setIsCustom(true);
      return;
    }

    let height = 0;
    let width = 0;

    switch (value.target.value) {
      case 'SMALL':
        width = 300;
        height = 300;
        break;
      case 'MEDIUM':
        width = 425;
        height = 300;

        break;
      case 'LARGE':
        width = 640;
        height = 480;
        break;
    }

    form.setFieldsValue({
      width: width,
      height: height,
    });

    setIsCustom(false);
    updateViewportSize();
  };

  const onChangeMarkers = () => {
    if (map) {
      replaceMarkers(map, form.getFieldValue('markers'));
    }
  };

  // update coordinates and radius after editing in map
  const onModifyEnd = useCallback(
    (evt: ModifyEvent) => {
      if (map && evt.features?.item(0)?.getGeometry()) {
        const marker = evt.features.item(0);
        const coord = (marker.getGeometry() as OlPoint).getCoordinates();
        const formMarkers = (form.getFieldValue('markers') as any[]).map((m) => {
          if (m.uuid === marker.get('uuid')) {
            return { ...m, coord };
          }
          return m;
        });
        form.setFieldValue('markers', formMarkers);
      }
    },
    [map, form]
  );

  // add/remove map interaction
  useEffect(() => {
    if (map && isOpen) {
      const select = getMarkersLayer(map).get('selectInteraction') as OlInteractionSelect;
      const modify = new OlInteractionModify({
        features: select.getFeatures(),
        hitDetection: true,
      });
      modify.on('modifyend', (e) => onModifyEnd(e));
      map.addInteraction(modify);

      return () => {
        map.removeInteraction(modify);
      };
    }
  }, [map, isOpen, onModifyEnd]);

  // reset form
  useEffect(() => {
    if (map && !isOpen && form) {
      resetForm();
    }
  }, [map, isOpen, form]);

  const updateViewportSize = (viewportElement = viewport) => {
    if (viewportElement) {
      viewportElement.render(
        <EmbedViewport width={form.getFieldValue('width') || 300} height={form.getFieldValue('height') || 300} />
      );
    }
  };

  // add/remove embed viewport
  useEffect(() => {
    if (map && isOpen) {
      const element = document.createElement('div');
      const viewportControl = new OlControl({
        element,
      });
      const root = createRoot(element);
      setViewport(root);
      updateViewportSize(root);
      map.addControl(viewportControl);
      return () => {
        map.removeControl(viewportControl);
      };
    }
  }, [map, isOpen]);

  return (
    <Spinner spinning={isLoading || fetchingIsLoading || updateIsLoading || previewIsLoading}>
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Input
          name="name"
          label={intl.formatMessage({
            id: 'embedded.name',
          })}
          validations={['required']}
        />
        <IconWrapper>
          <div className="required-symbol">*</div>
          <Label label={intl.formatMessage({ id: 'embedded.domains' })} />
          <Tooltip hack title={intl.formatMessage({ id: 'embedded.domain_tooltip' })}>
            <Icon className="icon" faBase="far" icon="circle-info" />
          </Tooltip>
        </IconWrapper>
        <Input name="domain" validations={['required']} />
        <RadioGroup
          name="sizeType"
          direction="vertical"
          initialValue="SMALL"
          onChange={onSizeChange}
          label={intl.formatMessage({ id: 'embedded.size' })}
        >
          <Radio value="SMALL" label={intl.formatMessage({ id: 'embedded.small' })} />
          <Radio value="MEDIUM" label={intl.formatMessage({ id: 'embedded.medium' })} />
          <Radio value="LARGE" label={intl.formatMessage({ id: 'embedded.large' })} />
          <Radio value="CUSTOM" label={intl.formatMessage({ id: 'embedded.custom' })} />
        </RadioGroup>
        <Row gutter={16}>
          <Col span={12}>
            <InputNumber
              name="width"
              label={intl.formatMessage({
                id: 'embedded.width',
              })}
              initialValue={300}
              disabled={!isCustom}
              formatter={(value) => (value ? `${value}px` : '')}
              parser={(value) => value!.replace('px', '')}
              onBlur={() => updateViewportSize()}
            />
          </Col>
          <Col span={12}>
            <InputNumber
              name="height"
              label={intl.formatMessage({
                id: 'embedded.height',
              })}
              initialValue={300}
              disabled={!isCustom}
              formatter={(value) => (value ? `${value}px` : '')}
              parser={(value) => value!.replace('px', '')}
              onBlur={() => updateViewportSize()}
            />
          </Col>
        </Row>

        <Form.List name="markers">
          {(fields, { add, remove }) => (
            <>
              <AddMarkerButtonWrapper>
                <Row>
                  <Col span={16}>
                    <Form.Item>
                      <Button
                        type="primary"
                        onClick={() => {
                          add({
                            uuid: uuidv4(),
                            coord: map?.getView().getCenter(),
                            color: markers?.length > 0 ? markers[markers.length - 1].color : undefined,
                          });
                          onChangeMarkers();
                        }}
                        label={intl.formatMessage({ id: 'embedded.add_token' })}
                        className="mb-2 button"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </AddMarkerButtonWrapper>

              {!!markers?.length && <EmbedMarkers fields={fields} remove={remove} onChangeMarkers={onChangeMarkers} />}
            </>
          )}
        </Form.List>

        {nonIncludableGeoproducts.length > 0 && (
          <LayersNotIncludedLabel label={intl.formatMessage({ id: 'embedded.some_layers_not_included' })} />
        )}
        <ButtonListFull className="my-2">
          <Button onClick={onPreview} label={intl.formatMessage({ id: 'embedded.preview' })} />
        </ButtonListFull>
        <ButtonListFull className="my-2">
          <Button htmlType="submit" type="primary" label={intl.formatMessage({ id: 'general.save' })} />
          {!!id && (
            <Button
              type="primary"
              label={intl.formatMessage({ id: 'general.save_as_new' })}
              onClick={onCreateAdditionalNew}
            />
          )}
        </ButtonListFull>
        <TextAreaWrapper disableCopyIcon={!iframe}>
          <TextArea className="text-area" disabled name="iframe" />
          <Icon className="copy-icon" icon="copy" faBase="fa-light" onClick={copyIframe} />
        </TextAreaWrapper>
      </Form>
    </Spinner>
  );
};
