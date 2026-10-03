const donorForm = document.getElementById("donorForm");


// Load donors when page opens
document.addEventListener("DOMContentLoaded", () => {
    loadDonors();
    loadStats();
});


// Register donor
donorForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const donor = {
        name: document.getElementById("name").value.trim(),

        age: document.getElementById("age").value,

        gender: document.getElementById("gender").value,

        bloodGroup: document.getElementById("bloodGroup").value,

        phone: document.getElementById("phone").value.trim(),

        city: document.getElementById("city").value.trim(),

        lastDonation: document.getElementById("lastDonation").value
    };


    try {

        const response = await fetch("/api/donors", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(donor)

        });


        const result = await response.json();


        if (!response.ok) {
            alert(result.message);
            return;
        }


        alert("Donor registered successfully!");


        donorForm.reset();

        loadDonors();

        loadStats();


        document
            .getElementById("donors")
            .scrollIntoView({ behavior: "smooth" });

    }

    catch (error) {

        console.error(error);

        alert("Server error. Please try again.");

    }

});


// Load all donors
async function loadDonors() {

    try {

        const response = await fetch("/api/donors");

        const donors = await response.json();

        displayDonors(donors, "donorList");

    }

    catch (error) {

        console.error(error);

    }

}


// Display donors
function displayDonors(donors, elementId) {

    const container = document.getElementById(elementId);

    container.innerHTML = "";


    if (donors.length === 0) {

        container.innerHTML = `
            <p style="text-align:center; grid-column:1/-1;">
                No donors found.
            </p>
        `;

        return;
    }


    donors.forEach(donor => {

        const card = document.createElement("div");

        card.className = "donor-card";


        card.innerHTML = `

            <span class="blood">
                ${escapeHTML(donor.bloodGroup)}
            </span>

            <h3>
                ${escapeHTML(donor.name)}
            </h3>

            <p>
                <strong>Age:</strong>
                ${escapeHTML(donor.age)}
            </p>

            <p>
                <strong>Gender:</strong>
                ${escapeHTML(donor.gender)}
            </p>

            <p>
                <strong>City:</strong>
                ${escapeHTML(donor.city)}
            </p>

            <p>
                <strong>Phone:</strong>
                ${escapeHTML(donor.phone)}
            </p>

            ${
                donor.lastDonation
                ?
                `<p>
                    <strong>Last Donation:</strong>
                    ${escapeHTML(donor.lastDonation)}
                </p>`
                :
                ""
            }

            <button
                class="delete-btn"
                onclick="deleteDonor(${donor.id})"
            >
                Delete
            </button>
        `;


        container.appendChild(card);

    });

}


// Delete donor
async function deleteDonor(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this donor?");


    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(`/api/donors/${id}`, {

            method: "DELETE"

        });


        const result = await response.json();


        if (!response.ok) {

            alert(result.message);

            return;
        }


        alert("Donor deleted successfully!");


        loadDonors();

        loadStats();

    }

    catch (error) {

        console.error(error);

        alert("Unable to delete donor.");

    }

}


// Search donors
async function searchDonors() {

    const bloodGroup =
        document.getElementById("searchBloodGroup").value;

    const city =
        document.getElementById("searchCity").value.trim();


    const params = new URLSearchParams();


    if (bloodGroup) {
        params.append("bloodGroup", bloodGroup);
    }


    if (city) {
        params.append("city", city);
    }


    try {

        const response =
            await fetch(`/api/search?${params.toString()}`);


        const donors = await response.json();


        displayDonors(donors, "searchResults");

    }

    catch (error) {

        console.error(error);

        alert("Search failed.");

    }

}


// Load dashboard statistics
async function loadStats() {

    try {

        const response = await fetch("/api/stats");

        const stats = await response.json();


        document.getElementById("totalDonors").textContent =
            stats.totalDonors;

    }

    catch (error) {

        console.error(error);

    }

}


// Basic HTML escaping
function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}
