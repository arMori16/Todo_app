'use server'
import Image from 'next/image';
import NavbarLogin from './Navbar_login';
import { cookies } from 'next/headers';
import axios from 'axios';
import Avatar from './Avatar/Avatar';
export default async function Navbar(){
    const cookiesStore = cookies();
    const accessToken = (await cookiesStore).get('accessToken')?.value;
    return (
      <div className="flex w-full h-[3.25rem] mt-4 justify-center">
        <div className="flex w-[90%] h-full bg-black-300 rounded-[4px]">
            {/* 1 block */}
            <div className='flex h-full p-1 items-center'>
                <Image src={'/images/logo.svg'} width={62} height={72} alt='logo' className='mx-2'/>
                <p className='text-white text-[1.25rem] font-medium'>Notes</p>
            </div>
            {/* 2 block */}
            <div className='flex ml-auto h-full'>
                {accessToken ? (
                    <Avatar/>
                ):(
                    <NavbarLogin/>
                )}
            </div>
        </div>

      </div>  
    );
}