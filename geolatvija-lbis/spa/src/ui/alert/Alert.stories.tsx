import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Alert } from 'ui';

export default {
  title: 'Example/Alert',
  component: Alert,
  argTypes: {},
} as ComponentMeta<typeof Alert>;

const Template: ComponentStory<typeof Alert> = (args) => <Alert {...args} />;

export const AlertComponent = Template.bind({});
AlertComponent.args = {
  description: 'test test test',
};
