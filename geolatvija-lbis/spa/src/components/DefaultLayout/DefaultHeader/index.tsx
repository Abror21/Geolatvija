import React, { MouseEventHandler, useContext, useEffect, useState } from 'react';
import { ThemeContext } from 'contexts/ThemeContext';
import { Dropdown, Icon, Popover, Tooltip } from 'ui';
import { Badge, Menu } from 'antd';
import { useIntl } from 'react-intl';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  OptionsContainer,
  RightSideHeader,
  MenuButtons,
  ProfileMenuContainer,
  HeaderContainer,
  ProfileTooltipContent,
} from './styles';
import DropdownSidebar from './Components/DropdownSidebar';
import useQueryApiClient from 'utils/useQueryApiClient';
import { useUserState } from 'contexts/UserContext';
import useJwt from 'utils/useJwt';
import { useOpenedTypeState } from '../../../contexts/OpenedTypeContext';
import { AccessibilityMenu } from '../../AccessibilityMenu/AccessibilityMenu';
import { useMapClickResultsOpening } from '../../../contexts/MapClickResultsOpeningContext';
import HeaderButtonsWrapper from './Components/HeaderButtonsWrapper';
import HeaderButton from './Components/HeaderButton';
import useSessionStorage from '../../../utils/useSessionStorage';

interface HeaderProps {
  showHeaderOptions?: boolean;
}

interface ProfileMenuOptions {
  id: number;
  url?: string;
  faBase?: string;
  icon: string;
  label: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  tooltip?: string;
}

