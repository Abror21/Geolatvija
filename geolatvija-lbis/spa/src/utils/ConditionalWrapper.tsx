import React from 'react';

type ConditionalWrapperPropsType = {
  condition: Boolean;
  wrapper: Function;
  children: React.ReactNode;
};

const ConditionalWrapper = ({ condition, wrapper, children }: ConditionalWrapperPropsType) =>
  condition ? wrapper(children) : children;

export default ConditionalWrapper;
