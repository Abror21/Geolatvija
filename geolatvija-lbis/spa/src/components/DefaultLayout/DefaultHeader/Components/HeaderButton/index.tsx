import React from 'react';
import { StyledButton } from './style';

interface HeaderButtonTypes {
    label: string;
    className?: string;
    onClick: any;
}

const HeaderButton = ({ label, className, onClick }: HeaderButtonTypes) => {
  return <StyledButton className={className} onClick={onClick}>
            <span>{label}</span>
        </StyledButton>;
};

export default HeaderButton;
