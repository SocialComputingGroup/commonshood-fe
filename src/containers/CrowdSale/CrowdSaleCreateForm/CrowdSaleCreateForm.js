import React, { Component } from "react";
import {withTranslation} from "react-i18next";
import {withRouter} from 'react-router-dom';
import {logger} from '../../../utilities/winstonLogging/winstonInit';


import {assetsType} from '../../../config/assets';

//Redux actions connector
import { connect } from 'react-redux';

//utilities
import {isProfileChanged} from '../../../utilities/utilities';

//Formik form control
import { Formik, Field } from "formik";
import { TextField, Select } from "formik-material-ui";

//Style injection
import withStyles from '@material-ui/core/styles/withStyles';
import crowdSaleCreateFormStyle from './CrowdSaleCreateFormStyle';

//Material UI components
import Button from "@material-ui/core/Button";
//import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import FeaturedCard from '../../../components/UI/Card/FeaturedCard/FeaturedCard';
import CircularProgress from '@material-ui/core/CircularProgress';
import AlertAvatar from '../../../components/UI/AlertAvatar/AlertAvatar';

import ZoomModal from '../../../components/UI/Modal/ZoomModal/ZoomModal';
import CoinAvatarLabeled from '../../../components/UI/CoinAvatarLabeled/CoinAvatarLabeled';


//Custom Components
import DatePickerField from "../../../components/UI/Form/Input/DatePickerField";
import CoinSelectItem from "../../../components/Coin/CoinSelect/CoinSelectItem/CoinSelectItem";
import CustomImageInput from '../../../components/UI/Form/Upload/CustomImageInput/CustomImageInput';
import Loading from '../../../components/UI/Loading/Loading';
import SplashScreen from '../../../components/UI/SplashScreen/SplashScreen';
import PdfFileInput from '../../../components/UI/Form/Upload/PdfFileInput/PdfFileInput';
import AddressSuggest from '../AddressSuggest/AddressSuggest';

//Form objects
import getFormSchema, {formFieldTypes, formFieldsNames} from "./configForm";
import getValidationSchema from "./getValidationSchema";
import * as actions from "../../../store/actions";
import Grid from "@material-ui/core/Grid";
import SteppedNumberInput from "../../../components/UI/SteppedNumberInput/SteppedNumberInput";
import NaturalLanguageTextField from '../../../components/UI/NaturalLanguageTextField/NaturalLanguageTextField';
import HelpModal from "../../../views/Help/HelpModal/HelpModal";
import help1 from "../../../assets/img/help/how-to-01.png";
import help2 from "../../../assets/img/help/how-to-02.png";



const NoElement = props => <div>No Element</div>;

class CrowdSaleCreateForm extends Component {

    state = {
        coinSelectList: null,
        acceptedCoinList: undefined,
        emittedCoinList: undefined,
        coinIconSelectList: [],
        acceptedCoin: undefined,
        emittedCoin: undefined,
        creationModalOpened: false,
        instructionOpened: false,
    };

    handleSelectAcceptedCoin = event => {
        this.setState({ acceptedCoin: event.target.value });
    };

    handleInstructionOpen = () => {
        this.setState({instructionOpened: true})
    };

    handleInstructionClose = () => {
        this.setState({instructionOpened: false})
    }


    getFieldComponent = type => {
        switch (type) {
            case formFieldTypes.text: {
                return TextField;
            }
            case "number": {
                return TextField;
            }
            case formFieldTypes.controlledNumberInput: {
                return SteppedNumberInput;
            }
            case formFieldTypes.datepicker: {
                return DatePickerField;
            }
            case formFieldTypes.select: {
                return Select;
            }
            case formFieldTypes.fileInput: {
                //return CustomFileInput;
                return PdfFileInput;
            }
            case formFieldTypes.imageInput: {
                return CustomImageInput;
            }
            case formFieldTypes.naturalLanguageTextField:{
                return NaturalLanguageTextField;
            }
            case formFieldTypes.typography:{
                return Typography;
            }
            case formFieldTypes.addressSuggest: {
                return AddressSuggest;
            }
            default: {
                return NoElement;
            }
        }
    };

