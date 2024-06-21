import React, { type Dispatch, type SetStateAction, useContext, useEffect, useState } from 'react';
import { SidebarDrawer } from 'ui';
import { useIntl } from 'react-intl';
import { Embedded } from './Embedded';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { UserEmbedContext } from '../../../../../contexts/UserEmbedContext';
import { Form } from 'antd';

interface SidebarsProps {
  setIsOpenedEmbedded: Dispatch<SetStateAction<boolean>>;
  isOpenEmbedded: boolean;
  setVisibleLayers: Dispatch<SetStateAction<string[] | undefined>>;
}

const Sidebars = ({ isOpenEmbedded, setIsOpenedEmbedded, setVisibleLayers }: SidebarsProps) => {
  const [selectedUserEmbed, setSelectedUserEmbed] = useState<number | null>(null);

  const [form] = Form.useForm();

  const { isOpen: isOpenEmbed, toggleHandler } = useContext(UserEmbedContext);

  let [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const intl = useIntl();

  useEffect(() => {
    if (searchParams.get('embedId')) {
      setSelectedUserEmbed(parseInt(searchParams.get('embedId') || ''));
      setIsOpenedEmbedded(true);
    }
  }, [searchParams]);

  const clearSearchParams = () => {
    searchParams.delete('embedId');
    navigate(location.pathname);
    setSelectedUserEmbed(null);
  };

  const closeUserEmbed = () => {
    setIsOpenedEmbedded(false);
    setSelectedUserEmbed(null);
    clearSearchParams();
    toggleHandler();
    form.resetFields();
  };

  useEffect(() => {
    if (selectedUserEmbed) {
      setIsOpenedEmbedded(true);
    }
  }, [selectedUserEmbed]);

  useEffect(() => {
    setIsOpenedEmbedded(false);
  }, [isOpenEmbed]);

  return (
    <>
      <SidebarDrawer
        title={
          selectedUserEmbed
            ? intl.formatMessage({ id: 'embedded.edit_embedded_map_window' })
            : intl.formatMessage({ id: 'embedded.embedded_map_window' })
        }
        isOpen={isOpenEmbedded}
        onClose={closeUserEmbed}
      >
        <Embedded
          id={selectedUserEmbed}
          clearSearchParams={clearSearchParams}
          form={form}
          setVisibleLayers={setVisibleLayers}
          isOpen={isOpenEmbedded}
        />
      </SidebarDrawer>
    </>
  );
};

export default Sidebars;
