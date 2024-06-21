import { Collapse, Collapse as AntdCollapse, Space } from 'antd';
import { StyledSummaryField } from '../../../../styles/layout/form';
import parse from 'html-react-parser';
import React from 'react';
import { useIntl } from 'react-intl';

interface SummaryPanelProps {
  headerTitle: string;
  isPublic: boolean;
  description: string;
  serviceLink?: string | string[];
  file?: boolean;
  key: number;
}

const SummaryPanel = ({ headerTitle, isPublic, description, serviceLink, key, file = false }: SummaryPanelProps) => {
  const { Panel } = AntdCollapse;
  const intl = useIntl();

  return (
    <Collapse>
      <Panel key={key} header={headerTitle}>
        <Space direction="vertical" size={10}>
          <StyledSummaryField>
            <div className="label">{intl.formatMessage({ id: 'background_task.status' })}</div>
            <div className="value">
              {intl.formatMessage({ id: `general.${isPublic ? 'published' : 'not_published'}` })}
            </div>
          </StyledSummaryField>
          <StyledSummaryField>
            <div className="label">
              {intl.formatMessage({ id: 'geoproducts.data_type_of_distribution_description' })}
            </div>
            <div className="value">{parse(description ?? '')}</div>
          </StyledSummaryField>
          {!file && (
            <StyledSummaryField>
              <div className="label">{intl.formatMessage({ id: 'geoproducts.service_url' })}</div>
              {Array.isArray(serviceLink) ? (
                <div className="value link">{parse(serviceLink.join(', '))}</div>
              ) : (
                <div className="value link">{parse(serviceLink ?? '')}</div>
              )}
            </StyledSummaryField>
          )}
        </Space>
      </Panel>
    </Collapse>
  );
};

export default SummaryPanel;
