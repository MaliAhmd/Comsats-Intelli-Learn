// const throughId = require('./tutor')
const getTutorData = async () => {
    try {
        // await getDetailPromise; // Wait for getDetailPromise to resolve before proceeding
        const tok = Cookies.get('token');
        // console.log('Token:', tok);
        // console.log('getdetail:', getdetail);

        // if (!getdetail || !getdetail.result || !getdetail.result[0]) {
        //     console.error('getdetail does not contain expected data');
        //     return;
        // }

        // const id = getdetail.result[0].id;
        // console.log("Test id:", id);

        // // const throughId = () =>{
        // //     return id;
        // // }
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

