import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Label } from 'ui';

export default {
  title: 'Example/Label',
  component: Label,
  argTypes: {},
} as ComponentMeta<typeof Label>;

const Template: ComponentStory<typeof Label> = (args) => <Label {...args} />;

export const LabelComponent = Template.bind({});
LabelComponent.args = {
  label: 'test',
};
