import React, { type Dispatch, type SetStateAction, useContext } from 'react';
import { Icon, Label } from '../../ui';
import { SettingsColorSchemes, SettingsFontSizes } from '../../constants/enums';
import { Menu } from 'antd';
import { useIntl } from 'react-intl';
import { ThemeContext } from '../../contexts/ThemeContext';
import { FontSizeContext } from '../../contexts/FontSizeContext';
import { SettingsContainer, SidebarHeaderContainer } from './styles';

type AccessibilityMenuProps = {
  setVisible: Dispatch<SetStateAction<boolean>>;
};

export const AccessibilityMenu = ({ setVisible }: AccessibilityMenuProps) => {
  const intl = useIntl();
  const { theme, changeTheme } = useContext(ThemeContext);
  const { fontSize, changeFontSize } = useContext(FontSizeContext);

  const renderTextOptions = (entry: string[], index: number) => {
    return (
      <div className="text-option" onClick={() => changeFontSize(entry[1])} key={index}>
        <Label label={`${entry[1]}%`} />
        {fontSize.toString() === entry[1] && <Icon faBase="far" icon="check" />}
      </div>
    );
  };

  const renderColorOptions = (entry: string[], index: number) => {
    return (
      <div className={`text-option ${entry[1]}`} onClick={() => changeTheme(entry[1])} key={index}>
        {theme === entry[1] && <Icon faBase="far" icon="eye" />}
      </div>
    );
  };

  return (
    <Menu>
      <SidebarHeaderContainer>
        <div className="title">
          <Label
            label={intl.formatMessage({
              id: 'navigation.settings',
            })}
          />
        </div>
        <div className="close-icon" onClick={() => setVisible(false)}>
          <Icon icon="times" faBase="far" />
        </div>
      </SidebarHeaderContainer>
      <SettingsContainer>
        <div>
          <Label
            label={intl.formatMessage({
              id: 'general.text_size',
            })}
            className="semi-title"
          />
          {Object.entries(SettingsFontSizes).map((entry: string[], index) => renderTextOptions(entry, index))}
        </div>
        <div>
          <Label
            label={intl.formatMessage({
              id: 'general.contrast',
            })}
            className="semi-title"
          />
          {Object.entries(SettingsColorSchemes).map((entry: string[], index) => renderColorOptions(entry, index))}
        </div>
      </SettingsContainer>
    </Menu>
  );
};
