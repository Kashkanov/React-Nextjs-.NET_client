"use client";

import { useEffect, useState } from "react";
import {
    HubConnection,
    HubConnectionBuilder,
    LogLevel,
} from "@microsoft/signalr";

const Recipes = () => {

    const [recipes, setRecipes] = useState([]);
    const [name, setName] = useState('');
    const [prepTime, setPrepTime] = useState(0);
    const [cookTime, setCookTime] = useState(0);
    const [description, setDescription] = useState('');
    const [newName, setNewName] = useState('');
    const [newPrepTime, setNewPrepTime] = useState(0);
    const [newCookTime, setNewCookTime] = useState(0);
    const [newDescription, setNewDescription] = useState('');

    const [connection, setConnection] = useState(null);

    useEffect(() => {
        const conn = new HubConnectionBuilder()
            .withUrl("http://localhost:5062/messageHub")
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        conn.on("GetRecipes", (data) =>{
            setRecipes(data);
        } )

        conn.start().
            then(()=>{
                conn.on("UpdateRecipes", (newName, newPrepTime, newCookTime, newDescription) => {
                    setRecipes((prevRecipes) => [...prevRecipes, {name: newName, prepTime: newPrepTime, CookTime: newCookTime, description: newDescription}]);
                });
            conn.invoke("GetRecipes")
                .catch(function (err) {
                console.error("error getting recipes: " + err.toString());
            });
        })
            .catch((err) =>

                console.error("Error while connecting to SignalR Hub:", err)
            );

        setConnection(conn);

    }, []);

    const addRecipe = async () => {

        console.log("Connection state: ", connection);  // Should be 'Connected'
        if (connection?.state === "Connected") {
            try {
                await connection.send("PostRecipe", name, prepTime, cookTime, description);
                console.log("Recipe sent successfully");
            } catch (err) {
                console.error("Error sending recipe:", err.toString());
            }
        } else {
            console.log("SignalR connection not established");
        }
    };


    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Description</td>
                        <td>Prep Time</td>
                        <td>Cook Time</td>
                    </tr>
                </thead>
                <tbody>
                {/*{recipes.map((recipe, index) => (*/}
                {/*    <li key={index}>{recipe.name}</li>*/}
                {/*))}*/}
                {recipes.map((recipe, index) => (
                    <tr key={index}>
                        <td className="p-1">{recipe.name}</td>
                        <td>{recipe.description}</td>
                        <td>{recipe.prepTime}</td>
                        <td>{recipe.cookTime}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div>

                    <input type="text" placeholder="Name" onChange={(e)=>setName(e.target.value)} />
                    <input type="number" placeholder="Prep Time"  onChange={(e)=>setPrepTime(Number(e.target.value))}/>
                    <input type="number" placeholder="Cook Time"  onChange={(e)=>setCookTime(Number(e.target.value))}/>
                    <input type="text" placeholder="Description"  onChange={(e)=>setDescription(e.target.value)}/>
                    <button type="submit" onClick={addRecipe}>Submit</button>

            </div>
        </div>
    );
}
export default Recipes;