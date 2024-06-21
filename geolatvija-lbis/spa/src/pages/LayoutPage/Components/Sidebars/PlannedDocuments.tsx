import { Icon, Input, Label, List, Select, SelectOption } from '../../../../ui';
import React, { useEffect, useRef, useState } from 'react';
import { Flex, Form } from 'antd';
import { useIntl } from 'react-intl';
import { listStatuses } from '../../../../config/config';
import { StyledListContainer, StyledSearchContainer } from './styles';
import { useDebounce } from '../../../../utils/useDebounce';
import { usePlannedDocumentsFilterContext } from '../../../../contexts/PlannedDocumentsFilterContext';
import PlannedDocumentsOrganizationSelect from '../../../../components/Selects/PlannedDocumentsOrganizationSelect';
import { useSearchParams } from 'react-router-dom';

interface PlannedDocumentsProps {
  setSelectedPlannedDocument: (id: number) => void;
  setSelectedTitle?: (title: string) => void;
  isOpenDocument: boolean;
}

const PlannedDocuments = ({ isOpenDocument, setSelectedPlannedDocument, setSelectedTitle }: PlannedDocumentsProps) => {
  const { filterParams, setFilterParams, form } = usePlannedDocumentsFilterContext();
  const debouncedDataFilter = useDebounce(filterParams, 1000);
  let [searchParams] = useSearchParams();

  const [visible, setVisible] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const intl = useIntl();

  window.onbeforeunload = function () {
    sessionStorage.clear();
  };

  const handleChange = () => {
    setVisible(!visible);
  };
  useEffect(() => {
    if (searchParams.get('advanced-search') === 'open') {
      setVisible(true);
    }
  }, [searchParams]);

  // Adds "..." at the end of the title if it exceeds four words.
  const getFormattedTitle = (title: string) => {
    const splitInWords = title.split(' ');
    return splitInWords.length > 4 ? splitInWords.slice(0, 4).join(' ') + '...' : title;
  };

  const handleFilterChange = (value: string | string[], key: string) => {
    const updatedFilterParams = {
      ...filterParams,
      bbox: undefined,
      [key]: value,
    };

    setFilterParams(updatedFilterParams);
    sessionStorage.setItem('filterValues', JSON.stringify(updatedFilterParams));
  };

  return (
    <>
      <Form form={form}>
        <Input
          name="search"
          placeholder={intl.formatMessage({ id: 'planned_documents.search_by_name' })}
          onChange={(e) => {
            handleFilterChange(e.target.value, 'search');
          }}
        />
        <StyledSearchContainer>
          <div className={`${!visible && 'hide-container'}`}>
            <PlannedDocumentsOrganizationSelect
              mode="multiple"
              name="organization"
              onChange={(values: string[]) => {
                handleFilterChange(values, 'organization');
              }}
            />
            <Select
              mode="multiple"
              name="status"
              placeholder={intl.formatMessage({ id: 'planned_documents.search_by_status' })}
              onChange={(values: string[]) => handleFilterChange(values, 'status')}
            >
              {listStatuses.map((entry) => {
                if (!entry.useInSearch) {
                  return <></>;
                }

                return (
                  <SelectOption key={entry.searchStatus} value={entry.searchStatus}>
                    {getFormattedTitle(entry.title)}
                  </SelectOption>
                );
              })}
            </Select>
          </div>
        </StyledSearchContainer>
        <div onClick={handleChange}>
          {!visible ? (
            <Flex align="center" gap="small">
              <Icon icon="angle-right" faBase="far" />{' '}
              <Label clickable label={intl.formatMessage({ id: 'planned_documents.additional_search' })} />
            </Flex>
          ) : (
            <Flex align="center" gap="small">
              <Icon icon="angle-down" faBase="far" />{' '}
              <Label clickable label={intl.formatMessage({ id: 'planned_documents.simple_search' })} />
            </Flex>
          )}
        </div>
      </Form>
      <StyledListContainer ref={ref}>
        <List
          hoverItem={true}
          isPlanned={true}
          isOpenDocument={isOpenDocument}
          pageSize={50}
          // itemHeight={250}
          url="api/v1/tapis/planned-documents"
          onSelect={(id: number) => setSelectedPlannedDocument(id)}
          selectedTitle={(title: string) => setSelectedTitle?.(title)}
          dataKey="features"
          filterParams={debouncedDataFilter}
          useClientHeight={{
            ref,
            enable: true,
          }}
          properties={{
            prefix: 'properties',
            title: 'dok_nosaukums',
            subtitle: 'atvk_nos',
            status: 'dok_status',
            id: 'dok_id',
          }}
        />
      </StyledListContainer>
    </>
  );
};

export default PlannedDocuments;
