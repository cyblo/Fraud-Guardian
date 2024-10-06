const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 5000;

const uri = "mongodb+srv://rachitci22:rachit@cluster0.qo4waj9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// mongodb+srv://rachitci22:rachit@cluster0.qo4waj9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
mongoose.connect(uri);

const userschema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    // Add more fields as needed
});

const complaintSchema = new mongoose.Schema({
    name: String,
    email: String,
    incidentDateTime: Date,
    incidentDescription: String,
    fraudType: String,
    fraudWebsite: String,
    amountLost: Number,
    paymentMethod: String,
    financialInstitution: String,
    suspiciousLinks: Boolean,
    reportedToAuthority: Boolean,
    authorityDetails: String,
    consent: Boolean
});

// Create a model based on the schema
const Complaint = mongoose.model('Complaint', complaintSchema);


const User = mongoose.model('User', userschema);

const htmlPath = path.join(__dirname, 'index.html');
app.use(express.static(path.dirname(__dirname)));
app.use(express.json());
app.use(cors());

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

app.get('/', (req, res) => {
    res.sendFile(htmlPath);
});

app.post('/registerUser', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = await User.create({ username, email, password });
        res.status(200).send('Registration successful');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/userlogin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });
        if (user) {
            res.status(200).send('Login successful');
        } else {
            res.status(401).send('Invalid email or password');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/submitComplaint', async (req, res) => {
    const formData = req.body;

    try {
        const complaint = await Complaint.create(formData);
        res.status(200).send('Complaint submitted successfully');
    } catch (error) {
        console.error('Error submitting complaint:', error);
        res.status(500).send('Internal Server Error');
    }
});


// app.get('/complaints', async (req, res) => {
//     try {
//         const complaints = await Complaint.find();
//         res.status(200).json(complaints);
//     } catch (error) {
//         console.error('Error fetching complaints:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('Closed MongoDB connection');
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
    } finally {
        process.exit();
    }
});
