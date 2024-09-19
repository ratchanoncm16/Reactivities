
import { useField } from 'formik';
import { Form, Label } from 'semantic-ui-react';
//import React from 'react';
import DatePicker from 'react-datepicker'
//import { ReactDatePickerCustomHeaderProps } from 'react-datepicker';

interface Props {
    placeholder: string;
    name: string;
    label?: string;
}

export default function MyDateInput(props: Partial<Props>) {
  const [field, meta, helper] = useField(props.name!);
  return (
    <Form.Field error={meta.touched && !!meta.error}>
       <DatePicker 
        {...field}
        {...props}
        selected={(field.value && new Date(field.value)) || null}
        onChange={value => helper.setValue(value)}
        dateFormat='dd MMM yyyy h:mm'
       />
        {meta.touched && meta.error ? (
            <Label basic color='red'>{meta.error}</Label>
        ) : null}
    </Form.Field>
  )
}
