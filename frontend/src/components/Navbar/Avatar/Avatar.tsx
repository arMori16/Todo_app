'use client'
import Image from 'next/image';
import Cookies from 'js-cookie';
import axios from '@/api/asxios.api';

export default function Avatar(){
    const logout = ()=>{
        axios.post('/logout', {}, {
            headers:{
                'Authorization': `Bearer ${Cookies.get('accessToken')}`
            }
        })
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        window.location.reload();
        }
    return(
        <div className='flex h-full items-center justify-center'>
            <div className='flex h-full items-center justify-center'>
                <button onClick={logout} className='flex w-[4rem] cursor-pointer h-[1.5rem] items-center bg-[#f01a41] border-[1px] rounded-sm justify-center'>
                    <p className='text-white text-[0.7rem] font-semibold'>Log Out</p>
                </button>
            </div>
            <Image src={'/images/user.svg'} width={32} height={32} alt='user' className='mx-2 rounded-[50%] bg-white'/>
        </div>
    )
}