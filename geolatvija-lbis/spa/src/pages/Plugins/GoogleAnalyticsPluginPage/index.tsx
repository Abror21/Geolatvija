import React, {useState} from "react";
import {Form} from "antd";
import {Button, Spinner, TextArea} from "../../../ui";
import {useIntl} from "react-intl";
import useQueryApiClient from "../../../utils/useQueryApiClient";
import useJwt from "../../../utils/useJwt";

const GoogleAnalyticsPlugin = () => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [_, setRecaptchaValue] = useState<string | null>(null);
  const {isTokenActive} = useJwt();

  const {} = useQueryApiClient({
    request: {
      url: `api/v1/plugins/google/1`,
      data: [],
      method: 'GET',
      disableOnMount: !isTokenActive(),
    },
    onSuccess: (response) => {
      form.setFieldValue('script', response?.script);
    }
  });

  const {appendData, isLoading} = useQueryApiClient({
    request: {
      url: `api/v1/plugins/google/1`,
      method: 'PATCH',
    },
  });


  const handleRecaptchaChange = (value: string | null) => {
    setRecaptchaValue(value);
  };
  return (
    <div>
      <div>
        <Spinner spinning={isLoading}>
          <Form form={form} onFinish={appendData}>
            <TextArea label={intl.formatMessage({id: 'plugins.google_script'})}
                      name="script"
                      value="script"/>
          </Form>
        </Spinner>
      </div>
      <Button label={intl.formatMessage({id: 'general.submit'})} type="primary" onClick={() => form.submit()}/>
    </div>
  );
};
export default GoogleAnalyticsPlugin;
