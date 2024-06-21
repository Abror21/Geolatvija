import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button, RadioButton } from 'ui';

export default {
  title: 'Example/RadioButton',
  component: RadioButton,
  argTypes: {},
} as ComponentMeta<typeof RadioButton>;

const Template: ComponentStory<typeof RadioButton> = (args) => <RadioButton {...args} />;

export const RadioButtonComponent = Template.bind({});
RadioButtonComponent.args = {
  children: (
    <>
      <Button label={'test1'} />
      <Button label={'test2'} />
      <Button label={'test3'} />
    </>
  ),
};
