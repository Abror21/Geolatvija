import React, { useEffect, useState } from 'react';
import { TabPane, Tabs, Tooltip } from 'ui';
import { useIntl } from 'react-intl';
import { SubmitedProjects } from './components/SubmitedProjects';
import TabMyProfile from './components/TabNotifications';
import TabMyProposals from './components/TabMyProposals';
import ProposalItem from './components/TabMyProposals/components/ProposalItem';
import MyVotesProjects from './components/MyVotesProjects';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Ideas from './components/Ideas';

const MyParticipationTabs = () => {
  let [searchParams] = useSearchParams();
  const [proposalItem, setProposalItem] = useState(null);
  const activeTabFromQuery = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<string>(activeTabFromQuery ? activeTabFromQuery : 'notices_tab');
  const navigate = useNavigate();

  const intl = useIntl();
  const onTabChange = (activeKey: string) => {
    setActiveTab(activeKey);
    navigate(`/main?my-participation=open&tab=${activeKey}`);
  };

  useEffect(() => {
    if (activeTabFromQuery) {
      setActiveTab(activeTabFromQuery);
    }
  }, [activeTabFromQuery]);

  return (
    <Tabs type="card" onChange={onTabChange} activeKey={activeTab} className="my-participation-tabs no-border">
      <TabPane
        tab={intl.formatMessage({
          id: 'my_participation.tab_title.notices',
        })}
        key="notices_tab"
      >
        <TabMyProfile />
      </TabPane>

      <TabPane
        tab={
          <Tooltip
            title={intl.formatMessage({ id: 'my_participation.my_participation.my_proposals_tooltip' })}
            overlayClassName="white-background"
          >
            {intl.formatMessage({
              id: 'my_participation.tab_title.my_proposals',
            })}
          </Tooltip>
        }
        key="my_proposals_tab"
      >
        {proposalItem ? (
          <ProposalItem setProposalItem={setProposalItem} id={proposalItem} />
        ) : (
          <TabMyProposals setProposalItem={setProposalItem} />
        )}
      </TabPane>
      <TabPane
        tab={intl.formatMessage({
          id: 'my_participation.tab_title.my_votes',
        })}
        key="my_votes_tab"
        destroyInactiveTabPane
      >
        <MyVotesProjects />
      </TabPane>
      <TabPane
        tab={intl.formatMessage({
          id: 'my_participation.tab_title.submitted_projects',
        })}
        key="submitted_projects_tab"
        destroyInactiveTabPane
      >
        <SubmitedProjects />
      </TabPane>
      <TabPane
        tab={intl.formatMessage({
          id: 'my_participation.tab_title.ideas',
        })}
        key="ideas_tab"
      >
        <Ideas />
      </TabPane>
    </Tabs>
  );
};

export default MyParticipationTabs;
