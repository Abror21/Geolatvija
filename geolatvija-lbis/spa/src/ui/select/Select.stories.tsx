import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Select, SelectOption } from 'ui';

export default {
  title: 'Example/Select',
  component: Select,
  argTypes: {},
} as ComponentMeta<typeof Select>;

const Template: ComponentStory<typeof Select> = (args) => <Select {...args} />;

export const Search = Template.bind({});
Search.args = {
  size: 'small',
  showSearch: true,
  children: (
    <>
      <SelectOption value={1} key={1}>
        test
      </SelectOption>
    </>
  ),
};
