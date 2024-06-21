import React, {useState, useRef, useEffect, useMemo} from 'react';
import { Spinner } from 'ui';
import { StyledCustomCollapse } from './style';
import { Icon } from '../icon';
import { useIntl } from 'react-intl';

interface ItemsProps {
  name: string;
}
interface CustomCollapseProps {
  header: string | React.ReactNode;
  icon: string;
  action?: string | React.ReactNode;
  items: ItemsProps[];
  onClick?: Function;
  parseLabel?: Function;
  isLoading: boolean;
  max?: number;
  total?: number;
  onViewMoreClick?: Function;
  defaultOpen?: boolean;
  disableOpen?: boolean;
  allowExtend?: boolean;
}

export const CustomCollapse = ({
  header,
  icon,
  action,
  items,
  onClick,
  parseLabel,
  isLoading,
  max,
  total,
  onViewMoreClick,
  defaultOpen = false,
  disableOpen,
}: CustomCollapseProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [showAvailable, setShowAvailable] = useState<number>(max || 5);
  const [contentHeight, setContentHeight] = useState(0);

  const ref = useRef<HTMLDivElement>(null);

  const intl = useIntl();

  const updateContentHeight = () => {
    if (ref.current) {
      setContentHeight(open ? ref.current.clientHeight : 0);
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const updateContentHeightWithDelay = () => {
      timeoutId = setTimeout(() => {
        updateContentHeight();
      }, 300);
    };

    updateContentHeightWithDelay();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [open, showAvailable, items]);

  useEffect(() => {
    if (isLoading && open) {
      setOpen(false);
    }

    if (defaultOpen && !isLoading && items?.length) {
      setTimeout(() => setOpen(defaultOpen || false), 100);
    }
  }, [isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  const getFormattedTitle = (title: string) => {
    return title.length > 32 ? title.slice(0, 32) + "..." : title;
  }

  const renderItems = (entry: ItemsProps, index: number) => (
    <div key={index} className="collapse-entry" onClick={() => onClick && onClick(entry)}>
      {parseLabel ? getFormattedTitle(parseLabel(entry)) : getFormattedTitle(entry?.name)}
    </div>
  );

  const _items = useMemo(() => {
    if (!items) {
      return null;
    }

    const itemsToRender = showAvailable === total ? items : items.slice(0, showAvailable);

    return itemsToRender.map(renderItems);
  }, [items, showAvailable, total]);

  if (!isLoading && !items?.length) {
    return <></>;
  }

  const handleOpenClose = () => {
    if (disableOpen) {
      return;
    }

    setOpen((old) => !old);
  };

  const onShowAvailable = () => {
    !!total && setShowAvailable(total);
  }

  return (
    <StyledCustomCollapse>
      <div className="collapse" onClick={handleOpenClose}>
        <Icon icon={icon} />
        <div className="header">{header}</div>
        <div className="action">
          <div>{action}</div>
        </div>
      </div>
      <Spinner spinning={isLoading}>
        <div>
          <div
            className="content"
            style={{ height: `${contentHeight}px` }}
          >
            <div ref={ref} className="content-wrapper">
              {_items?.map((_item) => (
                <>
                  {_item}
                </>
              ))}
              {!disableOpen && (!!total && total > 5 && total > showAvailable) && (
                <div className="action" onClick={() => {
                  if (!!onViewMoreClick) {
                    onViewMoreClick();
                  } else {
                    onShowAvailable();
                  }
                }}>
                  <div>{intl.formatMessage({ id: 'search.more' })} ({items?.length})</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Spinner>
    </StyledCustomCollapse>
  );
};
