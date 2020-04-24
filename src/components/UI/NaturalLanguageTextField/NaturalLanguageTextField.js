import React, {useState, useEffect} from 'react';

import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import InputBase from "@material-ui/core/InputBase";

import SteppedSelectInput from '../SteppedSelectInput/SteppedSelectInput';


const NaturalLanguageTextField = (props) => {
    let {
        disabled,
        defaultValue,
        setFieldValue,
        field,
    } = props;
    let isDisabled = props.disabled ? true : false;
    let inputField = null;

    const [inputValue, setInputValue] = useState(parseFloat(props.defaultValue) ? props.defaultValue : 1);
    
    useEffect(() => {
        if(disabled){ //it's a field which is updated only externally
            setInputValue(defaultValue);
            setFieldValue(field.name, parseFloat(defaultValue) );
        }
    }, [disabled, setInputValue, setFieldValue, field.name, defaultValue]);
  
    const fieldMaxLength = props.fieldMaxLength != null ? props.fieldMaxLength : 7;
    
    const handleInputChange = (event) => {
        let newInput = event.target.value.toString();
        if(newInput.length === 0){
            props.setFieldValue(props.field.name, 0 );
            setInputValue( 0 );
            return;
        }

        if( !fieldMaxLength || (newInput.length <= fieldMaxLength) ){

            if(props.onlyInteger){
                if(newInput.charCodeAt(newInput.length -1) < 48 && newInput.charCodeAt(newInput.length -1) > 57) { //is not a number
                    props.setFieldValue(props.field.name, parseInt( newInput.slice(0, -1) ) );
                    setInputValue( parseInt( newInput.slice(0, -1) ));
                }
                props.setFieldValue(props.field.name, parseInt(newInput) );
                setInputValue( newInput );
            }else { //it's a float, limit to 2 decimals
                newInput = newInput.replace(/,/g, '.'); //replace commas with dot else parseFloat will not recognize decimals
                props.setFieldValue(props.field.name, parseFloat(newInput));
                setInputValue(newInput);
                // props.setFieldValue(props.field.name, parseFloat( event.target.value).toFixed(2));
                // setInputValue( parseFloat(event.target.value).toFixed(2) );
            }
        }
    };

    const handleSteppedInputChange = (value) => {
        props.setFieldValue(props.field.name, parseFloat(value));
        setInputValue(value);
    };

    if(props.stepped === true){
        inputField =(
             <SteppedSelectInput //FIXME old and probably broken, check carefully (not used atm)
                //field={props.field} 
                //setFieldValue={props.setFieldValue} 
                onChange={handleSteppedInputChange}
                value={inputValue}
                labelText={props.labelText} 
                cap={props.cap}
                >
                    {props.children}
            </SteppedSelectInput>
        );
    }else{
        if(!isDisabled){
            const repositionCursorToTheRight = (e) => {
                const val = e.target.value;
                e.target.value = '';
                e.target.value = val;
            };
            inputField = (
                <TextField
                        value={inputValue}                
                        margin="normal"
                        inputProps={{
                            style: { textAlign: "center" },
                        }}
                        onChange={handleInputChange}
                        onFocus= {repositionCursorToTheRight}
                    />
            );
        }else{ //this input field will appear disabled

            inputField = (
                <Grid container justify="center" alignItems="center" >
                    <Grid item xs={6}>
                        <InputBase
                            value={inputValue}
                            disabled={true}
                            style={{border: 'none', }}
                            inputProps={{
                                style:{
                                    color: 'black',
                                    textAlign: 'center'
                                }
                            }}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        {props.children}
                    </Grid>
                </Grid>
            );
        }
    }

    const hideField = props.hidden ? {display: 'none'} : null;

    return (
        <Grid container justify="flex-start" alignItems="center" style={{hideField}}>
            <Grid item  xs={12} md={6} style={{flexBasis: "auto"}}>
                <Typography 
                    component="span" 
                    variant="body1" 
                    style={{display: "inline", marginLeft: "0.25em", marginRight: "0.5em"}}>
                        {props.externalLabel}
                </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
                {inputField}
            </Grid>
        </Grid>
    )
};

export default NaturalLanguageTextField;
