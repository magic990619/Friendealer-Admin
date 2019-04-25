import api from 'app/ApiConfig.js'
import jwtDecode from 'jwt-decode';
import FuseUtils from '@fuse/FuseUtils';
import history from 'history.js';
// import browserLog from 'app/LogConfig.js';

class jwtService extends FuseUtils.EventEmitter {

    init()
    {
        this.setInterceptors();
        this.handleAuthentication();
    }

    setInterceptors = () => {
        api.interceptors.response.use(response => {
            return response;
        }, err => {
            return new Promise((resolve, reject) => {
                if ( err.response !== undefined && err.response.status === 401 && err.config && !err.config.__isRetryRequest )
                {
                    console.log("Error in setInterceptors");
                    // if you ever get an unauthorized response, logout the user
                    this.emit('onAutoLogout', 'Incorrect username or password provided.');
                    this.setSession(null);
                }
                throw err;
            });
        });
    };

    handleAuthentication = () => {
        //console.log('jwtService -> handleAuthentication');
        // browserLog("jwtService", 'handelAuthentication', "call");
        let access_token = this.getAccessToken();

        if ( !access_token) {
            this.setSession(null);
            this.emit('onAutoLogout', 'You should login.');
        } else if (this.isAuthTokenValid(access_token) )
        {
            console.log("emit -> auto login");
            this.setSession(access_token);
            this.emit('onAutoLogin', true);
        }
        else
        {
            this.setSession(null);
            this.emit('onAutoLogout', 'Access_token expired');
        }
    };

    createUser = (data) => {
        console.log(data);
        return new Promise((resolve, reject) => {
            api.post('/auth/register', data)
                .then(response => {
                    if ( response.data.doc )
                    {
                        this.setSession(response.data.access_token);
                        resolve(response.data.doc);
                    }
                    else
                    {
                        console.log(response);
                        reject(response.data.error);
                    }
                });
        });
    };

    signInWithEmailAndPassword = (email, password) => {
        
        return new Promise((resolve, reject) => {
            api.post('/auth/login', {
                    'email': email,
                    'password' : password
            }).then(response => {
                console.log(response);
                if ( response.data.decodedToken && response.data.decodedToken.role === 'admin' )
                {
                    this.setSession(response.data.access_token);
                    resolve(response.data.decodedToken);
                }
                else
                {
                    reject(response.data.error);
                }
            });
        });
    };

    signInWithToken = () => {
        return new Promise((resolve, reject) => {
            api.get('/auth/access-token/' + this.getAccessToken())
                .then(response => {
                    if ( response.data.decodedToken )
                    {
                        this.setSession(response.data.access_token);
                        resolve(response.data.decodedToken);
                    }
                    else
                    {
                        reject(response.data.error);
                    }
                });
        });
    };

    updateUserData = (user) => {
        return api.post('/auth/user/update', {
            user: user
        });
    };

    setSession = access_token => {
        if ( access_token )
        {
            localStorage.setItem('jwt_access_token', access_token);
            api.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
        }
        else
        {
            localStorage.removeItem('jwt_access_token');
            delete api.defaults.headers.common['Authorization'];
        }
    };

    logout = () => {
        console.log("jwtService -> logout");
        this.setSession(null);
        
        history.push({
            pathname: '/login'
        });
    };

    isAuthTokenValid = access_token => {
        if ( !access_token )
        {
            return false;
        }
        const decoded = jwtDecode(access_token);
        const currentTime = Date.now() / 1000;
        if ( decoded.exp < currentTime )
        {
            console.warn('access token expired');
            return false;
        }
        else
        {
            return true;
        }
    };

    getAccessToken = () => {
        return window.localStorage.getItem('jwt_access_token');
    };
}

const instance = new jwtService();

export default instance;
