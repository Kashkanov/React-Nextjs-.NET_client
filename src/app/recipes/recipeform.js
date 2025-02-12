"use client";
import { useEffect, useState } from "react";

//TODO: Add ingredients per recipe

function RecipeForm(props) {

    const [name, setName] = useState('');
    const [prepTime, setPrepTime] = useState(0);
    const [cookTime, setCookTime] = useState(0);
    const [description, setDescription] = useState('');

    const addRecipe = async () => {

        console.log("Connection state2: ", props.connection.state);  // Should be 'Connected'
        if (props.connection?.state === "Connected") {
            try {
                await props.connection.send("PostRecipe", name, prepTime, cookTime, description);
                console.log("Recipe sent successfully");
            } catch (err) {
                console.error("Error sending recipe:", err.toString());
            }
        } else {
            console.log("SignalR connection not established");
        }
    };

    return (
        <div className="p-5 border w-3/5 mx-auto my-2">
            <div className="flex flex-col space-y-4 w-full max-w-lg mx-auto">
                <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)}/>
                <input type="number" placeholder="Prep Time" onChange={(e) => setPrepTime(Number(e.target.value))}/>
                <input type="number" placeholder="Cook Time" onChange={(e) => setCookTime(Number(e.target.value))}/>
                <input type="text" placeholder="Description" onChange={(e) => setDescription(e.target.value)}/>
                <button type="submit" onClick={addRecipe}>Submit</button>
            </div>

        </div>
    )
}

export default RecipeForm;