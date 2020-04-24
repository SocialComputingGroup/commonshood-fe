import React from "react";
// used for making the prop types of this component
import PropTypes from "prop-types";


//Classnames Helper
import classNames from 'classnames'

//Material UI Style helper
import withStyles from '@material-ui/core/styles/withStyles'
import imageUploadStyle from './ImageUploadStyle';

//Material UI core components
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'

//Material Icons
import Folder from '@material-ui/icons/Folder'

// Material Kit Pro components
//import Button from "../../../../../Kit/components/CustomButtons/Button.jsx";

//Custom Components
//import AppIcon from "../../../AppIcon/AppIcon"
import defaultImage from "../../../../../assets/img/placeholder.svg";
import defaultAvatar from "../../../../../assets/img/placeholder.svg";


class ImageUpload extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            file: null,
            imagePreviewUrl: this.props.avatar ? defaultAvatar : defaultImage
        };
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }

    handleImageChange(e) {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        if (file) {
            reader.onloadend = () => {
                this.setState({
                    file: file,
                    imagePreviewUrl: reader.result
                });
            };
            reader.readAsDataURL(file);
            this.props.setFieldValue(this.props.id, file)
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        // this.state.file is the file/image uploaded
        // in this function you can save the image (this.state.file) on form submit
        // you have to call it yourself
    }
    handleClick() {
        this.refs.fileInput.click();
    }

    handleRemove() {
        this.setState({
            file: null,
            imagePreviewUrl: null
        });
        this.refs.fileInput.value = null;
    }

    render() {
        var {
            classes,
            avatar,
            title
        } = this.props;
        const {imagePreviewUrl, file} = this.state;
        const avatarStyle = classNames ({[classes.bigAvatar]: true}, this.state.file ? [classes.whiteBackground] : null );
        return (
            <div className={classes.elementDiv}>
                <Typography className={classes.title} variant="subtitle2">{title}</Typography>
                <input className={classes.fileInput}
                       id={this.props.id}
                       type="file"
                       onChange={this.handleImageChange} ref="fileInput" />

                {avatar ? (
                    <Avatar className={avatarStyle} onClick={()=>this.handleClick()}>
                        { file ?  (

                                <img
                                    className={classes.avatarThumb}
                                    src={imagePreviewUrl}
                                    alt="..."
                                />
                            ) :
                            //<AppIcon style={{fontSize: 36}} icon={{font: 'material', name: 'folder'}}/>
                            <Folder style={{fontSize: 36 }} />}
                </Avatar>) : (<div className="thumbnail">
                    <img src={imagePreviewUrl} alt="..." />
                </div>)}

                <div>
                    {/*{this.state.file === null ? (*/}
                        {/*<Button {...addButtonProps} onClick={() => this.handleClick()}>*/}
                            {/*{avatar ? "Add Photo" : "Select image"}*/}
                        {/*</Button>*/}
                    {/*) : (*/}
                        {/*<span>*/}
              {/*<Button {...changeButtonProps} onClick={() => this.handleClick()}>*/}
                {/*Change*/}
              {/*</Button>*/}
                            {/*{avatar ? <br /> : null}*/}
                            {/*<Button*/}
                                {/*{...removeButtonProps}*/}
                                {/*onClick={() => this.handleRemove()}*/}
                            {/*>*/}
                {/*<i className="fas fa-times" /> Remove*/}
              {/*</Button>*/}
            {/*</span>*/}
                    {/*)}*/}
                </div>
            </div>
        );
    }
}

ImageUpload.propTypes = {
    avatar: PropTypes.bool,
    addButtonProps: PropTypes.object,
    changeButtonProps: PropTypes.object,
    removeButtonProps: PropTypes.object
};

export default withStyles(imageUploadStyle)(ImageUpload) ;
