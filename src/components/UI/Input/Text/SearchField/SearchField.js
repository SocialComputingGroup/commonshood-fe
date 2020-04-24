import React from 'react';

//Lazy loading for Code Splitting
import asyncComponent from '../../../../../hoc/AsyncComponent/AsyncComponent';

//Custom components
//import AppIcon from '../../../AppIcon/AppIcon'

//Style injections
import { withStyles } from "@material-ui/core/styles";
import searchFieldStyle from "./SearchFieldStyle";

//Material-UI Components
const FormControl = asyncComponent(()=>import('@material-ui/core/FormControl')) ;
const Input = asyncComponent(()=>import('@material-ui/core/Input')) ;
const InputLabel = asyncComponent(()=>import('@material-ui/core/InputLabel')) ;
const InputAdornment = asyncComponent(()=>import('@material-ui/core/InputAdornment')) ;

//Material Icons
const Search = asyncComponent(()=>import('@material-ui/icons/Search'))

const searchField = props => {

    const {
        classes,
        placeholder,
        value,
        searchHandler} = props;
    return (

        <FormControl
            fullWidth
            className={classes.textField}
        >
            <InputLabel htmlFor="searchField">{placeholder}</InputLabel>
            <Input
                id="searchField"
                value={value}
                onChange={searchHandler}
                endAdornment={<InputAdornment position="end">
                    {/*<AppIcon icon={{font: 'material', name: 'search'}}/>*/}
                    <Search />
                </InputAdornment>}
            />
        </FormControl>

    );
};

export default withStyles(searchFieldStyle)(searchField);
