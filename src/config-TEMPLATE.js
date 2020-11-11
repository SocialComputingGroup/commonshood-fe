const config = Object.freeze({
    network: { // Network elements
        loopback: {
            URL: 'http://127.0.0.1:8080/api/'
        },
        authserver:{
            firstlife : {
                base_url : 'https://secure.firstlife.org/oauth/login',
                response_type: 'code',
                client_id: 'ciIoXWo2',
                redirect_uri: 'http://localhost:3000/login',
            },
            firstlife_logout : {
                base_url : 'https://secure.firstlife.org/oauth/logout',
                client_id: 'ciIoXWo2',
                redirect_uri: 'http://localhost:3000/logout',
            }
        },
        socketserver :{
            url: 'http://127.0.0.1:8080/'
        },
        firstLifeApi : {
            url: 'https://api.firstlife.org/v6/fl/'
        }
    },
    interface: { //Interface configuration elements
        snackbar: {
            maxSnack: 3
        }
    },
    logging:{
        level: "debug", //"error" for production
        //std levels in priority order:   error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
    },
    crowdsaleStatus: {
        0: "RUNNING",
        1: "STOPPED",
        2: "LOCKED"
    },
    blockchain: {
        networkID: 456719,
        rpcEndpoint: "https://eth-dapp.commonshood.eu",
    },
    smartContracts : {
        TKN_FCTRY_ABI: [],
        TKN_FCTRY_ADDR: "",

        CRWDSL_FCTRY_ABI: [],
        CRWDSL_FCTRY_ADDR: "",

        DAO_FCTRY_ABI: [],
        DAO_FCTRY_ADDR: "",

        TKN_TMPLT_ABI: [],

        TKN_CRWDSL_ABI: [],

        CCDAO_ABI: [],
    },
    defaultGeoCoordinates: { //these below are centered on Turin
        longitude: 7.686856,
        latitude: 45.070312,
    }
});

export default config;
