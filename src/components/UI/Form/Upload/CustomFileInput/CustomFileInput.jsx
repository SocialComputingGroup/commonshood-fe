import React from "react";
// used for making the prop types of this component
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import CustomInput from "../../../Form/Input/CustomInput/CustomInput";
import Button from "../../../../../Kit/components/CustomButtons/Button.jsx";

import styles from "../../../../../Kit/assets/jss/material-kit-pro-react/components/customFileInputStyle.jsx";

class CustomFileInput extends React.Component {
  constructor(props) {
    super(props);
    this.fileUpload = React.createRef();
    this.onFocus = this.onFocus.bind(this);
  }

  state = {
      fileNames: "",
      files: null
  };

  onFocus = e => {
      if (this.fileUpload) {
          this.props.setFieldTouched(this.props.field.name);
          this.fileUpload.current.click();
      }
  };

  handleSubmit = e => {
    e.preventDefault();
    // this.state.file is the file/image uploaded
    // in this function you can save the image (this.state.file) on form submit
    // you have to call it yourself
  };

  addFile = e => {
      //console.log("INPUT NAME: "+ this.props.field.name);
    let fileNames = "";
    let files = e.target.files;
    for (let i = 0; i < e.target.files.length; i++) {
      fileNames = fileNames + e.target.files[i].name;
      if (this.props.multiple && i !== e.target.files.length - 1) {
        fileNames = fileNames + ", ";
      }
    }
    this.setState({
      fileNames: fileNames,
      files: files
    });
      if (this.props.multiple) {
          this.props.setFieldValue(this.props.field.name, files)
      } else {
          this.props.setFieldValue(this.props.field.name, files[0])
      }
  };

  componentDidUpdate () {
    //console.log('FILE DID UPDATE');
    if (!this.props.touched && this.props.field.value === undefined && this.state.files) {
      //console.log('RESETTING');
      this.setState({files: null, fileNames: ""});
    }
  }

  render() {
    const {
      classes,
      endButton,
      startButton,
      inputProps,
      formControlProps,
      multiple,
        errMessage,
        touched
    } = this.props;

    const { name } = this.props.field;
    if (inputProps && inputProps.type && inputProps.type === "file") {
      inputProps.type = "text";
    }
    let buttonStart;
    let buttonEnd;
    if (startButton) {
      buttonStart = (
        <Button {...startButton.buttonProps} onClick={this.onFocus}>
          {startButton.icon !== undefined ? startButton.icon : null}
          {startButton.text !== undefined ? startButton.text : null}
        </Button>
      );
    }
    if (endButton) {
      buttonEnd = (
        <Button {...endButton.buttonProps} onClick={this.onFocus}>
          {endButton.icon !== undefined ? endButton.icon : null}
          {endButton.text !== undefined ? endButton.text : null}
        </Button>
      );
    }
    return (
      <div className={classes.inputFileWrapper}>
        <input
            name={name}
            id={name}
          type="file"
          className={classes.inputFile}
          multiple={multiple}
            ref={this.fileUpload}
          onChange={this.addFile}
        />
        <CustomInput

          id={name}
          name={name}
          formControlProps={{
            ...formControlProps
          }}
          errMessage={errMessage}
          touched={touched}
          inputProps={{
            ...inputProps,
            onFocus: this.onFocus,
            value: this.state.fileNames,
            endAdornment: buttonEnd,
            startAdornment: buttonStart
          }}
        />
      </div>
    );
  }
}

CustomFileInput.defaultProps = {
  multiple: false
};

CustomFileInput.propTypes = {
  id: PropTypes.string,
  endButton: PropTypes.object,
  startButton: PropTypes.object,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object,
  multiple: PropTypes.bool
};

export default withStyles(styles)(CustomFileInput);
