import React, { useEffect } from 'react';
import { StyledProjectPopOver, StyledSubmitedProjects } from './style';
import { Button, Label, Popover, Pagination, Icon, Spinner } from 'ui';
import { useIntl } from 'react-intl';
import { ProjectCard, Select, SelectOption } from 'ui';
import usePagination from 'utils/usePagination';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tag, Form } from 'antd';
import { useProjectDispatch, useProjectState } from '../../../../../../../contexts/ProjectContext';

export const SubmitedProjects = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { state } = useLocation();
  const theme = localStorage.getItem('selected-theme');
  const [form] = Form.useForm();

  const { projects, initialized, isLoading } = useProjectState();
  const dispatchSettings = useProjectDispatch();

  const { currentPage, paginatedData, handlePageChange } = usePagination(projects);

  const highlightProject = (projectId: number | null) => {
    if (projectId) {
      dispatchSettings({
        type: 'HIGHLIGHT_PROJECT',
        payload: projectId,
      });
    }
  };

  useEffect(() => {
    if (state) {
      handlePageChange(state.currentPage);
    }
  }, []);

  useEffect(() => {
    if (initialized) {
      dispatchSettings({
        type: 'REFETCH',
        payload: {
          search: {
            submitter_code: 'replace',
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
          submitter_code: 'replace',
          state: values.state,
        },
      },
    });
  };

  return (
    <StyledSubmitedProjects>
      <Label
        label={`${intl.formatMessage({ id: `participation_budget.project` })}:`}
        extraBold={true}
        title={true}
        className="title"
      />
      <Spinner spinning={isLoading}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
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
              { id: '7', value: 'submitted', name: 'Iesniegts' },
              { id: '8', value: 'did_not_qualify', name: 'Nekvalificējas' },
              { id: '9', value: 'ready_to_vote', name: 'Gatavs balsošanai' },
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
        <div className="project_list">
          {paginatedData.map((project: any) => (
            <ProjectCard
              project={project}
              isVisibleSeDescBtn={true}
              projectViewSide="right"
              id={project.id}
              currentPage={currentPage}
              setActiveProject={highlightProject}
            >
              {project.state === 'in_voting' ? (
                <div className="project_button">
                  <Button
                    label={intl.formatMessage({ id: `participation_budget.labot` })}
                    onClick={() => navigate(`/main?submit-project-form=open&project-id=${project.id}&coords=${project.the_geom}&atvk=${project.atvk_id}`)}
                  />
                  <div className="info">
                    <Popover
                      placement="topLeft"
                      trigger={'hover'}
                      content={
                        <StyledProjectPopOver>
                          {intl.formatMessage(
                            { id: 'participation_budget.submission_period_to' },
                            { date: project.submission_period_to }
                          )}
                        </StyledProjectPopOver>
                      }
                    >
                      <i className="fa-regular fa-circle-info"></i>
                    </Popover>
                  </div>
                </div>
              ) : (
                <div className={`status ${project.state}`}>
                  {intl.formatMessage({ id: `participation_budget.${project.state}` })}
                </div>
              )}
            </ProjectCard>
          ))}
        </div>
        {projects.length > 6 && (
          <Pagination
            current={currentPage}
            total={projects.length}
            onChange={handlePageChange}
            showSizeChanger={false}
            className="pagination default"
          />
        )}
      </Spinner>
    </StyledSubmitedProjects>
  );
};
