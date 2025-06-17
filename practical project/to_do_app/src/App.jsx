import react, { useEffect, useState } from 'react'
import './App.css'

function App() {
  // const [count, setCount] = useState(0)
  const [view, setView] = useState('form');
  // useEffect(()=>{
  //   let newData = data;
  //   // setData
  // },[data])
  const [name,setName] = useState('');
  const [status,setStatus] = useState('Undone');
  const [category,setCategory] = useState('Home');
  const [data,setData] = useState([])
  const handlechange = (e,name)=>{
          e.preventDefault();
          let newData = data;
          console.log("first")
          newData.forEach((item)=>{
            if(item.name==key.name){
              if(item.status=='Done'){
                item.status = 'Undone'
              }else{
                item.status = 'Done'
              }
            }
          })
          // console.log(newData);
          setData(newData);
          alert("Status Changed");
  }
  console.log(data);
  return (
    <div className='h-[80%] w-[80%] mx-auto my-auto bg-white b flex flex-col items-center justify-center'>
    <h1 className='font-bold mt-20'>To Do App</h1>
    <div 
      onClick={(e)=>{
        if(view=='List') setView("form");
        else setView("List");
      }}
    className='w-fit h-fit  bg-blue-300 flex items-center px-2  rounded-md  text-white'> Form/List </div>

    {view=='form'&&<div className={`${view=='form'?"opacity-100":"opacity-0"} flex flex-col items-center justify-center gap-3`}>
      <form className='flex flex-col gap-3 items-center justify-center mt-10'  >
        <label  >Name: <input className='border-1 text-center' type='text' name='name'
          onChange={(e)=>{
            e.preventDefault();
            setName(e.target.value);
          }}
        /></label>
        <label>Category</label>
        <select 
        className='border-2'
          onChange={(e)=>{
            e.preventDefault();
            setCategory(e.target.value);
          }}
        >
            <option value={"Home"}>Home</option>
            <option value={"Office"}>Office</option>
            <option value={"Personal"}>Personal</option>
          
        </select>
        <label>Status:</label>
        <select 
        className='border-2'
          onChange={(e)=>{
            e.preventDefault();
            setStatus(e.target.value);
          }}
        >
            <option value={"Done"}>Done </option>
            <option value={"Undone"}>Undone</option>          
        </select>
        
      </form>
      <button
        type='button'
        className='bg-black text-white px-2 rounded-sm'
        onClick={(e)=>{
          e.preventDefault();
          console.log(name);
          let newdata = data ;
          let newdata2 = data;
          let index = newdata2.findIndex((key)=>(key.name===name));
          
          if(index!=-1){
            console.log(index);
            alert("Same task is Available");
            return;
          }
        
          newdata.push({
            name:name,
            status:status,
            category:category,
          });
          setData(newdata);
          // console.log("Fome")
          alert("Data added successfully")
          // console.log(data, newdata);
        }}
        
        >Submit</button>
    </div>
}
    {view=='List'&&<div className={`${view=='List'?"opacity-100":"opacity-0"} mt-10 `}>
      <h1>To Do List</h1>
      {
        data.length==0?(<div className='text-black font-bold mt-10 '>No To Do Task Available</div>)
        :(
          <div className='flex flex-wrap gap-3 justify-center items-center'>
            {
              data?.map((key,index)=>(
                <div key={index} className='border-2 border-amber-100 rounded-md p-3 '>
                    <div>Task Name: {key?.name}</div>
                    <div>Category: {key?.category}</div>
                    <div
                    onClick={(e)=>{
                      // handlechange(e, key.name);
                      if(key.status=='Done'){
                        key.status = 'Undone'
                        console.log(key.status)
                      }else{
                        key.status = 'Done';
                        console.log(key.status)
                      }
                      alert("status Changed");
                      
                      setView('form');
                      // setView('List');
                    }}
                    >{key.status=='Done'?"Done":"Undone"}</div>
                    <div 
                    className='p-2'
                    onClick={(e)=>{
                      let newData = data.filter((item)=>item.name!=key.name);
                      if(newData.length==0){
                        setData([]);
                      }else{
                        setData(newData);
                      }
                      
                      alert("Data Deleted Successfully..");
                      
                    }}
                    > delete</div>
                   </div> 
                   
              ))
            }
          </div>
          
        )
      }
    </div>}
    </div>
  )
}

export default App
