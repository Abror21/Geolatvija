import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Drawer, Button } from 'ui';

export default {
  title: 'Example/Drawer',
  component: Drawer,
  argTypes: {},
} as ComponentMeta<typeof Drawer>;

const Template: ComponentStory<typeof Drawer> = (args) => <Drawer {...args} />;

export const DrawerComponent = Template.bind({});
DrawerComponent.args = {
  title: 'test',
  width: '50%',
  open: true,
  footer: (
    <div className="drawer-buttons">
      <Button label="Open" type="primary" />
      <Button label="Close" />
    </div>
  ),
};
