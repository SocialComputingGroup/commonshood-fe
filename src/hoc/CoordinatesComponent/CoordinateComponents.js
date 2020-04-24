import React, { Component } from 'react';

const coordinates = (WrappedComponent) => {
    class HOC extends Component {
    state  = {
        lat : undefined,
        lon: undefined
    };

    componentDidMount()
    {
        if (!this.state.lat && !this.state.lon) {
            // navigator.geolocation.getCurrentPosition(location => {
            //     this.setState ({lat: location.coords.latitude, lon: location.coords.longitude});
            // });

            // position is fixed on turin
            const latPortaSusa = 45.071830;
            const lonPortaSusa = 7.662872;
            this.setState({lat: latPortaSusa, lon: lonPortaSusa});
        }

    }

    render () {

    return  (
        
        <WrappedComponent
            {...this.props}
            {...this.state}
        />
    )
    }
    
}
return HOC;
};

export default coordinates;