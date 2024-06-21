import { ComponentStory, ComponentMeta } from '@storybook/react';

import { TimePicker } from 'ui';

export default {
  title: 'Example/TimePicker',
  component: TimePicker,
  argTypes: {},
} as ComponentMeta<typeof TimePicker>;

const Template: ComponentStory<typeof TimePicker> = (args) => <TimePicker {...args} />;

export const TimePickerComponent = Template.bind({});
TimePickerComponent.args = {};
