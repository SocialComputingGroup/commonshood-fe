import config from "../config";
import {assetDecimalRepresentationToInteger, assetIntegerToDecimalRepresentation} from '../utilities/decimalsHandler/decimalsHandler';

export const coinGetBalance = async (web3, accountAddress, coinAddress) => {
    const coinContractInstance = new web3.eth.Contract(
        config.smartContracts.TKN_TMPLT_ABI,
        coinAddress
    );

    const tickerBalance = await coinContractInstance.methods.balanceOf(accountAddress).call({from: accountAddress});
    const decimals = await coinContractInstance.methods.decimals().call();

    let balance = assetIntegerToDecimalRepresentation(tickerBalance, decimals);
    if(decimals == 0){
        balance = parseInt(balance);
    }

    return {
        balance,
        decimals,
    }
};

