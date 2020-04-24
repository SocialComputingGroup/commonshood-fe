import React, {Component} from 'react';

//Assets types
import {assetsType} from '../../../config/assets';

//Redux actions connector
import { connect } from 'react-redux';


//Routing HOC
import { withRouter } from 'react-router-dom';

// Action creators
import * as actions from '../../../store/actions/index'

//form field schema
import formSchema from './config';

//Style injection
import withStyles from '@material-ui/core/styles/withStyles';
import newCoinCreateFormStyle from './NewCoinCreateFormStyle';

//Form controls
import * as Yup from 'yup';
import { Formik, FastField, Field } from 'formik';
import { Select } from 'formik-material-ui';
import FormControl from '@material-ui/core/FormControl'
import getValidationSchema from './getValidationSchema'

//Material-UI components
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

//Custom Components
import TextInput from '../../../components/UI/Form/Input/TextInput';
import FeaturedCard from '../../../components/UI/Card/FeaturedCard/FeaturedCard';
import ZoomModal from '../../../components/UI/Modal/ZoomModal/ZoomModal';
import AlertAvatar from '../../../components/UI/AlertAvatar/AlertAvatar';
import Loading from '../../../components/UI/Loading/Loading';

import HelpModal from "../../../views/Help/HelpModal/HelpModal";
import help1 from "../../../assets/img/help/how-to-01.png";
import help2 from "../../../assets/img/help/how-to-02.png";


//derived from Material Kit pro component
import CustomImageInput from '../../../components/UI/Form/Upload/CustomImageInput/CustomImageInput';
import PdfFileInput from '../../../components/UI/Form/Upload/PdfFileInput/PdfFileInput';


// i18n
import {withTranslation} from "react-i18next";
import {FormHelperText} from "@material-ui/core";


class CoinCreateForm extends Component {

    state = {
        checkCap: false,
        modalOpened: false,
        instructionOpened: false,
        coinCreated: false,
        iconFile: null,
        contractFile: null,
        waitForCreation: false,
        coinSymbolsList: null
    };

    handleChangeSwitch = name => event => {

        this.setState({
            [name]: event.target.checked
        });

    };

    handleCreateCoin = values => {
        const {
            onCoinCreation,
        } = this.props;
        const {
            coinName,
            coinSymbol,
            coinDescription,
            initialSupply,
            isCapped,
            cap,
            iconFile,
            contractFile,
            type
        } = values;

        this.setState({waitForCreation: true});
        const coinData = {
            name: coinName,
            symbol: coinSymbol,
            description: coinDescription,
            initialSupply: initialSupply,
            decimals: assetsType[type].decimals, //tokens have 2 decimals, coupons have 0
            cap: isCapped? cap : '',
            iconFile : iconFile,
            contractFile: contractFile,
            type: assetsType[type].name
        };
        onCoinCreation(coinData);

    };

    handleInstructionOpen = () => {
        this.setState({instructionOpened: true})
    };

    handleInstructionClose = () => {
        this.setState({instructionOpened: false})
    }

    handleConfirmModalOpen = (values,
                              isValid,
                              validateForm,
                              setFieldTouched) => {
        formSchema.map(
            field => setFieldTouched(field.name)
        );
        validateForm().then(
            () => {
                if (isValid) {
                   this.setState({
                       modalOpened: true,
                       iconFile: URL.createObjectURL(values['iconFile']),
                       contractFile: URL.createObjectURL(values['contractFile'])
                   });
                }
            }
        )

    };

    handleModalClose = (resetForm) => {
        this.setState({modalOpened: false});

        if (resetForm && this.props.coinCreated) {
            resetForm();
            this.props.onCoinCreateReset();
            this.props.history.push('/');
        }
    };

    handleSymbolChange = (value, setFieldValue) => {
        return setFieldValue('coinSymbol', value.toUpperCase())
    };

    componentDidMount () {
        const queryUrlParams = new URLSearchParams(new URL(document.location).searchParams);

        if (queryUrlParams.has('firstTime')) {
            this.setState({instructionOpened: true})
        }

        if (!this.state.coinSymbolsList) {
            this.props.onGetCoinList();
        }
    }

    componentDidUpdate () {
        if(!this.state.coinSymbolsList && this.props.coinList) {
            var coinSymbols = [];
            this.props.coinList.forEach((coin) => {
                coinSymbols.push(coin.symbol);
            });
            this.setState({coinSymbolsList: coinSymbols});
        }

        if (this.state.waitForCreation) {
            if (this.props.coinCreated || this.props.coinError)
                this.setState({waitForCreation: false})
        }
    }

