import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from 'ui';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  type: 'primary',
  label: 'Button',
};

export const ButtonSecondary = Template.bind({});
ButtonSecondary.args = {
  label: 'button :)',
};

export const ButtonText = Template.bind({});
ButtonText.args = {
  label: 'button text :)',
  type: 'text',
};

export const ButtonLink = Template.bind({});
ButtonLink.args = {
  label: 'button link :)',
  type: 'link',
};

export const ButtonDefault = Template.bind({});
ButtonDefault.args = {
  label: 'button ghost :)',
  type: 'default',
};

export const ButtonDashed = Template.bind({});
ButtonDashed.args = {
  label: 'button dashed :)',
  type: 'dashed',
};
