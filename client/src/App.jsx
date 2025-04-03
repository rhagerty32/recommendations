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

    const fetchRecommendations = async () => {
        // if (!id) {
        //     setError("Please enter a userID or itemID.");
        //     return;
        // }

        setLoading(true);
        setError(null);

        const payload = {
            "Inputs": {
                "input1": [
                    {
                        "personId": -2871288807409592.0,
                        "contentId": 0,
                        "rating": 0
                    }
                ]
            },
            "GlobalParameters": {
                "text": "Unchanged"
            }
        };

        try {
            const response = await fetch("http://localhost:5000/score", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
            };

            const data = await response.json();
            const results = data;
            console.log(`\x1b[32m${JSON.stringify(results, null, 2)}\x1b[0m`);

            setRecommendations({
                collaborative: data.collaborative || [],
                content: data.content || [],
                azure: data.azure || []
            });
        } catch (err) {
            setError(`Failed to fetch recommendations: ${err.message}`);
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }

        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-4">News Recommender</h1>
            <input
                type="text"
                placeholder="Enter userID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="p-2 border rounded w-64 mb-4 outline-[#ffe374]"
            />
            <button
                onClick={fetchRecommendations}
                className="text-white px-4 py-2 rounded bg-black hover:bg-[#ffe374] hover:text-black transition"
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
            {items.length > 0
                ? items.map((item, i) => <li key={i}>{item}</li>)
                : <li className="text-gray-500">No recommendations available.</li>}
        </ul>
    </div>
);

export default App;