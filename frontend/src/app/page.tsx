import axios from "@/api/asxios.api";
import Todo from "@/components/Todos/Todo";
import { cookies } from "next/headers";

export default async function Home() {
  const accessToken = (await cookies()).get('accessToken')?.value;
  const todos = await axios.get('todo',{
    params: {
      page: 0,
      limit: 15
    },
    headers:{
      'Authorization': `Bearer ${accessToken}`
    }
  }).catch((err) => null);
  
  return (
    <div className="flex mt-[2rem] w-full h-full items-center justify-center">
      <div className="flex w-[75%] min-h-[40rem] h-full py-2 px-4 rounded-md bg-black-200">
        {accessToken ? (
          <Todo data={todos?.data}/>
        ):(
          <div className="flex w-full h-full items-center justify-center">
            <p className="text-gray-500 text-lg">Please log in to view your todos.</p>
          </div>
        )}
      </div>
    </div>
  );
}
