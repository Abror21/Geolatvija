import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Spinner } from 'ui';

export default {
  title: 'Example/Spinner',
  component: Spinner,
  argTypes: {},
} as ComponentMeta<typeof Spinner>;

const Template: ComponentStory<typeof Spinner> = (args) => <Spinner {...args} />;

export const Search = Template.bind({});
Search.args = {
  spinning: true,
};
