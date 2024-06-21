import React, { useEffect } from 'react';
import { Icon, Label, Pagination, ProjectCard, Select, SelectOption, Spinner } from 'ui';
import { useIntl } from 'react-intl';
// import FilterByStatusProject from '../FilterByStatusProject';
import { StyledMyVotesProjects } from './style';
import usePagination from 'utils/usePagination';
import { Tag, Form } from 'antd';
import { useProjectDispatch, useProjectState } from '../../../../../../../contexts/ProjectContext';
import { useNavigate } from 'react-router-dom';

const MyVotesProjects = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const theme = localStorage.getItem('selected-theme');
  const [form] = Form.useForm();

  const { projects, initialized, isLoading } = useProjectState();
  const { currentPage, paginatedData, handlePageChange } = usePagination(projects);

  const dispatchSettings = useProjectDispatch();

  const highlightProject = (projectId: number | null) => {
    if (projectId) {
      dispatchSettings({
        type: 'HIGHLIGHT_PROJECT',
        payload: projectId,
      });
    }
  };

  useEffect(() => {
    if (initialized) {
      dispatchSettings({
        type: 'REFETCH',
        payload: {
          search: {
            voter_code: 'replace',
          },
        },
      });
    }
  }, [initialized]);
  const renderTag = (props: any) => {
    const { value, label, closable, onClose } = props;

    const onPreventMouseDown = (event: any) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag className={'status status-' + value} onMouseDown={onPreventMouseDown} closable={closable} onClose={onClose}>
        {label}
      </Tag>
    );
  };

  const onFinish = () => {
    const values = form.getFieldsValue();
    dispatchSettings({
      type: 'REFETCH',
      payload: {
        search: {
          state: values.state,
          voter_code: 'replace',
        },
      },
    });
  };

  return (
    <StyledMyVotesProjects>
      <Label
        label={`${intl.formatMessage({ id: `participation_budget.project` })}:`}
        extraBold={true}
        title={true}
        className="title"
      />
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Select
          name="state"
          className="dimmed"
          mode="multiple"
          placeholder={intl.formatMessage({ id: 'participation_budget.project_of_all_status' })}
          tagRender={renderTag}
          onChange={() => onFinish()}
          customSufixIcon={<Icon faBase="far" icon="angle-down" />}
        >
          {[
            { id: '1', value: 'in_voting', name: 'Balsošanā' },
            { id: '2', value: 'voting_ended', name: 'Balsošana noslēgusies' },
            { id: '3', value: 'supported', name: 'Atbalstīts' },
            { id: '4', value: 'in_progress', name: 'Tiek īstenots' },
            { id: '5', value: 'realized', name: 'Realizēts' },
            { id: '6', value: 'unsupported', name: 'Neatbalstīts' },
          ].map((status) => (
            <SelectOption
              key={status.id}
              value={status.value}
              className={` project-status-${(theme === 'default' || !theme) && status.value}`}
            >
              {intl.formatMessage({ id: `participation_budget.${status.value}` })}
            </SelectOption>
          ))}
        </Select>
      </Form>
      <Spinner spinning={isLoading}>
        <div className="project_list">
          {paginatedData.map((project: any, index: number) => (
            <ProjectCard
              section="my-votes"
              key={index}
              project={{ ...project, voted: true }}
              isVisibleSeDescBtn={true}
              projectViewSide="right"
              id={project.id}
              setActiveProject={highlightProject}
              onDescriptionClick={() => navigate(`/main?vote-view=open&side=right&geoProjectId=${project.id}`)}
            />
          ))}
        </div>
        {projects.length > 6 && (
          <Pagination
            current={currentPage}
            total={projects.length}
            onChange={handlePageChange}
            className="pagination default"
          />
        )}
      </Spinner>
    </StyledMyVotesProjects>
  );
};

export default MyVotesProjects;
