import { StyledDirectoryTree } from './styles';
import { TreeDataNode } from 'antd';

type DirectoryTreeProps = {
  selectable?: boolean;
  showIcon?: boolean;
  treeData: TreeDataNode[];
};
export const DirectoryTree = (props: DirectoryTreeProps) => {
  return <StyledDirectoryTree {...props} />;
};
