import { ComponentStory, ComponentMeta } from '@storybook/react';

import { InputNumber } from 'ui';

export default {
  title: 'Example/InputNumber',
  component: InputNumber,
  argTypes: {},
} as ComponentMeta<typeof InputNumber>;

const Template: ComponentStory<typeof InputNumber> = (args) => <InputNumber {...args} />;

export const InputNumberComponent = Template.bind({});
InputNumberComponent.args = {};
