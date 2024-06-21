import React, { useState } from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { Button, Table } from 'ui';
import { pages } from 'constants/pages';
import { useIntl } from 'react-intl';
import { ButtonList, StyledPage } from '../../../styles/layout/table';
import InstitutionClassifierModal from './Components/InstitutionClassifierModal';
import useQueryApiClient from '../../../utils/useQueryApiClient';

const InstitutionClassifierListPage = () => {
  const [refresh, setRefresh] = useState<number>(0);
  const [selectedId, setSelectedId] = useState<number>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);

  const intl = useIntl();

  const { appendData: appendDataDelete } = useQueryApiClient({
    request: {
      url: `api/v1/institution-classifiers`,
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
        id: 'classifier.reg_nr',
      }),
      dataIndex: 'regNr',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({
        id: 'classifier.name',
      }),
      dataIndex: 'name',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({
        id: 'classifier.institution_type',
      }),
      dataIndex: 'institutionTypeClassifier',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({
        id: 'general.actions',
      }),
      dataIndex: 'id',
      render: (value: number) => (
        <>
          <Button
            type="text"
            onClick={() => onEditClick(value)}
            label={intl.formatMessage({
              id: 'general.edit',
            })}
          />
        </>
      ),
    },
  ];

  const onEditClick = (value: number) => {
    setSelectedId(value);
    setShowModal(true);
  };

  return (
    <DefaultLayout.PageLayout>
      <DefaultLayout.PageContent>
        <StyledPage>
          <DefaultLayout.PageHeader
            breadcrumb={[
              {
                path: '/',
                name: intl.formatMessage({ id: 'general.administration' }),
              },
            ]}
            title={intl.formatMessage({ id: pages.institutionClassifiers.title })}
          />
          <div className="theme-container">
            <Table
              url={`api/v1/institution-classifiers`}
              columns={columns}
              reload={refresh}
              defaultOrder="asc"
              defaultSort="name"
              enableSelectedRow
              setSelectedKeys={setSelectedKeys}
              tableActions={
                <ButtonList>
                  <Button
                    label={intl.formatMessage({ id: 'general.delete_chosen' })}
                    onClick={() => appendDataDelete({ ids: selectedKeys })}
                    disabled={!selectedKeys.length}
                  />
                  <Button
                    type="primary"
                    label={intl.formatMessage({ id: 'general.add_new' })}
                    onClick={() => setShowModal(true)}
                  />
                </ButtonList>
              }
            />
            <InstitutionClassifierModal
              showModal={showModal}
              setShowModal={setShowModal}
              setRefresh={setRefresh}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          </div>
        </StyledPage>
      </DefaultLayout.PageContent>
    </DefaultLayout.PageLayout>
  );
};

export default InstitutionClassifierListPage;
