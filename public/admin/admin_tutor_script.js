function toggleSection(sectionName) {
    const manageTutors = document.querySelector('.manageTutors');
    const manageUsers = document.querySelector('.manageUsers');
    const cardBox = document.querySelector('.cardBox');
    const details = document.querySelector('.details');

    if (sectionName === 'manageTutors') {
        manageTutors.classList.remove('hidden');
        manageUsers.classList.add('hidden');
        cardBox.classList.add('hidden');
        details.classList.add('hidden');
    } else if (sectionName === 'manageUsers') {
        manageTutors.classList.add('hidden');
        manageUsers.classList.remove('hidden');
        cardBox.classList.add('hidden');
        details.classList.add('hidden');
    } else if (sectionName === 'home') {
        manageTutors.classList.add('hidden');
        manageUsers.classList.add('hidden');
        cardBox.classList.remove('hidden');
        details.classList.remove('hidden');
    }
}

// Event listener for navigation clicks
const navigationLinks = document.querySelectorAll('.navigation li a');
navigationLinks.forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default link behavior
        const sectionName = this.getAttribute('data-section'); // Get section name from the link attribute
        toggleSection(sectionName); // Toggle visibility based on section name
    });
});



// Toggle functionality for menu
let toggle = document.querySelector('.toggle');
let navigation = document.querySelector('.navigation');
let main = document.querySelector('.main');

toggle.onclick = function () {
    navigation.classList.toggle('active');
    main.classList.toggle('navigation-active');
};

// Function to highlight hovered links
let list = document.querySelectorAll('.navigation li');
function activateLink() {
list.forEach(item => item.classList.remove('hovered'));
this.classList.add('hovered');
}
list.forEach(item => item.addEventListener('mouseover', activateLink));

// Function to toggle content visibility
function toggleContent(contentName) {
const tutorsDetails = document.querySelector('.tutorsDetails');
const approveTutors = document.querySelector('.approveTutors');

if (contentName === 'tutorsDetails') {
    tutorsDetails.classList.remove('hidden');
    approveTutors.classList.add('hidden');
} else if (contentName === 'approveTutors') {
    tutorsDetails.classList.add('hidden');
    approveTutors.classList.remove('hidden');
}
}

// Event listener for button clicks
document.addEventListener('DOMContentLoaded', function() {
const tutorsDetailsBtn = document.querySelector('.buttons .btn:nth-of-type(1)');
const approveTutorsBtn = document.querySelector('.buttons .btn:nth-of-type(2)');
const tutorsDetails = document.querySelector('.tutorsDetails');
const approveTutors = document.querySelector('.approveTutors');

if (tutorsDetailsBtn && approveTutorsBtn && tutorsDetails && approveTutors) {
tutorsDetailsBtn.addEventListener('click', function() {
    toggleContent('tutorsDetails');
});

approveTutorsBtn.addEventListener('click', function() {
    toggleContent('approveTutors');
});
}
});
// signout
document.addEventListener('DOMContentLoaded', function() {
    const signoutLink = document.getElementById('signoutLink');

        if (signoutLink) {
        signoutLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default link behavior

        fetch('/tutor-logout', {
            method: 'GET',
        })
        .then(response => {
            // console.log('Logout request sent successfully');
            window.location.href = '/public/admin/a_index.html'; // Redirect after logout
        })
        .catch(error => {
            console.error('Error sending logout request:', error);
        });
    });
} else {
    console.error('Signout link not found');
}
});
// signout end

// Delete func
function handletutorDelete(event) {
    const tutorId = event.target.closest('tr').getAttribute('data-tutor-id');
    const row = event.target.closest('tr');

    // Perform the delete action on the front end
    row.remove();

    // Implement the delete logic in the database
    fetch(`/delete-tutor/${tutorId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log(`Tutor with ID ${tutorId} deleted`);
        toastr.success('Student Data Delete','Successfully')
    })
    .catch(error => {
        console.error('There was a problem with the delete request:', error);
        // If there's an error, you may want to re-add the row to the table
        // row.style.display = 'table-row';
        // Or handle the error in an appropriate manner
    });
}
// deletefu end

// updatefu start
let updateTutorNameField
let updateTutorSubjectField 
let updateTutorEmailField
let tutorId
function updatetutorhandler(e){
    e.preventDefault();
    document.querySelector('.update-form').style.display='none' 
    const updatedData = {
        tutorId: tutorId,
        tutorName: updateTutorNameField.value,
        tutorSubject: updateTutorSubjectField.value,
        tutorEmail: updateTutorEmailField.value
    };

    // Implement the update logic in the database
    fetch(`/update-tutor/${tutorId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log(`Tutor with ID ${tutorId} updated`);
        toastr.success('Student Data Update','Successfully')
        showupdatdata()
        // You might update the row with the new data after a successful update
        // For example, update the row with the new data in the table
        // row.querySelector('.tutor-name').innerText = updatedData.tutorName;
        // row.querySelector('.tutor-subject').innerText = updatedData.tutorSubject;
        // row.querySelector('.tutor-email').innerText = updatedData.tutorEmail;
    })
    .catch(error => {
        console.error('There was a problem with the update request:', error);
        // Handle the error in an appropriate manner
    });
}

