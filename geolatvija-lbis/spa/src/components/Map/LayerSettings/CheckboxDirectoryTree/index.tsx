import React from 'react';
import { StyledCheckboxDirectoryTreeComponent } from './styles';
import { Tree } from 'antd';
import type { DataNode, DirectoryTreeProps } from 'antd/es/tree';

const { DirectoryTree } = Tree;

interface CheckboxDirectoryTreeProps {
  items: DataNode[];
  showIcon?: boolean;
  onCheck?: DirectoryTreeProps['onCheck'];
  defaultExpandedKeys: string[];
  checkedKeys: string[];
  onExpand?: DirectoryTreeProps['onExpand'];
  onSelect?: DirectoryTreeProps['onSelect'];
  expandedKeys?: string[];
}

const onCheckDefault: DirectoryTreeProps['onCheck'] = (checkedKeys, info) => {
  console.log('onCheck', checkedKeys, info);
};

const CheckboxDirectoryTree = ({
  items,
  showIcon = false,
  onCheck = onCheckDefault,
  defaultExpandedKeys,
  checkedKeys = [],
  onExpand,
  onSelect,
  expandedKeys,
}: CheckboxDirectoryTreeProps) => {
  return (
    <StyledCheckboxDirectoryTreeComponent>
      <DirectoryTree
        checkable
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        onSelect={onSelect}
        onCheck={onCheck}
        treeData={items}
        showIcon={showIcon}
        defaultExpandedKeys={defaultExpandedKeys}
        checkedKeys={checkedKeys}
      />
    </StyledCheckboxDirectoryTreeComponent>
  );
};

export default CheckboxDirectoryTree;
