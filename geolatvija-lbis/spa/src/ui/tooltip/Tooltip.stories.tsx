import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Tooltip } from 'ui';

export default {
  title: 'Example/Tooltip',
  component: Tooltip,
  argTypes: {},
} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = (args) => <Tooltip {...args} />;

export const TooltipComponent = Template.bind({});
TooltipComponent.args = {
  title: 'test',
  children: <>test</>,
};
