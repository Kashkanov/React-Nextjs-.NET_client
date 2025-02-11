import axios from 'axios';

export default async function Recipes({children}) {
    console.log('Running on:', typeof window === 'undefined' ? 'Server' : 'Client');

  return (
    <div>
        <div className="bg-red-900 h-full w-full bg-gradient">
            <a href="https://google.com"><strong>Recipes</strong></a>
        </div>
        {children}
    </div>
  );
}
