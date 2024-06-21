import { Button, Icon } from 'ui';
import { StyledCheckboxTreeComponent } from './styles';
import React, { useState } from 'react';
import { Col, Collapse as AntdCollapse, Form, Row, Space, Tree } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';

interface CheckboxTreeProps {
  items: DataNode[];
  showIcon?: boolean;
  onCheck?: TreeProps['onCheck'];
  defaultExpandedKeys: string[];
  checkedKeys: string[];
}

interface Tree {
  id: number;
  name: string;
  children: Child[];
}

interface Child {
  id: number;
  name: string;
}

const onCheckDefault: TreeProps['onCheck'] = (checkedKeys, info) => {
  console.log('onCheck', checkedKeys, info);
};

const CheckboxTree = ({
  items,
  showIcon,
  onCheck = onCheckDefault,
  defaultExpandedKeys,
  checkedKeys = [],
}: CheckboxTreeProps) => {
  const [dropdown, setDropdown] = useState<Record<number, boolean>>({});

  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  return (
    <StyledCheckboxTreeComponent>
      {/* <Row gutter={[5, 5]}>
        {items.map((item) => (
          <Col span={24} key={item.id}>
            <Button
              label={item.name}
              type="text"
              onClick={() => setDropdown({ ...dropdown, [item.id]: dropdown[item.id] ? false : true })}
            ></Button>
            {dropdown[item.id] && (
              <Row gutter={[5, 5]}>
                {item.children.map((child) => (
                  <Col span={24} key={child.id}>
                    <Space direction="horizontal" size={12}>
                      <i className="fa-regular fa-face-smile"></i>
                      {child.name}
                    </Space>
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        ))}
      </Row> */}
      <Tree
        checkable
        onSelect={onSelect}
        onCheck={onCheck}
        treeData={items}
        showIcon={showIcon}
        defaultExpandedKeys={defaultExpandedKeys}
        checkedKeys={checkedKeys}
      />
    </StyledCheckboxTreeComponent>
  );
};

export default CheckboxTree;
