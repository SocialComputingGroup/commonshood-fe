import React, {Component} from 'react';

import Fab from '@material-ui/core/Fab';

import Icon from '@material-ui/core/Icon';
import InputLabel from '@material-ui/core/InputLabel';

import withStyles from '@material-ui/core/styles/withStyles';
import PdfFileInputStyle from './PdfFileInputStyle';


class PdfFileInput extends Component{

    constructor(props){
        super(props);
        this.fileUpload = React.createRef();
    }

    state = {

    }

    addFile = (e) => {
        let file = e.target.files;
        this.props.setFieldValue(this.props.field.name, file[0]);
    }

    render(){
        const{
            placeholder,
            classes,
            value,
            errMessage
        } = this.props;

        const fileUploadButton = (
            <Fab color='primary' variant='round' component='span'>
                <Icon>attach_file</Icon>
            </Fab>
        );

        let labelText;
        let labelClass = null;
        
        if(errMessage){
            labelText = errMessage;
            labelClass = classes.errorLabel;
        } else if(value == null){
            labelText = placeholder;
        }else{
            labelText = value.name;
        }

        return (
            <div className={classes.input}>
                <input
                    accept=".pdf"
                    id="contained-button-file"
                    //multiple
                    type="file"
                    style = {{display: 'none'}}
                    onFocus = { () => this.props.setFieldTouched(this.props.field.name) }
                    onChange = {this.addFile}
                />
                <InputLabel htmlFor="contained-button-file" className={labelClass}>
                    {labelText} - {fileUploadButton}
                </InputLabel>
            </div>
        );

        // return (
        //     <>
        //         <input
        //             accept=".pdf"
        //             //className={classes.input}
        //             id="contained-button-file"
        //             multiple
        //             type="file"
        //             style = {{display: 'none'}}
        //         />
        //         <label htmlFor="contained-button-file">
        //             <Button 
        //                 variant="contained" 
        //                 component="span" 
        //                 color='primary'
        //                 //className={classes.button}
        //                 >
        //                 Upload Contract
        //             </Button>
        //         </label>
        //     </>
        // );
    }
}

export default
     withStyles(PdfFileInputStyle) (PdfFileInput)
;
