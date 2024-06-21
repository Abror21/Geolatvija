import React, { createContext, type Dispatch, type SetStateAction, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Form } from 'antd';
import { FormInstance } from 'antd/es/form/hooks/useForm';

export const PlannedDocumentsFilterContext = createContext({} as PlannedDocumentsFilterContextProps);

export interface PlannedDocumentsFilterContextProps {
  filterParams: FilterParamsType;
  setFilterParams: Dispatch<SetStateAction<FilterParamsType>>;
  form: FormInstance<FilterParamsType>;
  resetFilterInputs: Function;
}
export interface PlannedDocumentsFilterContextProviderProps {
  children: React.ReactNode;
}

interface FilterParamsType {
  organization?: number[];
  search?: string;
  status?: number[];
  bbox?: string;
  page?: number;
}

export const usePlannedDocumentsFilterContext = () => {
  return useContext(PlannedDocumentsFilterContext);
};

const PlannedDocumentsFilterContextProvider = ({ children }: PlannedDocumentsFilterContextProviderProps) => {
  let [searchParams] = useSearchParams();
  const searchString = searchParams.get('search');
  const storedDataString = sessionStorage.getItem('filterValues');
  const storedData = storedDataString ? JSON.parse(storedDataString) : null;

  const [filterParams, setFilterParams] = useState<FilterParamsType>(
    !!searchString ? { ...storedData, search: searchString } : storedData
  );

  const [form] = Form.useForm<FilterParamsType>();

  useEffect(() => {
    if (storedData && !filterParams?.bbox) {
      if (!form.isFieldTouched('search')) {
        form.setFieldValue('search', storedData.search || '');
      }
      if (!form.isFieldTouched('organization')) {
        form.setFieldValue('organization', storedData.organization || []);
      }
      if (!form.isFieldTouched('status')) {
        form.setFieldValue('status', storedData.status || []);
      }
    }
  }, [storedData, form, filterParams?.bbox]);

  useEffect(() => {
    if (!!searchString) {
      form.setFieldValue('search', searchString);
    }
  }, [form, searchString]);

  const resetFilterInputs = () => {
    form.setFieldValue('status', undefined);
    form.setFieldValue('search', undefined);
    form.setFieldValue('organization', undefined);
  };

  return (
    <PlannedDocumentsFilterContext.Provider value={{ filterParams, setFilterParams, form, resetFilterInputs }}>
      {children}
    </PlannedDocumentsFilterContext.Provider>
  );
};

export default PlannedDocumentsFilterContextProvider;
