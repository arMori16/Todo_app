import { create } from "zustand"



type State={
    page:number,
}

type Action={
    getPage:()=>number,
    setPage:(num:number)=>void

}

const usePageCounter = create<State & Action>((set:any,get:any)=>({
    page:0,
    setPage:(num:number)=>set({page:num}),
    getPage:()=>get().page,
}))
export default usePageCounter;