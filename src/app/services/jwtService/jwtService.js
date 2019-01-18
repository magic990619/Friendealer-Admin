import axios from 'axios'
import jwtDecode from 'jwt-decode';
import FuseUtils from '@fuse/FuseUtils';

class jwtService extends FuseUtils.EventEmitter {

    api = axios.create({baseURL: 'http://localhost:8888'})

    init()
    {
        this.setInterceptors();
        this.handleAuthentication();
    }

    setInterceptors = () => {
        this.api.interceptors.response.use(response => {
            return response;
        }, err => {
            return new Promise((resolve, reject) => {
                if ( err.response !== undefined && err.response.status === 401 && err.config && !err.config.__isRetryRequest )
                {
                    console.log("Error in setInterceptors");
                    // if you ever get an unauthorized response, logout the user
                    this.emit('onAutoLogout', 'Invalid access_token');
                    this.setSession(null);
                }
                throw err;
            });
        });
    };

    handleAuthentication = () => {

        let access_token = this.getAccessToken();
        if ( !access_token )
        {
            return;
        }

        if ( this.isAuthTokenValid(access_token) )
        {
            this.setSession(access_token);
            this.emit('onAutoLogin', true);
        }
        else
        {
            this.setSession(null);
            this.emit('onAutoLogout', 'access_token expired');
        }
    };

    createUser = (data) => {
        console.log(data);
        return new Promise((resolve, reject) => {
            this.api.post('/auth/register', data)
                .then(response => {
                    if ( response.data.user )
                    {
                        this.setSession(response.data.access_token);
                        resolve(response.data.user);
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
            this.api.post('/auth/login', {
                    'email': email,
                    'password' : password
            }).then(response => {
                console.log(response);
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

    signInWithToken = () => {
        return new Promise((resolve, reject) => {
            this.api.get('/auth/access-token/' + this.getAccessToken())
                .then(response => {
                    console.log(response);
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
        return this.api.post('/auth/user/update', {
            user: user
        });
    };

    setSession = access_token => {
        if ( access_token )
        {
            localStorage.setItem('jwt_access_token', access_token);
            this.api.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
        }
        else
        {
            localStorage.removeItem('jwt_access_token');
            delete this.api.defaults.headers.common['Authorization'];
        }
    };

    logout = () => {
        this.setSession(null);
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
