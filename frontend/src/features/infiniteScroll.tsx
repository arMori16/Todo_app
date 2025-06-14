'use client'
import usePageCounter from "@/zustand/zustandPageCounter";
import {debounce} from "lodash";

import { RefObject, useEffect, useState } from "react"

const InfiniteScroll = ({type,fetchedData,children,componentRef,isWindow,styles}:{type:string,isWindow?:boolean,componentRef:RefObject<HTMLDivElement>,fetchedData:any[],children?:React.ReactNode,styles:string})=>{
    const {page,getPage,setPage} = usePageCounter();
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const typeMapping: Record<
      string,
      { key: string; pageSetter: (num: number) => void, getter: () => number }
    > = {
      todos:   { key: "SeriesName", pageSetter: setPage, getter: getPage },
    };

    useEffect(()=>{
        if (fetchedData.length > 0 && fetchedData) {
            setHasMore(fetchedData.length === 15);
            setLoading(false);
        }else{
            setHasMore(false); // No more data to load
        }
    },[page,fetchedData])
    const handleScroll = debounce(() => {
        const target = isWindow ? window : componentRef.current;
        if (!target || loading || !hasMore) return;
        if (isWindow) {
            // Handle window scrolling
            const scrollTop = window.scrollY;
            const clientHeight = window.innerHeight;
            const scrollHeight = document.documentElement.scrollHeight;
      
            if (scrollTop + clientHeight >= scrollHeight * 0.75) {
              setLoading(true);
              typeMapping[type].pageSetter(typeMapping[type].getter() + 1);
            }
          } else if (componentRef.current) {
            // Handle div scrolling
            const scrollTop = componentRef.current.scrollTop;
            const clientHeight = componentRef.current.clientHeight;
            const scrollHeight = componentRef.current.scrollHeight;
      
            if (scrollTop + clientHeight >= scrollHeight * 0.75) {
              setLoading(true);
              
              typeMapping[type].pageSetter(typeMapping[type].getter() + 1);
            }
          }
      },300);
      useEffect(() => {
        const target = isWindow ? window : componentRef.current;
    
        if (target) {
          target.addEventListener("scroll", handleScroll);
        }
        
        return () => {
          if (target) {
            target.removeEventListener("scroll", handleScroll);
          }
        };
      }, [hasMore]);
    return (
        <div className={styles}>
            {children}
        </div>
    )
}
export default InfiniteScroll;