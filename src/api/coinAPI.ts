import Web3 from "web3";
import { AbiItem } from "web3-utils";
import config from "../config";
import {assetDecimalRepresentationToInteger, assetIntegerToDecimalRepresentation} from '../utilities/decimalsHandler/decimalsHandler';
import {logger} from '../utilities/winstonLogging/winstonInit';


type CoinCreateData = {
    name: string,
    symbol: string,
    decimals: number,
    iconUrl: string,
    iconHash: string,
    cap: number,
    contractHash: string,
};
export const createCoin = async(web3: Web3, accountAddress: string, coinData: CoinCreateData) => {
    const { name, symbol, decimals, iconUrl, iconHash, cap, contractHash} = coinData;

    const tokenFactoryInstance = new web3.eth.Contract(
        config.smartContracts.TKN_FCTRY_ABI as unknown as AbiItem, //TODO check if this is correct
        config.smartContracts.TKN_FCTRY_ADDR,
    );
    const creationResponse = await tokenFactoryInstance.methods.createToken(
        name,
        symbol,
        decimals,
        iconUrl,
        iconHash,
        cap,
        contractHash,
    ).send({from: accountAddress, gasPrice: "0"});
    logger.info('metamask succesfully created res: ', creationResponse); 

    //TODO fixme here there should be some response state management in case of failure!
    return creationResponse; //TODO add return type to this method
}



export const mintCoin = async(web3: Web3, accountAddress: string, coinAddress: string, initialSupply: number, decimals: number) => {
    
    const justCreatedTokenInstance = new web3.eth.Contract(
        config.smartContracts.TKN_TMPLT_ABI as unknown as AbiItem,
        coinAddress,
    );
    
    const mintingResponse = await justCreatedTokenInstance.methods.mint(
        accountAddress,
        parseInt(assetDecimalRepresentationToInteger(initialSupply, decimals)),
    ).send({from: accountAddress, gasPrice: "0"});
    logger.info('metamask succesfully minted res: ', mintingResponse); 

    //TODO fixme here there should be some response state management in case of failure
    return mintingResponse; //TODO add return type to this method
};


export type CoinBalance = {
    balance: number,
    decimals: number
};
export const coinGetBalance = async (web3: Web3, accountAddress: string, tokenAddress: string): Promise<CoinBalance> => {
    const coinContractInstance = new web3.eth.Contract(
        config.smartContracts.TKN_TMPLT_ABI as unknown as AbiItem, //TODO check if this is correct
        tokenAddress
    );

    const tickerBalance = await coinContractInstance.methods.balanceOf(accountAddress).call({from: accountAddress});
    const decimals = await coinContractInstance.methods.decimals().call();

    let balance: number =  parseFloat(assetIntegerToDecimalRepresentation(tickerBalance, decimals));
    if(decimals == 0){
        balance = parseInt(balance.toString());
    }

    return {
        balance,
        decimals,
    }
};


type CoinFullData = {
    owner: string,
    name: string,
    symbol: string,
    decimals: number,
    logoHash: string,
    logoUrl: string,
    contractHash: string,
};
export const coinGetFullData = async (web3: Web3, accountAddress: string, tokenAddress: string) : Promise<CoinFullData> => {
    const coinContractInstance = new web3.eth.Contract(
        config.smartContracts.TKN_TMPLT_ABI as unknown as AbiItem, //TODO check if this is correct
        tokenAddress
    );

    const name = await coinContractInstance.methods.name().call({from: accountAddress});
    const owner = await coinContractInstance.methods.owner().call({from: accountAddress});
    const logoHash = await coinContractInstance.methods.logoHash().call({from: accountAddress});
    const logoUrl = await coinContractInstance.methods.logoURL().call({from: accountAddress});
    const contractHash = await coinContractInstance.methods.contractHash().call({from: accountAddress});
    const symbol = await coinContractInstance.methods.symbol().call({from: accountAddress});
    const decimals = await coinContractInstance.methods.decimals().call({from: accountAddress});

    return {
        owner,
        name,
        symbol,
        decimals,
        logoHash,
        logoUrl,
        contractHash,
    }

};