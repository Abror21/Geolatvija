import React, {useState} from 'react';
import DefaultLayout from 'components/DefaultLayout';
import {Button, Table, TabPane, Tabs} from 'ui';
import {pages} from 'constants/pages';
import {StyledPage} from 'styles/layout/table';
import {useIntl} from "react-intl";
import {Form} from "antd";
import CaptchaPluginPage from "./CaptchaPluginPage";
import GoogleAnalyticsPluginPage from "./GoogleAnalyticsPluginPage";

const PluginsPage = () => {
  const intl = useIntl();
  const [activeTab, setActiveTab] = useState<string>('CaptchaPlugin');
  const [form] = Form.useForm();

  const onTabChange = (activeKey: string) => {
    form.resetFields();
    setActiveTab(activeKey);
  };

  return (
    <DefaultLayout.PageLayout>
      <DefaultLayout.PageContent>
        <StyledPage>
          <DefaultLayout.PageHeader
            title={intl.formatMessage({id: pages.plugins.title})}
            breadcrumb={[
              {
                path: '/',
                name: intl.formatMessage({id: 'general.administration'}),
              },
            ]}
          />
          <Tabs type="card" onChange={onTabChange} activeKey={activeTab}>
            <TabPane
              tab={intl.formatMessage({
                id: 'plugins.captcha',
              })}
              key="CaptchaPlugin"
            >
              <CaptchaPluginPage/>
            </TabPane>
            <TabPane
              tab={intl.formatMessage({
                id: 'plugins.google_analytics',
              })}
              key="google_analytics"
            >
              <GoogleAnalyticsPluginPage/>
            </TabPane>
          </Tabs>
        </StyledPage>
      </DefaultLayout.PageContent>
    </DefaultLayout.PageLayout>
  );
};

export default PluginsPage;
