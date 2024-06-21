import React from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { Table, Tooltip } from 'ui';
import { useIntl } from 'react-intl';
import { StyledPage } from 'styles/layout/table';
import { pages } from 'constants/pages';
import dayjs from 'dayjs';
import { ListProposalTextWrapper } from './style';

const ProposalListPage = () => {
  const intl = useIntl();

  const columns = [
    {
      title: intl.formatMessage({ id: 'proposals.submit_date' }),
      dataIndex: 'created_at',
      render: (value: string) => dayjs(value).format('DD.MM.YYYY'),
      width: 120,
    },
    {
      title: intl.formatMessage({ id: 'proposals.plan_name' }),
      dataIndex: 'document_name',
      render: (value: string) => (
        <Tooltip title={value}>
          <ListProposalTextWrapper>{value}</ListProposalTextWrapper>
        </Tooltip>
      ),
    },
    {
      title: intl.formatMessage({ id: 'proposals.my_proposal' }),
      dataIndex: 'comment',
      render: (value: string) => <ListProposalTextWrapper>{value}</ListProposalTextWrapper>,
    },
    {
      title: intl.formatMessage({ id: 'proposals.answer' }),
      dataIndex: 'decision_justification',
      render: (value: string) => <ListProposalTextWrapper>{value}</ListProposalTextWrapper>,
    },
    {
      title: intl.formatMessage({ id: 'proposals.answer_status' }),
      dataIndex: 'decision',
      render: (value: string) => value,
    },
  ];

  return (
    <DefaultLayout.PageLayout>
      <DefaultLayout.PageContent>
        <StyledPage>
          <DefaultLayout.PageHeader
            title={intl.formatMessage({ id: pages.proposals.title })}
            breadcrumb={[
              {
                path: '/',
                name: intl.formatMessage({ id: 'general.start' }),
              },
            ]}
          />
          <div className="theme-container">
            <Table
              url="/api/v1/tapis/my-discussions"
              columns={columns}
              rowKey="id"
              linkProps={{ url: pages.proposals.edit.url }}
            />
          </div>
        </StyledPage>
      </DefaultLayout.PageContent>
    </DefaultLayout.PageLayout>
  );
};

export default ProposalListPage;
