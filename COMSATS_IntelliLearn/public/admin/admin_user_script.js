    // Delete function
function handleDelete(event) {
    const userId = event.target.closest('tr').getAttribute('data-user-id');
    const row = event.target.closest('tr');

    // Perform the delete action on the front end
    row.remove();

    // Implement the delete logic in the database
    fetch(`/delete-user/${userId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log(`User with ID ${userId} deleted`);
        toastr.success('Student Data Delete','Successfully')
    })
    .catch(error => {
        console.error('There was a problem with the delete request:', error);
        // Handle the error in an appropriate manner
    });
}

// Update function
let updateUserFirstnameField;
let updateUserLastnameField;
let updateUserRegnoField;
let updateUserEmailField;
let userId;

function updateUserHandler(e) {
    e.preventDefault();
    document.querySelector('.update-user-form').style.display='none' 
    const updatedData = {
        userId: userId,
        firstname: updateUserFirstnameField.value,
        lastname: updateUserLastnameField.value,
        regno: updateUserRegnoField.value,
        email: updateUserEmailField.value
    };

    // Implement the update logic in the database
    fetch(`/update-user/${userId}`, {
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
        console.log(`User with ID ${userId} updated`);
        toastr.success('Student Data Update','Successfully')
        showUpdatedData();
        // You might update the row with the new data after a successful update
    })
    .catch(error => {
        console.error('There was a problem with the update request:', error);
        // Handle the error in an appropriate manner
    });
}

// Define handleUpdate in the global scope
function handleUpdate(event) {
    event.preventDefault();
    document.querySelector('.update-user-form').style.display='block'   
    const row = event.target.closest('tr');
    userId = row.getAttribute('data-user-id');
    const firstname = row.querySelector('.user-firstname').innerText;
    const lastname = row.querySelector('.user-lastname').innerText;
    const regno = row.querySelector('.user-regno').innerText;
    const email = row.querySelector('.user-email').innerText;

    // Populate the update form fields with the user's data
    updateUserFirstnameField = document.getElementById('updateUserFirstname');
    updateUserLastnameField = document.getElementById('updateUserLastname');
    updateUserRegnoField = document.getElementById('updateUserRegno');
    updateUserEmailField = document.getElementById('updateUserEmail');

    updateUserFirstnameField.value = firstname;
    updateUserLastnameField.value = lastname;
    updateUserRegnoField.value = regno;
    updateUserEmailField.value = email;

    // Show the update form
    const updateForm = document.querySelector('.update-user-form');
    updateForm.classList.remove('hidden');
    

}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded');

    // Select your update button based on your structure
    const updateButton = document.querySelector('.manageUsers .btn-update');
    const updateUserButton = document.querySelector('#updateUserBtn');

    updateUserButton.addEventListener('click', updateUserHandler);

    if (updateButton) {
        updateButton.addEventListener('click', handleUpdate);
        console.log('Update button listener attached');
    }
});

// Function to fetch and display updated user data
function showUpdatedData() {
    fetch('/manage-users-details')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('.manageUsers table tbody');
            tableBody.innerHTML = '';

            data.forEach(user => {
                const row = `
                    <tr data-user-id="${user.id}">
                        <td class="user-id">${user.id}</td>
                        <td class="user-firstname">${user.firstname}</td>
                        <td class="user-lastname">${user.lastname}</td>
                        <td class="user-regno">${user.regno}</td>
                        <td class="user-email">${user.email}</td>
                        <td><button class="btn btn-update">Update</button></td>
                        <td><button class="btn btn-delete">Delete</button></td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });

            // Event listener to attach handleDelete function to delete buttons
            const deleteButtons = document.querySelectorAll('.manageUsers .btn-delete');
            deleteButtons.forEach(button => {
                button.addEventListener('click', handleDelete);
            });

            // Event listener to attach handleUpdate function to update buttons
            const updateButtons = document.querySelectorAll('.manageUsers .btn-update');
            updateButtons.forEach(button => {
                button.addEventListener('click', handleUpdate);
                
            });
        })
        .catch(error => {
            console.error('Error fetching user details:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    // Fetch user details and populate the table
    showUpdatedData();
});
var searchh = document.getElementById("searchh");

searchh.addEventListener("input", function() {
    var searchTerm = searchh.value.toLowerCase();
    var userTable = document.getElementById("userSearchTable");
    var rows = userTable.getElementsByTagName("tr");

    // Loop through all table rows, and hide those that don't match the search query
    for (let i = 1; i < rows.length; i++) {
        const userFirstname = rows[i].querySelector('.user-firstname').textContent.toLowerCase();
        const userLastname = rows[i].querySelector('.user-lastname').textContent.toLowerCase();
        const userRegno = rows[i].querySelector('.user-regno').textContent.toLowerCase();
        const userEmail = rows[i].querySelector('.user-email').textContent.toLowerCase();

        // Check if any of the fields contain the search term
        if (userFirstname.includes(searchTerm) || userLastname.includes(searchTerm) || userRegno.includes(searchTerm) || userEmail.includes(searchTerm)) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
});

