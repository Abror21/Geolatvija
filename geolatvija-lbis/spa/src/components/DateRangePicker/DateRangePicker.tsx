import React, { useState } from 'react';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import dayjs, { Dayjs } from 'dayjs';
import { Button } from '../../ui';
import { Disabled, Validations } from '../../interfaces/shared';
import { Rule } from 'rc-field-form/lib/interface';
import useFormValidation from '../../utils/useFormValidation';
import { Form } from 'antd';
import { StyledDateRangePickerContainer } from './styles';
import { FormInstance } from 'antd/es/form/hooks/useForm';
import { DateRangePickerInput } from './DateRangePickerInput';
import { useIntl } from 'react-intl';
import { latvian_lv } from './latvian_lv';
import 'react-multi-date-picker/styles/colors/green.css';

interface DateRangeInputProps extends Disabled, Validations {
  placeholder?: [string, string];
  rules?: Rule[];
  label?: string;
  name?: string;
  value?: { start: Dayjs | null; end: Dayjs | null };
  onChange?: (dates: { start: Dayjs | null; end: Dayjs | null }) => void;
  form: FormInstance;
  triggerFieldsTouched?: (value: boolean) => void;
}

const CustomDatePicker = ({
  value = { start: null, end: null },
  onChange,
  name = 'range',
  validations,
  label,
  rules,
  placeholder,
  form,
  triggerFieldsTouched,
  disabled,
}: DateRangeInputProps) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(value.start);
  const [endDate, setEndDate] = useState<Dayjs | null>(value.end);
  const [monthPicker, setMonthPicker] = useState(false);

  const { formValidations } = useFormValidation();
  const intl = useIntl();

  const handleRangeChange = (dates: DateObject[] | null) => {
    if (Array.isArray(dates) && dates.length === 2) {
      let start = dates[0] ? dayjs(dates[0].toDate()) : null;
      let end = dates[1] ? dayjs(dates[1].toDate()) : null;

      if (monthPicker && start && end) {
        end = end.endOf('month');
      }

      setStartDate(start);
      setEndDate(end);

      form.setFieldValue([name, 'start'], start?.toISOString());
      form.setFieldValue([name, 'end'], end?.toISOString());
      triggerFieldsTouched?.(true);

      onChange?.({ start, end });
    }
  };

  const datePickerValue = [
    startDate ? new DateObject(startDate.toDate()) : null,
    endDate ? new DateObject(endDate.toDate()) : null,
  ].filter(Boolean) as DateObject[];

  const mapDays = ({ date, selectedDate }: { date: DateObject; selectedDate: DateObject | DateObject[] }) => {
    if (Array.isArray(selectedDate) && selectedDate[0] && !selectedDate[1]) {
      const startDay = dayjs(selectedDate[0].toDate());
      const currentDay = dayjs(date.toDate());
      let diffDays = currentDay.diff(startDay, 'day') + 1;

      if (currentDay.isSame(startDay, 'day')) {
        diffDays = 1;
      }

      if (currentDay.isBefore(startDay)) {
        diffDays = startDay.diff(currentDay, 'day') + 1;
      }

      return {
        className: 'hover-tooltip',
        'data-tooltip': `${diffDays} ${
          diffDays === 1
            ? intl.formatMessage({ id: 'datepicker_tooltip_day' })
            : intl.formatMessage({ id: 'datepicker_tooltip_days' })
        }`,
      };
    }

    return {};
  };

  const onClear = () => {
    setStartDate(null);
    setEndDate(null);
    form.setFieldValue([name, 'start'], null);
    form.setFieldValue([name, 'end'], null);
    triggerFieldsTouched?.(true);
    onChange?.({ start: null, end: null });
  };

  return (
    <Form.Item name={name} label={label} rules={validations ? formValidations(validations) : rules}>
      <StyledDateRangePickerContainer>
        <DatePicker
          className="green"
          locale={latvian_lv}
          mapDays={mapDays}
          onlyMonthPicker={monthPicker}
          render={(value, openCalendar) => (
            <DateRangePickerInput
              disabled={disabled}
              name={name}
              value={value}
              openCalendar={openCalendar}
              endDate={endDate}
              startDate={startDate}
              onClear={onClear}
              placeholder={placeholder}
            />
          )}
          range
          rangeHover
          value={datePickerValue}
          onChange={handleRangeChange}
          format="DD.MM.YYYY"
          weekStartDayIndex={1}
        >
          <div className="footer-wrapper">
            <Button
              type={monthPicker ? 'default' : 'primary'}
              label={intl.formatMessage({ id: 'datepicker_button_days' })}
              onClick={() => setMonthPicker(false)}
            />
            <Button
              type={!monthPicker ? 'default' : 'primary'}
              label={intl.formatMessage({ id: 'datepicker_button_months' })}
              onClick={() => setMonthPicker(true)}
            />
          </div>
        </DatePicker>
      </StyledDateRangePickerContainer>
    </Form.Item>
  );
};

export default CustomDatePicker;