    formRender = (formProps, t) => {
        logger.info('CrowdsaleCreateForm - [FORMRENDER] formprops', formProps);
        logger.info('CrowdsaleCreateForm - [FORMRENDER] formpropsvalues', formProps.values);
        const formFields = formProps.values.fields;

        logger.info('CrowdsaleCreateForm - [FORMRENDER] formfields', formFields);
        const tutorialSteps = [
            {
                label: '',
                imgPath: help1
            },
            {
                label: '',
                imgPath: help2
            }
        ];
        const {
            values,
            setFieldValue,
            setFieldTouched,
            touched,
            errors,
            submitForm
        } = formProps;
        const { classes } = this.props;

        let index = 0;
        let fieldComponents = new Map();
        for(let field of formFields){
            let fieldComponent = null;
            if(field.name === formFieldsNames.mainImage){
                fieldComponent = (
                    <Field
                        name={field.name}
                        component={this.getFieldComponent(field.type)}
                        setFieldValue={setFieldValue}
                        errMessage={errors[field.name]}
                        touched={touched[field.name]}
                        setFieldTouched={setFieldTouched}
                        className={classes.fieldContainer}
                        type='crowdsaleImage'
                        //value={values.iconFile || undefined}
                        {...field.customProps}
                    />
                );

            }else if(field.name === formFieldsNames.cap){ // NOT USED RIGHT NOW
                fieldComponent = (
                    <Field
                        className={classes.fieldContainer}
                        name={field.name}
                        setFieldValue={setFieldValue}
                        component={this.getFieldComponent(field.type)}
                        {...field.customProps}
                    />
                )
            }else if(field.name === formFieldsNames.acceptedCoin){
                let selectionList = [...this.state.acceptedCoinList];
                fieldComponent = (
                    <FormControl key={index} style={{minWidth: 150}}>
                        <InputLabel htmlFor={field.inputProps.id}>{field.label}</InputLabel>
                        <Field
                            className={classes.fieldContainer}
                            name={field.name}
                            component={this.getFieldComponent(field.type)}
                            // onChange={this.handleSelectCoin}
                            inputProps={field.inputProps ? field.inputProps : null}
                            //formControlProps={field.formControlProps ? field.formControlProps : null}
                            renderValue={  selectedValue =>
                                (<CoinSelectItem value={selectedValue} coin={selectionList[selectedValue]} showCoinBalance={false}  />)
                            }
                        >
                            {
                                selectionList.map((coin, index) => {
                                    return (<CoinSelectItem value={index} key={index} coin={coin} showCoinBalance={false} />
                                    )
                                })
                            }
                        </Field>
                    </FormControl>
                )
            }else if(field.name === formFieldsNames.emittedCoin){
                let selectionList = [...this.state.emittedCoinList];
                fieldComponent = (
                    <FormControl key={index} style={{minWidth: 150}}>
                        <InputLabel htmlFor={field.inputProps.id}>{field.label}</InputLabel>
                        <Field
                            className={classes.fieldContainer}
                            name={field.name}
                            component={this.getFieldComponent(field.type)}
                            // onChange={this.handleSelectCoin}
                            inputProps={field.inputProps ? field.inputProps : null}
                            //formControlProps={field.formControlProps ? field.formControlProps : null}
                            renderValue={  selectedValue =>
                                (<CoinSelectItem value={selectedValue} coin={selectionList[selectedValue]} showCoinBalance={false} />)
                            }
                        >
                            {
                                selectionList.map((coin, index) => {
                                    return (<CoinSelectItem value={index} key={index} coin={coin} showCoinBalance={false}/>
                                    )
                                })
                            }
                        </Field>
                    </FormControl>
                );
            }else if(field.name === formFieldsNames.acceptedCoinRatio){
                fieldComponent = (
                    <Field
                        className={classes.fieldContainer}
                        name={field.name}
                        setFieldValue={setFieldValue}
                        component={this.getFieldComponent(field.type)}
                        defaultValue={field.initialValue}
                        {...field.customProps}
                    />
                );
            }else if(field.name === formFieldsNames.totalEmittedCoin) {
                fieldComponent = (
                    <Grid container justify='flex-start'>
                        <Grid item xs={12}>
                            <Field
                                className={classes.fieldContainer}
                                name={field.name}
                                setFieldValue={setFieldValue}
                                component={this.getFieldComponent(field.type)}
                                defaultValue={field.initialValue}
                                {...field.customProps}
                            >
                                <CoinAvatarLabeled coin={this.state.emittedCoinList[values.emittedCoin]} noName={true}/>
                            </Field>
                        </Grid>
                    </Grid>
                );
            }else if(field.name === formFieldsNames.totalAcceptedCoin){
                let computedTotal = (parseInt(formProps.values.totalEmittedCoin) * parseFloat(formProps.values.acceptedCoinRatio)).toFixed(2);
                logger.info(`CrowdsaleCreateForm - COMPUTED TotalAcceptedCoin ${formProps.values.totalEmittedCoin} * ${formProps.values.acceptedCoinRatio} `, computedTotal);
                //computedTotal = isNaN(computedTotal) ? '' : computedTotal;
                fieldComponent = (
                    <Grid container justify='flex-start'>
                        <Grid item xs={12}>
                            <Field
                                className={classes.fieldContainer}
                                name={field.name}
                                setFieldValue={setFieldValue}
                                component={this.getFieldComponent(field.type)}
                                defaultValue={computedTotal}
                                {...field.customProps}
                            >
                                <CoinAvatarLabeled coin={this.state.acceptedCoinList[values.acceptedCoin]} noName={true}/>
                            </Field>
                        </Grid>
                    </Grid>
                );
            }else if(field.name === formFieldsNames.forEachEmittedCoin) {
                fieldComponent = (
                    <Grid container justify='flex-start'>
                        <Grid item xs={12}>
                            <Field
                                className={classes.fieldContainer}
                                name={field.name}
                                setFieldValue={setFieldValue}
                                component={this.getFieldComponent(field.type)}
                                defaultValue={1}
                                {...field.customProps}
                            >
                                <CoinAvatarLabeled coin={this.state.emittedCoinList[values.emittedCoin]} noName={true}/>
                            </Field>
                        </Grid>
                    </Grid>
                );
            }else if(field.name === formFieldsNames.coinsCouponsErrors){
                let errorText = '';
                for(let fieldName of field.observedFieldNames){
                    if(errors[fieldName]){ //show just one at time
                        errorText = errors[fieldName];
                        break;
                    }
                }
                if(errorText === ''){
                    fieldComponent = null;
                }else {
                    fieldComponent = (
                        <Field
                            className={classes.fieldContainer}
                            name={field.name}
                            component={this.getFieldComponent(field.type)}
                            children={errorText}
                            //customProps={field.customProps}
                            {...field.customProps}
                        />
                    );
                }
            }else if(field.name === formFieldsNames.contract){
                fieldComponent = (
                    <Field
                        name={field.name}
                        placeholder={t('contractPlaceholder')}
                        component={this.getFieldComponent(field.type)}
                        errMessage={errors[field.name]}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        touched={touched[field.name]}
                        className={classes.fieldContainer}
                        value={values.contract || undefined}
                    />
                );
            } else if(field.name === formFieldsNames.addressSuggest) {
                fieldComponent = (
                    <Field 
                        name={field.name}
                        component={this.getFieldComponent(field.type)}
                        setFieldValue={setFieldValue}
                        errMessage={errors[field.name]}
                        placeholder={t('addressSuggestPLaceholder')}
                    />
                );
            }
            else{ //generic TextField component
                fieldComponent = (
                    <Field
                        className={classes.fieldContainer}
                        name={field.name}
                        component={this.getFieldComponent(field.type)}
                        //customProps={field.customProps}
                        {...field.customProps}
                    />
                );
            }

            fieldComponents.set(field.name, fieldComponent);
        }


        const buttons = (
            <>
                {/*<Button*/}
                {/*    color='secondary'*/}
                {/*    onClick={() => this.handleInstructionOpen()}*/}
                {/*>*/}
                {/*    {t('help')}*/}
                {/*</Button>*/}
                 <HelpModal
                    open={this.state.instructionOpened}
                    handleClose={this.handleInstructionClose}
                    tutorialSteps= {tutorialSteps}
                />

                <Button
                    fullWidth
                    className={classes.buttons}
                    variant="contained"
                    style={{marginLeft: 'auto', marginRight: 'auto'}}
                    onClick ={submitForm}
                >
                    {t('createButton')}
                </Button>
            </>
        );


        return (
            <form>
                <FeaturedCard title={t('describeCrowdSaleTitle')}>
                    <Grid container justify='center' alignItems='flex-end'>
                        <Grid item xs={12}>
                            {fieldComponents.get(formFieldsNames.mainImage)}
                        </Grid>
                        <Grid item xs={12}>
                            {fieldComponents.get(formFieldsNames.bigTitle)}
                        </Grid>
                        <Grid item xs={12}>
                            {fieldComponents.get(formFieldsNames.details)}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Grid container justify='flex-start' alignItems='flex-end' spacing={5}>

                                <Grid item xs={6} md={6}>
                                    {fieldComponents.get(formFieldsNames.totalEmittedCoin)}
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    {fieldComponents.get(formFieldsNames.emittedCoin)}
                                </Grid>

                                <Grid item xs={12} md={12}>
                                    {fieldComponents.get(formFieldsNames.forEachEmittedCoin)}
                                </Grid>

                                <Grid item xs={6} md={6}>
                                    {fieldComponents.get(formFieldsNames.acceptedCoinRatio)}
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    {fieldComponents.get(formFieldsNames.acceptedCoin)}
                                </Grid>

                                {/*<Grid item xs={12} md={12}>*/}
                                {/*    {fieldComponents.get(formFieldsNames.acceptedCoinRatio)}*/}
                                {/*</Grid>*/}

                                <Grid item xs={12} md={12}>
                                    {fieldComponents.get(formFieldsNames.totalAcceptedCoin)}
                                </Grid>

                                <Grid item xs={12}>
                                    {fieldComponents.get(formFieldsNames.coinsCouponsErrors)}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            {fieldComponents.get(formFieldsNames.startDate)}
                        </Grid>
                        <Grid item xs={12}>
                            {fieldComponents.get(formFieldsNames.endDate)}
                        </Grid>
                        <Grid item xs={12}>
                            {fieldComponents.get(formFieldsNames.contract)}
                        </Grid>
                        <Grid item xs={12}>
                            {fieldComponents.get(formFieldsNames.addressSuggest)}
                        </Grid>
                    </Grid>
                    {buttons}
                </FeaturedCard>
            </form>
        );

    };

