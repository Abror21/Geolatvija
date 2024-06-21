import React, { useState } from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { Button, Spinner, Table, TabPane, Tabs } from 'ui';
import { Form } from 'antd';
import { pages } from 'constants/pages';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import ClassifierDetails from './Components/ClassifierDetails';
import useQueryApiClient from 'utils/useQueryApiClient';
import { ButtonList } from '../../../styles/layout/tab';
import ClassifierValueModal from './Components/ClassifierValueModal';
import DeleteModal from '../../../components/Modals/DeleteModal';
import { StyledPage } from 'styles/layout/form';

interface ClassifierValueProps {
  id: number;
  translation: string;
  valueCode: string;
}

const ClassifierEditPage = () => {
  const intl = useIntl();
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('classifierData');
  const [classifierCode, setClassifierCode] = useState<string>('classifierData');
  const [refresh, setRefresh] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [form] = Form.useForm();
  const { id } = useParams();
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [selectedId, setSelectedId] = useState<number>();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [enableWeights, setEnableWeights] = useState<boolean>(false);

  const { data, isLoading, refetch } = useQueryApiClient({
    request: {
      url: `api/v1/classifiers/${id}`,
      data: [],
      method: 'GET',
    },
    onSuccess: (response) => {
      form.setFieldsValue(response);
      setClassifierCode(response.uniqueCode);
      setEnableWeights(response?.enableWeights);
    },
  });

  const onTabChange = (activeKey: string) => {
    setActiveTab(activeKey);
  };

  const { appendData: appendDataDelete } = useQueryApiClient({
    request: {
      url: `api/v1/classifiers/${id}/values`,
      method: 'DELETE',
    },
    onSuccess: () => {
      setRefresh((old) => old + 1);
      setSelectedKeys([]);
    },
  });

  const columns = [
    {
      title: intl.formatMessage({
        id: 'classifier.value_code',
      }),
      dataIndex: 'valueCode',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({
        id: 'classifier.name',
      }),
      dataIndex: 'translation',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({
        id: 'general.actions',
      }),
      render: (record: ClassifierValueProps) => (
        <>
          <Button
            type="text"
            onClick={() => onEditClick(record)}
            label={intl.formatMessage({
              id: 'general.edit',
            })}
          />
        </>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'classifier.weight',
      }),
      dataIndex: 'weight',
      render: (value: string) => value,
    },
  ];

  const onEditClick = (record: ClassifierValueProps) => {
    setSelectedId(record.id);
    setShowModal(true);
  };

  return (
    <DefaultLayout.PageLayout>
      <DefaultLayout.PageContent>
        <Spinner spinning={isLoading || detailsLoading}>
          <StyledPage>
            <DefaultLayout.PageHeader
              breadcrumb={[
                {
                  path: '/',
                  name: intl.formatMessage({ id: 'general.administration' }),
                },
                {
                  name: intl.formatMessage({
                    id: pages.classifier.title,
                  }),
                  path: pages.classifier.url,
                },
              ]}
              title={data?.translation || ''}
              showBackIcon
            />
            <Tabs type="card" onChange={onTabChange} activeKey={activeTab}>
              <TabPane
                tab={intl.formatMessage({
                  id: 'classifier.classifier',
                })}
                key="classifierData"
              >
                <ClassifierDetails
                  setDetailsLoading={setDetailsLoading}
                  setEnableWeights={setEnableWeights}
                  form={form}
                  refetch={refetch}
                  setRefresh={setRefresh}
                />
              </TabPane>
              <TabPane
                tab={intl.formatMessage({
                  id: 'classifier.values',
                })}
                key="classifierValues"
              >
                <Table
                  url={`api/v1/classifiers/${id}/values`}
                  columns={columns}
                  reload={refresh}
                  enableSelectedRow
                  setSelectedKeys={setSelectedKeys}
                  defaultSort={enableWeights ? 'weight' : 'translation'}
                  defaultOrder="asc"
                  tableActions={
                    <ButtonList>
                      <Button
                        label={intl.formatMessage({ id: 'general.delete_chosen' })}
                        onClick={() => setShowDeleteModal(true)}
                        disabled={!selectedKeys.length}
                      />
                      <Button
                        type="primary"
                        label={intl.formatMessage({ id: 'general.add_new' })}
                        onClick={() => setShowModal(true)}
                      />
                      <DeleteModal
                        setRefresh={setRefresh}
                        url="api/v1/classifiers/${id}/values"
                        params={{ ids: selectedKeys }}
                        setShowModal={setShowDeleteModal}
                        showModal={showDeleteModal}
                      />
                    </ButtonList>
                  }
                />
                <ClassifierValueModal
                  weightsEnabled={enableWeights}
                  showModal={showModal}
                  setShowModal={setShowModal}
                  setRefresh={setRefresh}
                  selectedId={selectedId}
                  setSelectedId={setSelectedId}
                />
              </TabPane>
            </Tabs>
          </StyledPage>
        </Spinner>
      </DefaultLayout.PageContent>
    </DefaultLayout.PageLayout>
  );
};

export default ClassifierEditPage;
