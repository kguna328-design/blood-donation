const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());

const DATA_FILE = path.join(process.cwd(), "data.json");

function readData() {
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    } catch {
        return { donors: [] };
    }
}

function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Get donors
app.get("/api/donors", (req, res) => {
    const data = readData();
    res.json(data.donors);
});

// Add donor
app.post("/api/donors", (req, res) => {
    const {
        name,
        age,
        gender,
        bloodGroup,
        phone,
        city,
        lastDonation
    } = req.body;

    if (!name || !age || !gender || !bloodGroup || !phone || !city) {
        return res.status(400).json({
            message: "Please fill all required fields"
        });
    }

    const data = readData();

    const donor = {
        id: Date.now(),
        name,
        age,
        gender,
        bloodGroup,
        phone,
        city,
        lastDonation: lastDonation || ""
    };

    data.donors.push(donor);
    saveData(data);

    res.status(201).json({
        message: "Donor registered successfully",
        donor
    });
});

// Delete donor
app.delete("/api/donors/:id", (req, res) => {
    const data = readData();

    const id = Number(req.params.id);

    data.donors = data.donors.filter(
        donor => donor.id !== id
    );

    saveData(data);

    res.json({
        message: "Donor deleted successfully"
    });
});

// Search donors
app.get("/api/search", (req, res) => {
    const { bloodGroup, city } = req.query;

    const data = readData();

    let donors = data.donors;

    if (bloodGroup) {
        donors = donors.filter(
            donor =>
                donor.bloodGroup.toLowerCase() ===
                bloodGroup.toLowerCase()
        );
    }

    if (city) {
        donors = donors.filter(
            donor =>
                donor.city.toLowerCase().includes(
                    city.toLowerCase()
                )
        );
    }

    res.json(donors);
});

// Statistics
app.get("/api/stats", (req, res) => {
    const data = readData();

    res.json({
        totalDonors: data.donors.length
    });
});

module.exports = app;
