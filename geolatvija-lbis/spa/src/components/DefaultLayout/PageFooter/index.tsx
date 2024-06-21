import React from 'react';
import { StyledPage, StyledHrefComponent } from './style';
import { Icon, Label } from 'ui';
import { urlNavigation } from 'constants/navigation';
import { Link } from 'react-router-dom';
import useQueryApiClient from 'utils/useQueryApiClient';

interface UiMenuProps {
  uniqueKey: string;
  translation: string;
}

const PageFooter = () => {
  const { data: uiMenu } = useQueryApiClient({
    request: {
      url: 'api/v1/ui-menu-footer',
    },
  });

  return (
    <StyledPage>
      <Label className="copyright" label="© 2023 Valsts reģionālās attīstības aģentūra" />
      <div className="footer-sites">
        {uiMenu.map((text: UiMenuProps, index: number) => (
          <Link key={index} to={urlNavigation[text.uniqueKey] || '/predefined-page/' + text.uniqueKey}>
            {text.translation}
          </Link>
        ))}
      </div>
      <div className="end">
        <div className="contacts-entry">
          <Icon faBase="far" icon="envelope" />
          <StyledHrefComponent href="mailto:atbalsts@vraa.gov.lv">
            <Label label="atbalsts@vraa.gov.lv" />
          </StyledHrefComponent>
        </div>
      </div>
    </StyledPage>
  );
};

export default PageFooter;
