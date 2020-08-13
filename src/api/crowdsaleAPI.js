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