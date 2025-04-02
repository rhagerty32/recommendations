import 'dotenv/config'; // Load environment variables
import express from 'express';
import cors from 'cors';
import axios from 'axios';


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:5173", // Allow frontend requests
    methods: "GET,POST",
    allowedHeaders: "Content-Type,Authorization"
}));
app.use(express.json());

app.post('/score', async (req, res) => {
    console.log('Received request:', req.body);
    try {
        const response = await axios.post(
            'http://8ae8117a-1daf-4741-a862-6ee086c71144.eastus2.azurecontainer.io/score',
            req.body,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.AZURE_API_KEY}`,
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error calling Azure API:', error);
        res.status(error.response?.status || 500).json({ error: 'Failed to fetch data from Azure' });
    };
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});