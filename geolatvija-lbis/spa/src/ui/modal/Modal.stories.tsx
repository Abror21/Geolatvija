import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Modal } from 'ui';

export default {
  title: 'Example/Modal',
  component: Modal,
  argTypes: {},
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args) => <Modal {...args} />;

export const ModalComponent = Template.bind({});
ModalComponent.args = {
  children: <div>test</div>,
};
