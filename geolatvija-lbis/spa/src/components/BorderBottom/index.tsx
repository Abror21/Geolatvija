import React from 'react';
import { ClassName } from 'interfaces/shared';
import { StyledFormBottomBorder } from './style';

interface BorderBottomProps extends ClassName {
  style?: React.CSSProperties;
  modal?: boolean;
  dropdown?: boolean;
}

const BorderBottom = ({ style, modal, dropdown }: BorderBottomProps) => {
  let completeClassName = '';

  if (modal) {
    completeClassName += ' modal';
  }

  if (dropdown) {
    completeClassName += ' dropdown';
  }

  return <StyledFormBottomBorder className={completeClassName} style={style} />;
};
export default BorderBottom;
