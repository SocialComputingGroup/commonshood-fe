//import React from "react";
import React, {Component} from 'react';

//Redux actions connector
import { connect } from 'react-redux';
import * as actions from "../../../../store/actions";

//Lazy loading for Code Splitting
import asyncComponent from "../../../../hoc/AsyncComponent/AsyncComponent";
import MenuItem from "@material-ui/core/MenuItem";

//Async material-ui components
const ContactSelectDetails = asyncComponent(() => import ('./ContactSelectDetails'))

class ContactSelectItem extends Component {

    // constructor (props) {
    //     super(props);
    //     props.onGetIconReset();
    // }

    state = {
        contactIcon: null
    };

    componentDidMount() {
        if (!this.state.contactIcon
             && !this.props.loading
        ) {
            if (this.props.contact.realm === "user") {
                this.setState({contactIcon: this.props.contact.avatar})
            } else {
                this.props.onGetIcon(this.props.contact.avatar);
            }
        }
    }

     componentDidUpdate(prevProps, prevState) {
         if (!this.state.contactIcon &&
             !this.props.loading &&
             this.props.iconFile
         ) {
             if (this.props.iconFile.hash === this.props.contact.avatar) {
                 this.setState({contactIcon: this.props.iconFile})
             }
         }
         if (prevProps.contact.id !== this.props.contact.id) {
             if (this.props.contact.realm === "user" ){
                 this.setState({contactIcon: this.props.contact.avatar})
             } else {
                 this.setState({contactIcon: null});
                 this.props.onGetIcon(this.props.contact.avatar);
             }

         }
    }
    componentWillUnmount() {
        this.props.onGetIconReset();
    }

    render() {
        const {
            contact,
            loading,
            iconFile,
            iconError,
            onGetIcon,
            onGetIconReset,
            showEmail,
            ...rest
        } = this.props;

        const  { contactIcon } = this.state;

        if (contact) {
            return (
                <MenuItem {...rest} >
                    <ContactSelectDetails
                        style={{ overflow: 'hidden', textOverflow: 'ellipsis'}}
                        contact={contact}
                        iconData={contactIcon ? contactIcon : null}
                        showEmail={showEmail}
                    />
                </MenuItem>)
        } else {
            return (<div>Loading...</div>)
        }
    }
}

const mapStateToProps = state => {
    return {
        loading: state.file.loading,
        iconFile: state.file.fileData,
        iconError: state.file.error
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onGetIcon: (hash) => dispatch(actions.fileGetData(hash)),
        onGetIconReset: () => dispatch(actions.fileGetReset())
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(ContactSelectItem);
