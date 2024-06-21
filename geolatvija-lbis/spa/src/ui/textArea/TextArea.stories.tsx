import { ComponentStory, ComponentMeta } from '@storybook/react';

import { TextArea } from 'ui';

export default {
  title: 'Example/TextArea',
  component: TextArea,
} as ComponentMeta<typeof TextArea>;

const Template: ComponentStory<typeof TextArea> = (args) => <TextArea {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
