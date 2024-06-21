import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Switch } from 'ui';

export default {
  title: 'Example/Switch',
  component: Switch,
  argTypes: {},
} as ComponentMeta<typeof Switch>;

const Template: ComponentStory<typeof Switch> = (args) => <Switch {...args} />;

export const Search = Template.bind({});
Search.args = {};