    render() {
        let {t} = this.props;

        let form = (
            <Loading withLoader title={t('Common:loadingGeneric') + "..."}/>
        );

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

        if (this.state.coinSymbolsList) {
            const staticValidationSchema = getValidationSchema(t);

            const symbolValidationSchema = Yup.object().shape({
                coinSymbol: Yup.string()
                    .notOneOf(this.state.coinSymbolsList, t('symbolPresent'))
            });

            const finalValidationSchema = staticValidationSchema.concat(symbolValidationSchema);

            form = (
                <Formik
                    initialValues={{
                        coinName: '',
                        coinSymbol: '',
                        coinDescription: '',
                        initialSupply: '',
                        cap: '',
                        isCapped: false,
                        iconFile: undefined,
                        contractFile: undefined,
                        type: assetsType.token.name,
                    }}
                    validationSchema={finalValidationSchema}
                    onSubmit={(values, actions) => {
                        this.handleCreateCoin(values);
                        actions.setSubmitting(false);
                    }}

                    render={
                        ({
                             values,
                             handleSubmit,
                             handleChange,
                             handleBlur,
                             errors,
                             touched,
                             setFieldValue,
                             setFieldTouched,
                             isValid,
                             validateForm,
                             submitForm,
                             resetForm
                         }) => {

                            const {
                                t, //i18n via HOC
                                classes,
                                coinCreated,
                                coinMinting,
                                coinError,
                                fileError
                            } = this.props;

                            let modalConfirm = coinMinting ? 
                                    (
                                        <>
                                            <Typography variant='body2'>{t('coinMintingAfterCreationMessage')}</Typography>
                                            <CircularProgress/>
                                        </>
                                    ):
                                    (
                                        <>
                                            <Typography variant='body2'>{t('blockchainMining')}</Typography>
                                            <CircularProgress/>
                                        </>
                                    );

                            if (this.state.modalOpened) {

                                if (!this.state.waitForCreation) {
                                    if (!coinCreated && !coinError) {
                                        modalConfirm = (
                                            formSchema.map(
                                                (field, key) => {
                                                    const {name} = field;
                                                    let valueElement = null;
                                                    if (name === 'iconFile') {
                                                        if (values[name]) {
                                                            valueElement = (
                                                                <Avatar className={classes.bigAvatar} style={{margin: 0}}>
                                                                    <img
                                                                        className={classes.avatarThumb}
                                                                        alt={values[name].name}
                                                                        src={this.state[name]}
                                                                    />
                                                                </Avatar>
                                                            )
                                                        }
                                                    } else if (name === 'contractFile') {
                                                        if (values[name]) {
                                                            valueElement = (
                                                                <Typography
                                                                    variant='body2'>{values[name].name}</Typography>
                                                            )
                                                        }
                                                    }
                                                    else if (name ==='type') {
                                                        valueElement=(
                                                            <div>
                                                                {assetsType[values[name]].icon}&nbsp; <Typography
                                                                variant='body2'>{t(`Common:${values[name]}`)}</Typography>
                                                            </div>
                                                        )
                                                    }
                                                    else {
                                                        if (values[name] !== "") {
                                                            valueElement = (
                                                                <Typography variant='body2'>{values[name]}</Typography>
                                                            );
                                                        }
                                                    }

                                                    return (
                                                        <Grid container justify="space-evenly" alignItems="center" key={key}>
                                                            <Grid item xs={6} sm={3} style={{marginTop: '5px', marginBottom: '5px'}} align="left">
                                                                <Typography variant="button">{t(field.name)}</Typography>:
                                                            </Grid>
                                                            <Grid item xs={6} sm={3} style={{marginTop: '5px', marginBottom: '5px'}} align="right">
                                                                <strong>
                                                                    {valueElement}
                                                                </strong>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <Divider variant="middle"/>
                                                            </Grid>
                                                        </Grid>
                                                    )
                                                })
                                        )
                                    } else if (coinCreated) {
                                        modalConfirm = (
                                                <AlertAvatar big success />
                                        )
                                    }else if(coinError){
                                        modalConfirm = (
                                            <>
                                                <AlertAvatar big fail />
                                                <Typography variant="body1" error>{coinError.message}</Typography>
                                            </>
                                        );
                                    }else if(fileError){
                                        modalConfirm = (
                                            <>
                                                <AlertAvatar big fail />
                                                <Typography variant="body1" error>{fileError}</Typography>
                                            </>
                                        );
                                    }
                                }
                            }

                            return (
                                <form onSubmit={handleSubmit}>
                                    <FeaturedCard title={t('formTitle')}>

                                        <FormControl>
                                            <Field
                                                //className={classes.fieldContainer}
                                                type="text"
                                                name="type"
                                                component={Select}
                                                inputProps={{name: 'type', id: 'type'}}
                                                //formControlProps={field.formControlProps ? field.formControlProps : null}
                                                renderValue={ assetValue => {
                                                    if(assetValue === assetsType.token.name) {
                                                        return (<MenuItem value={assetsType.token.name}>
                                                            {assetsType.token.icon}&nbsp;{t(`Common:${assetsType.token.name}`)}
                                                        </MenuItem>)
                                                    }else{
                                                        return (<MenuItem value={assetsType.goods.name}>
                                                            {assetsType.goods.icon}&nbsp;{t(`Common:${assetsType.goods.name}`)}
                                                        </MenuItem>)
                                                    }
                                                }
                                                }
                                            >
                                                <MenuItem value={assetsType.token.name} key={assetsType.token.id}>
                                                    {assetsType.token.icon}&nbsp;{t(`Common:${assetsType.token.name}`)}
                                                </MenuItem>
                                                <MenuItem value={assetsType.goods.name} key={assetsType.goods.id}>
                                                    {assetsType.goods.icon}&nbsp;{t(`Common:${assetsType.goods.name}`)}
                                                </MenuItem>

                                            </Field>
                                            <FormHelperText>{t('selectType')}</FormHelperText>
                                        </FormControl>
                                        <FastField
                                            name="iconFile"
                                            component={CustomImageInput}
                                            title={t('selectIcon')}
                                            setFieldValue={setFieldValue}
                                            errMessage={errors["iconFile"]}
                                            touched={touched["iconFile"]}
                                            setFieldTouched={setFieldTouched}
                                            className={classes.fieldContainer}
                                            value={values.iconFile || undefined}
                                            isIcon //This is coin Icon
                                        />
                                        <FastField
                                            fullWidth
                                            name="coinName"
                                            placeholder={t('coinNamePlaceholder')}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            touched={touched["coinName"]}
                                            component={TextInput}
                                            errMessage={errors["coinName"]}
                                            value={values.coinName || ''}
                                        />
                                        <FastField
                                            fullWidth
                                            name="coinSymbol"
                                            placeholder={t('coinSymbolPlaceholder')}
                                            onChange={e => setFieldValue('coinSymbol', e.target.value.toUpperCase())}
                                            onBlur={handleBlur}
                                            touched={touched["coinSymbol"]}
                                            component={TextInput}
                                            errMessage={errors["coinSymbol"]}
                                            value={values.coinSymbol || ''}
                                        />
                                        <FastField
                                            fullWidth
                                            name="initialSupply"
                                            placeholder={t('supplyPlaceholder')}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            touched={touched["initialSupply"]}
                                            component={TextInput}
                                            errMessage={errors["initialSupply"]}
                                            type="text"
                                            value={values.initialSupply || ''}
                                        />
                                        {/*<FormControlLabel*/}
                                            {/*control={*/}
                                                {/*<Switch*/}
                                                    {/*checked={this.state.checkCap}*/}
                                                    {/*onChange={this.handleChangeSwitch('checkCap')}*/}
                                                    {/*color="primary"*/}
                                                {/*/>*/}
                                            {/*}*/}
                                            {/*label="Enable Max Supply"*/}
                                        {/*/>*/}
                                        {/*<Field //this has to be re-rendered to check disabling*/}
                                            {/*fullWidth*/}
                                            {/*name="cap"*/}
                                            {/*placeholder="Max Supply"*/}
                                            {/*onChange={handleChange}*/}
                                            {/*onBlur={handleBlur}*/}
                                            {/*touched={touched["cap"]}*/}
                                            {/*component={TextInput}*/}
                                            {/*type="number"*/}
                                            {/*errMessage={errors["cap"]}*/}
                                            {/*disabled={!this.state.checkCap}*/}
                                            {/*value={values.cap || ''}*/}
                                        {/*/>*/}
                                        <FastField
                                            multiline //TextInput prop
                                            fullWidth
                                            name="coinDescription"
                                            placeholder={t('shortDescriptionPlaceholder')}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            touched={touched["coinDescription"]}
                                            component={TextInput}
                                            errMessage={errors["coinDescription"]}
                                            value={values.coinDescription || ''}
                                        />

                                        {/* <Field
                                            name="contractFile"
                                            component={CustomFileInput}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                placeholder: t('uploadCoinContractPlaceholder'),
                                            }}
                                            endButton={{
                                                buttonProps: {
                                                    round: true,
                                                    color: "primary",
                                                    justIcon: true,
                                                    fileButton: true
                                                },
                                                icon: <AttachFile style={{color: 'white'}} />
                                                //icon: <AppIcon style={{color: 'white'}}
                                                               //icon={{font: 'material', name: 'attach_file'}}/>
                                            }}
                                            errMessage={errors["contractFile"]}
                                            setFieldValue={setFieldValue}
                                            setFieldTouched={setFieldTouched}
                                            touched={touched["contractFile"]}
                                            className={classes.fieldContainer}
                                            value={values.contractFile || undefined}
                                        /> */}

                                        <Field
                                            name='contractFile'
                                            placeholder={t('uploadCoinContractPlaceholder')}
                                            component={PdfFileInput}
                                            className={classes.fieldContainer}
                                            errMessage={errors["contractFile"]}
                                            setFieldValue={setFieldValue}
                                            setFieldTouched={setFieldTouched}
                                            touched={touched["contractFile"]}
                                            value={values.contractFile || undefined}
                                        />

                                        {/*<Button*/}
                                        {/*    color='secondary'*/}
                                        {/*    onClick={() => this.handleInstructionOpen()}*/}
                                        {/*>*/}
                                        {/*    {t('help')}*/}
                                        {/*</Button>*/}
                                    </FeaturedCard>
                                    <div className={classes.fieldContainer}>
                                        {/*<Button*/}
                                        {/*className={classes.submitButton}*/}
                                        {/*variant="contained"*/}
                                        {/*type="submit">Create</Button>*/}
                                        <Button
                                            fullWidth
                                            className={classes.buttons}
                                            variant="contained"
                                            onClick={() => this.handleConfirmModalOpen(
                                                values,
                                                isValid,
                                                validateForm,
                                                setFieldTouched
                                            )}
                                        >
                                            {t('buttonCreate')}
                                        </Button>
                                    </div>

                                    <ZoomModal
                                        title={
                                            coinCreated ?
                                                values['coinName'] + t('coinCreatedMessage') :
                                                coinError ?
                                                    t('coinErrorMessage') :
                                                    t('coinConfirmCreationMessage')
                                        }
                                        open={this.state.modalOpened}
                                        onClose={() => this.handleModalClose(resetForm)}
                                        disableBackdropClick={this.state.waitForCreation}
                                        disableEscapeKeyDown={this.state.waitForCreation}
                                        buttons={(
                                            <React.Fragment>
                                                {!this.props.coinCreated && !this.props.coinError ?
                                                    <Button
                                                        className={classes.buttons}
                                                        disabled={this.state.waitForCreation}
                                                        onClick={submitForm}
                                                        //onClick={(()=>this.handleCreateCoin(values))}
                                                        type="submit"
                                                        variant='contained'
                                                    >
                                                        {t('goCreateButton')}
                                                    </Button>
                                                    : null}
                                                <Button
                                                    className={classes.buttons}
                                                    disabled={this.state.waitForCreation}
                                                    onClick={() => this.handleModalClose(resetForm)}
                                                    variant='contained'
                                                >
                                                    {!this.props.coinCreated && !this.props.coinError ?
                                                        t('Common:cancel') :
                                                        t('Common:close')}
                                                </Button>
                                            </React.Fragment>
                                        )}
                                    >
                                        {modalConfirm}
                                    </ZoomModal>
                                </form>
                            )
                        }
                    }
                />
            );
        }
        return form;
    }
}

const mapStateToProps = state => {
    return {
        loading: state.coin.loading,
        coinCreated: state.coin.coinCreated,
        coinMinting: state.coin.coinMintingAfterCreation,
        coinError: state.coin.error,
        coinList: state.coin.coinList,
        fileData: state.file.fileData,
        fileError: state.file.error
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onGetCoinList: (type,withBalance,tickerArray) => dispatch (actions.coinGetList(null,false,null)),
        onCoinCreation: (coinData) => dispatch(actions.coinCreate(coinData)),
        onCoinCreateReset: () => dispatch(actions.coinCreateReset()),
        onFileUpload: (file) => dispatch(actions.fileUpload(file))
    }
};

export default withTranslation(['NewCoinCreateForm', 'Common', 'NewCoinCreate_validationSchema']) (
                    connect(mapStateToProps,mapDispatchToProps)(
                        withStyles(newCoinCreateFormStyle)(
                            withRouter(CoinCreateForm)
                        )
                    )
                );
