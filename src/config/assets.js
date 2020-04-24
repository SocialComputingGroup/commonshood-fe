import React from 'react'
import { Toll, LocalOffer } from "@material-ui/icons";

// Type of assets involved in app
export const assetsType = Object.freeze({
    token: {
        name: 'token',
        id: 0,
        decimals: 2,
        icon: <Toll/>
    },
    goods: {
        name: 'goods',
        id: 1,
        decimals: 0,
        icon: <LocalOffer />
    },
});
