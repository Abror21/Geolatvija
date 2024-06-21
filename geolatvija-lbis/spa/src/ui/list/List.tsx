import React, { type Dispatch, type MutableRefObject, type SetStateAction, useEffect, useMemo, useState } from 'react';
import { PlannedDocumentWrapper, StyledList, StyledListItem, StyledListTagWrapper } from './style';
import VirtualList from 'rc-virtual-list';
import useQueryApiClient from 'utils/useQueryApiClient';
import { listStatuses } from '../../config/config';
import { Tag } from '../tag';
import { Spinner } from '../spinner';
import { Popover } from 'antd';
import { DetailedPlannedDocument } from '../../pages/LayoutPage/Components/Sidebars/DetailedPlannedDocument';

export interface ListProps {
  url: string;
  pageSize?: number;
  height?: number;
  onSelect: Function;
  dataKey?: string;
  selectedTitle?: Function;
  isOpenDocument?: boolean;
  itemHeight?: number;
  hoverItem?: boolean;
  isPlanned?: boolean;
  captcha?: {
    captchaEnabled?: boolean;
    captchaKeyIsSet?: boolean | null;
    setCaptchaEnabled: Dispatch<SetStateAction<boolean | undefined>>;
    disableOnMount?: boolean;
  };
  useClientHeight?: { ref: MutableRefObject<any>; enable: boolean };

  properties: {
    prefix?: string;
    title: string;
    subtitle?: string;
    status?: string;
    id: string;
  };
  filterParams?: any;
  disableOnMount?: boolean;
}

const containerHeight = 400;

export const List = ({
  url,
  pageSize,
  height,
  onSelect,
  dataKey = 'data',
  properties,
  captcha,
  useClientHeight,
  itemHeight,
  filterParams,
  selectedTitle,
  isOpenDocument,
  disableOnMount,
  hoverItem,
  isPlanned,
}: ListProps) => {
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);
  const [_height, setHeight] = useState<number>(height || containerHeight);

  const _disableOnMount = useMemo(() => {
    return !!captcha
      ? !!disableOnMount
        ? (!!captcha?.captchaEnabled || captcha?.captchaEnabled === undefined) && disableOnMount
        : !!captcha?.captchaEnabled || captcha?.captchaEnabled === undefined
      : disableOnMount;
  }, [captcha, disableOnMount]);

  const { refetch, isLoading } = useQueryApiClient({
    request: {
      url: url,
      data: {
        page: currentPage,
        pageSize: pageSize || 100,
        count: 10,
        ...filterParams,
      },
      disableOnMount: _disableOnMount,
    },
    onSuccess: (response) => {
      const data = response[dataKey] || [];
      setData((old: any[]) => [...old, ...data]);
    },
  });

  const { isLoading: captchaIsLoading } = useQueryApiClient({
    request: {
      url: `api/v1/captcha/show`,
      method: 'GET',
      disableOnMount: captcha?.disableOnMount,
    },
    onSuccess: (response) => {
      if (parseInt(response.geoproduct.value) == 1) {
        captcha?.setCaptchaEnabled?.(true);
      } else {
        captcha?.setCaptchaEnabled?.(false);
      }
    },
  });

  useEffect(() => {
    if (currentPage !== 1) {
      refetch();
    }
  }, [pageSize, currentPage, url]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (useClientHeight && useClientHeight?.enable) {
      setHeight(useClientHeight.ref?.current?.clientHeight || containerHeight);
    } else if (height) {
      setHeight(height);
    } else {
      setHeight(containerHeight);
    }
  }, [data, useClientHeight, height]);

  useEffect(() => {
    setInitialLoad(false);

    if (!initialLoad) {
      setData([]);
      setCurrentPage(1);
      refetch();
    }
  }, [filterParams]);

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (Math.round(e.currentTarget.scrollHeight - e.currentTarget.scrollTop) === Math.round(_height)) {
      setCurrentPage((old) => old + 1);
    }
  };

  const innerOnSelect = (item: any) => {
    if (selectedTitle) {
      selectedTitle(computedValue(item, 'title'));
    }

    setSelected(computedValue(item, 'id'));
    onSelect(computedValue(item, 'id'));
  };

  const computedStatus = (statusCode: string, isTitle = true, isColor = false) => {
    // If a title exists, return the status title, otherwise, determine whether the color needs to be displayed.
    const type = isTitle ? 'title' : isColor ? 'color' : 'searchStatus';

    return listStatuses.find((status) => status.searchStatus === statusCode)![type];
  };

  const statusExistsInStatusList = (statusCode: string) => {
    return listStatuses.some((status) => status.searchStatus === statusCode);
  };

  const computedValue = (item: any, propertyName: 'title' | 'subtitle' | 'status' | 'id') => {
    return properties.prefix
      ? item[properties.prefix][properties[propertyName] as string]
      : item[properties[propertyName] as string];
  };

  const hoverContent = (item: any) => {
    if (hoverItem) {
      return (
        <PlannedDocumentWrapper>
          <span>{computedValue(item, 'title')}</span>
        </PlannedDocumentWrapper>
      );
    }
    return null;
  };

  return (
    <Spinner spinning={isLoading || captchaIsLoading}>
      <StyledList>
        <VirtualList data={data} height={_height} itemKey="properties.dok_id" onScroll={onScroll}>
          {(item: any) => (
            <StyledListItem
              style={{ height: itemHeight }}
              className={selected === computedValue(item, 'id') && isOpenDocument ? 'selected' : ''}
              onClick={() => innerOnSelect(item)}
            >
              <Popover content={hoverContent(item)} placement="right">
                <div className="box">
                  {properties.status && statusExistsInStatusList(computedValue(item, 'status')) && (
                    <Tag
                      color={computedStatus(computedValue(item, 'status'), false, true)}
                      label={computedStatus(computedValue(item, 'status'))}
                    />
                  )}
                  <div>
                    <div className="title">
                      <span style={{ fontWeight: isPlanned ? 'bold' : 'normal' }}>{computedValue(item, 'title')}</span>
                    </div>
                    {properties.subtitle && <p className="list__subtitle">{computedValue(item, 'subtitle')}</p>}
                  </div>
                </div>
              </Popover>
            </StyledListItem>
          )}
        </VirtualList>
      </StyledList>
    </Spinner>
  );
};
