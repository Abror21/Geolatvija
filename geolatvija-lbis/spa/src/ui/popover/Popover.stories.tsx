import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Popover } from 'ui';

export default {
  title: 'Example/Popover',
  component: Popover,
  argTypes: {},
} as ComponentMeta<typeof Popover>;

const Template: ComponentStory<typeof Popover> = (args) => <Popover {...args} />;

export const PopoverComponent = Template.bind({});
PopoverComponent.args = {
  content: <div>test</div>,
  children: <div>test</div>,
};
