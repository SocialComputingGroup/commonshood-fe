import React, { ReactPropTypes } from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import config from '../../config';

import metamask1 from '../../assets/img/metamaskScreenshoots/metamask1.png';
import metamask2 from '../../assets/img/metamaskScreenshoots/metamask2.png';
import metamask3 from '../../assets/img/metamaskScreenshoots/metamask3.png';

const MetamaskHelper = () => {

    return ( 
        <Grid container 
            spacing={2} 
            direction="row"
            justify="center"
            alignItems="center"
        >
            <Grid item xs={12} lg={6}>
                <Typography variant="h6" gutterBottom style={{color: "red"}}>
                    It seems your Metamask is misconfigured or absent.
                </Typography>
                <Typography variant="body1" gutterBottom>
                    1. First thing first have you installed it? <a href="https://metamask.io/download.html" target="_blank">Click Here </a> to go to the download page. Metamask is both available as a plugin for the most used browsers (Chrome, Firefox, Brave) and as an app for Android or IOS.
                </Typography>
                <Typography variant="body1" gutterBottom>
                    2. Once installed successfully, create your own account following the instructions given by Metamask itself.
                </Typography>
                <Typography variant="body1" gutterBottom>
                    3. Now you have to set the correct network. We used a personalized instance of ethereum blockchain run via geth in Proof-Of-Authority mode and 15second of block time.
                </Typography>
                <Typography variant="body1" gutterBottom>
                    4. Click on the metamask plugin icon in your browser and click on the menu of Metamask in which you select the current network (usually you will have Ropsten or Rinkeby preselected)
                </Typography>
                <Typography variant="body1" gutterBottom align="center">
                    <img src={metamask1}/>
                </Typography>
                <Typography variant="body1" gutterBottom>
                    5. Select "Custom RPC" from the dropdown menu
                </Typography>
                <Typography variant="body1" gutterBottom align="center">
                    <img src={metamask2}/>
                </Typography>
                <Typography variant="body1" gutterBottom>
                    6. Now set <span style={{color:"red"}}>{config.blockchain.rpcEndpoint}</span> as "New RPC URL", <span style={{color:"red"}}>{config.blockchain.networkID}</span> as "networkID", and put whatever network name you find easier to remember in connection to our app. Here in the screenshoot we used directly "Commonshood" as it is the name of the main app of our network. If you want you can also add the explorer address <span style={{color:"red"}}>https://explorer-dapp.commonshood.eu</span> so that metamask can link directly to the details of your transactions.<br/>
                    Click the "Save" Button (not showed in the screenshot, is just below all the fields) and you are ready to go!
                    If the app does not refresh automatically, click the refresh button on your browser!
                </Typography>
                <Typography variant="body1" gutterBottom align="center">
                    <img src={metamask3}/>
                </Typography>
            </Grid>
        </Grid>
    );
};

export default MetamaskHelper;