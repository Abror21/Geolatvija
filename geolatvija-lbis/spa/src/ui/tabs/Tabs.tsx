import { ClassName, Disabled, Name } from 'interfaces/shared';
import { StyledTabs } from './style';

export interface TabsProps extends Disabled, ClassName, Name {
  type?: 'line' | 'card' | 'editable-card';
  activeKey?: string;
  onChange?: (activeKey: string) => void;
  children?: React.ReactNode;
  defaultActiveKey?: string;
  className?: string;
  items?: any;
}

export const Tabs = ({ type, activeKey, onChange, children, defaultActiveKey, className,items }: TabsProps) => {
  return (
    <StyledTabs
      type={type}
      activeKey={activeKey}
      onChange={onChange}
      defaultActiveKey={defaultActiveKey}
      className={className}
      items={items}
    >
      {children}
    </StyledTabs>
  );
};
