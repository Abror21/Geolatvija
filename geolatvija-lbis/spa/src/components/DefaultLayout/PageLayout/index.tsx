import React from 'react';
import { ClassNameUtil } from 'utils/className';
import { StyledPage } from './style';

interface PageLayoutProps {
  withStickyFooter?: boolean;
  withoutPageHeader?: boolean;
  children?: React.ReactNode;
}

const PageLayout = ({ withStickyFooter, withoutPageHeader, children }: PageLayoutProps) => {
  const className = new ClassNameUtil();
  className.add('page-layout');
  className.add('with-sticky-footer', !!withStickyFooter);
  className.add('without-page-header', !!withoutPageHeader);

  return <StyledPage className={className.getClassName()}>{children}</StyledPage>;
};

export default PageLayout;
