import React, { type Dispatch, type SetStateAction, useMemo, useState } from 'react';
import { Button, Label, Modal } from '../../../ui';
import dayjs from 'dayjs';
import { GeoProductTableType } from '../../../pages/Orders';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { useUserState } from '../../../contexts/UserContext';
import { useSystemSettingState } from '../../../contexts/SystemSettingContext';
import { GeoProductNotAvailableModal } from '../GeoProductNotAvailableModal';
import { StyledFilesListWrapper } from './styles';
import { extractPVN } from '../../../utils/extractPVN';

type ViewOrderDetailsModalProps = {
  selectedOrder: any;
  activeTab: string;
  showInformationModal: boolean;
  setShowInformationModal: Dispatch<SetStateAction<boolean>>;
};

export function ViewOrderDetailsModal({
  selectedOrder,
  activeTab,
  showInformationModal,
  setShowInformationModal,
}: ViewOrderDetailsModalProps) {
  const [showModalGeoProductNotAvailable, setShowModalGeoProductNotAvailable] = useState<boolean>(false);

  const navigate = useNavigate();
  const intl = useIntl();
  const user = useUserState();
  const settings = useSystemSettingState();

  const parsedLimitationType = useMemo(() => {
    if (!!selectedOrder?.serviceLimitationType) {
      return JSON.parse(selectedOrder?.serviceLimitationType) as string[];
    }

    return null;
  }, [selectedOrder?.serviceLimitationType]);

  const translatedLimitationTypes = useMemo(() => {
    const translatedText: string[] = [];

    parsedLimitationType?.forEach((el) => {
      switch (el) {
        case 'ONLY_GEOPORTAL':
          translatedText.push(intl.formatMessage({ id: 'order.only_geoportal' }));
          break;
        case 'IP_ADDRESS':
          translatedText.push(intl.formatMessage({ id: 'order.by_ip' }));
          break;
        case 'PERIOD':
          translatedText.push(intl.formatMessage({ id: 'order.by_period' }));
          break;
      }
    });

    return translatedText.join(', ');
  }, [parsedLimitationType, intl]);

  const pvn = useMemo(() => {
    return extractPVN(selectedOrder.paymentAmount, parseFloat(settings.pvn));
  }, [settings.pvn, selectedOrder.paymentAmount]);

  const onOpenButtonClick = () => {
    if ((!!selectedOrder.geoProductDeletedAt || !selectedOrder.geoProductIsPublic) && !!selectedOrder.geoProductId) {
      setShowInformationModal(false);
      setShowModalGeoProductNotAvailable(true);
    } else {
      navigate(`/main?geoProductId=${selectedOrder.geoProductId}`);
    }
  };

  const onOrderButtonClick = () => {
    if ((!!selectedOrder.geoProductDeletedAt || !selectedOrder.geoProductIsPublic) && !!selectedOrder.geoProductId) {
      setShowInformationModal(false);
      setShowModalGeoProductNotAvailable(true);
    } else {
      if (selectedOrder.geoProductFileId) {
        navigate(
          `/main?geoProductId=${selectedOrder.geoProductId}&geoProductFileId=${selectedOrder.geoProductFileId}&geoOrderId=${selectedOrder.id}`
        );
      }

      if (selectedOrder.geoProductServiceId) {
        navigate(
          `/main?geoProductId=${selectedOrder.geoProductId}&geoProductServiceId=${selectedOrder.geoProductServiceId}&geoOrderId=${selectedOrder.id}`
        );
      }
    }
  };

  const getDescriptionUsageRequest = () => {
    const usageRequest =
      !!selectedOrder.fileUsageRequest || !!selectedOrder.serviceUsageRequest
        ? JSON.parse(selectedOrder.fileUsageRequest ?? selectedOrder.serviceUsageRequest)
        : [];
    return !!usageRequest.includes('description');
  };

  return (
    <>
      <Modal
        open={showInformationModal}
        footer={
          <>
            {activeTab === GeoProductTableType.ordered && (
              <Button
                type="primary"
                disabled={selectedOrder.status === 'INACTIVE'}
                label={intl.formatMessage({ id: 'general.open' })}
                onClick={onOpenButtonClick}
              />
            )}
            {selectedOrder.status !== 'ACTIVE' && (
              <>
                <Button
                  type="primary"
                  label={intl.formatMessage({
                    id: activeTab === GeoProductTableType.confirmed ? 'order.confirmed_apply' : 'general.order',
                  })}
                  onClick={onOrderButtonClick}
                />
                {activeTab === GeoProductTableType.confirmed && (
                  <Button
                    type="primary"
                    label={intl.formatMessage({
                      id: 'general.close',
                    })}
                    onClick={() => setShowInformationModal(false)}
                  />
                )}
              </>
            )}
          </>
        }
        onCancel={() => setShowInformationModal(false)}
        title={intl.formatMessage({
          id:
            activeTab === GeoProductTableType.ordered
              ? 'order.information_about_order'
              : 'order.information_about_confirmed_order',
        })}
        width={700}
      >
        <div className="grid grid-cols-2 gap-20">
          <Label label={intl.formatMessage({ id: 'order.date' })} />
          <Label color="primary" label={dayjs(selectedOrder.createdAt).format('DD.MM.YYYY HH:mm')} />

          <Label label={intl.formatMessage({ id: 'order.order_number' })} />
          <Label color="primary" label={selectedOrder.id} />

          <Label label={intl.formatMessage({ id: 'order.order_status' })} />
          <Label color="primary" label={selectedOrder.orderStatusClassifier} />

          {!!selectedOrder.filesAvailability && (
            <>
              <Label label={intl.formatMessage({ id: 'order.file_download_available_until' })} />
              <Label color="primary" label={dayjs(selectedOrder.filesAvailability).format('DD.MM.YYYY HH:mm')} />
            </>
          )}

          <Label label={intl.formatMessage({ id: 'order.data_requester_name' })} />
          <Label color="primary" label={user.name + ' ' + user.surname} />

          <Label label={intl.formatMessage({ id: 'order.data_requester_personal_code' })} />
          <Label color="primary" label={user.personalCode} />

          <Label label={intl.formatMessage({ id: 'order.licence_type' })} />
          <Label
            color="primary"
            label={
              (selectedOrder.licenseType || selectedOrder.fileLicenseType) &&
              intl.formatMessage({
                id: 'order.licence.' + (selectedOrder.licenseType || selectedOrder.fileLicenseType),
              })
            }
          />

          <Label label={intl.formatMessage({ id: 'order.geoproducts' })} />
          <Label color="primary" label={selectedOrder.geoProductName} />

          <Label label={intl.formatMessage({ id: 'order.geoproduct_type' })} />
          <Label
            color="primary"
            label={
              selectedOrder.geoProductServiceId
                ? intl.formatMessage({ id: 'order.service' })
                : intl.formatMessage({ id: 'order.file' })
            }
          />

          <Label label={intl.formatMessage({ id: 'order.data_owner' })} />
          <Label color="primary" label={selectedOrder.ownerInstitutionName} />

          <Label label={intl.formatMessage({ id: 'order.licence_agreement' })} />
          <Label
            color="primary"
            label={intl.formatMessage({ id: selectedOrder.confirmedRules ? 'order.accept' : 'order.reject' })}
          />

          {getDescriptionUsageRequest() && (
            <>
              <Label label={intl.formatMessage({ id: 'order.data_owner_description' })} />
              <Label color="primary" label={selectedOrder?.description} />
            </>
          )}

          {activeTab === GeoProductTableType.confirmed ? (
            <>
              <Label label={intl.formatMessage({ id: 'order.usage_rules' })} />
              <Label color="primary" label={translatedLimitationTypes} />

              <Label label={intl.formatMessage({ id: 'order.available_only_in_geoportal' })} />
              <Label
                color="primary"
                label={intl.formatMessage({
                  id: parsedLimitationType?.includes('ONLY_GEOPORTAL') ? 'general.yes' : 'general.no',
                })}
              />

              <Label label={intl.formatMessage({ id: 'order.by_ip' })} />
              <Label color="primary" label={selectedOrder?.ipLimitation} />

              <Label label={intl.formatMessage({ id: 'order.by_period' })} />
              <Label
                color="primary"
                label={
                  !!selectedOrder?.period &&
                  `${dayjs().format('DD.MM.YYYY')} - ${dayjs(selectedOrder?.period).format('DD.MM.YYYY')}`
                }
              />
            </>
          ) : (
            <>
              {/*<Label label={intl.formatMessage({ id: 'order.chosen_geoproduct_amount_pvn' })} />*/}
              {/*<Label color="primary" label={'€ ' + pvn.pvnAmount} />*/}

              {/*<Label label={intl.formatMessage({ id: 'order.chosen_geoproduct_amount_without_pvn' })} />*/}
              {/*<Label color="primary" label={'€ ' + pvn.withoutPVN} />*/}

              <Label label={intl.formatMessage({ id: 'order.chosen_geoproduct_amount_with_pvn' })} />
              <Label color="primary" label={'€ ' + pvn.withPVN} />
            </>
          )}

          {!!selectedOrder.attachmentsDisplayNames && (
            <>
              <div>
                <br />
              </div>
              <div>
                <br />
              </div>

              <Label label={intl.formatMessage({ id: 'order.ordered_files' })} />
              <StyledFilesListWrapper>
                {selectedOrder.attachmentsDisplayNames.map((name: string) => (
                  <Label color="primary" label={name} />
                ))}
              </StyledFilesListWrapper>
            </>
          )}
        </div>
      </Modal>
      <GeoProductNotAvailableModal
        setShowModal={setShowModalGeoProductNotAvailable}
        showModal={showModalGeoProductNotAvailable}
      />
    </>
  );
}
