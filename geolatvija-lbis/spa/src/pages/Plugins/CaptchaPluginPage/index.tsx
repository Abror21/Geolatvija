import React from "react";
import {Button, Spinner, Switch} from "../../../ui";
import {useIntl} from "react-intl";
import useQueryApiClient from "../../../utils/useQueryApiClient";
import {Form} from "antd";

const CaptchaPlugin = () => {
  const [form] = Form.useForm();

  const {} = useQueryApiClient({
    request: {
      url: `api/v1/captcha/show`,
      method: 'GET',
    },
    onSuccess: (response) => {
      form.setFieldValue('geoproduct_captcha', parseInt(response.geoproduct.value));
    }
  });

  const {appendData, isLoading} = useQueryApiClient({
    request: {
      url: `api/v1/system-settings/captcha`,
      method: 'PATCH',
    },
  });

  const intl = useIntl();

  return (
    <div>
      <Spinner spinning={isLoading}>
        <Form form={form} onFinish={appendData}>
          <div>
            <h2>{intl.formatMessage({id: 'plugins.georpoduct'})} </h2>
            <Switch name="geoproduct_captcha" label={intl.formatMessage({id: 'plugins.captcha_activated_geoproduct'})}/>
          </div>
          <Button label={intl.formatMessage({id: 'general.submit'})} type="primary" onClick={() => form.submit()}/>
        </Form>
      </Spinner>
    </div>
  );
};
export default CaptchaPlugin;
