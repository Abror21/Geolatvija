import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Collapse as AntdCollapse } from 'antd';

import { Collapse } from 'ui';
const { Panel } = AntdCollapse; //need more refactoring so this isn't really needed

export default {
  title: 'Example/Collapse',
  component: Collapse,
  argTypes: {},
} as ComponentMeta<typeof Collapse>;

const Template: ComponentStory<typeof Collapse> = (args) => <Collapse {...args} />;

export const CollapseComponent = Template.bind({});
CollapseComponent.args = {
  children: (
    <>
      <Panel key={1} header={'test'} />
    </>
  ),
};
