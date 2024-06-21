import React from 'react';
import { Col, Row } from 'antd';

interface SideBySideInterface {
  left?: React.ReactNode;
  right?: React.ReactNode;
  full?: React.ReactNode;
  gutter?: number;
  leftSpan?: number;
  rightSpan?: number;
}

export const SideBySide = ({ left, right, full, gutter = 16, leftSpan = 12, rightSpan = 12 }: SideBySideInterface) => {
  return (
    <Row gutter={gutter}>
      {full ? (
        <Col span={24}>{full}</Col>
      ) : (
        <>
          <Col span={leftSpan}>{left}</Col>
          <Col span={rightSpan}>{right}</Col>
        </>
      )}
    </Row>
  );
};
