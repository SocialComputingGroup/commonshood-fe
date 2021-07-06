import config from "../config";
import {
    assetDecimalRepresentationToInteger,
    assetIntegerToDecimalRepresentation
} from '../utilities/decimalsHandler/decimalsHandler';
import Web3 from "web3";
import {AbiItem} from "web3-utils";
import {logger} from "../utilities/winstonLogging/winstonInit";
import {coinGetFullData} from "./coinAPI";


/**
 *
 * @param web3
 * @param accountAddress
 * @param crowdsaleAddress
 * @param tokenAddress
 * @returns {Promise<void>}
 */
export const crowdsaleGetRaised = async (web3: Web3, accountAddress: string, crowdsaleAddress: string, tokenAddress: string) => {
    //TODO, just get the "raised" public value of the contract
}

/**
 *
 * @param web3
 * @param accountAddress
 * @param crowdsaleAddress
 * @param tokenAddress
 */
export const crowdsaleGetReservationsOfAccount = async (web3: Web3, accountAddress: string, crowdsaleAddress: string, tokenAddress: string)  : Promise<number> => {
    const crowdsaleContractInstance = new web3.eth.Contract(
        config.smartContracts.TKN_CRWDSL_ABI as unknown as AbiItem,
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
export const getCrowdsaleWalletBalanceOfTokenToGive = async (web3: Web3, accountAddress: string, crowdsaleAddress: string, tokenToGiveAddress: string) :  Promise<{balance: number, decimals: number}>=> {
    // const crowdsaleContractInstance = new web3.eth.Contract(
    //     config.smartContracts.TKN_CRWDSL_ABI,
    //     crowdsaleAddress
    // );

    const coinContractInstance = new web3.eth.Contract(
        config.smartContracts.TKN_TMPLT_ABI as unknown as AbiItem,
        tokenToGiveAddress
    );
    const tickerBalance = await coinContractInstance.methods.balanceOf(crowdsaleAddress).call();
    const decimals = await coinContractInstance.methods.decimals().call();

    let balance: number = parseFloat(assetIntegerToDecimalRepresentation(tickerBalance, decimals));
    if (decimals == 0) {
        balance = parseInt(balance.toString());
    }

    return {
        balance,
        decimals,
    }

}


export const loadCouponsInCrowdsale = async (web3: Web3, accountAddress: string, crowdsaleAddress: string, tokenToGiveAddress: string, amount: number, decimals: number) :Promise<boolean> => {
    const coinContractInstance = new web3.eth.Contract(
        config.smartContracts.TKN_TMPLT_ABI as unknown as AbiItem,
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
    } catch (error) {
        return false;
    }
}


export const unlockCrowdsale = async (web3: Web3, accountAddress: string, crowdsaleAddress: string) :Promise<boolean> => {
    const crowdsaleContractInstance = new web3.eth.Contract(
        config.smartContracts.TKN_CRWDSL_ABI as unknown as AbiItem,
        crowdsaleAddress
    );

    try {
        await crowdsaleContractInstance.methods
            .unlockCrowdsale()
            .send({from: accountAddress, gasPrice: '0'});
        return true;
    } catch (error) {
        return false;
    }
}

export const approveTransfer = async (web3: Web3, accountAddress: string, crowdsaleAddress: string, tokenAddress: string, amount: number) : Promise<boolean>=> {
    const tokenContractInstance = new web3.eth.Contract(
        config.smartContracts.TKN_TMPLT_ABI as unknown as AbiItem,
        tokenAddress
    );

    try {
        await tokenContractInstance.methods.approve(
            crowdsaleAddress,
            amount
        ).send({from: accountAddress, gasPrice: '0'});
        return true;
    } catch (error) {
        return false;
    }
    ;
};

/**
 * NOTE: Careful, this method will always fail if it's not called after an approveTransfer
 *          with correct amount and tokenAddress equal to that expected as tokenToAccept by the
 *          crowdsale contract
 */
export const joinCrowdsale = async (web3: Web3, accountAddress: string, crowdsaleAddress: string, amount: number) : Promise<boolean>=> {

    const crowdsaleContractInstance = new web3.eth.Contract(
        config.smartContracts.TKN_CRWDSL_ABI as unknown as AbiItem,
        crowdsaleAddress
    );

    try {
        await crowdsaleContractInstance.methods.joinCrowdsale(
            amount
        ).send({from: accountAddress, gasPrice: '0'});

        return true;
    } catch (error) {
        return false;
    }
}

export const refundFromCrowdsale = async (web3: Web3, accountAddress: string, crowdsaleAddress: string, amount: number): Promise<boolean> => {
    const crowdsaleContractInstance = new web3.eth.Contract(
        config.smartContracts.TKN_CRWDSL_ABI as unknown as AbiItem,
        crowdsaleAddress
    );

    try {
        await crowdsaleContractInstance.methods.refundMe(
            amount
        ).send({from: accountAddress, gasPrice: '0'});

        return true;
    } catch (error) {
        return false;
    }
}

type CrowdsaleData = {
    tokenToGiveAddr: string,
    tokenToAccept: string,
    start: number,
    end: number,
    acceptRatio: number,
    giveRatio: number,
    maxCap: number,
    metadata: any,
};
export const createCrowdsale = async (web3: Web3, accountAddress: string, crowdsaleData: CrowdsaleData): Promise<boolean> => {
    const {
        tokenToGiveAddr,
        tokenToAccept,
        start,
        end,
        acceptRatio,
        giveRatio,
        maxCap,
        metadata,
    } = crowdsaleData;
    try {
        const crowdsaleFactoryInstance = new web3.eth.Contract(
            config.smartContracts.CRWDSL_FCTRY_ABI as unknown as AbiItem,
            config.smartContracts.CRWDSL_FCTRY_ADDR,
        );
        await crowdsaleFactoryInstance.methods.createCrowdsale(
            tokenToGiveAddr,
            tokenToAccept,
            start,
            end,
            acceptRatio,
            giveRatio,
            maxCap,
            metadata,
        ).send({from: accountAddress, gasPrice: "0"});

        return true;
    } catch (error) {
        return false;
    }
}


export const getAllCrowdsales = async (web3: Web3, accountAddress: string): Promise<string[]> => {
    try {
        const CrowdsaleFactoryInstance = new web3.eth.Contract(
            config.smartContracts.CRWDSL_FCTRY_ABI as unknown as AbiItem,
            config.smartContracts.CRWDSL_FCTRY_ADDR,
        );
        let crowdsaleAddresses = [];
        crowdsaleAddresses = await CrowdsaleFactoryInstance.methods.getAllCrowdsalesAddresses()
            .call({from: accountAddress, gasPrice: "0"});
        return crowdsaleAddresses;
    }
    catch (error){
        logger.debug("Could not load all crowdsales: ", error);
        return [];
    }
}


export const getOwner = async (web3: Web3, accountAddress: string, crowdsaleAddress: string): Promise<string | null> => {
    try {
        const crowdsaleInstance =  new web3.eth.Contract(
            config.smartContracts.TKN_CRWDSL_ABI as unknown as AbiItem,
            crowdsaleAddress,
        );

        return await crowdsaleInstance.methods.owner().call({from: accountAddress, gasPrice: "0"});

    }catch (error){
        return null; 
    }
}


export const getTitle= async (web3: Web3, accountAddress: string, crowdsaleAddress: string): Promise<string | null> => {
    try {
        const crowdsaleInstance =  new web3.eth.Contract(
            config.smartContracts.TKN_CRWDSL_ABI as unknown as AbiItem,
            crowdsaleAddress,
        );

        return await crowdsaleInstance.methods.title().call({from: accountAddress, gasPrice: "0"});

    }catch (error){
        return null;
    }
}


export const getDescription = async (web3: Web3, accountAddress: string, crowdsaleAddress: string): Promise<string | null> => {
    try {
        const crowdsaleInstance =  new web3.eth.Contract(
            config.smartContracts.TKN_CRWDSL_ABI as unknown as AbiItem,
            crowdsaleAddress,
        );

        return await crowdsaleInstance.methods.description().call({from: accountAddress, gasPrice: "0"});

    }catch (error){
        return null;
    }
}


export const getLogoHash = async (web3: Web3, accountAddress: string, crowdsaleAddress: string): Promise<string | null> => {
    try {
        const crowdsaleInstance =  new web3.eth.Contract(
            config.smartContracts.TKN_CRWDSL_ABI as unknown as AbiItem,
            crowdsaleAddress,
        );

        return await crowdsaleInstance.methods.logoHash().call({from: accountAddress, gasPrice: "0"});

    }catch (error){
        return null;
    }
}


export const getTOSHash= async (web3: Web3, accountAddress: string, crowdsaleAddress: string): Promise<string | null> => {
    try {
        const crowdsaleInstance =  new web3.eth.Contract(
            config.smartContracts.TKN_CRWDSL_ABI as unknown as AbiItem,
            crowdsaleAddress,
        );

        return await crowdsaleInstance.methods.TOSHash().call({from: accountAddress, gasPrice: "0"});

    }catch (error){
        return null; 
    }
}


export const getStartDateRaw = async (web3: Web3, accountAddress: string, crowdsaleAddress: string): Promise<number | null> => {
    try {
        const crowdsaleInstance =  new web3.eth.Contract(
            config.smartContracts.TKN_CRWDSL_ABI as unknown as AbiItem,
            crowdsaleAddress,
        );

        return await crowdsaleInstance.methods.start().call({from: accountAddress, gasPrice: "0"});

    }catch (error){
        return null;
    }
}


export const getEndDateRaw = async (web3: Web3, accountAddress: string, crowdsaleAddress: string): Promise<number | null > => {
    try {
        const crowdsaleInstance =  new web3.eth.Contract(
            config.smartContracts.TKN_CRWDSL_ABI as unknown as AbiItem,
            crowdsaleAddress,
        );

        return await crowdsaleInstance.methods.end().call({from: accountAddress, gasPrice: "0"});

    }catch (error){
        return null;
    }
}


export const getAcceptRatioRaw = async (web3: Web3, accountAddress: string, crowdsaleAddress: string): Promise<number | null> => {
    try {
        const crowdsaleInstance =  new web3.eth.Contract(
            config.smartContracts.TKN_CRWDSL_ABI as unknown as AbiItem,
            crowdsaleAddress,
        );

        return await crowdsaleInstance.methods.acceptRatio().call({from: accountAddress, gasPrice: "0"});

    }catch (error){
        return null;
    }
}


export const getGiveRatioRaw = async (web3: Web3, accountAddress: string, crowdsaleAddress: string): Promise<number | null> => {
    try {
        const crowdsaleInstance =  new web3.eth.Contract(
            config.smartContracts.TKN_CRWDSL_ABI as unknown as AbiItem,
            crowdsaleAddress,
        );

        return await crowdsaleInstance.methods.giveRatio().call({from: accountAddress, gasPrice: "0"});

    }catch (error){
        return null;
    }
}


export const getTokenToGiveAddr = async (web3: Web3, accountAddress: string, crowdsaleAddress: string): Promise<string | null> => {
    try {
        const crowdsaleInstance =  new web3.eth.Contract(
            config.smartContracts.TKN_CRWDSL_ABI as unknown as AbiItem,
            crowdsaleAddress,
        );

        return await crowdsaleInstance.methods.tokenToGiveAddr().call({from: accountAddress, gasPrice: "0"});

    }catch (error){
        return null;
    }
}


export const getTokenToAcceptAddr= async (web3: Web3, accountAddress: string, crowdsaleAddress: string): Promise<string | null> => {
    try {
        const crowdsaleInstance =  new web3.eth.Contract(
            config.smartContracts.TKN_CRWDSL_ABI as unknown as AbiItem,
            crowdsaleAddress,
        );

        return await crowdsaleInstance.methods.tokenToAcceptAddr().call({from: accountAddress, gasPrice: "0"});

    }catch (error){
        return null;
    }
}

export type Status = keyof typeof config.crowdsaleStatus;

export const getStatus = async (web3: Web3, accountAddress: string, crowdsaleAddress: string): Promise<Status | null> => {
    try {
        const crowdsaleInstance =  new web3.eth.Contract(
            config.smartContracts.TKN_CRWDSL_ABI as unknown as AbiItem,
            crowdsaleAddress,
        );

        return await crowdsaleInstance.methods.status().call({from: accountAddress, gasPrice: "0"});

    }catch (error){
        return null; //TODO what should I return?
    }
}


export const getCap= async (web3: Web3, accountAddress: string, crowdsaleAddress: string): Promise<number | null> => {
    try {
        const crowdsaleInstance =  new web3.eth.Contract(
            config.smartContracts.TKN_CRWDSL_ABI as unknown as AbiItem,
            crowdsaleAddress,
        );

        return await crowdsaleInstance.methods.maxCap().call({from: accountAddress, gasPrice: "0"});

    }catch (error){
        return null;
    }
}


export const getTotalReservations= async (web3: Web3, accountAddress: string, crowdsaleAddress: string): Promise<number | null> => {
    try {
        const crowdsaleInstance =  new web3.eth.Contract(
            config.smartContracts.TKN_CRWDSL_ABI as unknown as AbiItem,
            crowdsaleAddress,
        );

        return await crowdsaleInstance.methods.raised().call({from: accountAddress, gasPrice: "0"});

    }catch (error){
        return null;
    }
}
