'use client'
import useOutsideCommon from "@/features/clickOutside";
import { useState, useRef } from "react";
import AuthWindow from "../AuthWindow/AuthWindow";
import Cookies from "js-cookie";
import Image from "next/image";


export default function NavbarLogin(){
    const [showAuthWindow,setAuthWindow] = useState(false);
    const divRef = useRef<HTMLDivElement>(null!);
    useOutsideCommon({refs:[divRef],onOutsideClick:()=>setAuthWindow(false),eventType:'click'});
    return(
        <div>
            <li className="flex h-full items-center custom-md-lg:w-full w-[5rem] mr-5">
                <button onClick={()=>setAuthWindow(true)} className={`text-rose-50 flex border-[#B3DCC5] border-2 px-2 h-[1.8rem] font-semibold w-full items-center justify-center transition-colors hover:bg-[#B3DCC5] ease-in-out delay-75 duration-500 rounded-md`}>
                    <p>Log In</p>
                </button>
            </li>
            {showAuthWindow && (
                <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-100/50">
                    <div className='relative flex flex-col mx-5 bg-gray-200 h-[37.5rem] rounded-md w-[33rem]' ref={divRef}>
                        <div className="relative flex p-3 justify-end items-center w-full h-[4.5rem]">
                            <button onClick={()=>setAuthWindow(false)} className="flex hover:bg-gray-300 duration-300 relative w-[2.5rem] h-[2.5rem] rounded-[50%] bg-gray-2E mr-4">
                                <div className="flex p-1 w-full h-full absolute inset-0 items-center justify-center">
                                    <span className="rotate-45 ml-1 mb-1 text-white font-thin text-[2rem]">+</span>
                                </div>
                            </button>
                        </div>
                        <AuthWindow />
                    </div>
                </div>
            )}
        </div>
    )
}