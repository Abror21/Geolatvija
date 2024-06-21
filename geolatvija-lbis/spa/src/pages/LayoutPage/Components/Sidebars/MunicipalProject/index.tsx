import { useIntl } from 'react-intl';
import { SidebarDrawer, Spinner, Tabs } from '../../../../../ui';
import { NotificationSide } from './components/NotificationSide';
import { StyledMunicipalProject } from './style';
import { ProjectSection } from './components/ProjectSection';
import { EventSection } from './components/EventSection';
import { BudgetSection } from './components/BudgetSection';
import { SpecialistInfo } from './components/SpecialistInfo';
import React, { useEffect, useState } from 'react';
import useQueryApiClient from '../../../../../utils/useQueryApiClient';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';

export const MunicipalProject = ({ isOpenMunicipalProject, closeProject }: any) => {
  const [hasVotingPeriod, setHasVotingPeriod] = useState<boolean>(false);
  const [hasSubmissionPeriod, setHasSubmissionPeriod] = useState<boolean>(false);
  const [budget, setBudget] = useState<number>(0);
  const [municipal, setMunicipal] = useState<any>();

  const intl = useIntl();
  let [searchParams] = useSearchParams();
  const atvkId = searchParams.get('atvk_id');

  const { refetch, isLoading: isMunicipalLoading } = useQueryApiClient({
    request: {
      url: `/api/v1/tapis/participation_budgets/${atvkId}`,
      method: 'GET',
      disableOnMount: true,
    },
    onSuccess: (response) => {
      setBudget(response.budget);

      const afterSub = dayjs(response.submission_period_from).startOf('d').isBefore(dayjs().endOf('d'));
      const beforeSub = dayjs(response.submission_period_to).endOf('d').isAfter(dayjs().startOf('d'));

      setHasSubmissionPeriod(afterSub && beforeSub);

      const after = dayjs(response.voting_period_from).startOf('d').isBefore(dayjs().endOf('d'));
      const before = dayjs(response.voting_period_to).endOf('d').isAfter(dayjs().startOf('d'));

      setHasVotingPeriod(after && before);
      setMunicipal(response);
    },
  });

  useEffect(() => {
    if (atvkId) {
      refetch();
    }
  }, [searchParams]);

  const tabSelectorData = [
    {
      tab: 'project',
      id: 1,
      children: <ProjectSection budget={budget} />,
    },
    {
      tab: 'events',
      id: 2,
      children: <EventSection />,
    },
    {
      tab: 'about_budjet',
      id: 3,
      children: <BudgetSection />,
    },
  ];

  return (
    <Spinner spinning={isMunicipalLoading}>
      <SidebarDrawer
        width="50vw"
        className="sidebar-style-2"
        //Temporary title
        title={municipal?.name}
        isOpen={isOpenMunicipalProject}
        showBreadcrumb={false}
        backIcon={'left'}
        onClose={closeProject}
      >
        <StyledMunicipalProject>
          <Tabs
            defaultActiveKey="1"
            type="card"
            className="municipal_project_tab"
            items={tabSelectorData.map((item) => {
              return {
                label: intl.formatMessage({ id: `participation_budget.${item.tab}` }),
                key: item.id,
                children: (
                  <div>
                    {hasVotingPeriod ? (
                      <NotificationSide
                        message={intl.formatMessage(
                          { id: `municipiality_can_vote_for_projects_message` },
                          { until: dayjs(municipal?.voting_period_to).format('DD.MM.YYYY') }
                        )}
                      />
                    ) : null}
                    {hasSubmissionPeriod ? (
                      <NotificationSide
                        message={intl.formatMessage(
                          { id: `municipiality_submission_period_message` },
                          { until: dayjs(municipal?.submission_period_to).format('DD.MM.YYYY') }
                        )}
                      />
                    ) : null}
                    <SpecialistInfo isThereSubmissionPeriod={Boolean(municipal?.submission_period_from)} isMunicipalLoading={isMunicipalLoading}/>
                    {item.children}
                  </div>
                ),
              };
            })}
          />
        </StyledMunicipalProject>
      </SidebarDrawer>
    </Spinner>
  );
};
