
import { useField } from 'formik';
import { Form, Label } from 'semantic-ui-react';
//import React from 'react';
// import DatePicker from 'react-datepicker'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
//import { ReactDatePickerCustomHeaderProps } from 'react-datepicker';

interface Props {
    placeholder: string;
    name: string;
    label?: string;
}

export default function MyDateInput(props: Partial<Props>) {
  const [field, meta, helpers] = useField(props.name!);
  return (
    <Form.Field error={meta.touched && !!meta.error}>
       {/* <DatePicker 
        {...field}
        {...props}
        selected={(field.value && new Date(field.value)) || null}
        onChange={value => helper.setValue(value)}
        dateFormat='dd MMM yyyy h:mm'
       /> */}
    <DatePicker placeholderText='Date' showTimeSelect timeCaption="time" dateFormat='MMMM d, yyyy h:mm aa' 
            selected={(field.value && new Date(field.value)) || null}
            onChange={(value => helpers.setValue(value))}
            isClearable
            showYearDropdown
            scrollableYearDropdown
        />

{/* <DatePicker {...field} {...props} selected={(field.value && new Date(field.value)) || null}
                onChange={(value => helpers.setValue(value))}>
            </DatePicker> */}

        {meta.touched && meta.error ? (
            <Label basic color='red'>{meta.error}</Label>
        ) : null}
    </Form.Field>
  )
}
