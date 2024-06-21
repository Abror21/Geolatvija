import { ComponentStory, ComponentMeta } from '@storybook/react';

import { BasicSearch } from 'ui';

export default {
  title: 'Example/BasicSearch',
  component: BasicSearch,
  argTypes: {},
} as ComponentMeta<typeof BasicSearch>;

const Template: ComponentStory<typeof BasicSearch> = (args) => <BasicSearch {...args} />;

export const Search = Template.bind({});
Search.args = {};
