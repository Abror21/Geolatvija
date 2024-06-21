import { ClassName, Disabled, Name } from 'interfaces/shared';
import { StyledBreadcrumb } from './style';
import { Icon } from '../icon';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import truncateWithEllipsis from '../../utils/truncateWithEllipsis';

export interface BreadcrumbProps extends Disabled, ClassName, Name {
  title: string | undefined;
  breadcrumb?: BreadcrumbObject[];
  trunc?: number;
}
interface BreadcrumbObject {
  path?: string;
  name: string;
  goBack?: boolean;
  withState?: boolean;
}
export const Breadcrumb = ({ title, breadcrumb = [], trunc = 0 }: BreadcrumbProps) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  
  return (
    <StyledBreadcrumb separator={<Icon icon="chevron-right" className="custom-icon" />}>
      {breadcrumb.map((breadcrumb: BreadcrumbObject, index: number) => {
        return (
          <StyledBreadcrumb.Item key={index}>
            {
              breadcrumb.goBack
                ? (<span onClick={() => navigate(-1)}>{breadcrumb.name}</span>)
                : (
                    breadcrumb.withState
                      ? <span onClick={() => navigate(`${breadcrumb.path}`, {state: {currentPage: state?.currentPage}})}>{breadcrumb.name}</span>
                      : (breadcrumb.path ? <NavLink to={breadcrumb.path}>{breadcrumb.name}</NavLink> : breadcrumb.name)
                  )
            }
          </StyledBreadcrumb.Item>
        );
      })}
      {title && <StyledBreadcrumb.Item>{trunc ? truncateWithEllipsis(title, trunc) : title}</StyledBreadcrumb.Item>}
    </StyledBreadcrumb>
  );
};
