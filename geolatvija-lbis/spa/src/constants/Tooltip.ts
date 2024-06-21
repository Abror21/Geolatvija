import { CSSProperties } from 'react';

interface TooltipProps {
  overlayInnerStyle: CSSProperties;
  color: string;
  title?: string;
}

//todo need to think about theme color changes
export const Tooltip: TooltipProps = {
  overlayInnerStyle: { color: '#0D283F' },
  color: 'white',
};
