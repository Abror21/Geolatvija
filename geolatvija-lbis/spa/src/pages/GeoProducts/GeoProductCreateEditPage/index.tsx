import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { Button, DatePicker, Modal, Spinner, Steps } from 'ui';
import { ButtonListModal, StyledDivider, StyledPage } from 'styles/layout/form';
import { Form, Row, Space } from 'antd';
import FirstStep from './steps/FirstStep';
import SecondStep from './steps/SecondStep';
import useQueryApiClient from 'utils/useQueryApiClient';
import { UploadFile } from 'antd/lib/upload/interface';
import { useNavigate, useParams } from 'react-router-dom';
import { pages } from 'constants/pages';
import DefaultLayout from '../../../components/DefaultLayout';
import ThirdStep from './steps/ThirdStep';
import dayjs from 'dayjs';
import { useUserState } from '../../../contexts/UserContext';
import CustomGeoProductActionModal from './modals/CustomGeoProductActionModal';
import MetadataResponseModal, { MetadataStatus } from './modals/MetadataResponseModal';
import { routes } from '../../../config/config';

export type MetadataResponse = {
  report: string;
  status: MetadataStatus;
};

export type DivEndIndex = {
  servicesEndIndex: number;
  filesEndIndex: number;
  othersEndIndex: number;
};

const enableInspireValidationOnPublish = window?.runConfig?.enableInspireValidationOnPublish;

