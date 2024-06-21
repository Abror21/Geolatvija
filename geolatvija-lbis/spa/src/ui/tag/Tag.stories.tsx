import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Tag } from 'ui';

export default {
  title: 'Example/Tag',
  component: Tag,
} as ComponentMeta<typeof Tag>;

const Template: ComponentStory<typeof Tag> = (args) => <Tag {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  label: 'Tag',
};
