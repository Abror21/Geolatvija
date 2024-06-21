import React from 'react';
import DefaultLayout from '../../../components/DefaultLayout';
import { pages } from '../../../constants/pages';
import { StyledPage } from '../../../components/DefaultLayout/style';
import useQueryApiClient from '../../../utils/useQueryApiClient';
import { Link, useParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import truncateWithEllipsis from '../../../utils/truncateWithEllipsis';
import { Button, Spinner } from '../../../ui';
import dayjs from 'dayjs';
import { Card } from '../../../ui/card';
import { StyledProposalEditContainer } from './style';
import { List } from 'antd';
import parse from 'html-react-parser';

const ProposalEditPage = () => {
  const { id } = useParams();
  const intl = useIntl();

  const { data: discussion, isLoading } = useQueryApiClient({
    request: {
      url: `api/v1/tapis/get-discussion-answer/${id}`,
      disableOnMount: !id,
    },
  });

  return (
    <DefaultLayout.PageLayout>
      <DefaultLayout.PageContent>
        <Spinner spinning={isLoading}>
          <StyledPage>
            <DefaultLayout.PageHeader
              title={discussion?.document_name}
              breadcrumb={[
                {
                  path: '/',
                  name: intl.formatMessage({ id: 'general.start' }),
                },
                {
                  path: pages.proposals.url,
                  name: intl.formatMessage({ id: 'proposals.my' }),
                },
              ]}
              trunc={75}
              rightSideOptions={[<Button label={intl.formatMessage({ id: 'return.to_map' })} href="/main" />]}
            />
          </StyledPage>
          <StyledProposalEditContainer>
            <Card>
              <div className="content-wrapper">
                <div className="text-wrapper">
                  <FormattedMessage id="proposals.submit_date" />:
                  <span className="text"> {dayjs(discussion?.created_at).format('DD.MM.YYYY HH:mm')}</span>
                </div>
                <div className="text-wrapper">
                  <div>
                    <FormattedMessage id="proposals.my_proposal" />:
                  </div>
                  <div>
                    <span className="text">{discussion?.comment}</span>
                  </div>
                </div>
              </div>
            </Card>

            <List
              itemLayout="horizontal"
              dataSource={discussion.data}
              bordered={false}
              locale={{ emptyText: 'Vēl nav sagatavota atbilde' }}
              renderItem={(item: any) => (
                <List.Item>
                  <Card>
                    <div className="content-wrapper">
                      <div className="text-wrapper">
                        <FormattedMessage id="proposal.date" />:
                        <span className="text"> {dayjs(item?.sent_time_to_latvija_lv).format('DD.MM.YYYY')}</span>
                      </div>

                      <div className="text-wrapper">
                        <FormattedMessage id="proposals.answer_status" />:
                        <span className="text"> {item?.decision}</span>
                      </div>

                      <div className="text-wrapper">
                        <div>
                          <FormattedMessage id="proposals.answer" />:
                        </div>
                        <div>
                          <span className="text">
                            {item?.decision_justification.split('\r\n').map((e: string) => (
                              <div>{e}</div>
                            ))}
                          </span>
                        </div>
                      </div>
                      {!!item?.file_attachment_url && (
                        <div className="text-wrapper">
                          <FormattedMessage id="proposals.file" />:<span className="text"></span>
                          <a target="_blank" style={{ fontWeight: 'normal' }} href={item?.file_attachment_url}>
                            {' '}
                            {item?.file_attachment_url}
                          </a>
                        </div>
                      )}
                      <div className="text-wrapper">
                        <FormattedMessage id="proposals.contact_information" />:
                        <span className="text"> {item?.contact_info}</span>
                      </div>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          </StyledProposalEditContainer>
        </Spinner>
      </DefaultLayout.PageContent>
    </DefaultLayout.PageLayout>
  );
};

export default ProposalEditPage;
