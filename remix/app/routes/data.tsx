import { useLoaderData } from "@remix-run/react";

export async function loader() {
        const response = await fetch("http://localhost:8000/api/data");
        
        const data = await response.json();
        return data;
}

export default function DataRoute() {
    const data = useLoaderData();
    return <div>Message: {data.message}</div>;
}
