import {createSlice, Dispatch, PayloadAction} from "@reduxjs/toolkit";
import {logger} from "../../utilities/winstonLogging/winstonInit";
import Web3 from "web3";
import {web3Set} from "../../store/actions";
import {RootState} from "../store";
import config from "../../config";
import {getBackendWalletsForUser, putData} from "../../api/web3API";


declare global {
    interface Window {
        ethereum: any;
    } //TODO check the real type of ethereum
}

const ETH_POA_NETWORK_ID = config.blockchain.networkID;

type Web3InitialState = {
    isMetamaskChecking: boolean,
    isMetamaskInstalled: any | boolean, //TODO fix
    provider: any, //TODO fix
    web3Instance: any,//TODO fix
    currentAccount: string | any, //TODO fix
}
const initialState: Web3InitialState = {
    isMetamaskChecking: false,
    isMetamaskInstalled: undefined,
    provider: null,
    web3Instance: null,
    currentAccount: null,
};

export const web3Slice = createSlice({
    name: 'Web3',
    initialState,
    reducers: {
        web3StartCheck(state) {
            state.isMetamaskChecking = true;
        },
        web3SetMetamaskPresence(state, action: PayloadAction<{ isMetamaskInstalled: boolean, provider: any, web3Instance: any, currentAccount: string }>) {
            state.isMetamaskChecking = false;
            state.isMetamaskInstalled = action.payload.isMetamaskInstalled;
            state.provider = action.payload.provider;
            state.web3Instance = action.payload.web3Instance;
            state.currentAccount = action.payload.currentAccount;
        }
    }
})
export const {web3SetMetamaskPresence, web3StartCheck} = web3Slice.actions;

export const web3CheckMetamaskPresence = () => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
        try {
            dispatch(web3StartCheck());

            const provider = window.ethereum;
            if (typeof provider !== 'undefined') {
                logger.info('METAMASK installed and found');

                //checking initial balance here
                await provider.enable(); // without this metamask won't authorize any action, not even getting the account
                const web3 = new Web3(provider);
                const metamaskStatus = await isMetamaskLocked(web3);
                const isCorrectNetwork = await isMetamaskNetworkCorrect(web3);
                if (!metamaskStatus.locked && metamaskStatus.accounts.length > 0 && isCorrectNetwork) {
                    await checkMetamaskBalance(web3, metamaskStatus.accounts[0]); //just checking one account for now!
                    dispatch(web3Set(true, provider, web3, metamaskStatus));

                    //getBackendBankForUser(getState().user.currentProfile.id);
                    setBackendWalletsForUser(getState().user.currentProfile.id, metamaskStatus.accounts[0]);
                } else {
                    logger.info('METAMASK on wrong blockchain address or locked');
                    dispatch(web3Set(false));
                }
            } else {
                logger.info('METAMASK not found');
                dispatch(web3Set(false));
            }
        } catch (error) {
            logger.info(`an error occurred: ${error} `);
            dispatch(web3Set(false));
        }
    }
};

const isMetamaskNetworkCorrect = async (web3: Web3): Promise<boolean> => {
    const networkId = await web3.eth.net.getId();
    if (networkId !== ETH_POA_NETWORK_ID) {
        logger.debug(`metamask network id: ${networkId}, expected ${ETH_POA_NETWORK_ID}`);
        return false;
    } else {
        logger.debug(`we are in the correct metamask network id ${networkId}`);
        return true;
    }
}

const isMetamaskLocked = async (web3: Web3): Promise<{ locked: boolean, accounts: string[] }> => {
    return await new Promise((resolve, reject) => { //promisifing a callback

        web3.eth.getAccounts((err, accounts) => {
            if (err != null) {
                logger.error(err);
                reject({
                    locked: true,
                });
            } else if (accounts.length === 0) {
                logger.debug('metamask is probably locked');
                reject({
                    locked: true,
                });
            } else {
                logger.debug('metamask is unlocked');
                logger.debug('metamask ACCOUNTS ', accounts);
                resolve({
                    locked: false,
                    accounts
                });
            }
        })
    });
};

const checkMetamaskBalance = async (web3: Web3, accountAddress: string) => {
    const balance = await web3.eth.getBalance(accountAddress);
    let convertedBalance;
    if (web3.utils.isHexStrict(balance)) {
        convertedBalance = web3.utils.fromWei(web3.utils.toDecimal(balance), "ether"); //TODO check this error
    } else {
        convertedBalance = web3.utils.fromWei(balance, "ether");
    }
    logger.info('METAMASK ACCOUNT BALANCE: ', convertedBalance);
};

const setBackendWalletsForUser = async (userId: number, currentAddress: string) => {
    const currentBank = await getBackendWalletsForUser(userId);

    let data = {};
    if (currentBank !== undefined) {
        if (currentBank.currently_active_wallet === currentAddress) {
            return; // backend Wallets are already updated
        }

        const wallets = currentBank.wallets;
        if (!wallets.includes(currentAddress)) {
            wallets.push(currentAddress);
        }

        data = {
            id: currentBank.id,
            userId: userId,
            currently_active_wallet: currentAddress,
            wallets: wallets,
        };
    } else { //first login ever with an active wallet
        data = {
            userId: userId,
            currently_active_wallet: currentAddress,
            wallets: [currentAddress],
        };
    }
    await putData(data);
}

export default web3Slice.reducer;