let catId = null
async function showCategory() {
    const token = Cookies.get('token');
    const container = document.getElementById('showcategory');
    try {
        const response = await fetch('http://localhost:5000/getquizcategory', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            credentials: 'include',
            withCredentials: true
        });

        if (!response.ok) {
            throw new Error('Failed to fetch quiz categories');
        }

        const categories = await response.json();
        // console.log(categories);
        // Clear previous content
        const show=document.querySelector('.whitecontainer');
        // Iterate over categories and create list items
        categories.forEach(category => {
            const listItem = document.createElement('div');
            listItem.classList.add('catgy');
            listItem.textContent = category.category; // Assuming each category has a 'name' property
            listItem.style.cursor = "pointer";
            // console.log(listItem);
            listItem.onclick=function(){
                showmcqs(category.id);
                catId = category.id
                // console.log("Button clicked",category.id);
            }
            show.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

showCategory();


async function showmcqs(id){
    const tok = Cookies.get('token');
    const data= await fetch(`/getmcqs/${id}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tok}`
        },
        credentials: "include",
        withCredentials: true,

    })

    if (!data.ok) {
        // Handle error if response is not successful
        console.error("Error fetching data:", response.statusText);
        return;
    }
try{
   const result= await data.json();
//    console.log(result)
   const results=shuffleArray(result);
   const whitecontainer=document.querySelector('.whitecontainer');
   whitecontainer.innerHTML = '';

   let currentQuestionIndex = 0;
   let totalscore=0;
   let score =0;
   
   // Function to display the current question
        function displayQuestion() {
            const mcq = results[currentQuestionIndex];
            const mcqElement = document.createElement('div');
            mcqElement.classList.add('mcq');
            mcqElement.innerHTML = `
                <h3>${mcq.question}</h3>
                <ul>
                    <li id="optionA_${mcq.id}">${mcq.optA}</li>
                    <li id="optionB_${mcq.id}">${mcq.optB}</li>
                    <li id="optionC_${mcq.id}">${mcq.optC}</li>
                    <li id="optionD_${mcq.id}">${mcq.optD}</li>
                </ul>
                <button id="submit_${mcq.id}">Submit</button>
                <p>Correct Option: ${mcq.Correctopt}</p>
            `;
            whitecontainer.appendChild(mcqElement);

            // Add event listeners to options
            const optionIds = ['optionA', 'optionB', 'optionC', 'optionD'];
            optionIds.forEach(optionId => {
                const optionElement = document.getElementById(`${optionId}_${mcq.id}`);
                optionElement.addEventListener('click', () => {
                    // Remove highlight from all options
                    optionIds.forEach(id => {
                        const currentOption = document.getElementById(`${id}_${mcq.id}`);
                        currentOption.classList.remove('selected');
                    });

                    // Highlight the selected option
                    optionElement.classList.add('selected');
                });
            });

            // Add event listener to the button
            const submitButton = document.getElementById(`submit_${mcq.id}`);
            submitButton.addEventListener('click', () => {
                // Find the selected option
                const selectedOptionElement = document.querySelector(`#optionA_${mcq.id}.selected, #optionB_${mcq.id}.selected, #optionC_${mcq.id}.selected, #optionD_${mcq.id}.selected`);
                if (!selectedOptionElement) {
                    console.log("No option selected for MCQ with ID:", mcq.id);
                    return;
                }

                const selectedOption = selectedOptionElement.textContent;
                console.log("Selected Option:", selectedOption);

                // Compare with correct option
                if (selectedOption === mcq.Correctopt) {
                    console.log("Correct!");
                    totalscore+=10;
                    score = 10;
                    postmcqs(catId, "correct", score, mcq.id);
                } else {
                    console.log("Incorrect!");
                    score = 0;
                    postmcqs(catId, "Incorrect", score, mcq.id);
                }
                console.log("Score:", score);
                // console.log("Total Score", totalscore);


                // Proceed to the next question
                currentQuestionIndex++;
                // Check if there are more questions
                if (currentQuestionIndex < results.length) {
                    // Remove the current question
                    mcqElement.remove();
                    // Display the next question
                    displayQuestion();
                } else {
                    console.log("End of quiz");
                    console.log("Total Score", totalscore);
                    const quizMarks = document.querySelector('.quizmarks');
                    quizMarks.textContent = "Quiz Ended. Total Score: " + totalscore;
                    // Perform any action when the quiz ends
                }
            });
        }

        // Display the first question
        displayQuestion();
    } catch (error) {
        console.error("Error parsing JSON:", error);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

async function postmcqs(cat_id,option,score,mcq_id){
    try{
    const tok = Cookies.get('token');
    const resp=await fetch(`http://localhost:5000/marking`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tok}`
        },
        credentials: "include",
        withCredentials: true,
        body:JSON.stringify({
            selectedOpt:option,
            score:score,
            mcqs_id:mcq_id,
            category_id:cat_id
        })
    });
    if (!resp) {
        
        throw new Error('Failed');
    }

    const resultt=await resp.json();
    console.log(resultt);
    

    }catch(error){
        console.error('Error occur',error);
    }
}
