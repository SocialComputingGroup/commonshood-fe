import React, {useEffect} from 'react';
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";

const computeNextDivider = (currentDivider, cap) => {
    let i;
    for(i = 1; currentDivider + i <= cap; i++ ){
        if(cap % (currentDivider + i) === 0)
            break;
    }
    return currentDivider + i;
}

const computePreviousDivider = (currentDivider, cap) => {
    let i;
    for(i = 1; currentDivider - i >= 1; i++ ){
        if(cap % (currentDivider - i) === 0)
            break;
    }
    return currentDivider - i;
}

const SteppedNumberInput = (props) => {

    const{
        labelText,
        value,
        onChange,
        cap
    } = props;


    useEffect(() => {
        onChange(1);
    }, [onChange, cap]); //run this effect only if cap changed

    const handleAddClick = () => {
        if(value < cap){
            const nextDivider = computeNextDivider(value, cap);
            onChange(nextDivider);
        }
    };

    const handleRemoveClick = () => {
        if(value > 1 ){
            const prevDivider = computePreviousDivider(value, cap);
            onChange(prevDivider);
        }
    };

    const iconFontSize = '34px';

    return(
        <Grid
            container justify="center" alignItems="center" 
        >
            <Grid item xs={1}>
                <IconButton
                    style={{padding:0}}
                    onClick={handleRemoveClick}
                >
                    <Icon style={{fontSize: iconFontSize}}>remove_circle_outline</Icon>
                </IconButton>
            </Grid>
            <Grid item xs={2}>
                <FormControl>
                    <InputLabel htmlFor="numberField">{labelText}</InputLabel>
                    <Input
                        id="numberField"
                        // label={labelText}
                        readOnly={true}
                        disableUnderline={true}
                        style={{display: 'inline-block', textAlign: 'center', maxWidth: '120px'}}
                        inputProps={{
                            style: { textAlign: "center" }
                        }}
                        value={value}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={1}>
                <IconButton
                    onClick={handleAddClick}
                    style={{padding:0}}
                >
                    <Icon style={{fontSize: iconFontSize}}>add_circle_outline</Icon>
                </IconButton>
            </Grid>
            {/*<Button variant="outlined">*/}
            {/*    <Icon style={{fontSize: iconFontSize}}>add</Icon>10*/}
            {/*</Button>*/}
        </Grid>
    )
};

export default SteppedNumberInput;