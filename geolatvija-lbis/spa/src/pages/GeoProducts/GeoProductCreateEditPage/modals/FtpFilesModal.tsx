import React from 'react';
import { Modal, Button, Table, Alert } from 'ui';
import { useIntl } from 'react-intl';
import dayjs from 'dayjs';
import useQueryApiClient from '../../../../utils/useQueryApiClient';

interface FtpFilesModalProps {
  isOpen: boolean;
  setIsOpen: Function;
  files: Object[];
  setFiles: React.Dispatch<React.SetStateAction<Object[]>>;
  id?: number;
}

const FtpFilesModal = ({ id, setFiles, isOpen, setIsOpen, files }: FtpFilesModalProps) => {
  const intl = useIntl();

  // useEffect(() => {
  //   if (id && id !== 0) {
  //     initialLoad();
  //   }
  // }, [id]);

  const { data, refetch } = useQueryApiClient({
    request: {
      url: `/api/v1/ftp/load/${id}`,
      disableOnMount: !id,
    },
    onSuccess(response) {
      setFiles(response.files);
    },
  });

  const columns = [
    {
      title: intl.formatMessage({ id: 'geoproducts.file_name' }),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({ id: 'geoproducts.load_date' }),
      dataIndex: 'createdAt',
      render: (value: string) => value && dayjs(value).format('DD.MM.YYYY HH:mm'),
    },
  ];

  return (
    <Modal
      open={isOpen}
      destroyOnClose={true}
      onCancel={() => setIsOpen(false)}
      footer={
        <>
          <Button label={intl.formatMessage({ id: 'general.close' })} onClick={() => setIsOpen(false)} />
          <Button type="primary" label={intl.formatMessage({ id: 'general.refresh' })} onClick={refetch} />
        </>
      }
      title={intl.formatMessage({ id: 'geoproducts.files' })}
    >
      {data?.isSyncing && (
        <Alert type="warning" message={intl.formatMessage({ id: 'geoproducts.files_is_syncing' })} className="mb-4" />
      )}
      {!files?.length && (
        <Alert type="warning" message={intl.formatMessage({ id: 'geoproducts.files_info_block' })} className="mb-4" />
      )}
      <Table dataSource={files} columns={columns} rowKey="name" className="half-size" />
    </Modal>
  );
};

export default FtpFilesModal;
