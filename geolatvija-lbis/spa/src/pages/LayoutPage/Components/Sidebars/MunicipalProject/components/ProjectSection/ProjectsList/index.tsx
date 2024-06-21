import { ProjectInterface } from '../../temporary-data';
import { useIntl } from 'react-intl';
import { ProjectListItem } from '../ProjectListItem';
import { Label, Pagination } from 'ui';
import usePagination from 'utils/usePagination';
import dayjs from 'dayjs';

export const ProjectsList = ({ data, budget, municipalProject }: any) => {
  const intl = useIntl();
  const currentYear = String(new Date().getFullYear());

  const supportedStatus = ['supported', 'being_implemented', 'realized'];
  const excludedStatuses = ['submitted', 'did_not_qualify', 'ready_to_vote'];

  // Determine the voting period status
  const isVotingPeriod: boolean =
    municipalProject &&
    dayjs().isAfter(dayjs(municipalProject.voting_period_from)) &&
    dayjs().isBefore(dayjs(municipalProject.voting_period_to));

  const isVotingEnded = municipalProject && dayjs().isAfter(dayjs(municipalProject.submission_period_to));

  const validProjects = data?.projects?.filter((project: any) => !excludedStatuses.includes(project.state)) || [];

  const { currentPage, paginatedData, handlePageChange } = usePagination(
    validProjects?.sort((a: any, b: any) => {
      const statusAIndex = supportedStatus.indexOf(a.state);
      const statusBIndex = supportedStatus.indexOf(b.state);

      if (statusAIndex === -1 && statusBIndex === -1) {
        // Both statuses are not in the statusOrder, sort by votes
        return b.votes - a.votes;
      }
      if (statusAIndex === -1) return 1; // a.status is not in statusOrder
      if (statusBIndex === -1) return -1; // b.status is not in statusOrder

      // Both statuses are in statusOrder, sort by their order
      if (statusAIndex !== statusBIndex) {
        return statusAIndex - statusBIndex;
      }

      // Statuses are the same in statusOrder, sort by votes
      return b.votes - a.votes;
    }) || []
  );

  let firstBlock = [];
  let secondBlock = [];

  if (isVotingPeriod) {
    // During voting period //TODO Change filter function after adding budget to backend
    firstBlock = paginatedData.slice(0, paginatedData.length / 2);
    secondBlock = paginatedData.slice(paginatedData.length / 2, paginatedData.length);
  } else if (isVotingEnded || data.year !== currentYear) {
    // After voting period
    firstBlock = paginatedData.filter((e) => supportedStatus.includes(e.state));
    secondBlock = paginatedData.filter((e) => !supportedStatus.includes(e.state));
  }

  return (
    <>
      <div className="municipal_project_list">
        <div>
          <div className="first_block">
            <Label
              subTitle
              bold
              label={intl.formatMessage({ id: 'amount_allocated_to_participation_budget' }) + ' ' + budget + ' EUR'}
            />
            {!!firstBlock.length && (
              <>
                <Label
                  className="block_title"
                  title={true}
                  regular={true}
                  label={intl.formatMessage({
                    id: isVotingPeriod
                      ? 'participation_budget.supported_projects_title'
                      : 'participation_budget.municipal_supported_projects_title',
                  })}
                />
                <div className="projects">
                  {firstBlock
                    .sort((a, b) => b.vote_count - a.vote_count)
                    .map((project: ProjectInterface) => (
                      <ProjectListItem
                        project={project}
                        block="first"
                        votingPeriodFrom={municipalProject?.voting_period_from}
                        votingPeriodTo={municipalProject?.voting_period_to}
                        isVotingPeriod={isVotingPeriod}
                      />
                    ))}
                </div>
              </>
            )}
          </div>
          {!!secondBlock.length && (
            <div className="second_block">
              <Label
                title={true}
                className="block_title"
                regular={true}
                label={intl.formatMessage({
                  id: isVotingPeriod
                    ? 'participation_budget.active_projects_title'
                    : 'participation_budget.unsupported_projects_title',
                })}
              />

              <div className="projects">
                {secondBlock
                  .sort((a, b) => b.vote_count - a.vote_count)
                  .map((project: ProjectInterface) => (
                    <ProjectListItem
                      project={project}
                      block="second"
                      votingPeriodFrom={municipalProject?.voting_period_from}
                      votingPeriodTo={municipalProject?.voting_period_to}
                      isVotingPeriod={isVotingPeriod}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {data.projects.length > 6 && (
        <Pagination
          current={currentPage}
          onChange={handlePageChange}
          total={validProjects.length}
          showSizeChanger={false}
          className="default"
        />
      )}
    </>
  );
};
