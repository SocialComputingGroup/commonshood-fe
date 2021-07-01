import config from "../config";
import {
    assetDecimalRepresentationToInteger,
    assetIntegerToDecimalRepresentation
} from '../utilities/decimalsHandler/decimalsHandler';
import Web3 from "web3";
import {AbiItem} from "web3-utils";


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
 * @param web3
 * @param accountAddress
 * @param crowdsaleAddress
 * @param amount
 * @returns {Promise<boolean>}
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