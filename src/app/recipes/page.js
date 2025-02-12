"use client";

import {useEffect, useState} from "react";
import {
    HubConnection,
    HubConnectionBuilder,
    LogLevel,
} from "@microsoft/signalr";
import 'datatables.net-dt/css/dataTables.dataTables.css';
import dynamic from "next/dynamic";
import RecipeForm from "@/app/recipes/recipeform";


const Recipes = () => {

    const [recipes, setRecipes] = useState([]);
    const [connection, setConnection] = useState(null);


    const DataTable = dynamic(
        async () => {
            const dtReact = import('datatables.net-react');
            const dtNet = import(`datatables.net-dt`);

            const [reactMod, dtNetMod] = await Promise.all([dtReact, dtNet]);

            reactMod.default.use(dtNetMod.default);
            return reactMod.default;
        },
        {ssr: false}
    );


    useEffect(() => {
        const conn = new HubConnectionBuilder()
            .withUrl("http://localhost:5062/messageHub")
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        conn.on("GetRecipes", (data) => {
            setRecipes(data);
        })

        conn.start().then(() => {
            conn.on("UpdateRecipes", (newName, newPrepTime, newCookTime, newDescription) => {
                setRecipes((prevRecipes) => [...prevRecipes, {
                    name: newName,
                    prepTime: newPrepTime,
                    CookTime: newCookTime,
                    description: newDescription
                }]);
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
        console.log("Connection state1: ", conn.state);  // Should be 'Connected'

    }, []);

    return (
        <div className="w-full">
            <div className="w-3/4 mx-auto bg-gray-800 rounded-xl p-1">
                <DataTable id="recipeTable">
                    <thead>
                    <tr>
                        <td className="p-4 font-bold">Name</td>

                        <td className="p-4 font-bold">Cook Time</td>
                    </tr>
                    </thead>
                    <tbody>

                    {recipes.map((recipe, index) => (
                        <tr key={index}>
                            <td className="px-4">{recipe.name}</td>
                            <td className="px-4">{recipe.cookTime}</td>
                        </tr>
                    ))}
                    </tbody>
                </DataTable>
            </div>

            <RecipeForm connection={connection}/>
        </div>
    );
}
export default Recipes;