// Define handletutorUpdate in the global scope
function handletutorUpdate(event) {
    // console.log('Update button clicked');
    event.preventDefault(); // Prevent default behavior
    document.querySelector('.update-form').style.display='block' 
    const row = event.target.closest('tr');
    tutorId = row.getAttribute('data-tutor-id');
    const tutorName = row.querySelector('.tutor-name').innerText;
    const tutorSubject = row.querySelector('.tutor-subject').innerText;
    const tutorEmail = row.querySelector('.tutor-email').innerText;
    // Populate the update form fields with the tutor's data
    updateTutorNameField = document.getElementById('updateTutorName');
    updateTutorSubjectField = document.getElementById('updateTutorSubject');
    updateTutorEmailField = document.getElementById('updateTutorEmail');

    updateTutorNameField.value = tutorName;
    updateTutorSubjectField.value = tutorSubject;
    updateTutorEmailField.value = tutorEmail;

    // Show the update form
    const updateForm = document.querySelector('.update-form');
    updateForm.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
console.log('DOM content loaded'); // Check if this log appears
// Select your update button based on your structure
const updateButton = document.querySelector('.tutorsDetails .btn-update');
const updateTutorbtn=document.querySelector('#updateTu')
updateTutorbtn.addEventListener('click',updatetutorhandler)

if (updateButton) {
    updateButton.addEventListener('click', handletutorUpdate);
    console.log('Update button listener attached'); // Log to confirm listener attachment
}
});
// updatefu end
// show updatefu start
function showupdatdata(){
fetch('/manage-tutors-details')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('.tutorsDetails table tbody');
            tableBody.innerHTML = '';

            data.forEach(tutor => {
                const row = `
                    <tr data-tutor-id="${tutor.id}">
                        <td class="tutor-id">${tutor.id}</td>
                        <td class="tutor-name">${tutor.tutor_name}</td>
                        <td class="tutor-subject">${tutor.tutor_subject}</td>
                        <td class="tutor-email">${tutor.tutor_email}</td>
                        <td><button class="btn btn-update openDialogButton">Update</button></td>
                        <td><button class="btn btn-delete">Delete</button></td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });

            // Event listener to attach handletutorDelete function to delete buttons
            const deleteButtons = document.querySelectorAll('.tutorsDetails .btn-delete');
            deleteButtons.forEach(button => {
                button.addEventListener('click', handletutorDelete);
            });

            // Event listener to attach handletutorUpdate function to update buttons
            const updateButtons = document.querySelectorAll('.tutorsDetails .btn-update');
            updateButtons.forEach(button => {
                button.addEventListener('click', handletutorUpdate);
            });
        })
        .catch(error => {
            console.error('Error fetching tutor details:', error);
        });
}
document.addEventListener('DOMContentLoaded', () => {
    // Fetch tutor details and populate the table
    showupdatdata()
});
// show updatefu end

var search = document.getElementById("search");

search.addEventListener("input", function() {
    var searchTerm = search.value.toLowerCase();
    var userTable = document.getElementById("tutorsearch");
    var rows = userTable.getElementsByTagName("tr");

    // Loop through all table rows, and hide those that don't match the search query
    for (let i = 1; i < rows.length; i++) {
        const tutorName = rows[i].querySelector('.tutor-name').textContent.toLowerCase();
        const tutorSubject = rows[i].querySelector('.tutor-subject').textContent.toLowerCase();
        const tutorEmail = rows[i].querySelector('.tutor-email').textContent.toLowerCase();
        // Add more fields if needed and modify the conditions below

        // Check if any of the fields contain the search term
        if (tutorName.includes(searchTerm) || tutorSubject.includes(searchTerm) || tutorEmail.includes(searchTerm)) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
});


function fetchTutorDetails() {
    fetch('/approve-tutors-details') // Replace this with your backend route
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('tableBody');
            tableBody.innerHTML = ''; // Clear previous data
            
            data.forEach(tutor => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${tutor.id}</td>
                    <td>${tutor.name}</td>
                    <td>${tutor.email}</td>
                    <td>${tutor.bio}</td>
                    <td>${tutor.birthday}</td>
                    <td>${tutor.country}</td>
                    <td>${tutor.phone_no}</td>
                    <td><a href="../documents/${tutor.email}/${tutor.resume_file}">Resume</a></td>
                    <td><a href="../documents/${tutor.email}/${tutor.bachelors_file}">Bachelors</a></td>
                    <td><a href="../documents/${tutor.email}/${tutor.intermediate_file}">Intermediate</a></td>
                    <td><a href="../documents/${tutor.email}/${tutor.matrix_file}">Matric</a></td>
                    <td><button class="btn btn-approve" onClick="approvetutor(${tutor.id})">Approve</button></td>
                    <!-- Add other table data here based on your fetched columns -->
                `;
                tableBody.appendChild(row);

            });
        })
        .catch(error => console.error('Error:', error));
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    fetchTutorDetails();
});

function approvetutor(id) {
    //     const enrollid = event.target.closest('tr').getAttribute('data-enrollid');
    //     const row = event.target.closest('tr');
    // // 
    //     // Perform the delete action on the front end
    //     row.remove();
    
        // Implement the delete logic in the database
        fetch(`/approvetutor/${id}`, {
            method: 'PUT'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log(`Tutor with ID ${id} deleted`);
            toastr.success('Tutor Approved','Successfully')
            
        })
        .catch(error => {
            console.error('There was a problem with the approve request:', error);
            // If there's an error, you may want to re-add the row to the table
            // row.style.display = 'table-row';
            // Or handle the error in an appropriate manner
        });
    }
