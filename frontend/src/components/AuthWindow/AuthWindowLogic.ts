"use client"
import origAxios, { AxiosError } from 'axios';
import axios from '@/api/asxios.api';
import Cookies from 'js-cookie';
import { LoginForm, SignUpForm } from './AuthWindow';
export const saveTokensToCookies = async(accessToken:string,refreshToken:string):Promise<void>=>{
    const accessTokenExpiration = new Date(new Date().getTime() + 60 * 60 * 1000);
    Cookies.set('accessToken',accessToken,{
        expires: accessTokenExpiration,secure:true,sameSite:'strict'
    });
    Cookies.set('refreshToken',refreshToken,{
        expires: 28,secure:true,sameSite:'strict'
    });
}
export const handleLogic = async (data:LoginForm | SignUpForm,view:string,setServerError:(error:string)=>void)=>{
    try{
        const URI = view === 'login' ? '/signin' : '/signup';
        const res = await axios.post(URI,data);
        if(res.data.tokens){
            saveTokensToCookies(res.data.tokens.access_token,res.data.tokens.refresh_token);
            window.location.reload();
        }
    }catch(error:any){
        if (origAxios.isAxiosError(error) && error.response) {
            const serverError = String(error.response.data.message);
            setServerError(serverError);
            console.log('THI IS SETSERVER ERROR',serverError);
        } else {
            setServerError(error.message || 'An unexpected error occurred');
            
        }
    }
}