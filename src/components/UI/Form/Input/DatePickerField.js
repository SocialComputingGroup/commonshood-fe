import React from 'react';

import { DatePicker } from 'material-ui-pickers';

const DatePickerField = ({ field, form, ...props }) => {
    const currentError = form.errors[field.name];
    const touched = form.touched[field.name];
    const { onBlur } = field;

    return (
        <DatePicker
            keyboard
            autoOk
            name={field.name}
            value={field.value}
            helperText={touched && currentError ? currentError : undefined}
            error={touched && Boolean(currentError)}
            //onError={(_, error) => form.setFieldError(field.name, error)}
            onChange={date => form.setFieldValue(field.name, date, true)}
            onBlur={onBlur}
            mask={value => (value ? [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] : [])}
            {...props}
        />
    );
};

export default DatePickerField;