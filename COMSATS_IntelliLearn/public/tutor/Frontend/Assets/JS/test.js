// const throughId = require('./tutor')
const getTutorData = async () => {
    try {
        const tok = Cookies.get('token');

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        const response = await fetch(`http://localhost:5000/fetchTutorData/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${tok}`
            },
            credentials: "include",
            withCredentials: true,
        });

        if (!response.ok) {
            throw new Error('Failed to fetch tutor data');
        }

        const res = await response.json();
        
        // document.querySelector('.tutor-namee').value = res[0].tutor_name
        // document.querySelector('.tutor-emaill').value = res[0].tutor_email
        document.querySelector('.tutor-name').value = res[0].tutor_name
        document.querySelector('.tutor-email').value = res[0].tutor_email
        
        // document.querySelector(".user_name").innerHTML = res[0].tutor_name
        // document.querySelector(".user_email").innerHTML = res[0].tutor_email
        
    } catch (error) {
        console.error('Error fetching tutor data:', error);
    }
};
getTutorData();

const getTutorVerifyDetails = async () => {
    try {
        const tok = Cookies.get('token');

        const response = await fetch(`http://localhost:5000/fetchTutorverifyinfo/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${tok}`
            },
            credentials: "include",
            withCredentials: true,
        });

        if (!response.ok) {
            throw new Error('Failed to fetch tutor data');
        }

        const res = await response.json();
        
        console.log(res)
        const date = res[0].birthday
        const img = `../documents/undefined/${res[0].t_image}`
        document.querySelector('.profileImage').src = img
        document.querySelector(".bi").value=res[0].bio;
        document.querySelector(".birt").value=date.split("T")[0];
        document.querySelector(".co").value=res[0].country;
        document.querySelector(".ph").value=res[0].phone_no;
       
        document.querySelector(".user_bio").innerHTML = res[0].bio
        document.querySelector(".user_dof").innerHTML = date.split("T")[0];
        document.querySelector('.user_country').innerHTML = res[0].country;
        document.querySelector('.user_contact').innerHTML = res[0].phone_no;

    } catch (error) {
        console.error('Error fetching tutor data:', error);
    }
};
getTutorVerifyDetails();

function show_stu_to_tutor() {
    const tok = Cookies.get('token');
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    fetch(`/showstudenttotutor/${id}`,
    {
        method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${tok}`
            },
            credentials: "include",
            withCredentials: true,
        })
     // Replace this with your backend route
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('tableBody');
            tableBody.innerHTML = ''; // Clear previous data
            
            data.forEach(tutor => {
                console.log(tutor)
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${tutor.student_name}</td>
                    <td>${tutor.student_regno}</td>
                    <td>${tutor.student_email}</td>
                    <td><button class="btn btn-remove" onClick="Delete_enrollstudent(${tutor.id})">Remove</button></td>
                    <!-- Add other table data here based on your fetched columns -->
                `;
                tableBody.appendChild(row);
            });
            
    //         const deleteButtons = document.querySelectorAll('.content .btn-remove');
    //         // console.log("ssss",deleteButtons.length);
    //         deleteButtons.forEach(button => {
    //             console.log("hello");
    //             button.addEventListener('click', Delete_enrollstudent);
    // });
        })
        
        .catch(error => console.error('Error:', error));
}
document.addEventListener('DOMContentLoaded', function() {
    show_stu_to_tutor();
});

//remove enroll student
function Delete_enrollstudent(id) {
//     const enrollid = event.target.closest('tr').getAttribute('data-enrollid');
//     const row = event.target.closest('tr');
// // 
//     // Perform the delete action on the front end
//     row.remove();

    // Implement the delete logic in the database
    fetch(`/delete-enroll-tutor/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log(`Tutor with ID ${id} deleted`);
        toastr.success('Student Data Delete','Successfully')
        show_stu_to_tutor()
    })
    .catch(error => {
        console.error('There was a problem with the delete request:', error);
        // If there's an error, you may want to re-add the row to the table
        // row.style.display = 'table-row';
        // Or handle the error in an appropriate manner
    });
}
