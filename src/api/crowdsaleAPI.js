import config from "../config";
import {assetDecimalRepresentationToInteger, assetIntegerToDecimalRepresentation} from '../utilities/decimalsHandler/decimalsHandler';


/**
 *
 * @param web3
 * @param accountAddress
 * @param crowdsaleAddress
 * @param tokenAddress
 * @returns {Promise<void>}
 */
export const crowdsaleGetRaised = async (web3, accountAddress, crowdsaleAddress, tokenAddress) => {
    //TODO, just get the "raised" public value of the contract
}

/**
 *
 * @param web3
 * @param accountAddress
 * @param crowdsaleAddress
 * @param tokenAddress
 */
export const crowdsaleGetReservationsOfAccount = async (web3, accountAddress, crowdsaleAddress, tokenAddress) => {
    const crowdsaleContractInstance = new web3.eth.Contract(
        config.smartContracts.TKN_CRWDSL_ABI,
        crowdsaleAddress
    );

    let accountReservations = await crowdsaleContractInstance.methods.getMyReservation().call({from: accountAddress});
    accountReservations = parseFloat(assetIntegerToDecimalRepresentation(accountReservations, 2)); //decimals always 2 for coins

    return accountReservations;
}

/**
 *
 * @param web3
 * @param accountAddress
 * @param crowdsaleAddress
 * @param tokenToGiveAddress
 * @returns {Promise<{balance: number, decimals: *}>}
 */
export const getCrowdsaleWalletBalanceOfTokenToGive = async (web3, accountAddress, crowdsaleAddress, tokenToGiveAddress) => {
    // const crowdsaleContractInstance = new web3.eth.Contract(
    //     config.smartContracts.TKN_CRWDSL_ABI,
    //     crowdsaleAddress
    // );

    const coinContractInstance = new web3.eth.Contract(
        config.smartContracts.TKN_TMPLT_ABI,
        tokenToGiveAddress
    );
    const tickerBalance = await coinContractInstance.methods.balanceOf(crowdsaleAddress).call();
    const decimals = await coinContractInstance.methods.decimals().call();

    let balance =  parseFloat(assetIntegerToDecimalRepresentation(tickerBalance, decimals));
    if(decimals == 0){
        balance = parseInt(balance);
    }

    return {
        balance,
        decimals,
    }

}


export const loadCouponsInCrowdsale = async(web3, accountAddress, crowdsaleAddress, tokenToGiveAddress, amount, decimals) => {
    const coinContractInstance = new web3.eth.Contract(
        config.smartContracts.TKN_TMPLT_ABI,
        tokenToGiveAddress
    );

    //in theory no need to convert because coupons have always 0 decimals
    //but better be future proof
    const trueAmount = parseInt(assetDecimalRepresentationToInteger(amount, decimals));
    try {
        await coinContractInstance.methods
            .transfer(crowdsaleAddress, trueAmount)
            .send({from: accountAddress, gasPrice: '0'});
        return true;
    }catch(error){
        return false;
    }
}


export const unlockCrowdsale = async(web3, accountAddress, crowdsaleAddress) => {
    const crowdsaleContractInstance = new web3.eth.Contract(
        config.smartContracts.TKN_CRWDSL_ABI,
        crowdsaleAddress
    );

    try {
        await crowdsaleContractInstance.methods
            .unlockCrowdsale()
            .send({from: accountAddress, gasPrice: '0'});
        return true;
    }catch(error){
        return false;
    }
}