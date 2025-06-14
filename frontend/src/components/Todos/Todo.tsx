'use client'

import { useEffect, useRef, useState } from "react";
import { TodoDto, TodoDtoWithId } from "./Todo.dto";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from 'uuid';
import axios from "@/api/asxios.api";
import InfiniteScroll from "@/features/infiniteScroll";
import usePageCounter from "@/zustand/zustandPageCounter";

export default function Todo({data}:{data:TodoDtoWithId[]}){
    const [todos,setTodos] = useState<TodoDtoWithId[]>(data);
    const [selectedText, setSelectedText] = useState<string>('');
    const divRef = useRef<HTMLDivElement>(null!);
    const [justFetchedTodos, setJustFetchedTodos] = useState<TodoDtoWithId[]>([]);
    const [text, setText] = useState<string>('');
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [priority, setPriority] = useState<number>(0);
    const [completed, setCompleted] = useState<boolean>(false);
    const {page} = usePageCounter();
    const [selectedTodo, setSelectedTodo] = useState<TodoDtoWithId | null>(null);
    const addTodo = async()=>{
        if(!text.trim())return;
        const newTodo:TodoDto = {
            title:text,
            priority: priority,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            completed: completed,
        };
        resetForm();
        const post = await axios.post('/todo/create', newTodo, {
            headers:{
                'Authorization': `Bearer ${Cookies.get('accessToken')}`
            }
        }).catch((err) => null);
        const tempId = -Math.floor(Math.random() * 1_000_000) || -1;
        setTodos([...todos,{...newTodo,id: tempId}]);
        if (post?.data) {
            setTodos((prev) =>
                prev.map(todo =>
                    todo.id === tempId ? { ...todo, id: post.data.id } : todo
                )
            );
        }
    };

    const resetForm = () => {
        setText('');
        setDueDate(null);
        setPriority(0);
        setCompleted(false);
    };
    const handleUpdateTodo = ()=>{
        if(!selectedTodo) return;
        if(!selectedText.trim())return;
        const newTodo: TodoDtoWithId = {
            id: selectedTodo.id,
            title: selectedText,
            priority: priority,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            completed: completed,
        };
        setTodos(prev => {
            const index = prev.findIndex(todo => todo.id === selectedTodo.id);
            if (index === -1) return prev;
        
            const updated = [...prev];
            updated[index] = newTodo;
            return updated;
        });
        
        resetForm();
        const post = axios.post('/todo/create', newTodo, {
            headers:{
                'Authorization': `Bearer ${Cookies.get('accessToken')}`
            }
        }).catch((err) => null);
    };
    const handleDeleteTodo = async()=>{
        try{
            if(!selectedTodo) return;
            await axios.delete('/todo/delete',{
                params:{
                    id:selectedTodo.id
                },
                headers:{
                    'Authorization':`Bearer ${Cookies.get('accessToken')}`
                }
            });
            setSelectedTodo(null);
            setTodos(prev => prev.filter(todo => todo.id !== selectedTodo.id));
        }catch(err){
            console.error(err);
            
        }
    }
    useEffect(()=>{
        const fetchTodos = async () => {
            const response = await axios.get('/todo', {
                params: {
                    page: page,
                    limit: 15,
                },
                headers: {
                    'Authorization': `Bearer ${Cookies.get('accessToken')}`
                },
            });
            setTodos((prev)=>{
                const newTodos = [...prev, ...response.data];
                const filteredTodos = Array.from(new Map(newTodos.map(todo => [todo.id, todo])).values());
                return filteredTodos;
            });
            setJustFetchedTodos(response.data);
        };
        fetchTodos()
    

    },[page])
    return(
        <div className="w-full h-full">
            <div className="flex flex-col w-full mt-2 rounded-sm overflow-hidden">
                <textarea value={text} onChange={(e)=>setText(e.target.value)} className="flex  peer whitespace-nowrap h-[2.75rem] text-white border-b-[1px] border-gray-300 outline-none p-2 w-full items-center bg-gray-100" placeholder="+ Add a new todo here...">

                </textarea>
                <div className={`${text ? 'scale-y-100':'peer-focus:scale-100 scale-y-0' } transition-transform origin-top duration-300 flex border-t-[1px] border-gray-300 items-center w-full bg-gray-200 h-[2.25rem]`}>
                    <button onClick={addTodo} disabled={!text.trim()} className="ml-auto cursor-pointer flex items-center justify-center w-[4rem] h-[1.5rem] text-gray-500 mr-4 rounded-sm bg-gray-100 " >
                        <i className="fa-solid fa-plus text-[0.7rem] mr-1"></i>
                        <p className="text-[0.8rem]">Add</p>
                    </button>
                </div>
            </div>
            <div className="flex w-full min-h-[2.5rem] bg-gray-100 border-b-[1px] mt-4 border-gray-300">
                <div className="flex w-[50%] items-center">
                    <p className="text-gray-500 ml-5">Title</p>
                </div>
                <div className="flex w-[30%] items-center">
                    <p className="text-gray-500 ml-5">Due Date</p>
                </div>
                <div className="flex w-[30%] items-center">
                    <p className="text-gray-500 ml-5">Importance</p>
                </div>
            </div>
            <div className="flex w-full max-h-[30rem] overflow-y-scroll" ref={divRef}>
                <InfiniteScroll type="todos" componentRef={divRef} isWindow={false}  fetchedData={justFetchedTodos} styles="flex w-full h-full flex-col">
                    {todos && todos.map((todo: TodoDtoWithId,i:number) => (
                        <div key={i} className="flex w-full min-h-[2.5rem] bg-gray-100 border-b-[1px] h-[2.75rem] border-gray-300">
                            <div className="flex w-[50%] items-center relative">
                                <p className="text-gray-500 ml-5 w-full align-middle h-full py-2 outline-none whitespace-nowrap ">{todo.title}</p>
                                <button onClick={()=>setSelectedTodo(todo)} className="absolute right-0 flex h-full items-center cursor-pointer w-[1rem]"><i className="fa-solid fa-chevron-right text-[0.8rem] text-white"></i></button>
                            </div>
                            <div className="flex w-[30%] items-center">
                                <p className="text-gray-500 ml-5">{todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'No due date'}</p>
                            </div>
                            <div className="flex w-[30%] items-center">
                                <p className="text-gray-500 ml-5">{todo.priority}</p>
                            </div>
                        </div>
                    ))}
                </InfiniteScroll>

            </div>
            {selectedTodo && (
                <div className="flex flex-col w-[25rem] z-50 h-[91%] fixed bottom-0 right-0 bg-black-200 rounded-l-md p-4">
                    <div className="flex w-full h-[3rem] items-center ml-4">
                        <button onClick={()=>setSelectedTodo(null)} className="flex items-center justify-center text-gray-500 cursor-pointer">
                            <i className="fa-solid fa-arrow-right-long text-[1.55rem]"></i>
                        </button>
                    </div>
                    <div className="flex w-full pl-4">
                        <textarea onChange={(e)=>setSelectedText(e.target.value)} className="text-gray-500 p-2 w-full bg-gray-100 align-middle h-full py-2 outline-none whitespace-nowrap " defaultValue={selectedTodo.title}></textarea>
                    </div>
                    <div className="flex w-full mt-4 h-[2rem] text-white">
                        <button onClick={handleDeleteTodo} className="flex ml-auto mr-2 bg-[#ab1732] w-[2rem] rounded-sm cursor-pointer h-full items-center justify-center"><i className="fa-solid fa-trash text-[0.9rem]"></i></button>
                        <button onClick={handleUpdateTodo} className="flex cursor-pointer bg-[#19a944] px-2 rounded-sm h-full items-center justify-center"><i className="fa-solid fa-check text-[1rem] mr-1"></i> <p className="text-[0.9rem] font-semibold">Save changes</p></button>
                    </div>
                </div>
            )}
        </div>
    )
}