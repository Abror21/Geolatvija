import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Button, Switch, Table } from 'ui';
import useQueryApiClient from 'utils/useQueryApiClient';
import { ColumnsType } from 'antd/lib/table/interface';
import { Form, Space, Row } from 'antd';
import { ButtonList } from '../../../../styles/layout/table';

interface Role {
  id: number;
  name: string;
}

interface UiMenu {
  id: number;
  description: string;
  translation: string;
}

const RightsListTable = () => {
  const intl = useIntl();

  const [form] = Form.useForm();

  const { data: roles } = useQueryApiClient({
    request: {
      url: 'api/v1/roles',
      data: {
        options: [],
        pageSize: 999,
      },
    },
  });

  const {
    data: rights,
    refetch,
    isLoading,
  } = useQueryApiClient({
    request: {
      url: '/api/v1/rights',
    },
    onSuccess: (response) => {
      let parsed: any = {};

      response.forEach((el: any) => {
        parsed = {
          ...parsed,
          [el.userGroupId]: {
            ...parsed?.[el.userGroupId],
            [el.uiMenuId]: el.isAllowed,
          },
        };
      });

      form.setFieldsValue(parsed);
    },
  });

  const { appendData } = useQueryApiClient({
    request: {
      url: `api/v1/rights/update`,
      method: 'PATCH',
    },
    onSuccess: refetch,
  });

  const columns = useMemo(() => {
    const calculatedColumns: ColumnsType = [
      {
        title: intl.formatMessage({ id: 'user_management.menu_section' }),
        dataIndex: 'translation',
        render: (value: string) => value,
      },
    ];
    if (roles.data && Array.isArray(roles.data)) {
      roles.data.forEach((el: Role) => {
        calculatedColumns.push({
          title: el.name,
          render: (value: UiMenu) => {
            return <Switch name={[el.id, value.id.toString()]}></Switch>;
          },
        });
      });
    }
    return calculatedColumns;
  }, [roles, rights]);

  const prepareData = (values: any) => {
    const result = [];

    for (const userGroupId in values) {
      for (const uiMenuId in values[userGroupId]) {
        const isAllowed = values[userGroupId][uiMenuId];
        result.push({
          userGroupId,
          uiMenuId,
          isAllowed,
        });
      }
    }
    return result;
  };
  const onSubmit = async () => {
    const values = form.getFieldsValue(true);
    const preparedData = prepareData(values);
    appendData({ values: preparedData });
  };

  return (
    <div className="theme-container">
      <Form form={form} onFinish={onSubmit}>
        <Space direction="vertical" size={[20, 20]} style={{ width: '100%' }}>
          <Table url={'api/v1/ui-menu-list'} columns={columns} loading={isLoading} filter={{ isPublic: true }} />
          <Row justify="end">
            <ButtonList>
              <Button label={intl.formatMessage({ id: 'general.cancel' })} onClick={() => refetch()} />
              <Button label={intl.formatMessage({ id: 'general.save' })} onClick={() => form.submit()} type="primary" />
            </ButtonList>
          </Row>
        </Space>
      </Form>
    </div>
  );
};

export default RightsListTable;
