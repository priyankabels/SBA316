 
 //Declaring variables that neded to be cached with form values at the start of js
 const taskForm=document.getElementById("formTaskManager");
// console.log(taskForm)
 const inputTextTask=document.querySelector("#inputTask");  // This is the place where user enteres text
 const taskList=document.getElementById("taskList");  //Created Ul to store task
 const taskListOptons=document.querySelector("#taskListOptons"); //Filter Completed and Incompleted tasks Form control
 const addTaskButton=document.querySelector("#addTaskButton");

// console.log(task);
//On DOMContentLoaded Get tasks if present from local storage
document.addEventListener("DOMContentLoaded", getTasksFromLocalStorage);

//Validate task text so that it not only contains special characters
function validateTaskInput(taskText)
{
    let regex=/^(?=.*[A-Za-z0-9])[A-Za-z0-9\s\-_\.]*$/
    return regex.test(taskText);
}

function validateTaskInLocalStorage(taskText)
{
    let tasks=JSON.parse(localStorage.getItem("tasks"))||[];
    if(tasks)
    {
        const sametask= tasks.find(task => task.taskText === taskText);
        if(sametask)
            return true;
        else
        return false;

    }
    else
    return false;
}
//The Add button click event listner
addTaskButton.addEventListener("click",function(e)
{
    e.preventDefault();
    console.log(inputTextTask.value)
    const inputTask=inputTextTask.value.trim();
    //Set custom validation return if null
    if(inputTask==="")
    {
        window.alert("Input cannot be blank");
        return;
    }
    //Validate to check if input task entered already matches with one in local storage then say it is duplicate reenter 
    let repeatTask=validateTaskInLocalStorage(inputTextTask.value)
    //Check for the text validation in task text 
    let inputValid= validateTaskInput(inputTextTask.value)
    if(repeatTask)
    {
        window.alert("The task already exists. Reneter new task");
        inputTextTask.value="";
        return;
    }
    if(!inputValid)
    {
        window.alert("Please reenter a valid task");
        inputTextTask.value="";
        return;
    }
    //Task creating using fragment 
    createTask(inputTask,false,false)
    inputTextTask.value="";
    taskListOptons.value="all";
    //inputTask=null;
    // To get the parent of a task
   const firstTask = taskList.firstChild;
   
});

//It will create a taskDiv and create DOM accordingly and wrap it in DocumentFragment
function createTask(inputTask,retrieval,completed)
{
    //console.log("Im called")
    let index=0;
    const frag=document.createDocumentFragment(); //Using Document fragment for better performance
    //Creating a newTaskDiv and adding Li to hit to hold task created text
    const newTaskDiv=document.createElement("div");
    newTaskDiv.classList.add("task");
    //newTaskDiv.setAttribute("class","task");
    const taskLi=document.createElement("li")
    taskLi.textContent=inputTask; //Li will contain the task that is created
    //Adding tasks to local storage
    if(retrieval===false)
    {
        saveTaskToLocalStorage(taskLi.textContent);  //Skip this while loading 
    }
   
    taskLi.classList.add("task-item");
    newTaskDiv.appendChild(taskLi);
    

   // Creating a button that can enable user mark task as completed
    const taskCompletedBtn=document.createElement("button");
    taskCompletedBtn.innerHTML="<i class='fa-solid fa-check-square'></li>"
    taskCompletedBtn.classList.add("completeBtn");
    if(completed===true)   //WHile retrieveing check if completed flag is true then mark show accordingly to UI 
    {
        newTaskDiv.classList.add("completed");
        newTaskDiv.classList.add("task-text");
    }
    
    newTaskDiv.appendChild(taskCompletedBtn);
    //Creating a delete button that can enable user delete a task
    const taskDeleteBtn=document.createElement("button");
    taskDeleteBtn.innerHTML="<i class='fa-trash-can fa-solid'></li>"
    taskDeleteBtn.classList.add("deleteBtn");
    
    newTaskDiv.appendChild(taskDeleteBtn);
   //Appending the DIv created for a task to Frag
    frag.appendChild(newTaskDiv);
    taskList.appendChild(frag); //Appending fragment to taskList that is ul
   // console.log(frag);

}

