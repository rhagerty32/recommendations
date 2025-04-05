import React, { useState } from "react";

const App = () => {
    const [id, setId] = useState("");
    const [loading, setLoading] = useState(false);
    const [collaborative, setCollaborative] = useState([]);
    const [contentFiltering, setConentFiltering] = useState([]);
    const [error, setError] = useState(null);

    const fetchRecommendations = async () => {
        // if (!id) {
        //     setError("Please enter a userID or itemID.");
        //     return;
        // }

        setLoading(true);
        setError(null);


        // Get column as array from csv file
        const csvFilePath = 'src/assets/article_recomendations.csv';
        const response = await fetch(csvFilePath);
        const text = await response.text();
        const rows = text.split('\n');
        const data = rows.map(row => {
            const [userId, itemId, rating] = row.split(',');
            return { userId, itemId, rating };
        });

        console.log(data)

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
                className="text-white px-4 py-2 rounded bg-black hover:bg-[#ffe374] hover:text-black transition cursor-pointer"
            >
                Get Recommendations
            </button>
            {loading && <p className="mt-4">Loading...</p>}
            {error && <p className="mt-4 text-red-500">{error}</p>}
            <div className="mt-6 w-full max-w-lg">
                <RecommendationList title="Collaborative Filtering" items={collaborative} />
                <RecommendationList title="Content-Based Filtering" items={contentFiltering} />
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