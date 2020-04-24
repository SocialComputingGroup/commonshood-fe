const piggyBankStyle = theme => ({
    center: {
        textAlign: "center"
    },
    positivePledgeValue: {
        color: theme.palette.success.main,
    },
    negativePledgeValue: {
        color: theme.palette.secondary.main,
    },
    unmodifiedPledgeValue: {
        color: "black"
    },
    centeredPledgeValue: {
        position: "absolute",
        top:"57%", //harcoded to center on the real body of the maialino
        left:"49%", //harcoded to center on the real body of the maialino
        transform: "translate(-50%, -50%)",
    }
});

export default piggyBankStyle;