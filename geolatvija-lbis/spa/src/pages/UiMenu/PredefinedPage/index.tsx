import React, { useEffect } from 'react';
import { Spinner } from 'ui';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import useQueryApiClient from 'utils/useQueryApiClient';
import { PredefinedPageContent } from './styles';

const PredefinedPage = () => {
  const { key } = useParams();

  const { data, isLoading, refetch } = useQueryApiClient({
    request: {
      url: `api/v1/ui-menu/${key}/content`,
    },
  });

  useEffect(() => {
    if (!isLoading) {
      refetch();
    }
  }, [key]);

  return (
    <PredefinedPageContent>
      <Spinner spinning={isLoading}>{parse(data.content || '')}</Spinner>
    </PredefinedPageContent>
  );
};

export default PredefinedPage;
