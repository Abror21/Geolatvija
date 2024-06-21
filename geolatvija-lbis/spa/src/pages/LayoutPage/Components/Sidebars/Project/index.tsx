import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { StyledProjects } from './style';
import { Button, Input, Pagination, ProjectCard, Select, SelectOption, Popover, Spinner } from 'ui';
import { Form, Tag } from 'antd';
import { useIntl } from 'react-intl';
import usePagination from 'utils/usePagination';
import { useProjectState, useProjectDispatch } from '../../../../../contexts/ProjectContext';
import { CoordinatesWindowPosition } from 'pages/LayoutPage';
import { useParticipationBudgetState } from 'contexts/ParticipationBudgetContext';

export interface ProjectType {
  id: number;
  name: string;
  title: string;
  voted: boolean;
  pictures: string[];
  the_geom: string;
  state: string;
  modalCoord?: any;
  has_voted?: boolean;
  coordinatesForModal?: CoordinatesWindowPosition;
}
interface ProjectPropType {
  isOpenProjectSearch: boolean;
  setIsOpenProjectSearch: Dispatch<SetStateAction<boolean>>;
}

const Project = ({ isOpenProjectSearch, setIsOpenProjectSearch }: ProjectPropType) => {
  const [showAdvancedFilter, setShowAdvancedFilter] = useState<boolean>(
    isOpenProjectSearch ? isOpenProjectSearch : false
  );
  const [projectsListed, setProjectsListed] = useState<boolean>(false);
  const [projects, setProjects] = useState<ProjectType[] | []>([]);
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const intl = useIntl();
  const [form] = Form.useForm();
  const theme = localStorage.getItem('selected-theme');
  const { projects: projectsDataApi, isLoading } = useProjectState();
  const dispatchProjects = useProjectDispatch();
  const { budgets } = useParticipationBudgetState();
  const publicStatus = [
    { id: '1', value: 'in_voting', name: 'Balsošanā' },
    { id: '2', value: 'voting_ended', name: 'Balsošana noslēgusies' },
    { id: '3', value: 'supported', name: 'Atbalstīts' },
    { id: '4', value: 'in_progress', name: 'Tiek īstenots' },
    { id: '5', value: 'realized', name: 'Realizēts' },
    { id: '6', value: 'unsupported', name: 'Neatbalstīts' },
  ];
  useEffect(() => {
    setProjects(projectsDataApi);
    return () => setIsOpenProjectSearch(false);
  }, [projectsListed, projectsDataApi]);

  useEffect(() => {
    if (activeProject) {
      dispatchProjects({
        type: 'HIGHLIGHT_PROJECT',
        payload: activeProject,
      });
    }
  }, [activeProject]);

  const onFinish = (values: any) => {
    if (values.state.length) {
      dispatchProjects({
        type: 'REFETCH',
        payload: { search: values },
      });
      return;
    }
    const status = publicStatus.map((el) => el.value);
    dispatchProjects({
      type: 'REFETCH',
      payload: { search: { ...values, state: status } },
    });
  };

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

  const storedPage = sessionStorage.getItem('ProjectCurrentPage');

  const { currentPage, paginatedData, handlePageChange } = usePagination(
    projects,
    storedPage && parseInt(storedPage),
    projectsListed ? 9 : undefined
  );

  const handleChangeProjectList = (value: boolean) => {
    const newPageSize = value ? 9 : 6;
    const newTotalPages = Math.ceil(projects.length / (newPageSize || projects.length));
    const newPage = Math.min(currentPage, newTotalPages);

    setProjectsListed(value);
    handleProjectPageChange(newPage);
  };
  const handleProjectPageChange = (page: number) => {
    sessionStorage.setItem('ProjectCurrentPage', page.toString());
    handlePageChange(page);
  };

  const projectsInfo = (
    <p className="projects__info-text">{intl.formatMessage({ id: 'participation_budget.projects_info' })}</p>
  );

  return (
    <StyledProjects className="projects">
      <Form layout="vertical" form={form} onFinish={onFinish} initialValues={{ third: 'F39C11' }}>
        <div className="projects__input-button-wrapper">
          <Input
            name="name"
            label={intl.formatMessage({ id: 'participation_budget.projects_search_input' })}
            className="projects__input"
            placeholder={intl.formatMessage({ id: 'participation_budget.projects_search_input_placeholder' })}
          />
          <Button
            loading={isLoading}
            htmlType="submit"
            type="primary"
            label={intl.formatMessage({ id: 'participation_budget.projects_search_input' })}
          />
          {showAdvancedFilter ? (
            <Button
              className="close-filter-button"
              icon="xmark"
              faBase="fa"
              onClick={() => setShowAdvancedFilter(false)}
            />
          ) : (
            <Button
              label={intl.formatMessage({ id: 'participation_budget.projects_filter_button' })}
              onClick={() => setShowAdvancedFilter(true)}
            />
          )}
        </div>
        {showAdvancedFilter && (
          <>
            <div className="projects__selects-wrapper">
              <Select
                name="atvk_id"
                placeholder={intl.formatMessage({ id: 'projects.for_example_riga' })}
                label={intl.formatMessage({ id: 'participation_budget.projects_select_municipality' })}
              >
                {budgets.map((entry: any) => (
                  <SelectOption key={entry.id} value={entry.atvk_id}>
                    {entry.name}
                  </SelectOption>
                ))}
              </Select>
              <Select
                name="territorial_unit"
                className="dimmed"
                disabled
                placeholder="Jugla"
                mode="multiple"
                label={intl.formatMessage({ id: 'participation_budget.projects_select_territorialunit' })}
              >
                {[
                  { id: 0, value: 'jugla', name: 'Jugla' },
                  { id: 1, value: 'first', name: 'First' },
                  { id: 2, value: 'second', name: 'Second' },
                ].map((entry) => (
                  <SelectOption key={entry.id} value={entry.id}>
                    {entry.name}
                  </SelectOption>
                ))}
              </Select>
              <Select
                name="state"
                className="dimmed"
                mode="multiple"
                label={intl.formatMessage({ id: 'participation_budget.projects_select_statusofprojects' })}
                tagRender={renderTag}
                defaultValue={'in_voting'}
              >
                {publicStatus.map((status) => (
                  <SelectOption
                    key={status.id}
                    value={status.value}
                    className={` project-status-${(theme === 'default' || !theme) && status.value}`}
                  >
                    {intl.formatMessage({ id: `participation_budget.${status.value}` })}
                  </SelectOption>
                ))}
              </Select>
              <Select
                name="category"
                disabled
                className="dimmed"
                placeholder="Sporta un rotaļu laukumi"
                mode="multiple"
                label={intl.formatMessage({ id: 'participation_budget.projects_select_category' })}
              >
                {[
                  { id: 1, value: 'first Category', name: 'First Category' },
                  { id: 4, value: 'Second Category', name: 'Second Category' },
                ].map((entry) => (
                  <SelectOption key={entry.id} value={entry.id}>
                    {entry.name}
                  </SelectOption>
                ))}
              </Select>
            </div>
            <div className="projects__clear-selects">
              <Button
                icon="trash-can"
                faBase="fa"
                label={intl.formatMessage({ id: 'participation_budget.projects_selects_clear' })}
                border={false}
                onClick={() =>
                  form.setFieldsValue({
                    name: undefined,
                    first: undefined,
                    state: ['in_voting'],
                    searchInput: undefined,
                    atvk_id: undefined,
                  })
                }
              />
            </div>
          </>
        )}
      </Form>
      <div className="projects__content">
        <div className="projects__content-header">
          <span>
            {intl.formatMessage({ id: 'participation_budget.projects_together' }, { projects: projects.length })}
          </span>
          <div className="projects__content-header-btns">
            <Button
              icon="grid-2"
              faBase="fa-regular"
              label={intl.formatMessage({ id: 'participation_budget.projects_behaviour_column' })}
              className={projectsListed ? '' : 'selected-project-format'}
              border={false}
              onClick={() => handleChangeProjectList(false)}
            />
            <Button
              icon="list"
              faBase="fa-regular"
              label={intl.formatMessage({ id: 'participation_budget.projects_behaviour_list' })}
              className={!projectsListed ? '' : 'selected-project-format'}
              border={false}
              onClick={() => handleChangeProjectList(true)}
            />
            <Button
              icon="file-pdf"
              faBase="fa-light"
              label={intl.formatMessage({ id: 'participation_budget.projects_download' })}
              border={false}
              disabled
            />
            <Popover trigger="hover" placement="topLeft" content={projectsInfo}>
              <Button className="circile-info" icon="circle-info" faBase="fa-regular" border={false} />
            </Popover>
          </div>
        </div>
        <Spinner spinning={isLoading}>
          <div className={`projects__content-body ${projectsListed && 'list-view'}`}>
            {paginatedData.map((project: ProjectType) => (
              <ProjectCard
                key={project.id}
                listView={projectsListed}
                project={project}
                isVisibleSeDescBtn
                className={`${activeProject === project.id ? 'bordered' : ''} ellipse-title`}
                setActiveProject={setActiveProject}
                projectViewSide="left"
                id={project.id}
              />
            ))}
          </div>
        </Spinner>
        {projects.length > 6 && (
          <Pagination
            onChange={handleProjectPageChange}
            defaultCurrent={1}
            current={currentPage}
            total={projects.length}
            pageSize={projectsListed ? 9 : undefined}
            showSizeChanger={false}
            className="default"
          />
        )}
      </div>
    </StyledProjects>
  );
};

export default Project;
