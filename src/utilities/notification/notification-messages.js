import messageKeys from './messageKeys';
import {assetIntegerToDecimalRepresentation} from '../decimalsHandler/decimalsHandler';
import {logger} from '../winstonLogging/winstonInit';

const getTypedTranslation = (type, translationKeyword) => {
    if(type === 'success'){
        return translationKeyword;
    }else{
        return translationKeyword + 'Fail';
    }
};

const getNotificationText = (messageKey, params, type, t) => {

    let notificationText = '';
    let amountConverted = -1;

    if(params == null){
        throw new Error('This notification received no params, check the caller');
    }
    logger.debug('in getNotificationText, for key ===>', messageKey, ' params ===> ', params);
    //TODO check params correctness base on messageKey
    switch (messageKey) {
        case messageKeys.COIN_CREATED:
            if(!params.ticker || !params.owner){
                throw new Error('missing a required parameter for ' + messageKey);
            }
                notificationText = t( getTypedTranslation(type, 'NotificationMessages:coinCreated'), {params});
            break;
        case messageKeys.COIN_SENT:
            if(!params.ticker || params.amount == null || !params.sender || !params.receiver || params.decimals == null ){
                throw new Error('missing a required parameter for ' + messageKey);
            }
            amountConverted = assetIntegerToDecimalRepresentation(params.amount, params.decimals);
            notificationText = t(getTypedTranslation(type, 'NotificationMessages:coinSent'), {params: {...params, amount: amountConverted}});
            break;
        case messageKeys.COIN_RECEIVED:
        case messageKeys.DAO_COIN_RECEIVED:
            if(!params.ticker || params.amount == null || !params.sender || !params.receiver || params.decimals == null){
                throw new Error('missing a required parameter for ' + messageKey);
            }
            if(params.receiver.type === 'user'){
                amountConverted = assetIntegerToDecimalRepresentation(params.amount, params.decimals);
                notificationText = t(getTypedTranslation(type, 'NotificationMessages:coinReceivedByUser'), {params: {...params, amount: amountConverted}});
            }else if(params.receiver.type === 'dao'){
                amountConverted = assetIntegerToDecimalRepresentation(params.amount, params.decimals);
                notificationText = t(getTypedTranslation(type, 'NotificationMessages:coinReceivedByDao'), {params: {...params, amount: amountConverted}});
            }else{
                throw new Error('receiver.type undefined');
            }
            break;
        case messageKeys.COIN_MINTED:
            if(!params.ticker || params.amount == null || params.decimals == null){
                throw new Error('missing a required parameter for ' + messageKey);
            }
            amountConverted = assetIntegerToDecimalRepresentation(params.amount, params.decimals);
            notificationText = t(getTypedTranslation(type, 'NotificationMessages:coinMinted'), {params: {...params, amount: amountConverted}});
            break;
        case messageKeys.DAO_CREATED:
            if(!params.name){
                throw new Error('missing a required parameter for ' + messageKey);
            }
            notificationText = t(getTypedTranslation(type, 'NotificationMessages:daoCreated'), {params});
            break;
        case messageKeys.DAO_COIN_CREATED:
            if(!params.ticker || !params.owner){
                throw new Error('missing a required parameter for ' + messageKey);
            }
            notificationText = t(getTypedTranslation(type, 'NotificationMessages:daoCoinCreated'), {params});
            break;
        case messageKeys.DAO_COIN_SENT:
            if(!params.ticker || params.amount == null|| !params.sender || !params.receiver || params.decimals == null){
                throw new Error('missing a required parameter for ' + messageKey);
            }
            amountConverted = assetIntegerToDecimalRepresentation(params.amount, params.decimals);
            notificationText = t(getTypedTranslation(type, 'NotificationMessages:daoCoinSent'), {params: {...params, amount: amountConverted}});
            break;
        case messageKeys.DAO_COIN_MINTED:
            if(!params.ticker || params.amount == null || params.decimals == null || params.fullname == null){
                throw new Error('missing a required parameter for ' + messageKey);
            }
            amountConverted = assetIntegerToDecimalRepresentation(params.amount, params.decimals);
            notificationText = t(getTypedTranslation(type, 'NotificationMessages:daoCoinMinted'), {params: {...params, amount: amountConverted}});
            break;
        case messageKeys.DAO_ADMIN_ADDED:
            if(!params.new_admin){
                throw new Error('missing a required parameter for ' + messageKey);
            }
            notificationText = t(getTypedTranslation(type, 'NotificationMessages:daoAdminAdded'), {params});
            break;
        case messageKeys.DAO_MEMBER_JOINED:
            if(!params.new_member){
                throw new Error('missing a required parameter for ' + messageKey);
            }
            notificationText = t(getTypedTranslation(type, 'NotificationMessages:daoMemberJoined'), {params});
            break;
        case messageKeys.DAO_MEMBER_KICKED:
            if(!params.member_kicked){
                throw new Error('missing a required parameter for ' + messageKey);
            }
            notificationText = t(getTypedTranslation(type, 'NotificationMessages:daoMemberKicked'), {params});
            break;
        case messageKeys.DAO_MEMBER_DEMOTED:
            if(!params.member_demoted || params.role != null){
                throw new Error('missing a required parameter for ' + messageKey);
            }
            notificationText = t(getTypedTranslation(type, 'NotificationMessages:daoMemberDemoted'), {params});
            break;
        case messageKeys.DAO_MEMBER_PROMOTED:
            if(!params.member_promoted || params.role != null){
                throw new Error('missing a required parameter for ' + messageKey);
            }
            notificationText = t(getTypedTranslation(type, 'NotificationMessages:daoMemberPromoted'), {params});
            break;
        case messageKeys.DAO_CROWDSALE_CREATED:
            if(!params.crowdsaleID || !params.title){
                throw new Error('missing a required parameter for ' + messageKey);
            }
            notificationText = t(getTypedTranslation(type, 'NotificationMessages:daoCrowdsaleCreated'), {params});
            break;
        case messageKeys.CROWDSALE_CREATED:
            if(!params.crowdsaleID || !params.title){
                throw new Error('missing a required parameter for ' + messageKey);
            }
            notificationText = t(getTypedTranslation(type, 'NotificationMessages:crowdsaleCreated'), {params});
            break;
        case messageKeys.CROWDSALE_UNLOCKED:
        case messageKeys.DAO_CROWDSALE_UNLOCKED:
            if(!params.title){
                throw new Error('missing a required parameter for ' + messageKey);
            }
            notificationText = t(getTypedTranslation(type, 'NotificationMessages:crowdsaleUnlocked'));
            break;
        case messageKeys.CROWDSALE_JOINED:
            if(params.amount == null || !params.title || !params.ticker || !params.crowdsaleId || params.decimals == null){
                throw new Error('missing a required parameter for ' + messageKey);
            }
            amountConverted = assetIntegerToDecimalRepresentation(params.amount, params.decimals);
            notificationText = t(getTypedTranslation(type, 'NotificationMessages:crowdsaleJoined'), {params:{...params, amount: amountConverted}});
            break;
        case messageKeys.CROWDSALE_REFUNDED:
            if(params.amount == null || !params.title || !params.ticker || !params.crowdsaleId || params.decimals == null){
                throw new Error('missing a required parameter for ' + messageKey);
            }
            amountConverted = assetIntegerToDecimalRepresentation(params.amount, params.decimals);
            notificationText = t(getTypedTranslation(type, 'NotificationMessages:crowdsaleRefunded'), {params:{...params, amount: amountConverted}});
            break;
        case messageKeys.CROWDSALE_STOPPED:
        case messageKeys.DAO_CROWDSALE_STOPPED:
            if(!params.title){
                throw new Error('missing a required parameter for ' + messageKey);
            }
            notificationText = t(getTypedTranslation(type, 'NotificationMessages:crowdsaleStopped'));
            break;
        case messageKeys.WALLET_READY: //no params
            notificationText = t(getTypedTranslation(type, 'NotificationMessages:walletReady'));
            break;
        
        default:
            //notificationText = 'Something went wrong - unrecognized messageKey for notification';
            throw new Error('Something went wrong - unrecognized messageKey for notification. Given: ' + messageKey);
    }

    return notificationText;
};

export default getNotificationText;