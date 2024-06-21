import React, { createRef, useRef, useState } from 'react';
import { Button, Input, List, Switch } from 'ui';
import { useIntl } from 'react-intl';
import { useSearchParams } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { siteKey } from '../../../../config/config';
import { Form } from 'antd';
import { SearchInspireWrapper, StyledListContainer } from './styles';

interface GeoProductListProps {
  setSelectedGeoProduct: (id: number) => void;
  setSelectedTitle: (title: string) => void;
}

type FilterParams = {
  filter: {
    institutionName: string | null;
    search: string | null;
    inspire: boolean;
  };
};

const GeoProductList = ({ setSelectedGeoProduct, setSelectedTitle }: GeoProductListProps) => {
  let [searchParams] = useSearchParams();
  const searchString = searchParams.get('search');

  const [showCaptcha, setShowCaptcha] = useState<boolean>();
  const [recaptchaKey, setRecaptchaKey] = useState<string | null>();
  const [filterParams, setFilterParams] = useState<FilterParams>({
    filter: { institutionName: searchParams.get('institutionName'), search: searchString || null, inspire: false },
  });

  const ref = useRef<HTMLDivElement>(null);
  const recaptchaRef = createRef<ReCAPTCHA>();

  const intl = useIntl();

  const [form] = Form.useForm();

  const onFormFinish = (data: any) => {
    if (Object.values(data).length > 0) {
      const parsedData = {
        filter: {
          ...data,
        },
        recaptchaKey,
      };

      setFilterParams(parsedData);
      recaptchaRef?.current?.reset();
    }
  };

  return (
    <>
      <Form form={form} onFinish={onFormFinish}>
        <Input name="search" placeholder={intl.formatMessage({ id: 'geoproducts.search_geoproduct' })} />
        <SearchInspireWrapper>
          <Switch
            name="inspire"
            label={intl.formatMessage({ id: 'geoproducts.search_inspire' })}
            className="horizontal"
          />
        </SearchInspireWrapper>
        {showCaptcha && <ReCAPTCHA ref={recaptchaRef} sitekey={siteKey} onChange={(value) => setRecaptchaKey(value)} />}
        <Button type="primary" htmlType="submit" label={intl.formatMessage({ id: 'general.search' })} />
      </Form>
      <StyledListContainer ref={ref}>
        <List
          url="api/v1/public/geoproducts"
          useClientHeight={{
            ref,
            enable: true,
          }}
          // itemHeight={120}
          hoverItem={false}
          onSelect={(id: number) => setSelectedGeoProduct(id)}
          selectedTitle={(title: string) => setSelectedTitle(title)}
          filterParams={filterParams}
          properties={{ title: 'name', id: 'id' }}
          captcha={{
            captchaKeyIsSet: !!recaptchaKey,
            captchaEnabled: showCaptcha,
            setCaptchaEnabled: setShowCaptcha,
          }}
        />
      </StyledListContainer>
    </>
  );
};

export default GeoProductList;
