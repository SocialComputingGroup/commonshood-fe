import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

//Material UI components
import Typography from '@material-ui/core/Typography'

// Kit Pro components
// import Card from "../../../../Kit/components/Card/Card";
// import CardBody from "../../../../Kit/components/Card/CardBody.jsx";
// import CardHeader from "../../../../Kit/components/Card/CardHeader.jsx";
// import CardFooter from "../../../../Kit/components/Card/CardFooter.jsx";

import Card from "../Card";
import CardBody from "../CardBody.jsx";
import CardHeader from "../CardHeader.jsx";
import CardFooter from "../CardFooter.jsx";
import featuredCardStyle from './FeaturedCardStyle';
//import classNames from 'classnames'



function FeaturedCard(props) {
    const { classes } = props;
    // const featuredTitle = classNames({
    //     [classes.cardTitle]: true,
    //     [classes.textSecondary]: true});
    return (
        <Card className={classes.textCenter}>
            <CardHeader color="primary">
                <Typography variant="h5" className={classes.cardTitle}>{props.title}</Typography>
            </CardHeader>
            <CardBody>
                {props.children}
            </CardBody>
            {props.footer ? (<CardFooter>{props.footer}</CardFooter>) : null}
        </Card>
    );
}

export default withStyles(featuredCardStyle)(FeaturedCard);
