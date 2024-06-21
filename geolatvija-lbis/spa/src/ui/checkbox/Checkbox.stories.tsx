import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Checkbox } from 'ui';

export default {
  title: 'Example/Checkbox',
  component: Checkbox,
  argTypes: {},
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = (args) => <Checkbox {...args} />;

export const CheckboxComponent = Template.bind({});
CheckboxComponent.args = {
  label: 'test-1',
  value: '1',
  checked: true,
};

export const CheckboxUncheckedComponent = Template.bind({});

CheckboxUncheckedComponent.args = {
  label: 'test-1',
  value: '1',
  checked: false,
};
