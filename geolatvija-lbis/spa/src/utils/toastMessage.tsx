import React from 'react';
import { message } from 'antd';
import { Icon } from '../ui';
import type { NoticeType } from 'antd/es/message/interface';

interface ToastMessageProps {
  duration?: number;
  onClose?: () => void;
  style?: React.CSSProperties;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

function uuidv4() {
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: any) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
}

// Global config for all toast messages
message.config({
  maxCount: 5,
  duration: 15,
});

const generateToast = (type: NoticeType) => (content: string, config?: ToastMessageProps) => {
  const key = uuidv4();
  const closeIcon = (
    <Icon className="close" icon="circle-xmark" faBase="fa-regular" onClick={() => message.destroy(key)} />
  );

  message[type]({
    key,
    content: (
      <div className="toast-message-wrapper">
        {content}
        {closeIcon}
      </div>
    ),
    ...config,
  });
};

const toastMessage = {
  success: generateToast('success'),
  error: generateToast('error'),
  info: generateToast('info'),
  warning: generateToast('warning'),
  loading: generateToast('loading'),
};

export default toastMessage;
