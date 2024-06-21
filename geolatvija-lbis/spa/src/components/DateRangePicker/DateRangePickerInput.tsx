import { Icon, Input } from '../../ui';
import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useIntl } from 'react-intl';
import { Disabled } from '../../interfaces/shared';

interface DateRangePickerInputProps extends Disabled {
  name: string;
  value: string;
  openCalendar: any;
  onClear: (event: any) => void;
  placeholder: [string, string] | undefined;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

export const DateRangePickerInput = ({
  name,
  value,
  placeholder,
  openCalendar,
  onClear,
  disabled,
}: DateRangePickerInputProps) => {
  const [start, setStart] = useState<string | undefined>();
  const [end, setEnd] = useState<string | undefined>();

  const intl = useIntl();

  return (
    <div className="input-wrapper">
      <Input
        name={[name, 'start']}
        className="first-input"
        disabled={disabled}
        onClick={openCalendar}
        value={start}
        prefix={<Icon onClick={openCalendar} icon="calendar-days" faBase="fa-light" />}
        readOnly
        placeholder={placeholder?.[0] ?? intl.formatMessage({ id: 'datepicker_placeholder_from' })}
        getValueProps={(value) => {
          setStart(!!value ? dayjs(value)?.format('DD.MM.YYYY') : '');
          return value;
        }}
      />
      <div className="separator" />
      <Input
        name={[name, 'end']}
        className="last-input"
        disabled={disabled}
        onClick={openCalendar}
        value={end}
        placeholder={placeholder?.[1] ?? intl.formatMessage({ id: 'datepicker_placeholder_to' })}
        readOnly
        suffix={
          !!value ? (
            <Icon onClick={onClear} className="clear-icon" icon="circle-xmark" faBase="fa-duotone" baseClass="" />
          ) : (
            <></>
          )
        }
        getValueProps={(value) => {
          setEnd(!!value ? dayjs(value)?.format('DD.MM.YYYY') : '');
          return value;
        }}
      />
    </div>
  );
};
