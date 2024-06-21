import React from 'react';
import { ClassNameUtil } from 'utils/className';
import { StyledPage } from './style';
interface PageContentProps {
  withTopPadding?: boolean;
  children?: React.ReactNode;
}

const PageContent = ({ withTopPadding, children }: PageContentProps) => {
  const className = new ClassNameUtil();
  className.add('page-content');
  className.add('with-top-padding', !!withTopPadding);

  return (
    <StyledPage className={className.getClassName()}>{children}</StyledPage>
  );
};

export default PageContent;
