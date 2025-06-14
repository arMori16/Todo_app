
"use client"

import React, { useEffect,useState } from 'react';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useForm, SubmitHandler } from "react-hook-form";
import { loginScheme, signupScheme } from './validation-scheme';
import errorStorage from '@/zustand/zustand.authErrors';
import { handleLogic } from './AuthWindowLogic';

export interface LoginForm{
    email:string,
    password:string
}

export interface SignUpForm extends LoginForm{
    firstName:string
}
export default function AuthWindow(){ 

    /* <useStateVariables> */
    const [userEmail,setUserEmail] = useState<string | undefined>('');
    const [userPassword,setUserPassword] = useState<string | undefined>('');
    const [userFirstName,setUserFirstName] = useState<string | undefined>();
    const [view,setView] = useState('login');
    const [isLoading,setIsLoading] = useState(false);
    const {serverError,setServerError} = errorStorage();

    const scheme = view === 'login' ? loginScheme : signupScheme;
      
    /* </useStateVariables> */
    /* </ChangeView> */

    useEffect(() => {
        if(view === 'signup-2'){
            if(typeof window === "undefined") return;
            const element = document.querySelector('.selector') as HTMLTextAreaElement;
            element.value = '';
        }
        return () => {
            setServerError('');
        };
    }, [view]);
    useEffect(()=>{
        const handleKeyPress = (e:KeyboardEvent)=>{
            const activeElement = document.activeElement;

            // Check if the user is inside a textarea
            if ((activeElement && activeElement.tagName === 'TEXTAREA' && e.key === 'Enter') || (activeElement && e.key === 'Enter')) {
                e.preventDefault(); // Prevent new line in the textarea

                // Find the submit button and trigger a click
                const button = document.querySelector('.submit-button') as HTMLButtonElement;
                if (button) button.click();
            }
        }
        document.removeEventListener('keydown',handleKeyPress);
        document.addEventListener('keydown',handleKeyPress);
        return () => {
            document.removeEventListener('keydown',handleKeyPress);
        };
    },[])
    /* Clear setServerError either closing tab or switching view */

    /* <Validation> */
    const {register,handleSubmit,getValues,watch,reset,formState:{errors},trigger,clearErrors} = useForm({
        defaultValues:view === 'login'
        ? { email: '', password: '' }
        : { email: '', password: '', firstName: '' },
        resolver:yupResolver(scheme),
    });
    /* </Validation> */

    /* <Handles> */
    const handleForm:SubmitHandler<SignUpForm | LoginForm> = async (data:SignUpForm | LoginForm)=>{
        const isSuccess = await handleLogic(data,view,setServerError);
    }
    /* </Handles> */
    const handleNewToAniMori = ()=>{
        setView('signup');
        reset();
    }
    return(
            <div className='flex px-[5rem] custom-xs:px-[2rem] h-full text-white flex-col w-full'>
                <p className='text-green-400 text-[1.75rem] font-semibold'>{view === 'login'?'Log In' : 'Sign Up'}</p>
                {view === 'signup' ? (
                    <p className='text-white text-[0.9rem] break-words'>AniMori is anonymous, so your username is what you&apos;ll go by here. Choose wisely—because once you get a name, you can&apos;t change it.</p>
                ):(
                    <p className='text-white text-[0.9rem] break-words'>By continuing,you agree to our <a href='/user/agreement' className='a-login'>User Agreement</a> and acknowledge tha you understand the <a href="/policies/privacy-policy" className='a-login'>Privacy Policy</a></p>
                )}
                {isLoading && (
                    <div className='flex pointer-events-none flex-col-reverse items-center justify-center absolute inset-0 rounded-md z-20 bg-black bg-opacity-40'>
                        <p className='font-semibold text-[1.5rem] ml-2 text-white'>Loading...</p>
                        <img src={`/images/logo.svg`} className='flex w-[2.75rem] h-[2.75rem] rounded-xl' alt="" />
                    </div>
                )}
                <form onSubmit={handleSubmit((data)=>handleForm(data))} className={`flex flex-col h-full w-full ${view === 'login'?'mt-[9rem]':'mt-5'}`}>
                    <div className='flex flex-col w-full p-2 h-[3.5rem] custom-xs:h-[2.75rem] bg-gray-300 rounded-md'>
                        <textarea className='w-full selector h-full bg-transparent outline-none custom-xs:pt-1 custom-xs:text-[0.85rem] flex py-2 overflow-x-scroll overflow-y-hidden whitespace-nowrap scrollbar-hide' placeholder={'Eneter your email'}
                        {...register('email')}
                        ></textarea>
                    </div>
                    {(errors.email) && <div className='flex text-[14px] text-[#E93055] relative ml-2 my-1'>{errors.email?.message}</div>}
                    <div className='flex flex-col'>
                        <div className={`flex w-full ${errors.email?'':'mt-4'} p-2 custom-xs:p-1 custom-xs:text-[0.85rem] custom-xs:h-[2.75rem] h-[3.5rem] bg-gray-300 rounded-md`}>
                            <textarea className='w-full h-full bg-transparent outline-none flex py-2 overflow-x-scroll overflow-y-hidden whitespace-nowrap scrollbar-hide' placeholder={`${'Enter your password'}`} {...register('password')}></textarea>
                        </div>
                        {(errors.password) && <div className='flex text-[14px] text-[#E93055] relative ml-2 mt-1'>{errors.password?.message}</div>}
                    </div>
                    {view==='login' && (
                        <button type="button" onClick={handleNewToAniMori} className='flex text-green-400 mt-3 w-[8rem] custom-xs:text-[0.85rem]'>New to <span className='ml-1 font-inknut font-semibold'>Notes?</span></button>
                    )}
                    {view === 'signup' && (
                        <div className='flex flex-col'>
                            <div className={`flex w-full ${errors.email?'':'mt-4'} p-2 custom-xs:p-1 custom-xs:text-[0.85rem] custom-xs:h-[2.75rem] h-[3.5rem] bg-gray-300 rounded-md`}>
                                <textarea className='w-full h-full bg-transparent outline-none flex py-2 overflow-x-scroll overflow-y-hidden whitespace-nowrap scrollbar-hide' placeholder={`${'Enter your nickname'}`} {...register('firstName')}></textarea>
                            </div>
                            {(serverError || errors.password) && <div className='flex text-[14px] text-[#E93055] relative ml-2 mt-1'>{errors.password?.message || serverError}</div>}
                        </div>
                    )}
                    <div className='flex mt-[2.75rem] w-full h-[2.5rem] custom-xs:h-[2rem] custom-xs:mt-[2.25rem] custom-xs:text-[0.85rem] justify-center'>
                        <button type={'submit'} onClick={()=>handleSubmit} className='flex bg-green-400 submit-button items-center justify-center w-[90%] h-full rounded-md'>
                            <p>Submit</p>
                        </button>
                    </div>
                </form>
            </div>
    )
}
