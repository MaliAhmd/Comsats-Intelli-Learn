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
        document.querySelector('.tutor-namee').value = res[0].tutor_name
        document.querySelector('.tutor-emaill').value = res[0].tutor_email
        document.querySelector('.tutor-name').value = res[0].tutor_name
        document.querySelector('.tutor-email').value = res[0].tutor_email
       
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
        console.log(res[0])
        const date = res[0].birthday
        document.querySelector(".bi").value=res[0].bio;
        document.querySelector(".birt").value=date.split("T")[0];
        document.querySelector(".co").value=res[0].country;
        document.querySelector(".ph").value=res[0].phone_no;
       
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
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${tutor.student_name}</td>
                    <td>${tutor.student_regno}</td>
                    <td>${tutor.student_email}</td>
                    <td><button class="btn btn-approve">Enroll</button></td>
                    <!-- Add other table data here based on your fetched columns -->
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
}
document.addEventListener('DOMContentLoaded', function() {
    show_stu_to_tutor();
});