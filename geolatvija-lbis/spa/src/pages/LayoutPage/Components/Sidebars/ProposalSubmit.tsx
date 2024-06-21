import { useIntl } from 'react-intl';
import { Form, Space } from 'antd';
import { DrawerButtonList, StyledSpace } from '../../../../styles/layout/form';
import {
  Alert,
  Button,
  Checkbox,
  CheckboxGroup,
  Icon,
  Input,
  Label,
  Radio,
  RadioGroup,
  TextArea,
  Tooltip,
} from '../../../../ui';
import { InputWrapper, Section } from './styles';
import React, { useContext, useState, useEffect, useCallback } from 'react';
import { ProposalSubmitContext } from '../../../../contexts/ProposalSubmitContext';
import { RadioChangeEvent } from 'antd/es/radio/interface';
import MapContext from 'contexts/MapContext';
import OlLayerVector from 'ol/layer/Vector';
import OlSourceVector from 'ol/source/Vector';
import OlCollection from 'ol/Collection';
import OlStyleStyle from 'ol/style/Style';
import OlStyleStroke from 'ol/style/Stroke';
import OlStyleFill from 'ol/style/Fill';
import OlStyleCircle from 'ol/style/Circle';
import OlInteractionDraw, { DrawEvent } from 'ol/interaction/Draw';
import OlFeature from 'ol/Feature';
import OlGeometry from 'ol/geom/Geometry';
import { getGMLStringFromGeometry, getIconStyle } from 'utils/mapUtils';
import useQueryApiClient from '../../../../utils/useQueryApiClient';
import { useUserState } from '../../../../contexts/UserContext';
import toastMessage from '../../../../utils/toastMessage';

interface ProposalSubmitPropsType {
  duration: string;
}

const fillColor = 'rgba(101, 219, 147, 0.5)';
const strokeColor = 'rgba(28, 97, 55, 0.7)';
const fillColorAdded = 'rgba(101, 219, 147, 0.7)';
const strokeColorAdded = 'rgba(28, 97, 55, 0.9)';

