import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Checkbox, CheckboxGroup } from 'ui';

export default {
  title: 'Example/CheckboxGroup',
  component: CheckboxGroup,
  argTypes: {},
};

const Template: ComponentStory<typeof CheckboxGroup> = (args) => <CheckboxGroup {...args} />;

export const CheckboxGroupComponent = Template.bind({});
CheckboxGroupComponent.args = {
  defaultValue: ['1'],
  children: (
    <>
      <Checkbox key={1} label={'test-1'} value="1" />
      <Checkbox key={2} label={'test-2'} value="2" />
      <Checkbox key={3} label={'test-3'} value="3" />
    </>
  ),
};