    //Redirect to coin creation in case there's no coin in wallet
    handleCreateButton = () => {
        this.props.history.push('/coinCreate?firstTime');
    };

    componentDidMount() {
        if(this.state.coinSelectList === null ){
            //const userId = localStorage.getItem('userId');
            this.props.onCoinGetAllOwned();
        }
        const queryUrlParams = new URLSearchParams(new URL(document.location).searchParams);

        if (queryUrlParams.has('firstTime')) {
            this.setState({instructionOpened: true})
        }
    }

    componentDidUpdate(prevProps, prevState) {

        const {
            onCoinGetListReset,
            onCoinGetAllOwned,
            profile,
            loading,
            coinList,
        } = this.props;

        const {
            acceptedCoinList,
            emittedCoinList
        } = this.state;

        //profile switched, reset coin
        if( (prevProps.profile !== null) && (profile !== null) && isProfileChanged(prevProps.profile, profile)){
            logger.info('CrowdsaleCreateForm - [CROWDSALE - PROFILE SWITCHED]');

            this.setState({
                acceptedCoinList: null,
                emittedCoinList: null,
            });
            onCoinGetListReset();
        }
        else{
            if(!loading){//coins are not currently being loaded
                if(coinList){ //we have a coinList from redux
                    if (!acceptedCoinList) {
                        const accepted = coinList.filter( coin => coin.type === assetsType.token.name);
                        this.setState({acceptedCoinList: accepted});
                    }
                    if (!emittedCoinList) {
                        const emitted = coinList.filter (coin => coin.type === assetsType.goods.name);
                        this.setState({emittedCoinList: emitted});
                    }
                }else{// coin list empty (right after reset)
                    logger.info('CrowdsaleCreateForm - coin list empty', coinList);
                    onCoinGetAllOwned();
                }

            }
        }
    }

