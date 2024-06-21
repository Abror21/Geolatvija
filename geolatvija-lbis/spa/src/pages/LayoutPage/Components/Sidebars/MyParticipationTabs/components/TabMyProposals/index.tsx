import { StyledTabMyProposals } from './style';
import { Button, Table, Tooltip } from 'ui';
import { useIntl } from 'react-intl';
import dayjs from 'dayjs';
import { ListProposalTextWrapper } from 'pages/Proposals/ProposalListPage/style';
import { Badge } from 'antd';
import React from 'react';

interface TabMyProposalsProps {
  setProposalItem: any;
}

const TabMyProposals = ({ setProposalItem }: TabMyProposalsProps) => {
  const intl = useIntl();

  const columns = [
    {
      title: intl.formatMessage({ id: 'proposals.submit_date' }),
      dataIndex: 'created_at',
      render: (value: string, values: any) => (
        <div className="badge_row">
          {values.has_unseen && <Badge className="table-badge" dot={values.has_unseen} size="default" />}
          {dayjs(value).format('DD.MM.YYYY')}
        </div>
      ),
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
      title: intl.formatMessage({ id: 'proposals.answer_status' }),
      dataIndex: 'decision',
      render: (value: string) => <ListProposalTextWrapper>{value}</ListProposalTextWrapper>,
    },
    {
      title: '',
      dataIndex: '',
      render: (value: string) => <Button className="ant-btn-link" label={intl.formatMessage({ id: 'general.see' })} />,
    },
  ];

  const rowClassName = (record: any) => (record.has_unseen ? 'has_unseen_row' : '');

  return (
    <StyledTabMyProposals>
      <Table
        className="proposals-table"
        url="/api/v1/tapis/my-discussions"
        columns={columns}
        rowKey="id"
        onRow={(record: any) => ({ onClick: () => setProposalItem(record.id) })}
        rowClassName={rowClassName}
      />
    </StyledTabMyProposals>
  );
};

export default TabMyProposals;
