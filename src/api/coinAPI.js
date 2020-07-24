import config from "../config";
import {assetDecimalRepresentationToInteger, assetIntegerToDecimalRepresentation} from '../utilities/decimalsHandler/decimalsHandler';

export const coinGetBalance = async (web3, accountAddress, tokenAddress) => {
    const coinContractInstance = new web3.eth.Contract(
        config.smartContracts.TKN_TMPLT_ABI,
        tokenAddress
    );

    const tickerBalance = await coinContractInstance.methods.balanceOf(accountAddress).call({from: accountAddress});
    const decimals = await coinContractInstance.methods.decimals().call();

    let balance =  parseFloat(assetIntegerToDecimalRepresentation(tickerBalance, decimals));
    if(decimals == 0){
        balance = parseInt(balance);
    }

    return {
        balance,
        decimals,
    }
};

export const coinGetFullData = async (web3, accountAddress, tokenAddress) => {
    const coinContractInstance = new web3.eth.Contract(
        config.smartContracts.TKN_TMPLT_ABI,
        tokenAddress
    );

    const name = await coinContractInstance.methods.name().call({from: accountAddress});
    const owner = await coinContractInstance.methods.owner().call({from: accountAddress});
    const logoHash = await coinContractInstance.methods.logoHash().call({from: accountAddress});
    const logoUrl = await coinContractInstance.methods.logoURL().call({from: accountAddress});
    const contractHash = await coinContractInstance.methods.contractHash().call({from: accountAddress});
    const symbol = await coinContractInstance.methods.symbol().call({from: accountAddress});

    return {
        owner,
        name,
        symbol,
        logoHash,
        logoUrl,
        contractHash,
    }

};