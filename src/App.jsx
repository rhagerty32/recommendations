import React, { useState } from "react";

const App = () => {
    const [id, setId] = useState("");
    const [recommendations, setRecommendations] = useState({
        collaborative: [],
        content: [],
        azure: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const apiUrl = import.meta.env.VITE_API_URL;
    const apiKey = import.meta.env.VITE_API_KEY;

    const fetchRecommendations = async () => {
        console.log('Fetching recommendations...');
        if (!id) {
            setError("Please enter a userID or itemID.");
            return;
        };
        setLoading(true);
        setError(null);

        const payload = {
            Inputs: {
                web_service_input_data: [
                    {
                        personId: id,
                        userRegion: "US",
                        userCountry: "USA",
                    }
                ]
            },
            GlobalParameters: {}
        };

        try {
            // Wait for all three API requests to complete
            const [collabRes, contentRes, azureRes] = await Promise.all([
                fetch(`${apiUrl}/score`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify(payload),
                })
            ]);

            // Handle the responses and parse JSON
            const [collabData, contentData, azureData] = await Promise.all([
                collabRes.json(),
                contentRes.json(),
                azureRes.json(),
            ]);

            // Assuming the API responses return an array of items
            setRecommendations({
                collaborative: collabData.items || [],
                content: contentData.items || [],
                azure: azureData.items || [],
            });
        } catch (err) {
            setError("Failed to fetch recommendations.");
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-4">News Recommender</h1>
            <input
                type="text"
                placeholder="Enter userID or itemID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="p-2 border rounded w-64 mb-4 outline-[#ffe374] "
            />
            <button
                onClick={fetchRecommendations}
                className="text-white px-4 py-2 rounded bg-black hover:bg-[#ffe374] cursor-pointer transition duration-200 hover:text-black ease-in-out"
            >
                Get Recommendations
            </button>
            {loading && <p className="mt-4">Loading...</p>}
            {error && <p className="mt-4 text-red-500">{error}</p>}
            <div className="mt-6 w-full max-w-lg">
                <RecommendationList title="Collaborative Filtering" items={recommendations.collaborative} />
                <RecommendationList title="Content-Based Filtering" items={recommendations.content} />
                <RecommendationList title="Azure ML" items={recommendations.azure} />
            </div>
        </div>
    );
};

const RecommendationList = ({ title, items }) => (
    <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <ul className="list-disc pl-5 bg-white p-4 rounded shadow">
            {items.length > 0 ? items.map((item, index) => (
                <li key={index} className="py-1">{item}</li>
            )) : <p className="text-gray-500">No recommendations available.</p>}
        </ul>
    </div>
);

export default App;