    handleCreateCrowdsale = crowdSaleData => {
        const {
            onCreateCrowdSale
        } = this.props;
        logger.info('CrowdsaleCreateForm - CREATECROWDSALE', crowdSaleData);
        onCreateCrowdSale(crowdSaleData);

        this.setState({
           creationModalOpened: true,
        });
    };

    handleCreationModalClose = (isError) => {
        const {
            history,
            onCrowdsaleCreateReset
        } = this.props;

        this.setState({creationModalOpened: false});

        onCrowdsaleCreateReset();
        if(!isError) { //redirect to home if creation was successful
            history.push('/');
        }
    };

    render() {
        const { acceptedCoinList, emittedCoinList } = this.state;
        const {
            t,
            loading,
            classes,
            creationSuccess,
            creationFailureError,
        } = this.props;

        //Creation of the initial Values object to pass to Formik component
        let initialFieldValues = getFormSchema(t).reduce((obj, field) => {
            obj[field.name] = field.initialValue;
            return obj;
        }, {});


        initialFieldValues.locationSelectedId = null

        let form = (
            <Loading withLoader title={t('loadingWait') + "..."}/>
        );

        if (!loading
            && acceptedCoinList
            && emittedCoinList ) {
            if (acceptedCoinList.length !== 0 && emittedCoinList.length !==0 ) {
                form = (
                    <Formik
                        initialValues={{fields: getFormSchema(t), ...initialFieldValues}}
                        validationSchema={getValidationSchema()}
                        onSubmit={(values, actions) => {
                            actions.setSubmitting(false);
                            logger.info('CrowdsaleCreateForm - formik BUTTON FORM SUBMIT', values );
                            //This is to get the coins instead of the index in their list
                            values = {
                                ...values,
                                emittedCoin: this.state.emittedCoinList[values.emittedCoin],
                                acceptedCoin: this.state.acceptedCoinList[values.acceptedCoin],
                            };

                            this.handleCreateCrowdsale(values);
                        }}
                        render={formProps => this.formRender(formProps, t)}
                    />
                );
            } else { //user has not coin and/or coupon created by himself, so he cannot open a crowdsale
                let missingTokenMessage = '';

                if( (!acceptedCoinList || acceptedCoinList.length === 0) && (!emittedCoinList || emittedCoinList.length === 0)){
                    missingTokenMessage = t('askCreate');
                }else if(!acceptedCoinList || acceptedCoinList.length === 0){
                    missingTokenMessage = t('askCreateCoinToAccept');
                }else if(!emittedCoinList || emittedCoinList.length === 0){
                    missingTokenMessage = t('askCreateCouponToEmit');
                }

                form = (
                    <SplashScreen title={t('noCoins')} avatarProps={{'big': true, 'warning': true}}>
                        <div>{missingTokenMessage}</div>
                        <div>
                            <Button className={classes.buttons} variant='contained' onClick={this.handleCreateButton}>Create
                                New Coin</Button>
                        </div>
                    </SplashScreen>)
            }
        }

        //modal which confirms creation or shows why it failed
        let modalTitle = t('creationModalTitle');
        //let isError = false;
        let creationModalContent = (
            <CircularProgress />
        );
        let closeModalButton = null;

        if(!loading && !creationSuccess && creationFailureError){
            modalTitle = t('errorModalTitle');
            creationModalContent = (
                <AlertAvatar big fail
                    text={t('errorDetails') + creationFailureError}
                />
            );
            closeModalButton = (
                <Button
                    variant='contained'
                    color='primary'
                    className={classes.button}
                    onClick={() => this.handleCreationModalClose(true)}>
                    Ok
                </Button>
            );
        }else if(!loading && creationSuccess){//creation was successful
            creationModalContent = (
                    <AlertAvatar big success text={t('creationSuccessful')}/>
            );
            closeModalButton = (
                <Button
                    variant='contained'
                    color='primary'
                    className={classes.button}
                    onClick={() => this.handleCreationModalClose(false)}>
                    Ok
                </Button>
            );
        }

        const creationModal = (
            <ZoomModal
                title={modalTitle}
                open={this.state.creationModalOpened}
                //onClose={() => this.handleCreationModalClose()}
                disableBackdropClick
                disableEscapeKeyDown

            >
                {creationModalContent}
                {closeModalButton}
            </ZoomModal>
        );

        //==================
        return (
            <>
                {form}
                {creationModal}
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        fileLoading: state.file.loading,
        fileList: state.file.fileList,
        loading: state.coin.loading,
        coinError: state.coin.error,
        coinList: state.coin.coinList,
        fileData: state.file.fileData,
        fileError: state.file.error,
        profile: state.user.currentProfile,
        creationSuccess: state.crowdsale.crowdSaleCreated,
        creationFailureError: state.crowdsale.error,
        crowdsaleLoading: state.crowdsale.loading,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onCoinGetListReset: () => dispatch(actions.coinGetListReset()),
        onCoinGetAllOwned: () => dispatch (actions.coinGetList(null, true, true, true)),
        onFileGetList: (hashArray) => dispatch(actions.fileGetList(hashArray)),
        onFileGetListReset: () => dispatch(actions.fileGetListReset()),
        onFileUpload: (file) => dispatch(actions.fileUpload(file)),
        onCreateCrowdSale: (crowdsaleData) => dispatch(actions.crowdsaleCreate(crowdsaleData)),
        onCrowdsaleCreateReset: () => dispatch(actions.crowdsaleCreateReset()),

    }
};

export default withTranslation('CrowdSaleCreateForm') (
                    connect(mapStateToProps,mapDispatchToProps) (
                        withStyles(crowdSaleCreateFormStyle) (withRouter(CrowdSaleCreateForm))
                    )
                );
