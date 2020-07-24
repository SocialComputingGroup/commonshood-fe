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