const ProposalSubmit = ({ duration }: ProposalSubmitPropsType) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const {
    toggleHandler,
    isOpen,
    tapisId,
    address,
    setAddress,
    cadastre,
    setCadastre,
    geom,
    setGeom,
    placeInputType,
    setPlaceInputType,
  } = useContext(ProposalSubmitContext);
  const map = useContext(MapContext);
  const user = useUserState();
  const activeRole = user.roles.find((e) => e.id === user.selectedRole);
  const [drawLayer, setDrawLayer] = useState<OlLayerVector<OlSourceVector<OlGeometry>> | null>(null);
  const { appendData } = useQueryApiClient({
    request: {
      url: `api/v1/tapis/proposal-submit`,
      method: 'POST',
    },
    onSuccess: () => {
      toastMessage.success(intl.formatMessage({ id: 'proposal_success' }));
      form.resetFields();
      toggleHandler();
      resetMapSearch();
    },
  });

  const onFormCancel = () => {
    toggleHandler();
  };

  const onFinish = (values: any) => {
    if (values.placeInputType !== 'place' && !geom) {
      form.setFields([
        {
          name: 'placeInputType',
          errors: [intl.formatMessage({ id: 'validation.geom_required' })],
        },
      ]);
      return;
    }

    form.setFields([
      {
        name: 'placeInputType',
        errors: [],
      },
    ]);

    const dataForSubmit = {
      ...values,
      email: activeRole?.email,
      address,
      cadastre,
      geom: geom ? getGMLStringFromGeometry(geom) : undefined,
      tapisId,
    };
    appendData(dataForSubmit);
  };

  const resetMapSearch = () => {
    setAddress(undefined);
    setCadastre(undefined);
    setGeom(undefined);
  };

  const onChangePlaceInputType = (value: RadioChangeEvent) => {
    resetMapSearch();
    setPlaceInputType(value.target.value);
  };

  const onDrawEnd = useCallback(
    (evt: DrawEvent) => {
      if (map && evt.feature && evt.feature.getGeometry()) {
        setGeom(evt.feature.getGeometry() as OlGeometry);
      }
    },
    [map]
  );

  useEffect(() => {
    resetMapSearch();
  }, [isOpen]);

  // add drawing layer
  useEffect(() => {
    if (map) {
      const ml = new OlLayerVector({
        properties: {
          name: '_proposal_draw',
        },
        source: new OlSourceVector({
          features: new OlCollection<OlFeature<OlGeometry>>(),
        }),
        style: new OlStyleStyle({
          fill: new OlStyleFill({
            color: fillColorAdded,
          }),
          stroke: new OlStyleStroke({
            color: strokeColorAdded,
            width: 2,
          }),
          image: getIconStyle('comment', strokeColorAdded, ''),
        }),
        zIndex: 100,
      });
      map.addLayer(ml);
      setDrawLayer(ml);
      return () => {
        map.removeLayer(ml);
        setDrawLayer(null);
      };
    }
  }, [map]);

  // add/remove map interaction
  useEffect(() => {
    if (map && drawLayer) {
      if (!geom) {
        drawLayer.getSource()?.clear();
      }
      if (placeInputType !== 'search' && placeInputType !== 'place' && isOpen && !geom) {
        const di = new OlInteractionDraw({
          source: drawLayer.getSource() || undefined,
          type: placeInputType === 'polygon' ? 'Polygon' : 'Point',
          stopClick: true,
          style: new OlStyleStyle({
            fill: new OlStyleFill({
              color: fillColor,
            }),
            stroke: new OlStyleStroke({
              color: strokeColor,
              width: 2,
            }),
            image: new OlStyleCircle({
              radius: 5,
              stroke: new OlStyleStroke({
                color: strokeColor,
              }),
              fill: new OlStyleFill({
                color: fillColor,
              }),
            }),
          }),
        });
        di.on('drawend', (e) => onDrawEnd(e));
        map.addInteraction(di);
        return () => {
          map.removeInteraction(di);
        };
      }
    }
  }, [map, placeInputType, drawLayer, onDrawEnd, isOpen, geom]);

  const RemoveButton = () => (
    <p>
      <Button
        type="text"
        icon="trash"
        onClick={resetMapSearch}
        label={intl.formatMessage({ id: 'proposal.info_remove_geom' })}
      />
    </p>
  );

  const dynamicCheckbox = (
    <Checkbox
      label={intl.formatMessage(
        { id: 'proposal.send_to_email' },
        {
          email: <b>{activeRole?.email}</b>,
          account: (
            <Button
              type="link"
              onClick={() => window.open('/account', '_blank')}
              label={intl.formatMessage({ id: 'proposal.send_to_my_proposals_account' })}
            />
          ),
        }
      )}
      value="email"
    />
  );

  return (
    <>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Section>
          <StyledSpace direction="vertical" size={16}>
            <div>
              <Label subTitle bold label={intl.formatMessage({ id: 'proposal.my_proposal' })} />
              <TextArea rows={5} name="proposal" validations={'required'} />
            </div>
          </StyledSpace>
        </Section>

        <Section>
          <Label subTitle bold label={intl.formatMessage({ id: 'proposal.proposal_place' })} />
          <Space size={16} direction="vertical">
            <RadioGroup
              name="placeInputType"
              direction="vertical"
              initialValue={placeInputType}
              size="middle"
              onChange={onChangePlaceInputType}
            >
              <Space size={10} direction="vertical">
                <Radio value="place" label={intl.formatMessage({ id: 'proposal.map_place' })} />
                <Radio value="search" label={intl.formatMessage({ id: 'proposal.map_search' })} />
                <Radio value="point" label={intl.formatMessage({ id: 'proposal.map_search_point' })} />
                <Radio value="polygon" label={intl.formatMessage({ id: 'proposal.map_search_area' })} />
              </Space>
            </RadioGroup>
            {placeInputType !== 'place' && (
              <Alert
                type="info"
                message={
                  <Space size={12} align="start">
                    <Icon faBase="fa-regular" icon="circle-info" />
                    <span>
                      {placeInputType === 'search' ? (
                        !address && !cadastre && !geom ? (
                          intl.formatMessage({ id: 'proposal.info_search' })
                        ) : (
                          <>
                            {!!address && intl.formatMessage({ id: 'proposal.info_searched_address' }, { address })}
                            {!!cadastre && intl.formatMessage({ id: 'proposal.info_searched_cadastre' }, { cadastre })}
                            <RemoveButton />
                          </>
                        )
                      ) : placeInputType === 'point' ? (
                        !geom ? (
                          intl.formatMessage({ id: 'proposal.info_point' })
                        ) : (
                          <>
                            {intl.formatMessage({ id: 'proposal.info_point_selected' })}
                            <RemoveButton />
                          </>
                        )
                      ) : placeInputType === 'polygon' ? (
                        !geom ? (
                          intl.formatMessage({ id: 'proposal.info_polygon' })
                        ) : (
                          <>
                            {intl.formatMessage({ id: 'proposal.info_polygon_selected' })}
                            <RemoveButton />
                          </>
                        )
                      ) : null}
                    </span>
                  </Space>
                }
              />
            )}
          </Space>
        </Section>

        <Space direction="vertical" size={16}>
          <div>
            <Label subTitle extraBold label={intl.formatMessage({ id: 'proposal.answer_reply' })} />
            <CheckboxGroup
              name="answer"
              direction="vertical"
              initialValue={activeRole?.emailVerified ? ['test', 'email'] : ['test']}
              disabled
            >
              <Space size={10} direction="vertical">
                <>
                  <Checkbox
                    label={intl.formatMessage(
                      { id: 'proposal.send_to_my_proposals' },
                      {
                        place: (
                          <Button
                            type="link"
                            onClick={() => window.open('/proposals', '_blank')}
                            label={intl.formatMessage({ id: 'proposal.send_to_my_proposals_place' })}
                          />
                        ),
                      }
                    )}
                    value="test"
                  />
                  {!activeRole?.emailVerified ? (
                    <Tooltip hack title={intl.formatMessage({ id: 'proposals.email_not_verified' })}>
                      {dynamicCheckbox}
                    </Tooltip>
                  ) : (
                    dynamicCheckbox
                  )}
                </>
              </Space>
            </CheckboxGroup>
          </div>

          <div>
            <div>
              <InputWrapper>
                <Label label={intl.formatMessage({ id: 'general.phone_number' })} />
                <Tooltip hack title={intl.formatMessage({ id: 'proposal.phone_tooltip' })}>
                  <Icon className="infoIcon" icon="circle-info" faBase="fa-regular" />
                </Tooltip>
              </InputWrapper>
              <Input name="phone" validations="phoneNumber" />
            </div>
          </div>

          <DrawerButtonList>
            <Button htmlType="submit" type="primary" label={intl.formatMessage({ id: 'proposal.submit' })} />
            <Button
              onClick={onFormCancel}
              type="text"
              className="primary"
              label={intl.formatMessage({ id: 'general.cancel' })}
            />
          </DrawerButtonList>
        </Space>
      </Form>
    </>
  );
};

export default ProposalSubmit;
