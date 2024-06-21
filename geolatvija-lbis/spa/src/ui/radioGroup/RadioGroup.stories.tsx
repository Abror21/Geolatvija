import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Radio, RadioGroup } from 'ui';

export default {
  title: 'Example/RadioGroup',
  component: RadioGroup,
  argTypes: {},
} as ComponentMeta<typeof RadioGroup>;

const Template: ComponentStory<typeof RadioGroup> = (args) => <RadioGroup {...args} />;

export const RadioGroupComponent = Template.bind({});
RadioGroupComponent.args = {
  defaultValue: 'xlsx',
  size: 'small',
  children: (
    <>
      <Radio value="xlsx" label="xlsx" />
      <Radio value="csv" label="csv" />
    </>
  ),
};
