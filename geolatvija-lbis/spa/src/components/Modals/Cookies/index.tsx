import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal, Dropdown, Icon, Label, CheckboxGroup, Checkbox } from 'ui';
import { Form, Space, Table } from 'antd';
import { useIntl } from 'react-intl';
import { RightSideHeader } from '../../../components/DefaultLayout/DefaultHeader/styles';
import { ThemeContext } from '../../../contexts/ThemeContext';
import {
  AccessibilityOptions,
  AgreeText,
  ButtonRow,
  DetailedInformation,
  DetailedInformationTableContainer,
  InformationText,
  MainBlock,
  PrivacyButton,
} from './styles';
import { cookieTypes } from '../../../config/config';
import Cookies from 'js-cookie';
import { useNotificationHeader } from '../../../contexts/NotificationHeaderContext';
import { AccessibilityMenu } from '../../../components/AccessibilityMenu/AccessibilityMenu';
import useQueryApiClient from '../../../utils/useQueryApiClient';
import { useLocation } from 'react-router-dom';

const ModalCookies = () => {
  const [visible, setVisible] = useState(false);
  const [_, setLogo] = useState('/geo_logo.svg');
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleCheckbox, setIsVisibleCheckbox] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(true);
  const location = useLocation();

  const [form] = Form.useForm();

  const intl = useIntl();
  const { theme } = useContext(ThemeContext);
  const { setCookiesAccepted } = useNotificationHeader();

  const { refetch } = useQueryApiClient({
    request: {
      url: `api/v1/plugins/google/1`,
      method: 'GET',
    },
    onSuccess: (response) => {
      if (Cookies.get('cookie') != null && Cookies.get('cookie') != '_ga_rejected') {
        const script = response.script;
        const regex = /"(.+?)"/g;
        const found = script.match(regex);
        var scriptElement1 = document.createElement('script');
        scriptElement1.async = true;
        scriptElement1.src = found[0].replace(new RegExp('"', 'g'), '');
        document.head.appendChild(scriptElement1);

        const regex2 = /<script>([\s\S]*?)<\/script>/g;
        let found2 = script.match(regex2);
        found2 = found2[0].replace(new RegExp('<script>', 'g'), '').replace(new RegExp('</script>', 'g'), '');

        var scriptElement2 = document.createElement('script');
        scriptElement2.innerHTML = found2;
        document.head.appendChild(scriptElement2);
      }
    },
  });

  const columns = [
    {
      title: intl.formatMessage({ id: 'cookies.table_title' }),
      dataIndex: 'cookie',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'cookies.table_group' }),
      dataIndex: 'group',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'cookies.table_description' }),
      dataIndex: 'description',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'cookies.table_deadline' }),
      dataIndex: 'deadline',
      render: (value: string) => value,
    },
  ];

  useEffect(() => {
    const getLogoPath = () => {
      if (theme === 'black-on-yellow') {
        setLogo('/yellowLogo.png');
        return;
      }

      if (theme === 'white-on-black') {
        setLogo('/blackLogo.png');
        return;
      }

      setLogo('/geo_logo.svg');
    };

    getLogoPath();
  }, [theme]);

  const handleOpenChange = (open: boolean) => {
    setVisible(open);
  };

  const setCookies = (values?: any, choice?: string) => {
    setShowModal(false);
    if (!values?.answer?.includes('statisticCookies') && choice != 'accept_all') {
      Cookies.set('cookie', '_ga_rejected', { expires: 365 });
    } else {
      Cookies.set('cookie', 'accepted', { expires: 365 });
      refetch();
    }
    setCookiesAccepted(true);
  };

  const checkCookies = () => {
    if (location.pathname === '/predefined-page/cookies') {
      return true;
    }
    return Cookies.get('cookie') != null;
  };

  const DetailedInformationTable = () => {
    return (
      <DetailedInformationTableContainer>
        <Table bordered={true} columns={columns} dataSource={cookieTypes} pagination={false} />
      </DetailedInformationTableContainer>
    );
  };

  const CheckboxArea = () => {
    return (
      <div>
        <CheckboxGroup name="answer" direction="vertical">
          <Space size={20} direction="vertical" className="mb-4">
            <Checkbox label={intl.formatMessage({ id: 'cookies.statistic' })} value="statisticCookies" />
          </Space>
        </CheckboxGroup>
      </div>
    );
  };

  if (!checkCookies()) {
    return (
      <MainBlock>
        <Modal
          open={showModal}
          footer={null}
          title={intl.formatMessage({ id: 'cookies.title' })}
          closable={false}
          width={700}
          actions={
            <RightSideHeader>
              <Dropdown
                placement={'topRight'}
                open={visible}
                menu={() => <AccessibilityMenu setVisible={setVisible} />}
                trigger={['click']}
                onOpenChange={(open) => handleOpenChange(open)}
              >
                <AccessibilityOptions>
                  <Icon icon="glasses" />
                  <Label label={intl.formatMessage({ id: 'cookies.accessibility' })} />
                </AccessibilityOptions>
              </Dropdown>
            </RightSideHeader>
          }
        >
          <div className="ml-4 mr-4">
            <InformationText>
              <Label label={intl.formatMessage({ id: 'cookies.information_text' })} />
            </InformationText>
            <br />
            <AgreeText>
              <Label label={intl.formatMessage({ id: 'cookies.agree_text' })} />
            </AgreeText>
            <Form form={form} layout="vertical" onFinish={setCookies}>
              <span>{isVisibleCheckbox && CheckboxArea()}</span>
              <ButtonRow>
                {!isVisibleCheckbox && (
                  <Button
                    type="primary"
                    onClick={() => setCookies(undefined, 'accept_all')}
                    label={intl.formatMessage({
                      id: 'cookies.accept_all',
                    })}
                    htmlType="button"
                  />
                )}
                {isVisibleCheckbox && (
                  <Button
                    type="primary"
                    label={intl.formatMessage({
                      id: 'cookies.accept_chosen',
                    })}
                    htmlType="submit"
                  />
                )}
                <Button
                  type="primary"
                  onClick={setCookies}
                  label={intl.formatMessage({
                    id: 'cookies.deny',
                  })}
                />
                {!isVisibleCheckbox && (
                  <Button
                    onClick={() => setIsVisibleCheckbox(true)}
                    label={intl.formatMessage({
                      id: 'cookies.customize',
                    })}
                  />
                )}
              </ButtonRow>
            </Form>
            <div className="mb-1">
              <PrivacyButton href="/predefined-page/cookies">
                {intl.formatMessage({ id: 'privacy.politic' })}
              </PrivacyButton>
            </div>
            <div>
              <span onClick={() => setIsVisible(!isVisible)}>
                <DetailedInformation>
                  <Label clickable label={intl.formatMessage({ id: 'cookies.detailed_information' })} />
                  {isVisible ? <Icon icon="angle-up" faBase="far" /> : <Icon icon="angle-down" faBase="far" />}
                </DetailedInformation>
              </span>
              <span>{isVisible && DetailedInformationTable()}</span>
            </div>
          </div>
        </Modal>
      </MainBlock>
    );
  } else {
    return null;
  }
};
export default ModalCookies;