const DefaultHeader = ({ showHeaderOptions }: HeaderProps) => {
  const intl = useIntl();

  const [visible, setVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState<boolean>(false);
  const [logo, setLogo] = useState('/geo_logo.svg');

  const { setOpen: setIsOpenMapClickResults } = useMapClickResultsOpening();
  const { theme } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();
  const mapRoutes = ['/main', '/geo/tapis', 'predefined-page'];
  const user = useUserState();
  const { isTokenActive } = useJwt();
  const { activeHeaderButton } = useOpenedTypeState();
  const disableAuthentication = window?.runConfig?.disableAuthentication;
  const activeRole = user.roles.find((e) => e.id === user.selectedRole);
  const isPhysical = activeRole?.code === 'authenticated';
  const [notificationTooltipVisible, setNotificationTooltipVisible] = useState(false);
  const {
    value: locationValue,
    removeSessionValue,
    setSessionValue,
  } = useSessionStorage<string | null | undefined>('SAVE_LOCATION');

  const { data: uiMenu } = useQueryApiClient({
    request: {
      url: 'api/v1/ui-menu',
      disableOnMount: isTokenActive() && !user.selectedRole,
    },
  });

  const showNotifications = () => user?.userNotifications > 0;
  const showEmbeds = () => user?.userEmbeds > 0;

  const { data: loginUrl } = useQueryApiClient({
    request: {
      url: 'api/v1/saml2',
    },
  });

  useEffect(() => {
    if (locationValue) {
      navigate(locationValue);
      removeSessionValue();
    }
  }, []);

  useEffect(() => {
    const getLogoPath = () => {
      if (theme === 'black-on-yellow') {
        setLogo('/geo_logo_yellow.svg');
        return;
      }

      if (theme === 'white-on-black') {
        setLogo('/geo_logo_black.svg');
        return;
      }

      setLogo('/geo_logo.svg');
    };

    getLogoPath();
  }, [theme]);

  const menu2 = <DropdownSidebar uiMenu={uiMenu} />;

  const profileMenu = () => {
    const menuOptions = isTokenActive()
      ? [
          {
            id: 1,
            icon: 'user',
            faBase: 'fa-regular',
            label: intl.formatMessage({
              id: 'profile.my_invoice',
            }),
            url: '/account',
          },
          {
            id: 9,
            icon: 'people-group',
            faBase: 'fa-regular',
            label: intl.formatMessage({
              id: 'profile.my_participation',
            }),
            tooltip: intl.formatMessage({ id: 'only_physical_person_can_view_section' }),
            onClick: () => {
              navigate('/main?my-participation=open&tab=notices_tab');
            },
          },
          {
            id: 2,
            icon: 'cart-shopping',
            faBase: 'fa-regular',
            label: intl.formatMessage({
              id: 'profile.my_orders',
            }),
            url: '/orders',
          },
          {
            id: 3,
            icon: 'share-from-square',
            faBase: 'fa-regular',
            label: intl.formatMessage({
              id: 'profile.my_proposals',
            }),
            url: '/proposals',
            disabledTooltip: intl.formatMessage({
              id: 'profile.my_proposals',
            }),
          },
          showEmbeds()
            ? {
                id: 6,
                icon: 'pen',
                faBase: 'fa-regular',
                label: activeRole?.institutionClassifierId
                  ? intl.formatMessage({
                      id: 'profile.org_user_embeds',
                    })
                  : intl.formatMessage({
                      id: 'profile.user_embeds',
                    }),
                url: '/user-embeds',
              }
            : {
                id: 10,
                icon: '',
                faBase: '',
                label: '',
                url: '',
              },
          showNotifications()
            ? {
                id: 7,
                icon: 'pen-to-square',
                faBase: 'fa-regular',
                label: intl.formatMessage({
                  id: 'profile.notifications',
                }),
                url: '/user-notifications',
                tooltip: intl.formatMessage({ id: 'only_physical_persona_notification' }),
              }
            : {
                id: 0,
                icon: '',
                faBase: '',
                label: '',
                url: '',
              },
          {
            id: 8,
            icon: 'arrow-right-from-bracket',
            faBase: 'fa-regular',
            label: intl.formatMessage({
              id: 'profile.logout',
            }),
            onClick: () => {
              user.logout();
            },
          },
        ]
      : [
          {
            id: 1,
            icon: 'user',
            faBase: 'fa-regular',
            label: intl.formatMessage({
              id: 'profile.login',
            }),
            onClick: () => {
              const params = new URLSearchParams(window.location.search);

              setSessionValue(location.pathname + (params ? '?' + params.toString() : null));
              window.location.replace(loginUrl);
            },
          },
        ];
    return (
      <Menu>
        <ProfileMenuContainer>{menuOptions.map((opt) => renderProfileMenuOption(opt))}</ProfileMenuContainer>
      </Menu>
    );
  };

  const renderProfileMenuOption = (opt: ProfileMenuOptions) => {
    const toDisable = ['people-group', 'share-from-square', 'pen-to-square'];
    let disabled = false;

    if (!isPhysical && toDisable.includes(opt?.icon)) {
      disabled = true;
    }

    const item = (
      <div key={opt.id} className={`profile-menu-option-wrapper ${disabled && 'is-disabled'}`}>
        {opt.url && (
          <Link to={opt.url} className="profile-menu-option">
            {opt.icon && opt.faBase && <Icon faBase={opt.faBase} icon={opt.icon} />}
            {opt.label}
          </Link>
        )}
        {opt.onClick && (
          <div onClick={opt.onClick} className="profile-menu-option">
            {opt.icon && opt.faBase && <Icon faBase={opt.faBase} icon={opt.icon} />}
            {opt.label}
          </div>
        )}
      </div>
    );

    if (disabled) {
      return (
        <Tooltip
          style={{ width: '100px' }}
          title={opt.tooltip ? opt.tooltip : intl.formatMessage({ id: 'only_physical_persona' })}
        >
          {item}
        </Tooltip>
      );
    }

    return item;
  };

  const handleOpenChange = (open: boolean) => {
    setVisible(open);
  };

  const handleChangeTooltip = (open: boolean) => {
    if (isPhysical) {
      setNotificationTooltipVisible(open);
    } else {
      setNotificationTooltipVisible(false);
    }
  };

  const parseName = (entry: any) => {
    if (!entry) {
      return;
    }

    if (!entry.institutionName) {
      return intl.formatMessage({ id: 'general.physical_person' });
    }

    return entry.name + (entry.institutionName ? ' - ' + entry.institutionName : '');
  };

  return (
    <>
      <div className="left-side-header">
        <Link to="/main">
          <img className="logo" src={logo} alt="" />
        </Link>
        <div className="random-line" />
        <HeaderContainer>
          <MenuButtons>
            {(mapRoutes.includes(location.pathname) || location.pathname.includes('predefined-page')) && (
              <HeaderButtonsWrapper>
                <HeaderButton
                  label={intl.formatMessage({ id: 'navigation.planned_documents' })}
                  className={`${activeHeaderButton === 'planned-documents' ? 'active' : ''}`}
                  onClick={() => {
                    navigate('/main?planned-documents=open');
                    setIsOpenMapClickResults(false);
                  }}
                />
                <HeaderButton
                  label={intl.formatMessage({ id: 'navigation.participation_budget' })}
                  className={`${activeHeaderButton === 'participation-budget' ? 'active' : ''}`}
                  onClick={() => {
                    navigate('/main?participation-budget=open');
                    setIsOpenMapClickResults(false);
                  }}
                />
                <HeaderButton
                  label={intl.formatMessage({ id: 'navigation.geoproducts' })}
                  className={`${activeHeaderButton === 'geoproduct' ? 'active' : ''}`}
                  onClick={() => {
                    navigate('/main?geoproduct=open');
                    setIsOpenMapClickResults(false);
                  }}
                />
              </HeaderButtonsWrapper>
            )}
          </MenuButtons>
        </HeaderContainer>
      </div>
      {showHeaderOptions && (
        <RightSideHeader>
          <OptionsContainer>
            <Dropdown
              open={visible}
              menu={() => <AccessibilityMenu setVisible={setVisible} />}
              trigger={['click']}
              onOpenChange={(open) => handleOpenChange(open)}
            >
              <div>
                <Icon faBase="far" icon="glasses" className="header-item" />
                <span className="header-text">{intl.formatMessage({ id: 'cookies.accessibility' })}</span>
              </div>
            </Dropdown>
          </OptionsContainer>
          <OptionsContainer>
            <Popover content={menu2} trigger="click">
              <div className="cursor">
                <Icon faBase="far" icon="bars" className="header-item" />
                <span className="header-text">{intl.formatMessage({ id: 'tooltip.ui_menu' })}</span>
              </div>
            </Popover>
          </OptionsContainer>
          {isTokenActive() ? (
            <>
              <Dropdown
                open={profileVisible}
                menu={profileMenu}
                trigger={['click']}
                onOpenChange={(open) => setProfileVisible(open)}
                placement="bottomRight"
                overlayClassName={'w-225'}
              >
                <div className="user-data" onMouseEnter={() => handleChangeTooltip(true)}>
                  <Tooltip
                    overlayClassName="tooltip-white profile-tooltip"
                    trigger={'click'}
                    className="profile-tooltip"
                    open={!!user.publicDiscussionCommentAnswers && notificationTooltipVisible}
                    onOpenChange={handleChangeTooltip}
                    title={
                      <ProfileTooltipContent>
                        <i className="far fa-times close-btn" onClick={() => setNotificationTooltipVisible(false)}></i>
                        <Link
                          onClick={() => setNotificationTooltipVisible(false)}
                          to={'/main?my-participation=open&tab=my_proposals_tab'}
                        >
                          {intl.formatMessage({ id: 'profile.view_response_to_proposal' })}
                        </Link>
                      </ProfileTooltipContent>
                    }
                  >
                    <>
                      <Badge dot={!!user.publicDiscussionCommentAnswers} offset={[-35, 0]}>
                        <div className="profile-icon">{user?.name?.substring(0, 1)}</div>
                      </Badge>
                    </>
                  </Tooltip>
                  <div>
                    <div className="user-name">
                      {user?.name} {user?.surname}
                    </div>
                    <div className="user-role">{parseName(activeRole)}</div>
                  </div>
                </div>
              </Dropdown>
            </>
          ) : (
            <Dropdown
              open={profileVisible}
              menu={profileMenu}
              trigger={['click']}
              onOpenChange={(open) => setProfileVisible(open)}
              placement="bottomRight"
              overlayClassName={'w-225'}
              disabled={disableAuthentication}
            >
              <div className="user-data">
                <span>Mana darba vieta</span>
              </div>
            </Dropdown>
          )}
        </RightSideHeader>
      )}
    </>
  );
};

export default DefaultHeader;
