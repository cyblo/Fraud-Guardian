const ExcelJS = require('exceljs');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://rachitci22:rachit@cluster0.qo4waj9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// mongodb+srv://rachitci22:rachit@cluster0.qo4waj9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
mongoose.connect(uri);
// Connect to MongoDB
//mongoose.connect('mongodb://localhost:27017/mydatabase');

// Create Excel workbook and worksheet
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Data');

// Retrieve data from MongoDB
const fetchDataFromMongoDB = async () => {
    try {
        // Fetch data from MongoDB collection
        const data = await MyModel.find(); // Replace MyModel with your Mongoose model

        // Write data to Excel worksheet
        data.forEach((item, index) => {
            worksheet.addRow([item.field1, item.field2, item.field3]); // Adjust fields as per your MongoDB schema
        });

        // Save Excel file
        await workbook.xlsx.writeFile('data.xlsx');
        console.log('Excel file generated successfully.');
    } catch (error) {
        console.error('Error:', error);
    }
};

fetchDataFromMongoDB();