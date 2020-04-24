const cardHeaderStyle = theme => ({
  cardHeader: {
    borderRadius: "3px",
    //padding: "1rem 15px",
    padding: theme.spacing(1),
    marginLeft: "15px",
    marginRight: "15px",
    marginTop: "-30px",
    border: "0",
    marginBottom: "0",
      display: 'flex',
      alignContent: 'center',
      justifyContent: 'center',
  },
  cardHeaderPlain: {
    marginLeft: "0px",
    marginRight: "0px",
    "&$cardHeaderImage": {
      margin: "0 !important"
    }
  },
  cardHeaderImage: {
    position: "relative",
    padding: "0",
    zIndex: "1",
    marginLeft: "15px",
    marginRight: "15px",
    marginTop: "-30px",
    borderRadius: "6px",
    "& img": {
      width: "100%",
      borderRadius: "6px",
      pointerEvents: "none",
      boxShadow:
        "0 5px 15px -8px rgba(0, 0, 0, 0.24), 0 8px 10px -5px rgba(0, 0, 0, 0.2)"
    },
    "& a": {
      display: "block"
    }
  },
  noShadow: {
    "& img": {
      boxShadow: "none !important"
    }
  },
  cardHeaderContact: {
    margin: "0 15px",
    marginTop: "-20px"
  },
  cardHeaderSignup: {
    marginLeft: "20px",
    marginRight: "20px",
    marginTop: "-40px",
    padding: "20px 0",
    width: "100%",
    marginBottom: "15px"
  },

    primary: {
        background: theme.palette.primary.main,
        "& h1 small": {
            color: "rgba(255, 255, 255, 0.8)"
        },
        color: "#FFFFFF",
        boxShadow:
            "0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(21, 101, 192, 0.4)"
    },
    secondary: {
        background: theme.palette.secondary.main,
        "& h1 small": {
            color: "rgba(255, 255, 255, 0.8)"
        },
        color: "#FFFFFF",
        boxShadow:
            "0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(21, 101, 192, 0.4)"
    },
    info: {
        background: "linear-gradient(60deg,#26c6da,#0097a7)",
        "& h1 small": {
            color: "rgba(255, 255, 255, 0.8)"
        },
        color: "#FFFFFF",
        boxShadow:
            "0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(21, 101, 192, 0.4)"
    },
    success: {
        background: "linear-gradient(60deg,#66bb6a,#388e3c)",
        "& h1 small": {
            color: "rgba(255, 255, 255, 0.8)"
        },
        color: "#FFFFFF",
        boxShadow:
            "0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(21, 101, 192, 0.4)"
    },
    warning: {
        background: "linear-gradient(60deg,#ffa726,#f57c00)",
        "& h1 small": {
            color: "rgba(255, 255, 255, 0.8)"
        },
        color: "#FFFFFF",
        boxShadow:
            "0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(21, 101, 192, 0.4)"
    },
    danger: {
        background: "linear-gradient(60deg,#ef5350,#d32f2f)",
        "& h1 small": {
            color: "rgba(255, 255, 255, 0.8)"
        },
        color: "#FFFFFF",
        boxShadow:
            "0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(21, 101, 192, 0.4)"
    },
    rose: {
        background: "linear-gradient(60deg,#ec407a,#c2185b)",
        "& h1 small": {
            color: "rgba(255, 255, 255, 0.8)"
        },
        color: "#FFFFFF",
        boxShadow:
            "0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(21, 101, 192, 0.4)"
    }
});

export default cardHeaderStyle;
