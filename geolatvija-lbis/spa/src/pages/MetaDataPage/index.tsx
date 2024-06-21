import React from 'react';
import { StyledPage } from 'styles/layout/SidebarMap';

const MetaDataPage = () => {
  return (
    <StyledPage>
      <div style={{ width: '100%' }}>
        <iframe
          src={'https://geo-network-dev.esynergy.lv/geonetwork/geo/eng/catalog.search#/search?from=1&to=30'}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </StyledPage>
  );
};

export default MetaDataPage;
