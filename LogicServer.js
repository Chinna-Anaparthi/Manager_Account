const RegularFieldWork = require("./DatabaseConnection/RegularFieldWork")
const TrainingWorkshop = require("./DatabaseConnection/TrainingWorkshop");

const multer = require('multer');
const upload = multer();

const FieldworkPost = async (req, res) => {
    try {
        upload.any()(req, res, async (error) => {
            if (error) {
                console.error('Error uploading files:', error);
                return res.status(500).json({ error: 'Error uploading files' });
            }

            const images = req.files.filter(file => file.fieldname === 'geoTaggedPhotos')
                .map(file => file.buffer.toString('base64'));

            const petrolBillImage = req.files.find(file => file.fieldname === 'uploadPetrolBill');

            const {
                employeeId,
                employeeName,
                dateOfVisit,
                natureOfFieldWork,
                placesOfVisit,
                purposeOfVisit,
                briefReport,
                villageWiseKeyPersons,
                contactNumbers,
                vehicleNumber,
                openingReading,
                closingReading,
                totalKmsTravelled,
                status,
            } = req.body;

            const newRecord = new RegularFieldWork({
                employeeId,
                employeeName,
                dateOfVisit,
                natureOfFieldWork,
                placesOfVisit,
                purposeOfVisit,
                briefReport,
                villageWiseKeyPersons,
                contactNumbers,
                geoTaggedPhotos: images,
                uploadPetrolBill: petrolBillImage ? petrolBillImage.buffer.toString('base64') : null,
                vehicleNumber,
                openingReading,
                closingReading,
                totalKmsTravelled,
                status,
            });

            await newRecord.save();

            res.status(200).json({ message: 'RegularFieldWork Data saved to MongoDB successfully.' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error inserting data into MongoDB' });
    }
};

const FieldworkStatusUpdate = async (req, res) => {
    try {
        const { status } = req.body;
        const { employeeId } = req.params;

        const updatedRecord = await RegularFieldWork.findOneAndUpdate(
            { employeeId: employeeId },
            { $set: { status: status } },
            { new: true }
        );

        if (!updatedRecord) {
            res.status(404).json({ error: 'Record with the provided employeeId not found in the database.' });
        } else {
            res.status(200).json({ message: 'Status updated successfully.', updatedRecord });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating status in MongoDB' });
    }
}

const FieldworkGet = async (req, res) => {
    try {
        const results = await RegularFieldWork.find();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching data from MongoDB' });
    }
}

const TrainingWorkshopPost = async (req, res) => {
    try {
        upload.any()(req, res, async (error) => {
            if (error) {
                console.error('Error uploading files:', error);
                return res.status(500).json({ error: 'Error uploading files' });
            }
            if (!req.files || !req.files.length) {
                return res.status(400).json({ error: 'No files were uploaded.' });
            }
            
            const geoTaggedPhotos = [];
            let uploadPetrolBill = '';

            for (let i = 0; i < req.files.length; i++) {
                const file = req.files[i];
                if (file.fieldname === 'geoTaggedPhotos') {
                    geoTaggedPhotos.push(file.buffer.toString('base64'));
                } else if (file.fieldname === 'uploadPetrolBill') {
                    uploadPetrolBill = file.buffer.toString('base64');
                }
            }

            const {
                employeeId,
                employeeName,
                dateOfVisit,
                natureOfFieldWork,
                trainingConductedBy,
                trainingPlace,
                trainingSubject,
                personsAttended,
                briefReport,
                vehicleNumber,
                openingReading,
                closingReading,
                totalKmsTravelled,
                status,
            } = req.body;

            const newRecord = new TrainingWorkshop({
                employeeId,
                employeeName,
                dateOfVisit,
                natureOfFieldWork,
                trainingConductedBy,
                trainingPlace,
                trainingSubject,
                personsAttended,
                briefReport,
                geoTaggedPhotos,
                uploadPetrolBill,
                vehicleNumber,
                openingReading,
                closingReading,
                totalKmsTravelled,
                status,
            });

            await newRecord.save();

            res.status(200).json({ message: 'TrainingWorkshop Data saved to MongoDB successfully.' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error inserting data into MongoDB' });
    }
};

const TrainingWorkshopGet = async (req, res) => {
    try {
        const results = await TrainingWorkshop.find();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching data from MongoDB' });
    }
}

const TrainingWorkshopstatusUpdate = async (req, res) => {
    try {
        const { status } = req.body; // Get status from the request body
        const { employeeId } = req.params; // Get employeeId from URL parameters

        const updatedRecord = await TrainingWorkshop.findOneAndUpdate(
            { employeeId: employeeId },
            { $set: { status: status } },
            { new: true }
        );

        if (!updatedRecord) {
            res.status(404).json({ error: 'Record with the provided employeeId not found in the database.' });
        } else {
            res.status(200).json({ message: 'Status updated successfully.', updatedRecord });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating status in MongoDB' });
    }
}
module.exports = { 
    FieldworkGet,
    FieldworkStatusUpdate,
    FieldworkPost,
    TrainingWorkshopPost,
    TrainingWorkshopGet,
    TrainingWorkshopstatusUpdate }