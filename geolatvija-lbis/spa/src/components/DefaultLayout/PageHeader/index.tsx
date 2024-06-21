import React from 'react';
import { Breadcrumb } from 'antd';
import { NavLink } from 'react-router-dom';
import { StyledPage } from './style';
import { Icon } from '../../../ui';
import truncateWithEllipsis from '../../../utils/truncateWithEllipsis';

interface BreadcrumbObject {
  path?: string;
  name: string;
}

interface PageHeaderProps {
  breadcrumb?: BreadcrumbObject[];
  title: string;
  subtitle?: string;
  loading?: boolean;
  showBackIcon?: boolean;
  breadcrumbRightSide?: React.ReactNode;
  rightSideOptions?: React.ReactNode;
  leftSideOptions?: React.ReactNode;
  trunc?: number;
}

const PageHeader = ({
  breadcrumb = [],
  title,
  subtitle,
  showBackIcon,
  breadcrumbRightSide,
  rightSideOptions,
  leftSideOptions,
  trunc = 0,
}: PageHeaderProps) => {
  return (
    <StyledPage>
      <div className="header-wrapper">
        <div className="breadcrumb-wrapper">
          <Breadcrumb separator={<Icon icon="chevron-right" />}>
            {breadcrumb.map((breadcrumb: BreadcrumbObject, index: number) => {
              return (
                <Breadcrumb.Item key={index}>
                  {breadcrumb.path ? <NavLink to={breadcrumb.path}>{breadcrumb.name}</NavLink> : breadcrumb.name}
                </Breadcrumb.Item>
              );
            })}
            <Breadcrumb.Item>{trunc ? truncateWithEllipsis(title, trunc) : title}</Breadcrumb.Item>
          </Breadcrumb>
          <div className="breadcrumb-right-side">{breadcrumbRightSide}</div>
        </div>
        <div className="header">
          <div className="left-side-header">
            <h1>
              {showBackIcon && (
                <NavLink to={breadcrumb[breadcrumb.length - 1].path!}>
                  <i className="far fa-arrow-left" />
                </NavLink>
              )}
              {title}
            </h1>
            {subtitle && <span className="subtitle">{subtitle}</span>}
            {leftSideOptions}
          </div>
        </div>
      </div>
      {rightSideOptions && <div className="right-side-options">{rightSideOptions}</div>}
    </StyledPage>
  );
};

export default PageHeader;