//Save the tasks created to local storage
function saveTaskToLocalStorage(task)
{
    //localStorage.clear();
    console.log(task);
   let tasks;
    console.log("savetolocal")
    if(localStorage.getItem("tasks")===null)
    {
        tasks=[];  // set tasks to empty array if none are present
        console.log("Empty task",tasks)
    }
    else
    {
        tasks=JSON.parse(localStorage.getItem("tasks")) //from local storage get tasks if any 
        console.log("Existing task",tasks)
    }
    if(task!=="")
    { 
        const taskObj={
            taskText:task,
            completed:false
        }
        tasks.push(taskObj); //Push each task to tasks
    }
  
    console.log("tasks before adding",tasks);

    localStorage.setItem("tasks",JSON.stringify(tasks)); //Send tasks to local storage to save key here is tasks
}

//Whenever user deletes task from the list it should be deleted from local storage as well
function deleteFromLocalStorage(task){
    console.log(task.childNodes[0].textContent);
    const taskNameToDelete = task.childNodes[0].textContent;
    //Get tasks from local storage
    let tasks=JSON.parse(localStorage.getItem("tasks"))||[];

    // Find the index of the task that matches the taskName
    const taskIndex = tasks.findIndex(task => task.taskText === taskNameToDelete);
    console.log(taskIndex)
    if (taskIndex >-1) {
        // Remove the task at the found index
        tasks.splice(taskIndex, 1);
        
        // Save the updated tasks array back to localStorage
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    else
    {
        console.log("No tasks found to delete");
    }

}
//On Document load call this function to get tasks from local storage
function getTasksFromLocalStorage()
{
    //localStorage.clear()
    let tasks;
    //JSON.parse(localStorage.getItem("tasks"))||[];
    if(localStorage.getItem("tasks")===null)
        {
            tasks=[];  // set tasks to empty array if none are present
            console.log("Empty task",tasks)
        }
        else
        {
            tasks=JSON.parse(localStorage.getItem("tasks")) //from local storage get tasks if any 
            console.log("Existing task",tasks)
        }
    console.log("retrieve",tasks);

    tasks.forEach(function(task)
    {
        console.log("Task retrieve",task.taskText);
        createTask(task.taskText,true,task.completed);

    });

}
//EventListner to mark task as completed and delete task
taskList.addEventListener("click",function(e)
{
    e.preventDefault();
    const task=e.target;
    console.log("task",task);
   try{
    if(task.classList[0]==="completeBtn")   
        {
            console.log("in")
            const taskItem=task.parentNode;
            console.log("Completed button item",task.previousElementSibling.textContent)
            //task.classList.toggle("completed");
            taskItem.classList.toggle("completed");
            taskItem.classList.toggle("task-text");
            //Update the local storage to mark flag as complted
            if(task.previousElementSibling.textContent!=="")
            {
                console.log("Update called");
                const isCompleted=taskItem.classList.contains("completed");
              updateTaskCompleteStatus(task.previousElementSibling.textContent,isCompleted)
            }
        }
        if(task.classList[0]==="deleteBtn")
        {
            const taskItem=task.parentNode;
            //Remove from Local Storage so passing full taskItem to get the text 
            console.log("Calling delete",taskItem);
            deleteFromLocalStorage(taskItem);
            taskItem.remove();
        }

   }
    catch
    {
        throw new Error("Error caused while deleting the task or maeking it complete");
        
    }
    
});
//Add an event listner to the filter box
taskListOptons.addEventListener("change",function(e)
{
    e.preventDefault();
    const tasks=taskList.childNodes;
    console.log(tasks);
    tasks.forEach(function(task){
        switch(e.target.value)
        {
            case "all":  //If all option selected show all tasks
                task.style.display="flex";
                break;
            case "completed":  //Show completed if user selects complete option
                if(task.classList.contains("completed"))
                {
                    task.style.display="flex";
                }
                else
                {
                    task.style.display="none";
                }
                break;
            case "incomplete":  //if user selects shwo incomplete tasks
                if(!task.classList.contains("completed"))  //Means it is incomplete then display else not 
                {
                    task.style.display="flex";
                }
                else
                {
                task.style.display="none";
                }
                break;
        }
    });
});

//To store item in local storage update the task status to completed so to retrieve completed task we can read that value
function updateTaskCompleteStatus(taskText,completed)
{
    // Retrieve the tasks from localStorage
    console.log(taskText);
    console.log(completed)
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    
    if (tasks === null) {
        console.log("No tasks found in localStorage.");
        return;
    }
    try{
            // Find the task by its name 
        const taskToUpdate = tasks.find(task => task.taskText === taskText);
        
        if (taskToUpdate) {
            // Update the completed of the found task
            taskToUpdate.completed = completed;
            
            // Save the updated tasks array back to localStorage
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }

    }
    catch{
        throw new Error("Error while updating the completed property of task ")
    }
    
    
}

