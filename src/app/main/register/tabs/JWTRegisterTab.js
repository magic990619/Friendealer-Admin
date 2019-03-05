import React, {Component} from 'react';
import Formsy from 'formsy-react';
import {TextFieldFormsy} from '@fuse';
import {Button, InputAdornment, Icon, withStyles} from '@material-ui/core';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import connect from 'react-redux/es/connect/connect';
import * as authActions from 'app/auth/store/actions';

const styles = theme => ({
    login_button: {
        background: 'linear-gradient(to bottom,#139ff0 0,#0087e0 100%)',
        border: '1px solid #0087e0',
        color: '#F7F7F7',
        textShadow: '0 -1px transparent'
    }
})

class JWTRegisterTab extends Component {

    state = {
        canSubmit: false
    };

    form = React.createRef();

    disableButton = () => {
        this.setState({canSubmit: false});
    };

    enableButton = () => {
        this.setState({canSubmit: true});
    };

    onSubmit = (model) => {
        this.props.submitRegister(model);
    };

    componentDidUpdate(prevProps, prevState)
    {
        if ( this.props.register.error && (this.props.register.error.username || this.props.register.error.password || this.props.register.error.email) )
        {
            this.form.updateInputsWithError({
                ...this.props.register.error
            });

            this.props.register.error = null;
            this.disableButton();
        }

        return null;
    }

    render()
    {
        const {classes} = this.props;

        return (
            <div className="w-full">
                <Formsy
                    onValidSubmit={this.onSubmit}
                    onValid={this.enableButton}
                    onInvalid={this.disableButton}
                    ref={(form) => this.form = form}
                    className="flex flex-col justify-center w-full"
                >
                    <TextFieldFormsy
                        className="mb-16"
                        type="text"
                        name="user_name"
                        label="Display name"
                        validations={{
                            minLength: 4
                        }}
                        validationErrors={{
                            minLength: 'Min character length is 4'
                        }}
                        InputProps={{
                            endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">person</Icon></InputAdornment>
                        }}
                        variant="outlined"
                        required
                    />

                    <TextFieldFormsy
                        className="mb-16"
                        type="text"
                        name="email"
                        label="Email"
                        validations="isEmail"
                        validationErrors={{
                            isEmail: 'Please enter a valid email'
                        }}
                        InputProps={{
                            endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">email</Icon></InputAdornment>
                        }}
                        variant="outlined"
                        required
                    />

                    <TextFieldFormsy
                        className="mb-16"
                        type="password"
                        name="password"
                        label="Password"
                        validations="equalsField:password-confirm"
                        validationErrors={{
                            equalsField: 'Passwords do not match'
                        }}
                        InputProps={{
                            endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">vpn_key</Icon></InputAdornment>
                        }}
                        variant="outlined"
                        required
                    />

                    <TextFieldFormsy
                        className="mb-16"
                        type="password"
                        name="password-confirm"
                        label="Confirm Password"
                        validations="equalsField:password"
                        validationErrors={{
                            equalsField: 'Passwords do not match'
                        }}
                        InputProps={{
                            endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">vpn_key</Icon></InputAdornment>
                        }}
                        variant="outlined"
                        required
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.login_button + " w-full mx-auto mt-16 normal-case"}
                        aria-label="REGISTER"
                        value="legacy"
                    >
                        Register
                    </Button>

                </Formsy>

            </div>
        );
    }
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        submitRegister: authActions.submitRegister
    }, dispatch);
}

function mapStateToProps({auth})
{
    return {
        register: auth.register,
        user    : auth.user
    }
}

export default withStyles(styles, {withTheme: true})(withRouter(connect(mapStateToProps, mapDispatchToProps)(JWTRegisterTab)));
