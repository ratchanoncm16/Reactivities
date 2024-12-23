import axios, { AxiosError, AxiosHeaders, AxiosResponse } from 'axios'
import { Activity, ActivityFormValues } from '../models/activity';
import { router } from '../router/Router';
import { toast } from 'react-toastify';
import { store } from '../stores/store';
import { User, UserFormValues } from '../models/user';
import { PaginatedResult } from "../models/pagination";
import { Photo, Profile, UserActivity } from '../models/profile';




const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    });
};

// axios.defaults.baseURL =  'http://localhost:5000/api/'; //process.env.REACT_APP_API_URL; 
const apiUrl = import.meta.env.VITE_API_URL;
console.log(`API URL: ${apiUrl}`);
console.log(`env.DEV: ${import.meta.env.DEV}`);

axios.defaults.baseURL =  apiUrl;


axios.interceptors.request.use((config) => {
    const token = store.commonStore.token;
    if (token && config.headers) {
      (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
    }
    return config;
  });

axios.interceptors.response.use(
    async response => {
    if (import.meta.env.DEV) await sleep(1000);
    console.log('Check Header ' + response.headers);
    const pagination = response.headers["pagination"];

    if (pagination) {
        response.data = new PaginatedResult(
            response.data,
            JSON.parse(pagination)
        );
        return response as AxiosResponse<PaginatedResult<any>>;
    }
    return response;
   
},(error: AxiosError) => {
    const {data, status, config} = error.response as AxiosResponse;
    switch (status) {
        case 400:
            if(config.method === 'get' && Object.prototype.hasOwnProperty.call(data.error, 'id')) {
             router.navigate('/not-found');
            }
            if(data.errors){
                const modalStateErrors = [];
                for(const key in data.errors) {
                    if(data.errors[key]){
                        modalStateErrors.push(data.errors[key])
                    }
                }
                throw modalStateErrors.flat();
            } else {
                toast.error(data);
            }
            //toast.error('bad request')
            break;
        case 401:
            toast.error('unauthorised')
            break;
        case 403:
            toast.error('forbidden')
            break;
        case 404:
            //toast.error('not found')
            router.navigate('/not-found');
            break;
        case 500:
            store.commonStore.setServerError(data);
            router.navigate('/server-error');
            //toast.error('server error') //alert bottom-right
            break;
    }
    return Promise.reject(error);
})

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T>  (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>  (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>  (url: string) => axios.delete<T>(url).then(responseBody),
}

const Activities ={
    list: (params: URLSearchParams) =>
        axios
          .get<PaginatedResult<Activity[]>>("/activities", { params })
          .then(responseBody),
    detail: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: ActivityFormValues) => requests.post<void>('/activities', activity),
    update: (activity: ActivityFormValues) => requests.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del<void>(`/activities/${id}`),
    attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {}),
}

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user),
    refreshToken: () => requests.post<User>("/account/refreshToken", {}),
}

const Profiles = {
    get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
    uploadPhoto: (file: Blob) => {
      let formData = new FormData();
      formData.append("File", file);
      return axios.post<Photo>("photos", formData, {
        headers: { "Content-type": "multipart/form-data" },
      });
    },
    setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
    deletePhoto: (id: string) => requests.del(`/photos/${id}`),
    updateProfile: (profile: Partial<Profile>) =>
      requests.put(`/profiles`, profile),
    updateFollowing: (username: string) =>
      requests.post(`/follow/${username}`, {}),
    listFollowings: (username: string, predicate: string) =>
      requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
    listActivities: (username: string, predicate: string) =>
      requests.get<UserActivity[]>(
        `/profiles/${username}/activities?predicate=${predicate}`
      ),
  };

  
const agent ={
    Activities,
    Account,
    Profiles,
}

export default agent;