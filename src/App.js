import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import './App.css';
import axios from "axios"
import { useEffect, useState } from 'react';
import { FormLabel } from '@mui/material';



 

const API="https://todo-be-f0u0.onrender.com/"

function App() {
            const [todos,setTodos]=useState([]);
            const [inputs,setInputs]=useState({task:"",date:""})
            const [status,setStatus]=useState("all")
            const [filtered,setFiltered]=useState([]);
            const HandleChange=(e)=>{
              setInputs((prevState)=>({...prevState,[e.target.name]:e.target.value}))
          }

           
            useEffect(()=>{
             
              GetTodos();
              filterHandler();
              // eslint-disable-next-line react-hooks/exhaustive-deps
            },[todos]);

            const GetTodos= async()=>{
              try {
               const response= await axios.get(API+"task")
               const data=await response.data;
               setTodos(data)
            }
             catch (error) {
                console.log(error)
              }
            }

          
            
            const completeTodo = async id => {
              const data = await fetch(API+"task/"+ id).then(res => res.json());
          
              setTodos(todos => todos.map(todo => {
                if (todo.id === data.id) {
                  todo.done = data.done;
                }
          
                return todo;
              }));
              GetTodos();
              
            }

            const addTodo = async (e) => {
              const data = await axios.post(API+"task", {
                  task:inputs.task,
                  date:inputs.date
                }).catch((err)=>console.log(err))
                 const taskData=data.data;
                 return taskData;
          
              
            }
            const handleSubmit=(e)=>{
              e.preventDefault()
              console.log(inputs)
            addTodo(inputs).then(res=>console.log(res))
            .catch((err)=>console.log(err))
            }
              
  
             
            const deleteTodo = async id => {
              const data = await fetch(API + 'task/' + id, { method: "DELETE" }).then(res => res.json())
              
              setTodos(data);
              GetTodos();
               
            }
          

            const statusHandler=(e)=>{
                setStatus(e.target.value)
            }

            const filterHandler=()=>{
              switch (status) {
                case "completed":
                  setFiltered(todos.filter((todo)=>todo.done===true))
                  break;
                case "uncompleted":
                  setFiltered(todos.filter((todo)=>todo.done===false))
                  break;
                default:
                  setFiltered(todos);
                  break;
               
              }
            }
           
      
  return (
    <div className="App">
      <div className='container'>
         <h1>ToDo App</h1>

        
          <form onSubmit={handleSubmit}>
          <div className='add-container'>
            <FormLabel>Task</FormLabel>
          <TextField

        hiddenLabel
        id="filled-hidden-label-normal"
        placeholder='Enter the todo task'
        variant="standard"
        name='task'
        className='text-field'
        onChange={HandleChange}
        value={inputs.task}
      />
      <FormLabel>Deadline</FormLabel>
      <input type="date" name="date" className='text-field' onChange={HandleChange}
        value={inputs.date}/>
       <Button
       type ="submit"
        variant="contained"
        sx={{"&:hover":{bgcolor:"hotpink"},bgcolor:"deeppink"}} 
         >   
        ADD
      </Button>
      </div>
          </form>
       
      <div className='select-task'>
        <select onChange={statusHandler} className='todos-filter'>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="uncompleted">Uncompleted</option>
        </select>
     
      </div>
      <div className='tasks'>
        <h3>Your Tasks</h3>
          {filtered.length>0 ? filtered.map(todo=>(
					<div className={
						"todo" + (todo.done ? " is-complete" : "")
					} key={todo._id} >
						<div className="text">{todo.task}</div>
            <p className={'date' +(new Date(todo.date)>new Date() ? "deadline":"")} style={{fontSize:"small"}} key={todo._id}>
              Deadline: {new Date (todo.date).toDateString()}
            </p>
            <div className='done-icon' onClick={() => completeTodo(todo._id)} >
              <DoneIcon/>
            </div>
						<div className="delete-icon" onClick={() => deleteTodo(todo._id)}><DeleteIcon/></div>
					</div>
				)) : (
					<p>You currently have no tasks</p>)}

      </div>

        
      </div>
    </div>
  );
}

export default App;
