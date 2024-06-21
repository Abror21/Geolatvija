import React, { useEffect } from 'react';
import { StyledIdeas } from './styled';
import { Button, Input, Label, Pagination, ProjectCard, Select, SelectOption } from 'ui';
import { useIntl } from 'react-intl';
import { ideasData } from '../temporary-data';
import usePagination from 'utils/usePagination';
import { useLocation, useNavigate } from 'react-router-dom';

const Ideas = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const intl = useIntl();
  const selectOptons = [ 'submitted', 'answered', 'realized'];
  
  const { currentPage, paginatedData, handlePageChange } = usePagination(ideasData);
  
  useEffect(() => {
    if(state){
      handlePageChange(state.currentPage);
    }
  }, [])

  return (
    <StyledIdeas>
      <div className="ideas_heading">
        <Label title extraBold label={intl.formatMessage({ id: 'my_participation.tab_title.ideas' }) + ':'} />
        <Button
          href="/main?submit-idea=open"
          label={intl.formatMessage({ id: 'my_participation.submit_new_idea' })}
          type="primary"
        />
      </div>

      <Label className="search_title" subTitle regular label={intl.formatMessage({ id: 'general.search' })} />
      <div className="ideas_search">
        <Input placeholder={intl.formatMessage({ id: 'my_participation.idea_name_keywords' })} />
        <Button label={intl.formatMessage({ id: 'general.search' })} type="primary" />
      </div>
      <div className="ideas_select">
        <Select placeholder={intl.formatMessage({ id: `my_participation.select_by_status` })} mode="multiple">
          {selectOptons.map((key) => (
            <SelectOption key={key}> {intl.formatMessage({ id: `participation_budget.${key}` })}</SelectOption>
          ))}
        </Select>

        <div className="project_list">
          {paginatedData.map((item: any) => (
            <ProjectCard elipseTitle={true} project={item} id={item.id}>
              <div className="status">{intl.formatMessage({ id: `participation_budget.${item.status}` })}</div>
              <Button
                onClick={() => navigate(`/main?idea-view=open&side=right&geoIdeaId=${item.id}`, {state: {currentPage}})}
                label={intl.formatMessage({ id: 'participation_budget.projects_see_description' })}
                className="project-item__desc-btn"
                border={false}
              />
            </ProjectCard>
          ))}
        </div>
      </div>

      <Pagination
        current={currentPage}
        defaultCurrent={1}
        total={ideasData.length}
        onChange={handlePageChange}
        className="pagination default"
      />
    </StyledIdeas>
  );
};

export default Ideas;
