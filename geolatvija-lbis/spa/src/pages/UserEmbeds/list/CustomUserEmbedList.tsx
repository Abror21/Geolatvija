import React, { type Dispatch, type SetStateAction, useEffect, useRef, useState } from 'react';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import {
  StyledEmbedCheckboxContainer,
  StyledEmbedListCheckbox,
  StyledEmbedList,
  StyledEmbedListItem,
  StyledUserEmbedListWrapper,
  StyledUserEmbedListContainer,
} from './style';
import { Button, Icon, Spinner } from '../../../ui';
import { FormattedMessage, useIntl } from 'react-intl';
import useQueryApiClient from '../../../utils/useQueryApiClient';
import VirtualList from 'rc-virtual-list';
import { useNavigate } from 'react-router-dom';
import toastMessage from '../../../utils/toastMessage';

export type UserEmbed = {
  currentPage: number;
  data: UserEmbedData[];
  lastPage: number;
  nextPageUrl: string | null;
  perPage: number;
  prevPageUrl: string | null;
  to: number;
  total: number;
};

export type UserEmbedData = {
  id: number;
  userId: number;
  name: string;
  domain: string;
  sizeType: string;
  width: number;
  height: number;
  iframe: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type CustomUserEmbedListProps = {
  filter?: object;
  setSelectedKeys: Dispatch<SetStateAction<Array<number>>>;
  selectedKeys: Array<number>;
  reload: number;
};

export const CustomUserEmbedList = ({ filter, setSelectedKeys, selectedKeys, reload }: CustomUserEmbedListProps) => {
  const [data, setData] = useState<UserEmbedData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [initialLoad, setInitialLoad] = useState(true);
  const [_height, setHeight] = useState<number>(400);
  const ref = useRef<HTMLDivElement>(null);

  const intl = useIntl();
  const navigate = useNavigate();

  const { refetch, isLoading } = useQueryApiClient({
    request: {
      url: '/api/v1/user-embeds',
      data: {
        page: currentPage,
        pageSize: 10,
        count: 10,
        filter: filter,
      },
    },
    onSuccess: (response: UserEmbed) => {
      setData((prevState) => [...prevState, ...response.data]);
    },
  });

  useEffect(() => {
    setHeight(ref?.current?.clientHeight || 400);
  }, [data]);

  useEffect(() => {
    if (currentPage !== 1) {
      refetch();
    }
  }, [currentPage]);

  useEffect(() => {
    setInitialLoad(false);

    if (!initialLoad) {
      setData([]);
      setCurrentPage(1);
      refetch();
    }
  }, [filter, reload]);

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (Math.round(e.currentTarget.scrollHeight - e.currentTarget.scrollTop) === Math.round(_height)) {
      setCurrentPage((old) => old + 1);
    }
  };

  const copyIframe = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      toastMessage.success(intl.formatMessage({ id: 'embedded.copied_to_clipboard' }));
    }
  };

  const onEdit = (id: number) => {
    navigate(`/main?embedId=${id}`);
  };

  const handleOnAllCheckDelete = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setSelectedKeys(data.map((i) => i.id));
    } else {
      setSelectedKeys([]);
    }
  };

  const handleOnCheckDelete = (e: CheckboxChangeEvent, id: number) => {
    if (e.target.checked) {
      setSelectedKeys((prev) => [...prev, id]);
    } else if (selectedKeys.includes(id)) {
      setSelectedKeys((prev) => [...prev.filter((i) => i !== id)]);
    }
  };

  return (
    <Spinner spinning={isLoading}>
      <StyledUserEmbedListContainer>
        <StyledEmbedCheckboxContainer>
          <StyledEmbedListCheckbox
            checked={selectedKeys.length === data.length && selectedKeys.length > 0}
            onChange={handleOnAllCheckDelete}
          />
        </StyledEmbedCheckboxContainer>
        <StyledUserEmbedListWrapper ref={ref}>
          <StyledEmbedList>
            {!!data.length ? (
              <VirtualList data={data} height={400} itemKey="id" onScroll={onScroll}>
                {(item: any) => (
                  <StyledEmbedListItem key={item.id}>
                    <div className="delete-checkbox-wrapper">
                      <StyledEmbedListCheckbox
                        checked={selectedKeys.includes(item.id)}
                        onChange={(e) => handleOnCheckDelete(e, item.id)}
                      />
                    </div>
                    <img alt="image placeholder" src="/embeds_placeholder.png" className="image" />
                    <div className="content-container">
                      <div className="button-wrapper">
                        <Button
                          label={intl.formatMessage({ id: 'general.edit' })}
                          type="primary"
                          onClick={() => onEdit(item.id)}
                        />
                        <Button
                          label={intl.formatMessage({ id: 'embedded.preview' })}
                          type="primary"
                          onClick={() =>
                            window.open(`/map?id=${item.uuid}`, 'IFRAME', `height=${item.height},width=${item.width}`)
                          }
                        />
                      </div>
                      <div className="content-wrapper">
                        <div className="label-wrapper">
                          <div className="label">
                            <FormattedMessage id="embedded.name" />:
                          </div>
                          <div className="label">
                            <FormattedMessage id="embedded.domains" />:
                          </div>
                          <div className="label">
                            <FormattedMessage id="embedded.iframe_title" />:
                          </div>
                        </div>
                        <div className="text-wrapper">
                          <div>{item.name ?? ''}</div>
                          <div>{item.domain ?? ''}</div>
                          <div className="iframe-wrapper">
                            <textarea className="iframe-textarea" value={item.iframe ?? ''} readOnly />
                            <Icon
                              className="icon"
                              icon="copy"
                              faBase="fa-light"
                              onClick={() => copyIframe(item.iframe)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </StyledEmbedListItem>
                )}
              </VirtualList>
            ) : (
              <div className="no-data-found-wrapper">
                <FormattedMessage id="general.found_no_data" />
              </div>
            )}
          </StyledEmbedList>
        </StyledUserEmbedListWrapper>
      </StyledUserEmbedListContainer>
    </Spinner>
  );
};
