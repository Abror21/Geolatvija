import React from 'react';
import { Button, Collapse, Switch, Label, Icon } from 'ui';
import { Collapse as AntdCollapse } from 'antd';
import { useIntl } from 'react-intl';
import { StyledPanelExtra } from 'ui/collapse/style';

interface NonePanelProps {
  panelKey: string;
  removePanel: Function;
  dynamicRow: number;
  previousEndIndex: number;
}

const NonePanel = ({ removePanel, panelKey, dynamicRow, previousEndIndex }: NonePanelProps) => {
  const intl = useIntl();
  const { Panel } = AntdCollapse;

  const extra = (
    <StyledPanelExtra
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <Label label={intl.formatMessage({ id: 'general.published' })} />
      <Switch name={[dynamicRow, 'isPublic']} />
      <Button label={<Icon icon="trash" />} onClick={() => removePanel()} />
    </StyledPanelExtra>
  );
  return (
    <Collapse>
      <Panel
        collapsible="disabled"
        key={panelKey}
        header={intl.formatMessage({ id: 'geoproducts.none' }) + ` #${previousEndIndex + dynamicRow + 1}`}
        extra={extra}
      />
    </Collapse>
  );
};

export default NonePanel;
