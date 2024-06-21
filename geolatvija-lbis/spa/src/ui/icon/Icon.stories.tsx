import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Icon } from 'ui';

export default {
  title: 'Example/Icon',
  component: Icon,
  argTypes: {},
} as ComponentMeta<typeof Icon>;

const Template: ComponentStory<typeof Icon> = (args) => <Icon {...args} />;

export const IconComponent = Template.bind({});
IconComponent.args = {
  faBase: 'far',
  icon: 'calendar-alt',
};
