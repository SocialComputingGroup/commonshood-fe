import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";

// core components

import customInputStyle from "../../../../../Kit/assets/jss/material-kit-pro-react/components/customInputStyle.jsx";

function CustomInput({ ...props }) {
  const {
    classes,
    formControlProps,
    labelText,
    id,
      name,
      touched,
    labelProps,
    inputProps,
    errMessage,
    white,
    inputRootCustomClasses,
    success
  } = props;

  console.log("Error Message: " + errMessage);
  const labelClasses = classNames({
    [" " + classes.labelRootError]: !!errMessage,
    [" " + classes.labelRootSuccess]: success && !errMessage
  });
  const underlineClasses = classNames({
    [classes.underlineError]: !!errMessage,
    [classes.underlineSuccess]: success && !errMessage,
    [classes.underline]: true,
    [classes.whiteUnderline]: white
  });
  const marginTop = classNames({
    [inputRootCustomClasses]: inputRootCustomClasses !== undefined
  });
  const inputClasses = classNames({
    [classes.input]: true,
    [classes.whiteInput]: white
  });
  let formControlClasses;
  if (formControlProps !== undefined) {
    formControlClasses = classNames(
      formControlProps.className,
      classes.formControl
    );
  } else {
    formControlClasses = classes.formControl;
  }
  return (
    <FormControl {...formControlProps} className={formControlClasses}>
      {labelText !== undefined ? (
        <InputLabel
          className={classes.labelRoot + " " + labelClasses}
          htmlFor={name}
          {...labelProps}
        >
          {labelText}
        </InputLabel>
      ) : null}
      <Input
        classes={{
          input: inputClasses,
          root: marginTop,
          disabled: classes.disabled,
          underline: underlineClasses
        }}
        id={id}
        error={touched && !!errMessage}

        {...inputProps}
      />
      {touched && errMessage ? (
            <FormHelperText error>{errMessage}</FormHelperText>
      ) : null}
    </FormControl>
  );
}

CustomInput.propTypes = {
  classes: PropTypes.object.isRequired,
  labelText: PropTypes.node,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object,
  inputRootCustomClasses: PropTypes.string,
  errMessage: PropTypes.string,
  success: PropTypes.bool,
  white: PropTypes.bool
};

export default withStyles(customInputStyle)(CustomInput);
