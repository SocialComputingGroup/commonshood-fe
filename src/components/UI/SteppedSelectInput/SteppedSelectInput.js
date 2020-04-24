import React, {useEffect} from 'react';
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem"

const computeAllDividers = (cap) => {
    let dividers = [];
    for(let i = 1; i <= cap/2; i++){
        if(cap % i === 0){
            dividers.push(i); 
        }
    }
    dividers.push(cap);
    return dividers;
}

const SteppedNumberInput = (props) => {

    const{
        //labelText,
        value,
        onChange,
        cap
    } = props;

    const handleSelectionChange = (event) =>{
        onChange(event.target.value);
    }

    let dividers;
    if(cap != null){
        dividers = computeAllDividers(cap);
    }

    useEffect(() => {
        onChange(1);
    }, [onChange, cap]); //run this effect only if cap changed


    return(
        <Grid
            container justify="center" alignItems="center" 
        >
            <Grid item xs={3} md={6}>
            <TextField
                select
                //label="steppedSelectInput"
                value={value}
                onChange={handleSelectionChange}
                //helperText="Please"
                //margin="normal"
            >
                {dividers.map( (divider, index) => (
                <MenuItem key={index} value={divider}>
                    {divider}
                </MenuItem>
                ))}
            </TextField>
            </Grid>
            <Grid item xs={3} md={6}>
                {props.children}
            </Grid>
        </Grid>
    )
};

export default SteppedNumberInput;