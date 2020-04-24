import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';

import logo_cocity from "../../assets/img/logo_cocity.jpg";
import logo_crowdbankers from "../../assets/img/logo/240x240.png";
import Typography from "@material-ui/core/Typography";
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import aboutStyle from './AboutStyle';

class About extends Component {
    render () {
        const {
            classes
        } = this.props;

        return (
            <Grid container alignItems="center" spacing={1}>
                <Grid item xs={12}>
                    <Avatar src={logo_crowdbankers} className={classes.logo}/>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="body2">
                        CommonsHood &egrave; sviluppato dal Dipartimento di Informatica dell&apos;Universit&agrave; degli Studi di Torino nell&apos;ambito del programma UIA, Urban Innovative Actions, promosso dall&apos;Unione Europea.
                        <br></br>
                        Per maggiori infomazioni sul progetto visita il link <Link href="https://www.uia-initiative.eu/en/uia-cities/turin" target="_blank">https://www.uia-initiative.eu/en/uia-cities/turin</Link>
                        <br></br>
                        Per maggiori informazioni su CommonsHood, puoi scrivere a <Link href="mailto:crowdbankers@di.unito.it">crowdbankers@di.unito.it</Link>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Link href="http://www.comune.torino.it/benicomuni/co-city/index.shtml" target="_blank">
                        <Avatar src={logo_cocity} className={classes.logo}/>
                    </Link>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(aboutStyle)(About);