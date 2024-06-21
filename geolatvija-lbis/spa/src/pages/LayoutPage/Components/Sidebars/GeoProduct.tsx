import React, { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { Collapse, Icon, Label, Tag, Tooltip, Tree, Popover, Input, Button } from 'ui';
import useQueryApiClient from 'utils/useQueryApiClient';
import { FormattedMessage, useIntl } from 'react-intl';
import Profile from 'components/Profile';
import parse from 'html-react-parser';
import { Collapse as AntdCollapse } from 'antd';
import { StyledPanelExtra, StyledPanelNone } from 'ui/collapse/style';
import { ParsedLabel, StyledATag, StyledDescriptionWrapper, StyledImage, StyledOther } from './styles';
import FileDownload from 'js-file-download';
import dayjs from 'dayjs';
import useJwt from '../../../../utils/useJwt';
import LicenceConfirmationLoginModal from '../Modals/LicenceConfirmationLoginModal';
import { useGeoProductOrderProcess } from '../../../../contexts/GeoProductOrderProcessContext';
import { Link, useSearchParams } from 'react-router-dom';
import WMSLayerTreeFromUrl from '../../../../components/Map/LayerSettings/WMSLayerTreeFromUrl';
import { formatUrl } from '../../../../utils/formatUrl';
import { useGeoProductSidebarContext } from '../../../../contexts/GeoProductSidebarContext';
import toastMessage from '../../../../utils/toastMessage';

interface GeoProductProps {
  id: number;
  setSelectedTitle: Dispatch<SetStateAction<string>>;
}

type ServiceLimitationType = 'NONE' | 'ONLY_GEOPORTAL' | 'IP_ADDRESS' | 'PERIOD';

interface GeoProductServiceProps {
  id: number;
  description: string;
  serviceLink: string;
  paymentType: 'FREE' | 'FEE';
  serviceTypeCode: string;
  isDisabled?: boolean;
  serviceLimitationType?: ServiceLimitationType[];
  failAmount: number;
}

type IconObject = {
  icon: string;
  tooltipMessageId: string;
  faBase?: string;
};

export const GeoProduct = ({ id, setSelectedTitle }: GeoProductProps) => {
  const [seeMore, setSeeMore] = useState<boolean>(false);
  const [showLicenseConfirmationLoginModal, setShowLicenseConfirmationLoginModal] = useState<boolean>(false);
  const [fileInputValue, setFileInputValue] = useState('');
  const [checkedKeys, setCheckedKeys] = useState<any>([]);

  const { isTokenActive } = useJwt();
  const { setSelectedService, setIsOpen: setShowOrderModal, purchaseSuccessful } = useGeoProductOrderProcess();
  const intl = useIntl();
  const { refetchGeoProduct, setRefetchGeoProduct } = useGeoProductSidebarContext();

  const { Panel } = AntdCollapse;

  let [searchParams] = useSearchParams();

  const { appendData: viewOther } = useQueryApiClient({
    request: {
      url: `api/v1/public/geoproducts/other-view/:id`,
      method: 'POST',
    },
  });

  const { data, refetch } = useQueryApiClient({
    request: {
      url: `api/v1/public/geoproducts/${id}`,
      disableOnMount: true,
    },
    onSuccess: (res) => {
      setSelectedTitle(res?.name);
    },
    onFinally: () => {
      setRefetchGeoProduct(false);
    },
  });

  useEffect(() => {
    if (refetchGeoProduct) {
      refetch();
    }
  }, [refetchGeoProduct]);

  useEffect(() => {
    if (purchaseSuccessful) return;
    const geoProductFileId = searchParams.get('geoProductFileId');

    if (geoProductFileId && data?.files) {
      const found = data.files.find((e: any) => e.id === parseInt(geoProductFileId));
      if (found) {
        setShowOrderModal(true);
        setSelectedService(found);
      }
    }

    const geoProductServiceId = searchParams.get('geoProductServiceId');
    if (geoProductServiceId && data?.services) {
      const found = data.services.find((e: any) => e.id === parseInt(geoProductServiceId));
      if (found) {
        setShowOrderModal(true);
        setSelectedService(found);
      }
    }
  }, [searchParams, data, purchaseSuccessful]);

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id]);

  const servicePanelLabel = (type: string) => {
    switch (type) {
      case 'INSPIRE_VIEW':
        return intl.formatMessage({ id: 'geoproducts.service_inspire_view' });
      case 'FEATURE_DOWNLOAD':
        return intl.formatMessage({ id: 'geoproducts.service_feature_download' });
      case 'WFS':
        return intl.formatMessage({ id: 'geoproducts.service_wfs' });
      case 'WMS':
        return intl.formatMessage({ id: 'geoproducts.service_wms' });
      case 'WMTS':
        return intl.formatMessage({ id: 'geoproducts.service_wmts' });
    }
  };

  const { appendData } = useQueryApiClient({
    request: {
      url: `api/v1/storage/:id`,
      method: 'GET',
      disableOnMount: true,
      multipart: true,
    },
    onSuccess: (response, passOnSuccess) => {
      FileDownload(response, passOnSuccess.fileName);
    },
  });

  const showToastCopiedMessage = () => {
    toastMessage.success(intl.formatMessage({ id: 'url_copied' }));
  };

  return (
    <>
      <div>
        <ParsedLabel label={parse(data?.description || '')} />
        <Label
          onClick={() => setSeeMore((old) => !old)}
          className="mt-4"
          bold
          label={
            seeMore ? intl.formatMessage({ id: 'general.see_less' }) : intl.formatMessage({ id: 'general.see_more' })
          }
        />
      </div>
      {seeMore && (
        <>
          <div>
            <div className="mb-4">
              <span style={{ fontWeight: 500, fontSize: '14px', color: '#0D283F' }}>
                {intl.formatMessage({ id: 'geoproducts.coordinate_system' })}
              </span>
              <span style={{ fontSize: '14px', color: '#518B33' }}> {data?.coordinateSystemClassifier}</span>
            </div>
            <div className="mb-4">
              <span style={{ fontWeight: 500, fontSize: '14px', color: '#0D283F' }}>
                {intl.formatMessage({ id: 'geoproducts.regularity_renewal' })}
              </span>
              <span style={{ fontSize: '14px', color: '#518B33' }}> ({data?.regularityRenewalClassifier})</span>
            </div>
            {data?.photo?.[0]?.id && (
              <StyledImage
                src={window?.runConfig?.backendUrl + `/api/v1/storage/${data?.photo?.[0]?.id}`}
                alt={`${data.name} Image`}
              />
            )}
            <div className="mt-4">
              {data?.tags?.map((e: string, index: number) => (
                <Tag key={`data-tags-${index}`} label={e} color="green" />
              ))}
            </div>
          </div>
          {!!data?.dataSpecification && (
            <div>
              <span style={{ fontWeight: 500, fontSize: '14px', color: '#0D283F' }}>
                {intl.formatMessage({ id: 'geoproducts.data_specification' })}:
              </span>
              <span style={{ fontWeight: 500, fontSize: '14px', color: '#518B33' }}>
                {' '}
                {data?.dataSpecification?.[0]?.displayName}
              </span>
            </div>
          )}

          <div>
            <Label bold label="Kontaktinformācija" />
            <div className="my-4">
              <Profile img={'img/map/orto.png'} email={data?.email} name={data?.organizationName} />
            </div>
          </div>
        </>
      )}

      {data?.services?.map((e: GeoProductServiceProps | any) => {
        const expirationDate = dayjs(e?.licenceExpirationData?.expire_at);

        e.licenceExpired = dayjs().isAfter(expirationDate);

        let icons: IconObject[] = [];
        const hasFailed = e.failAmount >= 3;

        if (e.licenseType === 'OPEN' && (e.paymentType === 'FREE' || e.paymentType === null)) {
          icons.unshift({
            icon: 'file-certificate',
            tooltipMessageId: 'tooltip.see_open_licence_rules',
          });
        }

        if (
          (e.servicesLicenceAccepted !== true || e.licenceExpired) &&
          !e.isDisabled &&
          (e.paymentType !== 'FREE' || (e.paymentType === 'FREE' && e.licenseType !== 'OPEN')) &&
          e.paymentType !== null &&
          !e.serviceLink &&
          !e.alreadyOrdered
        ) {
          icons.push({
            icon: 'cart-shopping',
            tooltipMessageId: 'tooltip.order',
          });
        }

        if (
          (e.licenseType === 'OPEN' || (e.servicesLicenceAccepted && !e.licenceExpired) || e.serviceLink) &&
          !e.isDisabled &&
          !e.serviceLimitationType.includes('ONLY_GEOPORTAL')
        ) {
          icons.push({
            icon: 'file',
            tooltipMessageId: 'tooltip.copy_site',
          });
        }

        if (hasFailed) {
          icons = [{ icon: 'circle-xmark', tooltipMessageId: 'tooltip.order_disabled' }];
        }

        icons.push({ icon: 'file-lines', tooltipMessageId: 'tooltip.metadata_link' });

        const onIconClick = (icon: string) => {
          switch (icon) {
            case 'file':
              navigator.clipboard.writeText(e.serviceLink); //save to clipboard
              showToastCopiedMessage();
              break;
            case 'cart-shopping':
              if (e.isDisabled) return;
              const _isTokenActive = isTokenActive();
              if (!_isTokenActive) {
                setShowLicenseConfirmationLoginModal(true);
              } else {
                setShowOrderModal(true);
              }

              setSelectedService(e);
              break;
            case 'file-lines':
              window.open(
                window?.runConfig?.backendUrl + `/geonetwork/srv/api/records/${e?.metadataUuid}/formatters/xml`
              );
              break;
            case 'file-certificate':
              if (e.attachmentId) {
                appendData([], { id: e.attachmentId }, { fileName: e.displayName });
              } else if (e.institutionAttachmentId) {
                appendData([], { id: e.institutionAttachmentId }, { fileName: e.institutionDisplayName });
              } else if (e.site) {
                window.open(formatUrl(e.site), '_blank');
              }
              break;
          }
        };

        const hasLayers = e.serviceLink && (e.serviceTypeCode === 'INSPIRE_VIEW' || e.serviceTypeCode === 'WMS');

        return (
          <div key={`services-${e.id}`}>
            <Collapse
              ghost
              onChange={(key) => {
                if (key && e?.serviceTypeCode === 'FEATURE_DOWNLOAD') {
                  window.open(e.serviceLink);
                }
              }}
            >
              <Panel
                key={'add-service'}
                header={
                  <Popover trigger="hover" content={<div className="mx-2">{parse(e.description)}</div>}>
                    {servicePanelLabel(e.serviceTypeCode)}
                  </Popover>
                }
                showArrow={hasLayers}
                collapsible={
                  (e.licenseType !== 'OPEN' && !e.servicesLicenceAccepted) ||
                  icons?.[0]?.icon === 'circle-xmark' ||
                  e.isDisabled ||
                  (e.servicesLicenceAccepted && e.licenceExpired)
                    ? 'disabled'
                    : 'header'
                }
                extra={
                  <StyledPanelExtra
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    {icons.map((i) => (
                      <Tooltip hack title={intl.formatMessage({ id: i.tooltipMessageId })}>
                        <Icon
                          key={`services-icon-${e.id}`}
                          className={`${e.isDisabled ? 'disable-icon' : 'clickable'}`}
                          icon={i.icon}
                          faBase={i.faBase ?? 'far'}
                          onClick={() => onIconClick(i.icon)}
                          color={i.icon === 'circle-xmark' ? 'red' : ''}
                        />
                      </Tooltip>
                    ))}
                  </StyledPanelExtra>
                }
              >
                {hasLayers && (
                  <WMSLayerTreeFromUrl
                    availableOnlyInGeoPortal={e.serviceLimitationType.includes('ONLY_GEOPORTAL')}
                    dppsUuid={e.dppsUuid}
                    serviceId={e.id}
                    capabilitiesUrl={e.serviceLink}
                    title={e.description ? `"${e.description.replace(/<[^>]*>?/gm, '')}" slāņi` : 'Ģeoprodukta slāņi'}
                    includableInEmbed={e.licenseType === 'OPEN'}
                  />
                )}
              </Panel>
            </Collapse>
          </div>
        );
      })}

      {data?.files?.map((e: GeoProductServiceProps | any) => {
        const attachments = e.attachments.map((e: any) => {
          return {
            key: e.id,
            title: e.displayName,
          };
        });

        const filteredAttachments = e.attachments.filter((attachment: any) =>
          data.orderedAttachmentIds.includes(attachment.id)
        );

        const filteredAttachmentValues = filteredAttachments.map((e: any) => {
          return {
            key: e.id,
            title: e.displayName,
          };
        });

        const filterPaidFiles = () => {
          if (e.paymentType == 'PREPAY' || e.paymentType == 'FEE') {
            return filteredAttachmentValues.filter((filteredAttachmentValue: { title: string }) =>
              filteredAttachmentValue.title.toLowerCase().includes(fileInputValue.toLowerCase())
            );
          }
          return attachments.filter((attachment: { title: string }) =>
            attachment.title.toLowerCase().includes(fileInputValue.toLowerCase())
          );
        };

        let icons: IconObject[] = [];
        const hasFailed = e.failAmount >= 3;

        if (e.licenseType === 'OPEN') {
          icons.unshift({
            icon: 'file-certificate',
            tooltipMessageId: 'tooltip.see_open_licence_rules',
          });
        }

        if (!e.isDisabled && e.licenseType !== 'OPEN' && e.paymentType !== null) {
          icons.push({
            icon: 'cart-shopping',
            tooltipMessageId: 'tooltip.order',
          });
        }

        //only show fo public files
        if (e.licenseType === 'OPEN') {
          icons.push({
            icon: 'folder-arrow-down',
            tooltipMessageId: 'tooltip.download',
          });
        }

        if (hasFailed) {
          icons = [{ icon: 'circle-xmark', tooltipMessageId: 'tooltip.order_disabled' }];
        }

        icons.push({ icon: 'file-lines', tooltipMessageId: 'tooltip.metadata_link' });

        const onIconClick = (icon: string) => {
          switch (icon) {
            case 'folder-arrow-down':
              checkedKeys.forEach((key: number) => {
                const attachment = e.attachments.find((attachment: any) => attachment.id === key);
                appendData([], { id: key }, { fileName: attachment.displayName });
              });
              break;
            case 'cart-shopping':
              if (e.isDisabled) return;
              const _isTokenActive = isTokenActive();
              if (!_isTokenActive) {
                setShowLicenseConfirmationLoginModal(true);
              } else {
                setShowOrderModal(true);
              }

              setSelectedService(e);
              break;
            case 'file-lines':
              window.open(
                window?.runConfig?.backendUrl + `/geonetwork/srv/api/records/${e?.metadataUuid}/formatters/xml`
              );
              break;
            case 'file-certificate':
              if (e.attachmentId) {
                appendData([], { id: e.attachmentId }, { fileName: e.displayName });
              } else if (e.institutionAttachmentId) {
                appendData([], { id: e.institutionAttachmentId }, { fileName: e.institutionDisplayName });
              } else if (e.site) {
                window.open(formatUrl(e.site), '_blank');
              }
              break;
          }
        };

        return (
          <div key={`files-${data.id}`}>
            <Collapse ghost>
              <Panel
                key={'add-file'}
                header={
                  <Popover trigger="hover" content={<div className="mx-2">{parse(e.description)}</div>}>
                    {intl.formatMessage({ id: 'geoproducts.file' })}
                  </Popover>
                }
                collapsible={
                  (filteredAttachments?.length == 0 &&
                    (e.paymentType === 'FEE' ||
                      e.paymentType === 'PREPAY' ||
                      (e.paymentType === 'FREE' && e.licenceType !== 'OPEN')) &&
                    e.licenseType !== 'OPEN') ||
                  icons?.[0]?.icon === 'circle-xmark' ||
                  e.isDisabled
                    ? 'disabled'
                    : 'header'
                }
                extra={
                  <StyledPanelExtra
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    {icons.map((i, index) => (
                      <Tooltip hack title={intl.formatMessage({ id: i.tooltipMessageId })}>
                        <Icon
                          key={`files-icon-${e.id}-${index}`}
                          className={`${e.isDisabled ? 'disable-icon' : 'clickable'}`}
                          icon={i.icon}
                          faBase={i.faBase ?? 'far'}
                          onClick={() => onIconClick(i.icon)}
                          color={i.icon === 'circle-xmark' ? 'red' : ''}
                        />
                      </Tooltip>
                    ))}
                  </StyledPanelExtra>
                }
              >
                {filteredAttachments?.length > 0 ? (
                  <>
                    {intl.formatMessage({ id: 'geoproducts.files_available' })}
                    <Button type="link" href="/orders" label={intl.formatMessage({ id: 'profile.my_orders' })} />
                  </>
                ) : (
                  <>
                    <Input
                      type="text"
                      placeholder={intl.formatMessage({ id: 'geoproducts.search_file' })}
                      onChange={(event) => {
                        setFileInputValue(event.target.value);
                      }}
                    />
                    <Tree
                      treeData={filterPaidFiles()}
                      checkable
                      onCheck={(value) => {
                        setCheckedKeys(value);
                      }}
                    />
                  </>
                )}
              </Panel>
            </Collapse>
            {e.filesUpdatedAt && (
              <Label
                label={intl.formatMessage(
                  { id: 'geoproducts.files_updated_at' },
                  { value: dayjs(e.filesUpdatedAt).format('DD.MM.YYYY') }
                )}
              />
            )}
          </div>
        );
      })}

      {data?.others?.map((e: any) => {
        let icons: IconObject[] = [];

        const onIconClick = (icon: string) => {
          switch (icon) {
            case 'file-lines':
              window.open(
                window?.runConfig?.backendUrl + `/geonetwork/srv/api/records/${e?.metadataUuid}/formatters/xml`
              );
              break;
          }
        };

        icons.push({ icon: 'file-lines', tooltipMessageId: 'tooltip.metadata_link' });

        return (
          <div key={`others-${data.id}`}>
            <Collapse ghost>
              <Panel
                key={'add-file'}
                header={
                  <Popover trigger="hover" content={<div className="mx-2">{parse(e.description)}</div>}>
                    {intl.formatMessage({ id: 'geoproducts.other' })}
                  </Popover>
                }
                collapsible={e.paymentType == 'FEE' || e.isDisabled ? 'disabled' : 'header'}
                extra={
                  <StyledPanelExtra
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    {icons.map((i) => (
                      <Tooltip hack title={intl.formatMessage({ id: i.tooltipMessageId })}>
                        <Icon
                          key={`others-icon-${data.id}`}
                          className={`${e.isDisabled ? 'disable-icon' : 'clickable'}`}
                          icon={i.icon}
                          faBase={i.faBase ?? 'far'}
                          onClick={() => onIconClick(i.icon)}
                        />
                      </Tooltip>
                    ))}
                  </StyledPanelExtra>
                }
              >
                {e.description.length > 0 && e.description !== '<p><br></p>' && (
                  <StyledDescriptionWrapper>
                    <ParsedLabel label={parse(e.description)} />
                  </StyledDescriptionWrapper>
                )}
                {e.sites.map((site: any) => (
                  <StyledOther key={`sites-${data.id}`}>
                    <div>{site.name}</div>
                    <StyledPanelExtra>
                      <Tooltip hack title={intl.formatMessage({ id: 'tooltip.go_to_url' })}>
                        <StyledATag
                          onClick={() => viewOther([], { id: e.id })}
                          target="_blank"
                          href={formatUrl(site.site)}
                        >
                          <Icon className="clickable" icon="arrow-up-right-from-square" faBase="far" />
                        </StyledATag>
                      </Tooltip>
                      <Tooltip hack title={intl.formatMessage({ id: 'tooltip.copy_site' })}>
                        <Icon
                          className="clickable"
                          icon="file"
                          faBase="far"
                          onClick={() => {
                            navigator.clipboard.writeText(site.site);
                            showToastCopiedMessage();
                          }}
                        />
                      </Tooltip>
                    </StyledPanelExtra>
                  </StyledOther>
                ))}
              </Panel>
            </Collapse>
          </div>
        );
      })}

      {data?.none && (
        <div key={`none-${data?.none?.id}`}>
          <StyledPanelNone
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <Tooltip hack title={intl.formatMessage({ id: 'tooltip.metadata_link' })}>
              <Icon
                key={`services-icon-${data?.id}`}
                className={`clickable`}
                icon={'file-lines'}
                faBase={'far'}
                onClick={() => {
                  window.open(
                    window?.runConfig?.backendUrl + `/geonetwork/srv/api/records/${data?.metadataUuid}/formatters/xml`
                  );
                }}
              />
            </Tooltip>
          </StyledPanelNone>
        </div>
      )}

      <LicenceConfirmationLoginModal
        setShowModal={setShowLicenseConfirmationLoginModal}
        showModal={showLicenseConfirmationLoginModal}
      />
    </>
  );
};
