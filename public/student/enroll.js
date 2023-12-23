
let studentdata;
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent the default form submission

            try {
                const studentreg = document.getElementById('regno').value;
                const studentPassword = document.querySelector('input[name="password"]').value;
                console.log("outer login")
                const response = await fetch('http://localhost:5000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: "include",
                    withCredentials: true,
                    body: JSON.stringify({
                        regno: studentreg,
                        password: studentPassword
                    })
                });
                console.log("inner login")
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Login failed:', errorData.error);
                    return;
                }

                const data = await response.json();
                
                console.log('Login Data idddddd:', data.result[0].id)
                const id = data.result[0].id
                Cookies.set("token", `${data.token}`);
                const tok = Cookies.get('token');
                if (tok) {
                    window.location.href = `/student/dashbaord.html?id=${id}`;
                    // console.log(getdetail)
                    // getdetail =  data;

                    // resolveGetDetail(data);
                    // getTutorData();
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    } else {
        console.error('Form element not found');
    }
});

const getstudentData = async () => {
    try {
        const tok = Cookies.get('token');

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        const response = await fetch(`http://localhost:5000/show-student-details/${id}`, {
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
        studentdata=res[0]
        console.log("User Data",studentdata)
        // document.querySelector('.tutor-namee').value = res[0].tutor_name
        // document.querySelector('.tutor-emaill').value = res[0].tutor_email
        // document.querySelector('.tutor-name').value = res[0].tutor_name
        // document.querySelector('.tutor-email').value = res[0].tutor_email
        // console.log(studentdata)
       
    } catch (error) {
        console.error('Error fetching tutor data:', error);
    }
};
getstudentData();

const test = async (id)=>{
    try {
        const tok = Cookies.get('token');
        const response = await fetch(`http://localhost:5000/studentdata`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${tok}`
            },
            credentials: "include",
            withCredentials: true,
            body: JSON.stringify({
                student_name: studentdata.Student_name,
                student_regno: studentdata.regno,
                student_email: studentdata.email,
                tutor_id:id
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch tutor data');
        }

        const res = await response.json();
        toastr.success('enroll with this teacher','Successfully')
        studentdata=res
        console.log("User Data",studentdata)
        console.log(studentdata)
       
    } catch (error) {
        console.error('Error fetching tutor data:', error);
    }
}
// test();

function getEnrollTutor() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const tok = Cookies.get('token');
    fetch(`/showselectedtutor/${id}`,{
        method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${tok}`
            },
            credentials: "include",
            withCredentials: true,
    }) // Replace this with your backend route
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('enrollTutorBody');
            tableBody.innerHTML = ''; // Clear previous data
            console.log(data)
            data.forEach(tutor => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td style="text-align: center;">${tutor.tutor_name}</td>
                    <td style="text-align: center;">${tutor.tutor_subject}</td>
                    <td style="text-align: center;">${tutor.tutor_email}</td>
                    <!-- Add other table data here based on your fetched columns -->
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
}
document.addEventListener('DOMContentLoaded', function() {
    getEnrollTutor();
});
{/* <td><img src="../documents/undefined/${tutor.t_image}" width="100" height="100"/></td> */}

function showTutorDetails() {
    fetch('/show-tutors-details') // Replace this with your backend route
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('tableBody');
            tableBody.innerHTML = ''; // Clear previous data
            
            data.forEach(tutor => {
                const row = document.createElement('tr');
                row.innerHTML = `
                      <td><img src="../documents/undefined/${tutor.t_image}" width="100" height="100"/></td>
                    <td>${tutor.tutor_name}</td>
                    <td>${tutor.tutor_subject}</td>
                    <td>${tutor.tutor_email}</td>
                    <td><button class="btn btn-approve"onClick="test(${tutor.id})">Enroll</button></td>
                    <!-- Add other table data here based on your fetched columns -->
                `;
                tableBody.appendChild(row);
                getEnrollTutor()
            });
            
        })
        .catch(error => console.error('Error:', error));
}
document.addEventListener('DOMContentLoaded', function() {
showTutorDetails();
});