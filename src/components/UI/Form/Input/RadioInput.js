import React from 'react';
import { Field } from 'formik'

//Lazy loading for Code Splitting
import asyncComponent from '../../../../hoc/AsyncComponent/AsyncComponent';

const Radio = asyncComponent(()=>import('@material-ui/core/Radio'));

const RadioInputComponent = ({
                                 field, // { name, value, onChange, onBlur }
                                 form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                 ...props
                             }) => {
    return (
        <Radio
            name={field.name}
            value={props.value}
            checked={props.checked}
            onChange={field.onChange}
        />
    );
};

const RadioInput = ({
                        id,
                        name,
                        value,
                        onChange,
                        className,
                        checked,
                        ...props
                    }) => {
    return (
        <Field
            component={RadioInputComponent}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            className={className}
            checked={checked}
            {...props}
        />

    )
};

export default RadioInput;