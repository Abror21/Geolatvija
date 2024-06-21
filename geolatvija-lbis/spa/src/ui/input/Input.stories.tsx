import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Input } from 'ui';

export default {
  title: 'Example/Input',
  component: Input,
  argTypes: {},
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = (args) => <Input {...args} />;

export const InputComponent = Template.bind({});
InputComponent.args = {};
