import React from 'react';
import { Formik, Form, Field} from 'formik';
import {logger} from '../../../../utilities/winstonLogging/winstonInit';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import {Typography} from "@material-ui/core";

import * as actions from "../../../../store/actions";
import {connect} from "react-redux";

const CoinMinter = (props) => {
    return (
        <>
            <Formik
                initialValues={{amountToMint: props.coinType === 'token' ? "1.00" : '1'}}
                validate={ values => {
                    let errors = {};
                    if(values.amountToMint === ''){
                        errors.amountToMint = "The amount to mint is required";
                    }else if(isNaN(parseFloat(values.amountToMint))){
                        errors.amountToMint = "Amount to mint must be a number";
                    }else {
                        if (props.coinType === 'token') { // it can be a number with 2 decimals
                            if (!values.amountToMint.match(/^[0-9]+([.,][0-9][0-9]?)?$/)) {
                                errors.amountToMint = "Amount to mint must be a positive decimal number with 2 decimals max and eventually dot \".\" as separator";
                            }
                        } else if (props.coinType === 'goods') {
                            if(!values.amountToMint.match(/^\d*$/)){
                                errors.amountToMint = "Amount to mint must be a positive integer. Coupons are not fractionable!";
                            }
                        }
                    }
                    return errors;
                }}
                onSubmit={ (values, {setSubmitting}) => {
                    logger.info('MINTER =>', props.ticker, values.amountToMint, props.decimals);
                    props.onCoinMint(props.tokenAddress, values.amountToMint, props.decimals);
                    props.onMintSubmit(true);
                }}
            >
                <Form>
                    <Grid container direction='column' justify='center' alignItems='center' spacing={2}>
                        <Grid item xs={12}>
                            <Field type='text' name='amountToMint' render={ ({field,form}) =>{
                                const handleChange = (event) =>{
                                    form.setFieldValue(field.name, event.target.value);
                                };
                                return (
                                    <TextField
                                        name={field.name}
                                        error={Boolean(form.errors.amountToMint)}
                                        onChange={handleChange}
                                        defaultValue={form.initialValues.amountToMint}
                                    />
                                )
                            }}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Field render={({field,form}) => {
                                return (
                                    <Typography variant="caption" display="block" style={{paddingLeft: '2em', paddingRight: '2em'}} >
                                        {form.errors.amountToMint}
                                    </Typography>
                                )
                            }}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" type='submit'>
                                submit
                            </Button>
                        </Grid>
                    </Grid>
                </Form>
            </Formik>
        </>
    );
};

const mapStateToProps = state => {
    return {
    }
};


const mapDispatchToProps = dispatch => {
    return {
        onCoinMint: (tokenAddress, amount, decimals) => dispatch(actions.coinMint(tokenAddress, amount, decimals)),
    }
};

export default  connect(mapStateToProps,mapDispatchToProps)(CoinMinter);