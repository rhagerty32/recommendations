import React, { useState } from "react";

const RecommendationsPage = () => {
    const [id, setId] = useState("");
    const [recommendations, setRecommendations] = useState({
        collaborative: [],
        content: [],
        azure: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRecommendations = async () => {
        if (!id) return;
        setLoading(true);
        setError(null);

        try {
            const [collabRes, contentRes, azureRes] = await Promise.all([
                fetch(`/api/recommend/collaborative/${id}`).then((res) => res.json()),
                fetch(`/api/recommend/content/${id}`).then((res) => res.json()),
                fetch(`/api/recommend/azure/${id}`).then((res) => res.json()),
            ]);

            setRecommendations({
                collaborative: collabRes.items || [],
                content: contentRes.items || [],
                azure: azureRes.items || [],
            });
        } catch (err) {
            setError("Failed to fetch recommendations.");
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
                className="p-2 border rounded w-64 mb-4"
            />
            <button
                onClick={fetchRecommendations}
                className="text-white px-4 py-2 rounded bg-black hover:bg-[#ffe374] cursor-pointer transition duration-100 ease-in-out"
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

export default RecommendationsPage;