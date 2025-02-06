import axios from 'axios';

export default async function Recipes() {
  const res = await fetch('http://localhost:5062/api/Recipe');
  const recipes = await res.json();

  return (
    <div>
      <h1>Recipes</h1>
      <ul>
        {recipes.map((recipe, index) => (
          <li key={index}>{recipe}</li>
        ))}
      </ul>
    </div>
  );
}
