import styled from 'styled-components/macro';
import { Tabs } from 'antd';
import { ClassName, Disabled, Name } from 'interfaces/shared';

export interface TabPaneProps extends Disabled, ClassName, Name {
  key: string;
  tab?: string | React.ReactNode;
}

export const TabPane = styled(Tabs.TabPane).attrs(({ key, tab }: TabPaneProps) => ({
  key,
  tab,
}))``;
