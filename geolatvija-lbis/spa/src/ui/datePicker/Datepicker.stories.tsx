import { ComponentStory, ComponentMeta } from '@storybook/react';

import { DatePicker } from 'ui';

export default {
  title: 'Example/DatePicker',
  component: DatePicker,
  argTypes: {},
} as ComponentMeta<typeof DatePicker>;

const Template: ComponentStory<typeof DatePicker> = (args) => <DatePicker {...args} />;

export const DatePickerComponent = Template.bind({});
DatePickerComponent.args = {};
