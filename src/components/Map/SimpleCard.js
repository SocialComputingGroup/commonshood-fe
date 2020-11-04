import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  card: {
    //minWidth: 275,
    display: "inline-block",
    visibility: "visible",
    display: "table-cell",
    fontSize: "1.0em",
    //text-transform: lowercase;
    //line-height: 2em;
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: "10px",
    border: "1px solid #cccccc",
    overflowY: "hidden",
    textOverflow: "ellipsis",
    marginRight: "5px",
    padding: "10px 10px 10px 10px",
    minWidth: "280px",
    maxWidth: "280px",
    overflowX: "hidden",
    fontSize: "1rem",
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 400
  },
  a: {
    textDecoration: "none",
    color: "#000000de",
    fontWeight: "normal",
    whiteSpace: "normal"
  },
  img: {
    verticalAlign: "middle",
    width: "65px",
    height: "65px",
    marginRight: "6px",
    float: "left",
    borderRadius: "40px",
  },
  p: {
    color: "#1e80b2",
    fontSize: "smaller",
    margin: "6px 0px 0px 40px"
  },
  p2: {
    color: "#000000de",
    fontSize: "small",
    float: "right"
  },


};

function handlePay (props)  {
  let contact = {
    firstLifePlaceID: props.feature.id,
    realm: "dao",
    icon: props.feature.img,
    name: props.feature.name
  };
  props.pay(contact);
  
}

function SimpleCard(props) {
  const { classes } = props;
  //console.log("PROPS",props)
  return (
      <div id="card" className={classes.card} onClick = {() => handlePay(props)}>
          <a className={classes.a}> <img src = {props.feature.img} className={classes.img}/> {props.feature.name }</a>
          {/* <p className={classes.p}>{ props.feature.date_from } -- { props.feature.date_to} </p> */}
          {/* <p className={classes.p2}>{ props.feature.numberCard}/{props.size}</p> */}
      </div>
      /* <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} color="textSecondary">
            Test
          </Typography>
        </CardContent>
  </Card> */
  );
}

SimpleCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleCard);