const GeoProductCreateEditPage = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [showPublishModal, setShowPublishModal] = useState<boolean>(false);
  const [wantedToPublish, setWantedToPublish] = useState<boolean>(false);

  const [divEndIndex, setDivEndIndex] = useState<DivEndIndex>({
    servicesEndIndex: 0,
    filesEndIndex: 0,
    othersEndIndex: 0,
  });

  const { id } = useParams();
  const [_id, setId] = useState<string | undefined>(id);

  const [isInspired, setIsInspired] = useState(false);
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [metadataEID, setMetadataEID] = useState<string>();
  const [inspireLoopIsWorking, setInspireLoopIsWorking] = useState(false);
  const [openTabs, setOpenTabs] = useState<number[]>([]);
  const [metadataResponse, setMetadataResponse] = useState<MetadataResponse | undefined>();
  const firstInspireLoopPassed = useRef(false);
  const timePopupOpened = useRef(false);
  const publishing = useRef(false);

  const user = useUserState();

  const intl = useIntl();
  const [form] = Form.useForm();
  const [publishForm] = Form.useForm();
  const navigate = useNavigate();
  const formValues = form.getFieldsValue(true);
  const activeRole = user.roles.find((e) => e.id === user.selectedRole);

  // eslint-disable-next-line no-empty-pattern
  const {
    data: geoproductData,
    refetch,
    isLoading: isRefetchLoading,
  } = useQueryApiClient({
    request: {
      url: `api/v1/geoproducts/${id}`,
    },
    enabled: !!parseInt(id!),
    onSuccess: (values) => {
      const parse = {
        ...values,
        dataReleaseDate: values.dataReleaseDate && dayjs(values.dataReleaseDate),
        dataUpdatedAt: values.dataUpdatedAt && dayjs(values.dataUpdatedAt),
        publicFrom: !!values.publicFrom ? dayjs(values.publicFrom) : null,
        publicTo: !!values.publicTo ? dayjs(values.publicTo) : null,
        filesData: values.filesData.map((e: any) => {
          let parsed = { ...e };

          if (parsed.frequencyDate) {
            parsed.frequencyDate = dayjs(parsed.frequencyDate);
          }

          return parsed;
        }),
      };

      form.setFieldsValue(parse);
      setIsInspired(values.isInspired);

      const servicesEndIndex = values?.services?.length;
      const filesEndIndex = servicesEndIndex + values?.filesData?.length;
      const othersEndIndex = filesEndIndex + values?.others?.length;

      setDivEndIndex({
        servicesEndIndex,
        filesEndIndex,
        othersEndIndex,
      });
    },
  });

  let intervalId: NodeJS.Timer;

  const { appendData: getInspireResponse } = useQueryApiClient({
    request: {
      url: `api/v1/geoproducts/${metadataEID}/inspire-response`,
      method: 'POST',
      disableOnMount: true,
    },
    onSuccess: (res: MetadataResponse | undefined) => {
      setMetadataResponse(res);

      if (!!id && publishing.current && !!res && !!Object.keys(res).length) {
        const publicTo = publishForm.getFieldValue('publicTo');
        const publicFrom = publishForm.getFieldValue('publicFrom');
        publishAppendData({ publicTo, publicFrom });
      } else if (!id && !!_id && !!res && !!Object.keys(res).length) {
        navigate(`/geoproducts/${_id}`);
      }
    },
    onError: () => {
      resetInspireLoopCheck();
      clearInterval(intervalId);
    },
  });

  // Wait for the response from inspire.
  // If first response is empty show modal which says validation can take up to 1 minute.
  // Else show modal with info accordingly to response from inspire.
  useEffect(() => {
    if (!enableInspireValidationOnPublish && publishing.current) return;
    if (!isInspired) return;

    if (!!metadataResponse && !!Object.keys(metadataResponse).length) {
      clearInterval(intervalId);
      setShowMetadataModal(true);
      setInspireLoopIsWorking(false);
      firstInspireLoopPassed.current = false;
    } else if (metadataEID) {
      intervalId = setInterval(() => {
        getInspireResponse({ geoProductId: _id });
        if (!firstInspireLoopPassed.current) firstInspireLoopPassed.current = true;
      }, 5000);
    }

    if (firstInspireLoopPassed.current && !timePopupOpened.current) {
      setShowMetadataModal(true);
      timePopupOpened.current = true;
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [metadataEID, metadataResponse, isInspired]);

  const { appendData: updateAppendData, isLoading: isUpdateLoading } = useQueryApiClient({
    request: {
      url: `api/v1/geoproducts/${id}?_method=PATCH`,
      method: 'POST',
      formData: true,
    },
    onSuccess: (res) => {
      refetch();
      setIsInspired(res.isInspired);

      if (res.isInspired && enableInspireValidationOnPublish) {
        setMetadataEID(res.inspireValidation);
        setInspireLoopIsWorking(true);
      } else if (publishing.current) {
        // Publish geo product.
        const publicTo = publishForm.getFieldValue('publicTo');
        const publicFrom = publishForm.getFieldValue('publicFrom');
        publishAppendData({ publicTo, publicFrom });
      }
    },
    onError: () => {
      resetInspireLoopCheck();
      setInspireLoopIsWorking(false);
    },
  });

  const { appendData: publishAppendData, isLoading: isPublishLoading } = useQueryApiClient({
    request: {
      url: `api/v1/geoproducts/${id}/publish`,
      method: 'POST',
    },
    onSuccess: () => navigate(pages.geoproduct.url),
    onError: (e) => {
      setShowPublishModal(false);
      resetInspireLoopCheck();
      setInspireLoopIsWorking(false);
      setWantedToPublish(true);

      if (e.code === 422) {
        setOpenTabs([1]);
        setCurrentStep(0);
      }
    },
    onFinally: () => {
      publishing.current = false;
    },
  });

  const { appendData, isLoading } = useQueryApiClient({
    request: {
      url: `api/v1/geoproducts`,
      method: 'POST',
      formData: true,
    },
    onSuccess: (res) => {
      setId(res.id);
      setIsInspired(res.isInspired);

      if (res.isInspired && enableInspireValidationOnPublish) {
        setMetadataEID(res.inspireValidation);
        setInspireLoopIsWorking(true);
      } else if (!id) {
        navigate(`/geoproducts/${res.id}`);
      }
    },
    onError: () => {
      resetInspireLoopCheck();
      setInspireLoopIsWorking(false);
    },
  });

  useEffect(() => {
    if (wantedToPublish) {
      setTimeout(() => {
        form.validateFields();
      }, 100);
    }
  }, [currentStep]);

  const resetInspireLoopCheck = () => {
    if (!!metadataResponse && !!Object.keys(metadataResponse).length) {
      setMetadataEID(undefined);
      setMetadataResponse(undefined);
      setInspireLoopIsWorking(false);
      firstInspireLoopPassed.current = false;
      timePopupOpened.current = false;
      publishing.current = false;
    }
  };

  useEffect(() => {
    if (!formValues['organizationName'])
      form.setFieldValue('organizationName', user.roles.find((e) => e.id === user.selectedRole)?.institutionName);
    if (!formValues['email']) form.setFieldValue('email', activeRole?.email);
  }, [formValues, user.selectedRole, activeRole?.email, user.roles]);

  const items = [
    {
      title: intl.formatMessage({ id: 'geoproducts.basic_information' }),
    },
    {
      title: intl.formatMessage({ id: 'geoproducts.type_of_distribution' }),
    },
    {
      title: intl.formatMessage({ id: 'geoproducts.summary' }),
    },
  ];

  const stepsElements = [
    <FirstStep inspireMetadata={isInspired} setInspireMetadata={setIsInspired} form={form} openTabs={openTabs} />,
    <SecondStep form={form} id={id} divEndIndex={divEndIndex} setDivEndIndex={setDivEndIndex} />,
    <ThirdStep form={form} />,
  ];

  const appendFileDynamically = (bodyFormData: FormData, files: UploadFile[]) => {
    return files.map((file: UploadFile) => {
      bodyFormData.append(`dynamicFiles[${file['uid']}]`, file.originFileObj!);

      return file['uid'];
    });
  };

  const onPublish = () => {
    setShowPublishModal(true);
    publishing.current = true;
  };

  const onSubmit = async () => {
    const values = { ...form.getFieldsValue(true) }; //parse for no mutations

    let bodyFormData = new FormData();

    const fileFields = ['licence', 'file', 'atom'];

    Object.entries(values).forEach((entry: any) => {
      if (entry[0] === 'photo' || entry[0] === 'dataSpecification') {
        return;
      }

      if (entry[0] === 'services' || entry[0] === 'filesData') {
        entry[1].forEach((innerEntry: any, index: number) => {
          fileFields.forEach((field) => {
            if (innerEntry?.[field]) {
              entry[1][index][field] = appendFileDynamically(
                bodyFormData,
                innerEntry?.[field].filter((item: any) => item?.uid)
              );
            }
          });
        });
      }

      if (entry[0] === 'dataReleaseDate' || entry[0] === 'dataUpdatedAt') {
        if (entry[1]) {
          bodyFormData.append(entry[0], dayjs(entry[1]).format('DD.MM.YYYY') || '');
        }

        return;
      }

      if (typeof entry[1] === 'object') {
        bodyFormData.append(entry[0], JSON.stringify(entry[1]));
        return;
      }

      bodyFormData.append(entry[0], entry[1]);
    });

    if (values?.photo) {
      bodyFormData.append('photo', values.photo[0]?.originFileObj as unknown as Blob);
    }

    if (values?.dataSpecification) {
      bodyFormData.append('dataSpecification', values.dataSpecification[0]?.originFileObj as unknown as Blob);
    }

    if (showPublishModal && id) {
      setShowPublishModal(false);
      updateAppendData(bodyFormData);
    } else if (id) {
      updateAppendData(bodyFormData);
    } else {
      appendData(bodyFormData);
    }
  };

  const handleSteps = async (type: 'add' | 'remove') => {
    if (type === 'add') {
      setCurrentStep(currentStep + 1);
    }

    if (type === 'remove') {
      setCurrentStep(currentStep - 1);
    }
  };

  const onCancelCheck = () => {
    if (form.isFieldsTouched([], true)) {
      setShowCancelModal(true);
      return;
    }

    onCancel();
  };

  const onCancel = () => {
    setShowCancelModal(false);
    navigate('/geoproducts');
  };

  //check if is changed
  const onBackCheck = () => {
    const isTouched = form.isFieldsTouched(['services', 'filesData', 'others', 'none']);

    if (isTouched) {
      setShowConfirmModal(true);
      return;
    }

    onBack();
  };

  const onBack = () => {
    if (currentStep === 1) {
      refetch();
    }

    setShowConfirmModal(false);
    setCurrentStep(currentStep - 1);
  };

  return (
    <DefaultLayout.PageLayout>
      <DefaultLayout.PageContent>
        <StyledPage>
          <DefaultLayout.PageHeader
            title={intl.formatMessage({
              id: id ? pages.geoproduct.edit.title : pages.geoproduct.create.title,
            })}
            breadcrumb={[
              {
                path: pages.geoproduct.url,
                name: intl.formatMessage({ id: pages.geoproduct.title }),
              },
            ]}
          />
          <Steps
            onChange={(current) => setCurrentStep(current)}
            current={currentStep}
            labelPlacement="vertical"
            items={items}
          />
          <StyledDivider />
          <Spinner
            spinning={isLoading || isPublishLoading || isUpdateLoading || isRefetchLoading || inspireLoopIsWorking}
          >
            <Form form={form} layout="vertical" onFinish={onSubmit}>
              {!(isLoading || isPublishLoading || isUpdateLoading || isRefetchLoading || inspireLoopIsWorking) &&
                stepsElements[currentStep]}
              <Row justify="space-between">
                <div>
                  {currentStep !== 0 && (
                    <Button label={intl.formatMessage({ id: 'general.back' })} onClick={() => onBackCheck()} />
                  )}
                </div>
                <Space size={10}>
                  {currentStep === 2 ? (
                    <>
                      <Button label={intl.formatMessage({ id: 'general.submit' })} onClick={onSubmit} />
                      {!!id && geoproductData?.status === 'DRAFT' && (
                        <Button
                          type="primary"
                          label={intl.formatMessage({ id: 'general.publish' })}
                          onClick={onPublish}
                        />
                      )}
                    </>
                  ) : (
                    <>
                      <Button label={intl.formatMessage({ id: 'general.cancel' })} onClick={onCancelCheck} />
                      <Button label={intl.formatMessage({ id: 'general.submit' })} onClick={onSubmit} />
                      <Button
                        type="primary"
                        label={intl.formatMessage({ id: 'general.continue' })}
                        onClick={() => handleSteps('add')}
                      />
                    </>
                  )}
                </Space>
              </Row>
              <Modal
                open={showPublishModal}
                footer={null}
                onCancel={() => setShowPublishModal(true)}
                title={intl.formatMessage({ id: 'geoproducts.publish_geoproduct' })}
              >
                <Form form={publishForm} layout={'vertical'}>
                  <DatePicker label={intl.formatMessage({ id: 'geoproducts.date_from' })} name="publicFrom" />
                  <DatePicker label={intl.formatMessage({ id: 'geoproducts.date_to' })} name="publicTo" />
                </Form>

                <Row justify="end">
                  <ButtonListModal>
                    <Button
                      label={intl.formatMessage({
                        id: 'general.cancel',
                      })}
                      onClick={() => setShowPublishModal(false)}
                    />
                    <Button
                      type="primary"
                      label={intl.formatMessage({
                        id: 'general.publish',
                      })}
                      htmlType="submit"
                    />
                  </ButtonListModal>
                </Row>
              </Modal>
            </Form>
          </Spinner>
          <CustomGeoProductActionModal
            setShowModal={setShowConfirmModal}
            showModal={showConfirmModal}
            manualOnModalContinue={onBack}
          />
          <CustomGeoProductActionModal
            confirmTextId="general.save.cancel"
            cancelButtonTextId="general.cancel"
            continueButtonTextId="general.submit"
            setShowModal={setShowCancelModal}
            showModal={showCancelModal}
            manualOnModalContinue={onSubmit}
            manualOnModalCancel={onCancel}
          />
          <MetadataResponseModal
            setShowModal={setShowMetadataModal}
            showModal={showMetadataModal}
            metadataResponse={metadataResponse}
            resetInspireLoopCheck={resetInspireLoopCheck}
            creatingNew={id === undefined}
          />
        </StyledPage>
      </DefaultLayout.PageContent>
    </DefaultLayout.PageLayout>
  );
};

export default GeoProductCreateEditPage;
