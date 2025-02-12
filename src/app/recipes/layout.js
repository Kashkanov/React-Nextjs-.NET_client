import axios from 'axios';

export default async function Recipes({children}) {
    //console.log('Running on:', typeof window === 'undefined' ? 'Server' : 'Client');

    return (
        <div>
            <div className="bg-red-900 fixed h-10 w-full my-0">
                <a href="https://google.com"><strong>Recipes</strong></a>
            </div>
            <div className="mt-6">
                {children}
            </div>
        </div>
    );
}
