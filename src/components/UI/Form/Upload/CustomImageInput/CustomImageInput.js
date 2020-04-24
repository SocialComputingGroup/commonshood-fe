import React, { Component } from "react";

import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import Avatar from "@material-ui/core/Avatar";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';

import withStyles from "@material-ui/core/styles/withStyles";
import customImageInputStyle from "./CustomImageInputStyle";
import classnames from "classnames";

class CustomImageInput extends Component {
    constructor(props) {
        super(props);
        this.fileUpload = React.createRef();
        this.showFileUpload = this.showFileUpload.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
    }

    state = {
        file: null,
        imagePreviewUrl: null
    };

    showFileUpload() {
        if (this.fileUpload) {
            this.props.setFieldTouched(this.props.field.name);
            this.fileUpload.current.click();
        }
    }

    handleImageChange(e) {
        const {
            setFieldValue,
            field
        } = this.props;
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
            setFieldValue(field.name, file);

        }
    }

    showPreloadImage() {
        const { errMessage, classes, touched, isIcon, type} = this.props;
        // const { name } = this.props.field;
        const { file, imagePreviewUrl } = this.state;

        let comp = null;

        if (touched && errMessage) {
            comp = <Icon style={{ fontSize: 36 }}>error_outline</Icon>;
        } else if (file) {
            comp = (
                <img className={isIcon ? classes.avatarThumb : classes.imageThumb} src={imagePreviewUrl} alt="..." />
            );
        } else {
            if(type === 'crowdsaleImage'){
                comp = <Icon style={{
                        fontSize: 56,
                        margin: "2rem auto 2rem auto",
                        display: "inline-block"
                    }}>wallpaper</Icon>
            }else {
                comp = <Icon style={{ fontSize: 36 }}>wallpaper</Icon>;
            }
        }
        return comp;
    }

    componentDidMount() {
    }
    componentDidUpdate() {
        if(!this.props.touched && this.props.field.value === undefined && this.state.file) {
            this.setState({file: null, imagePreviewUrl: null});
            this.showPreloadImage();
        }
    }

    render() {
        const { touched, errMessage, title, classes, isIcon } = this.props;
        const { name, onBlur } = this.props.field;

        const avatarStyle = classnames(
            classes.bigAvatar,
            this.state.file ? [classes.whiteBack] : [classes.primaryBack],
            { [classes.errorBack]: touched && errMessage }
        );
        return (
            <div className={classes.container}>
                <input
                    className={classes.hidden}
                    id={name}
                    name={name}
                    type="file"
                    onChange={this.handleImageChange}
                    ref={this.fileUpload}
                    onBlur={onBlur}
                    //className="form-control"
                />
                <Typography className={classes.title} variant="subtitle1">
                    {title}
                </Typography>
                {isIcon ?
                    (<Avatar className={avatarStyle} onClick={this.showFileUpload}>
                        {this.showPreloadImage()}
                    </Avatar>)
                    :
                    (<Card style={{border: '1px red'}}>
                        <CardActionArea style={{textAlign: 'center'}} onClick={this.showFileUpload}>
                            {this.showPreloadImage()}
                        </CardActionArea>
                    </Card>)
                }

                {touched && errMessage ? (
                    <Typography variant="caption" color="error">
                        {errMessage}
                    </Typography>
                ) : null}
            </div>
        );
    }
}

export default withStyles(customImageInputStyle)(CustomImageInput);
