import React, { useContext, useState, useEffect } from 'react';
import { Button, Label, SideBySide, InputNumber, Input, Tooltip } from '../../../../ui';
import { useIntl } from 'react-intl';
import {
  StyledApplicationNameWrapper,
  StyledApplyTextWrapper,
  StyledNotificationStep,
  StyledTooltipWrapper,
} from './styles';
import Slider from '../../../../ui/slider/Slider';
import { Form } from 'antd';
import { DrawerButtonList, StyledDrawerForm } from '../../../../styles/layout/form';
import { NotificationContext } from '../../../../contexts/NotificationContext';
import { useLocation } from 'react-router-dom';
import useQueryApiClient from '../../../../utils/useQueryApiClient';
import { useUserState } from '../../../../contexts/UserContext';
import useJwt from '../../../../utils/useJwt';
import toastMessage from '../../../../utils/toastMessage';
import useMapDrawing from 'utils/useMapDrawing';

const MIN_RADIUS = 0.2;
const MAX_RADIUS = 9.0;
const INITIAL_RADIUS = 1.0;

type ApplyingForNotificationProps = {
  onClose: Function;
};

const ApplyingForNotification = ({ onClose }: ApplyingForNotificationProps) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const {
    coords,
    setCoords,
    address: mapAddress,
    setAddress: setMapAddress,
    setInitialPointIsSet,
    initialPointIsSet,
  } = useContext(NotificationContext);
  const intl = useIntl();
  const user = useUserState();
  const location = useLocation();
  const { isTokenActive } = useJwt();
  const activeRole = user.roles.find((e) => e.id === user.selectedRole);

  const queryString = window.location.search;
  const searchParams = new URLSearchParams(queryString);

  const id = searchParams.get('notification');
  const lat = searchParams.get('lat');
  const long = searchParams.get('long');

  const [form] = Form.useForm();


  const { updateMapCircle } = useMapDrawing({
    coords,
    setCoords,
    form,
    setInitialPointIsSet,
    initialPointIsSet,
  });

  useEffect(() => {
    if (!!lat && !!long) {
      setIsEdit(false);
    } else {
      setIsEdit(location.search != '?notification=open');
    }
  }, [location.search]);

  useEffect(() => {
    if (!!lat && !!long) {
      setCoords([parseFloat(long), parseFloat(lat)]);
    }
  }, [lat, long]);

  const { isLoading } = useQueryApiClient({
    request: {
      url: `api/v1/user-notifications/${id}`,
      disableOnMount: !id || id == 'open',
      data: [],
      method: 'GET',
    },
    onSuccess: (response) => {
      form.setFieldValue('radius', response.radius);
      form.setFieldValue(
        'notificationGroups',
        response.notificationGroups?.map((g: any) => g.id)
      );
      form.setFieldValue('name', response.name);
      setMapAddress(response.address);
      if (response.coordLKSLat && response.coordLKSLong) {
        setCoords([response.coordLKSLong, response.coordLKSLat]);
      } else {
        setCoords(undefined);
      }
    },
  });

  const { data: notificationGroups, isLoading: notificationGroupsIsLoading } = useQueryApiClient({
    request: {
      url: `api/v1/notification-groups/`,
      disableOnMount: !isTokenActive(),
    },
  });

  const { appendData } = useQueryApiClient({
    request: {
      url: isEdit ? `api/v1/user-notifications/${id}` : `api/v1/user-notifications`,
      method: isEdit ? 'PATCH' : 'POST',
    },
    onSuccess: () => {
      {
        user.refetch();
      }
    },
  });

  const onFinishFailed = () => {
    toastMessage.error(intl.formatMessage({ id: 'notification.validation_required' }));
  };

  const onFinish = (values: any) => {
    if (!activeRole?.emailVerified) return;

    //add address and coordinates for submit
    const dataForSubmit = {
      ...values,
      notificationGroups: notificationGroups.map((group: any) => group.id),
      address: mapAddress ?? null,
      coordLKSLong: coords ? coords[0] : null,
      coordLKSLat: coords ? coords[1] : null,
    };
    appendData(dataForSubmit);
    onClose();
    toastMessage.success(intl.formatMessage({ id: 'notification.success' }));
  };

  return (
    <>
      <StyledDrawerForm form={form} onFinish={onFinish} layout="vertical" onFinishFailed={onFinishFailed}>
        <StyledNotificationStep>
          <Label sub-title extraBold label={intl.formatMessage({ id: 'notification.specify_on_map' })} />
          <Label label={intl.formatMessage({ id: 'notification.step_one_description' })} />
          <div className="img-wrapper">
            <img alt="select on map example" src="/select_on_map_example.png" className="image" />
          </div>
        </StyledNotificationStep>

        <StyledNotificationStep>
          <Label sub-title extraBold label={intl.formatMessage({ id: 'notification.specify_distance' })} />
        </StyledNotificationStep>

        <SideBySide
          leftSpan={16}
          rightSpan={8}
          left={<Slider name="radius" min={MIN_RADIUS} max={MAX_RADIUS} step={0.1} onChange={updateMapCircle} />}
          right={
            <InputNumber
              name="radius"
              initialValue={INITIAL_RADIUS}
              min={MIN_RADIUS}
              max={MAX_RADIUS}
              onChange={updateMapCircle}
              formatter={(value) => `${value ? value + intl.formatMessage({ id: 'general.kilometers' }) : value}`}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'validation.field_required' }),
                },
              ]}
            />
          }
        />

        <StyledApplicationNameWrapper>
          <Input
            label={intl.formatMessage({ id: 'notification.application_name' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'validation.field_required' }),
              },
            ]}
            name="name"
            tooltip={intl.formatMessage({ id: 'notification.tooltip.application_name' })}
          />
        </StyledApplicationNameWrapper>

        <DrawerButtonList>
          {!activeRole?.emailVerified ? (
            <StyledTooltipWrapper>
              <Tooltip
                hack
                className="tooltip-inner-div"
                title={
                  <StyledApplyTextWrapper>
                    {intl.formatMessage({ id: 'notification.email_not_verified' })}
                  </StyledApplyTextWrapper>
                }
              >
                <Button
                  className="button"
                  htmlType="submit"
                  type="primary"
                  disabled={!activeRole?.emailVerified}
                  label={
                    isEdit
                      ? intl.formatMessage({ id: 'general.save_changes' })
                      : intl.formatMessage({ id: 'general.apply' })
                  }
                />
              </Tooltip>
            </StyledTooltipWrapper>
          ) : (
            <Button
              htmlType="submit"
              type="primary"
              label={
                isEdit
                  ? intl.formatMessage({ id: 'general.save_changes' })
                  : intl.formatMessage({ id: 'general.apply' })
              }
            />
          )}
          <Button
            onClick={onClose}
            type="text"
            className="primary"
            label={
              isEdit
                ? intl.formatMessage({ id: 'general.cancel_changes' })
                : intl.formatMessage({ id: 'general.cancel' })
            }
          />
        </DrawerButtonList>
      </StyledDrawerForm>
    </>
  );
};

export default ApplyingForNotification;
