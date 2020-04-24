import React from "react";

//Lazy loading for Code Splitting
import asyncComponent from '../../../hoc/AsyncComponent/AsyncComponent';
import { withStyles } from "@material-ui/core/styles";
import TransactionListItemStyle from './TransactionListItemStyle';

//Material-UI Components (Lazy loaded)
const ListItem = asyncComponent(()=>import ("@material-ui/core/ListItem"));
const ListItemText = asyncComponent(()=>import ("@material-ui/core/ListItemText"));
const IconButton = asyncComponent(()=>import ("@material-ui/core/IconButton"));
const Typography = asyncComponent(()=>import ('@material-ui/core/Typography'));
const Icon = asyncComponent(()=>import ('@material-ui/core/Icon'));
const ListItemSecondaryAction = asyncComponent(()=>import ('@material-ui/core/ListItemSecondaryAction'));

const transactionListItem = props => (
    <ListItem>
        <ListItemText primary={props.name} secondary={new Date(props.timestamp*1000).toLocaleString()} />
        <ListItemSecondaryAction>
            <IconButton>
                <Typography variant="subtitle2">{props.amount}</Typography>
                <Icon className={props.way === "out"  ? props.classes.flowTransactionOut : props.classes.flowTransactionIn}>
                    {props.way === "out"  ? "arrow_forward" : "arrow_back"}
                </Icon>
            </IconButton>
        </ListItemSecondaryAction>
    </ListItem>
);

export default withStyles(TransactionListItemStyle,{
    withTheme: true
})(transactionListItem);
