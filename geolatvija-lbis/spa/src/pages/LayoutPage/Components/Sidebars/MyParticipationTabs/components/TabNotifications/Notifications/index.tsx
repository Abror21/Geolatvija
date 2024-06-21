import { Button, Label, Table } from 'ui';
import { useIntl } from 'react-intl';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from 'contexts/NotificationContext';
import DeleteModal from 'components/Modals/DeleteModal';
import useMapDrawing from 'utils/useMapDrawing';

const Notifications = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reload, setReload] = useState<number>(0);
  const [selectedKey, setSelectedKey] = useState<number>(0);
  const [selectedNotificationData, setSelectedNotificationData] = useState<any>();
  const { coords, setCoords, setAddress } = useContext(NotificationContext);

  useMapDrawing({
    coords,
    setCoords,
    notificationData: selectedNotificationData,
    readOnly: true,
  });

  const columns = [
    {
      title: intl.formatMessage({ id: 'user.notification_application' }),
      dataIndex: 'name',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'user.notification_radius' }),
      dataIndex: 'radius',
      render: (value: string) => value + ' km',
    },
    {
      title: '',
      dataIndex: 'action',
      render: (value: string, record: any) => (
        <div className="action_btn">
          <Button type="link" onClick={() => handleEdit(record)} label={intl.formatMessage({ id: 'general.edit' })} />
          <Button
            type="link"
            onClick={() => handleDelete(record)}
            label={intl.formatMessage({ id: 'general.delete' })}
          />
        </div>
      ),
    },
  ];

  const handleEdit = (record: any) => {
    navigate(`/main?notification=${record?.id}`);
  };

  const handleDelete = (record: any) => {
    setSelectedKey(record.id);
    setShowDeleteModal(true);
  };
  const handleRowClick = (record: any) => {
    setSelectedNotificationData(record);
    if (record.address) {
      setAddress(record.address);
    }

    if (record.coordLKSLat && record.coordLKSLong) {
      setCoords([record.coordLKSLong, record.coordLKSLat]);
    } else {
      setCoords(undefined);
    }
  };

  return (
    <div className="notifications_sec">
      <Label
        className="title_notication"
        bold
        title
        label={intl.formatMessage({ id: 'user.notification_management' })}
      />
      <div className="theme-container">
        <Table
          onRow={(record: any) => ({
            onClick: () => handleRowClick(record),
          })}
          url="api/v1/user-notifications"
          rowClassName="clickable-row"
          columns={columns}
          reload={reload}
        />
      </div>
      <DeleteModal
        setRefresh={setReload}
        setShowModal={setShowDeleteModal}
        showModal={showDeleteModal}
        url="api/v1/user-notifications/"
        params={{ ids: [selectedKey] }}
      />
    </div>
  );
};

export default Notifications;
