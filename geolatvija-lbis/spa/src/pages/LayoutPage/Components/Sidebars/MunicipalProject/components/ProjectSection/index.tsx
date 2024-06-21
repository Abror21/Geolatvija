import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { StyledProjectSection } from './style';
import { ProjectsList } from './ProjectsList';
import { Label, Tabs } from 'ui';
import { routes } from 'config/config';
import { useProjectState } from '../../../../../../../contexts/ProjectContext';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useParticipationBudgetState } from 'contexts/ParticipationBudgetContext';

interface ProjectSectionProps {
  budget: number;
}

export const ProjectSection = ({ budget }: ProjectSectionProps) => {
  const [selectedYear, setSelectedYear] = useState(routes.geo.municipalProjectSelectedYear);
  const { budgets } = useParticipationBudgetState();
  let [searchParams] = useSearchParams();
  const intl = useIntl();
  const municipalProject = budgets.find((e: any) => e.atvk_id === searchParams.get('atvk_id'));

  const { appendData, projects, initialized } = useProjectState();

  const years = useMemo(() => {
    let innerYears: string[] = [];
    const today = dayjs();
    let startYear = dayjs(routes.geo.municipalProjectSelectedYear);

    let continueMap = true;

    while (continueMap) {
      const yearStr = startYear.format('YYYY');
      if (startYear.isBefore(today)) {
        const votingPeriodFrom = municipalProject?.voting_period_from
          ? new Date(municipalProject.voting_period_from)
          : null;
        const votingPeriodTo = municipalProject?.voting_period_to ? new Date(municipalProject.voting_period_to) : null;
        
        //hide current year if voting not started
        if (
          yearStr !== today.format('YYYY') ||
          (votingPeriodFrom &&
            votingPeriodTo &&
            today.isAfter(dayjs(votingPeriodFrom)) &&
            today.isBefore(dayjs(votingPeriodTo)))
        ) {
          innerYears.push(yearStr);
        }
        startYear = startYear.add(1, 'y');
        continue;
      }

      continueMap = false;
    }

    return innerYears;
  }, [routes.geo.municipalProjectSelectedYear, municipalProject]);

  const handleTabChange = (year: string) => {
    setSelectedYear(year);
  };

  useEffect(() => {
    if (searchParams.get('atvk_id')) {
      appendData({
        search: {
          atvk_id: searchParams.get('atvk_id'),
          year: years[0] || null,
        },
      });
    }
  }, [searchParams, initialized]);

  return (
    <StyledProjectSection>
      <Label
        extraBold={true}
        title={true}
        className="section_title"
        label={intl.formatMessage({
          id: 'participation_budget.projects_municipal',
        })}
      />
      <Tabs
        type="card"
        activeKey={selectedYear}
        className="year_tabs"
        onChange={handleTabChange}
        items={years.map((year) => ({
          label: year,
          key: year,
          children: (
            <ProjectsList
              data={{ projects, year: year }}
              budget={budget}
              municipalProject={municipalProject}
            />
          ),
        }))}
      />
    </StyledProjectSection>
  );
};
