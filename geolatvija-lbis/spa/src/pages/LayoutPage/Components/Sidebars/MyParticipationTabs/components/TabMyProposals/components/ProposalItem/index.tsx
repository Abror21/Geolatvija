import React, { useEffect, useRef } from 'react';
import { StyledProposalItem } from './style';
import { Button, Card, Icon, Label, Spinner } from '../../../../../../../../../ui';
import { FormattedMessage, useIntl } from 'react-intl';
import dayjs from 'dayjs';
import useQueryApiClient from '../../../../../../../../../utils/useQueryApiClient';
import { List } from 'antd';
import { StyledProposalEditContainer } from 'pages/Proposals/ProposalEditPage/style';
import { useUserDispatch, useUserState } from 'contexts/UserContext';

interface TabMyProposalItemProp {
  setProposalItem: any;
  id: number;
}

const ProposalItem = ({ setProposalItem, id }: TabMyProposalItemProp) => {
  const intl = useIntl();
  const scrollToBottom = useRef<HTMLDivElement>(null);

  const dispatch = useUserDispatch();

  const { data: discussion, isLoading } = useQueryApiClient({
    request: {
      url: `api/v1/tapis/get-discussion-answer/${id}`,
      disableOnMount: !id,
    },
    onSuccess: (response) => {
      if (response?.has_seen) {
        dispatch({ type: 'NOTIFICATION_SEEN' });
      }
    },
  });

  useEffect(() => {
    if (scrollToBottom.current) {
      scrollToBottom.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, []);

  return (
    <StyledProposalItem>
      <div className="proposal-item__header">
        <Button
          className="without-hovering"
          onClick={() => setProposalItem(null)}
          label={
            <div className="back-button">
              <Icon icon="long-arrow-left" faBase="fa-regular" />
              <span>{intl.formatMessage({ id: 'general.back' })}</span>
            </div>
          }
          type="text"
        />
        <Label
          subTitle
          label={`${intl.formatMessage({ id: 'my_participation.my_proposals.proposal_for_document' })}: ${
            discussion?.document_name
          }`}
          bold
        />
      </div>
      <Spinner spinning={isLoading}>
        <StyledProposalEditContainer>
          <Card>
            <div className="content-wrapper">
              <div className="text-wrapper">
                <FormattedMessage id="proposals.submit_date" />:
                <span className="text"> {dayjs(discussion?.created_at).format('DD.MM.YYYY')}</span>
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
          <div className="proposal-items-wrapper" ref={scrollToBottom}>
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
                          <FormattedMessage id="my_participation.my_proposals.response_text" />:
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
          </div>
        </StyledProposalEditContainer>
      </Spinner>
    </StyledProposalItem>
  );
};

export default ProposalItem;
