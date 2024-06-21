import { useIntl } from 'react-intl';
import { FormInstance } from 'antd/es/form/hooks/useForm';
import parse from 'html-react-parser';
import React, { useEffect, useState } from 'react';
import { Label, Tag } from 'ui';
import Profile from 'components/Profile';
import { StyledImage, StyledPreviewDivider, StyledPreviewWrapper } from './styles';
import { StyledSummaryField } from 'styles/layout/form';
import { Space } from 'antd';
import useQueryApiClient from 'utils/useQueryApiClient';

interface PreviewProps {
  form: FormInstance;
}

const Preview = ({ form }: PreviewProps) => {
  const [seeMore, setSeeMore] = useState<boolean>(false);
  const formValues = form.getFieldsValue(true);
  const intl = useIntl();

  const [coordinateSystem, setCoordinateSystem] = useState('');

  const { data: options } = useQueryApiClient({
    request: {
      url: `api/v1/classifiers/select/KL1`,
    },
  });

  const { refetch: fetchCoordinateSystemOptions } = useQueryApiClient({
    request: {
      url: `api/v1/classifiers/select/KL2`,
      disableOnMount: true,
    },
    onSuccess: (res) => {
      setCoordinateSystem(res.find((c: any) => c.id === formValues?.coordinateSystemClassifierValueId)?.translation);
    },
  });

  useEffect(() => {
    if (formValues?.coordinateSystemClassifierValueId) fetchCoordinateSystemOptions();
  }, [formValues?.coordinateSystemClassifierValueId]);

  const content = (
    <>
      <StyledSummaryField>
        <Label bold label={intl.formatMessage({ id: 'geoproducts.coordinate_system' })} />
        <Label bold className="primary" label={coordinateSystem} />
      </StyledSummaryField>

      <StyledPreviewDivider />

      <div>
        <StyledSummaryField className="mb-4">
          <Label bold label={intl.formatMessage({ id: 'geoproducts.data_update' })} />
          <Label
            bold
            className="primary"
            label={options?.find((e: any) => e.id === formValues?.regularityRenewalClassifierValueId)?.translation}
          />
        </StyledSummaryField>
        {formValues?.photo?.[0]?.id && (
          <StyledImage
            src={window?.runConfig?.backendUrl + `/api/v1/storage/${formValues?.photo?.[0]?.id}`}
            alt={`${formValues?.name || ''} Image`}
          />
        )}
        <div className="mt-4">
          {formValues?.tags?.map((tag: string, index: number) => (
            <Tag key={index} label={tag} color="green" />
          ))}
        </div>
      </div>

      <StyledPreviewDivider />

      <StyledSummaryField>
        <Label bold label={intl.formatMessage({ id: 'geoproducts.data_specification' })} />
        <Label className="primary" label={formValues?.dataSpecification?.[0]?.displayName} />
      </StyledSummaryField>

      <StyledPreviewDivider />
      <Space direction="vertical" size={20}>
        <Label bold label={intl.formatMessage({ id: 'general.contact_info' })} />
        <div>
          <Profile img={'/img/map/orto.png'} email={formValues?.email} name={formValues?.organizationName} />
        </div>
      </Space>
    </>
  );

  return (
    <StyledPreviewWrapper>
      <div>
        <Label className="preview__description" label={parse(formValues?.description ?? '')} />
        <Label
          clickable
          onClick={() => setSeeMore((old) => !old)}
          className="mt-4 mb-4 primary"
          bold
          label={
            seeMore ? intl.formatMessage({ id: 'general.see_less' }) : intl.formatMessage({ id: 'general.see_more' })
          }
        />
      </div>
      {seeMore && content}
    </StyledPreviewWrapper>
  );
};

export default Preview;
