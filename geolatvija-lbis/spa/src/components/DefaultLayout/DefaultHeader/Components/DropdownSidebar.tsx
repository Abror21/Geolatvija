import React, { useEffect, useState } from 'react';
import { Icon } from 'ui';
import { Menu } from 'antd';
import { NavLink, useLocation } from 'react-router-dom';
import { StyledSider } from './style';
import { VARIABLES } from 'styles/globals';
import { urlNavigation } from 'constants/navigation';

const { SubMenu } = Menu;

interface DropdownSidebarProps {
  uiMenu: NavigationEntry[];
}

interface NavigationEntry {
  id: number;
  sequence: number;
  parentId: number;
  description: string;
  translation: string;
  uniqueKey: string;
  menuChild?: NavigationEntry[];
  url?: string;
}

const DropdownSidebar = ({ uiMenu }: DropdownSidebarProps) => {
  const [, setReload] = useState<number>(0);

  const location = useLocation();

  useEffect(() => {
    setReload((old) => old + 1);
  }, [location.pathname]);

  let menuItems: NavigationEntry[] = [];

  Object.values(uiMenu)
    .map((item: NavigationEntry) => {
      if (item.menuChild) {
        const childArr: NavigationEntry[] = [];
        item.menuChild.forEach((el: NavigationEntry) => {
          if (el.menuChild) {
            menuItems = [...menuItems, ...el.menuChild];
          }
        });
        if (item.menuChild) {
          menuItems = [...menuItems, ...item.menuChild];
        }

        return [...childArr, ...item.menuChild];
      }

      return item;
    })
    .flat();

  const openedMenuItem =
    menuItems.find(
      (el: NavigationEntry) =>
        (urlNavigation[el.uniqueKey] || '/predefined-page/' + el.uniqueKey) &&
        window.location.pathname.includes(urlNavigation[el.uniqueKey] || '/predefined-page/' + el.uniqueKey)
    ) || null;

  const openedSubMenu = openedMenuItem
    ? menuItems.find((navItem: NavigationEntry) =>
        navItem?.menuChild?.find((subNavItem: NavigationEntry) => subNavItem.id === openedMenuItem.id)
      )
    : null;

  if (!menuItems.length) {
    return null;
  }

  const getLink = (uiMenu: NavigationEntry, unique: string) => {
    let url = '';
    if (uiMenu.url) {
      url = uiMenu.url;

      if (url.includes('http')) {
        return (
          <a href={url}>
            <Icon icon="arrow-turn-down-right" />
            {uiMenu.translation}
          </a>
        );
      }
    } else {
      url = urlNavigation[unique] || '/predefined-page/' + unique;
    }

    return (
      <NavLink to={url}>
        <Icon icon="arrow-turn-down-right" />
        {uiMenu.translation}
      </NavLink>
    );
  };

  return (
    <StyledSider width={VARIABLES.sidebarWidth}>
      <Menu
        selectedKeys={(openedMenuItem && [openedMenuItem.id.toString()]) || []}
        defaultOpenKeys={openedMenuItem ? (openedSubMenu ? [openedSubMenu.id.toString()] : []) : []}
        mode="inline"
      >
        {Object.values(uiMenu).map((item) => {
          if (item.menuChild) {
            return (
              <SubMenu key={item.id} title={item.translation}>
                {item.menuChild.map((subItem) => {
                  if (subItem.menuChild) {
                    return (
                      <SubMenu key={subItem.id} title={subItem.translation} className="second-layer">
                        {subItem.menuChild.map((item) => (
                          <Menu.Item key={item.id}>{getLink(item, item.uniqueKey)}</Menu.Item>
                        ))}
                      </SubMenu>
                    );
                  } else {
                    return <Menu.Item key={subItem.id}>{getLink(subItem, subItem.uniqueKey)}</Menu.Item>;
                  }
                })}
              </SubMenu>
            );
          }

          return <Menu.Item key={item.id}>{getLink(item, item.uniqueKey)}</Menu.Item>;
        })}
      </Menu>
    </StyledSider>
  );
};

export default DropdownSidebar;
