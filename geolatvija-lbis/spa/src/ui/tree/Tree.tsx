import { StyledTree } from './style';
import React from 'react';
import { Tree as AntdTree } from 'antd';
import type { TreeProps } from 'antd/es/tree';

export const Tree = ({ treeData, showIcon, checkable, onCheck, checkedKeys }: TreeProps) => {
  return (
    <StyledTree>
      <AntdTree
        checkable={checkable}
        treeData={treeData}
        showIcon={showIcon}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
      />
    </StyledTree>
  );
};
