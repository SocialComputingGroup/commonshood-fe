import React from "react";

//Lazy loading for Code Splitting
// import asyncComponent from '../../../../hoc/AsyncComponent/AsyncComponent';
//
// const TextField = asyncComponent(()=> import("@material-ui/core/TextField"));
import TextField from '@material-ui/core/TextField'

const TextInput = ({ field, ...props }) => {

    const { errMessage, touched, ...otherProps } = props;
    const { name, onChange, onBlur } = field;
    return (
        <TextField
            name={name}
            error={touched && errMessage ? true : false}
            helperText={touched && errMessage ? errMessage : undefined}
            onChange={onChange}
            onBlur={onBlur}
            {...otherProps}
        />
    );
};
export default TextInput;