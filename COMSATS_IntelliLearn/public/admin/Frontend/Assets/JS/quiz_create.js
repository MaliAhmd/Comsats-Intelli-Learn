
let getId = null
// createquiz->category->button (next)-> quiz create

// Frontend title,category store in database code
async function title_category(){
    const title=document.getElementById('title').value;
    const category=document.getElementById("category").value;
    
    const response= await fetch('http://localhost:5000/createquiz',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        credentials: "include",
                        withCredentials: true,
                        body: JSON.stringify({
                            quiz_title: title,
                            quiz_category: category
    })
    });
    
    const data = await response.json();
    
    return data;
    }
function showcontent(){
    const createquizbtn=document.querySelector('.btn_quiz_create');
    const showcategory=document.querySelector('#ShowCategory');
    const nextbtn=document.querySelector("#nextbtn");
    const mcqs=document.querySelector("#showmcqs");

    // Event listener for clicking on the create quiz button
    createquizbtn.addEventListener('click', function() {
        // Show the category div
        showcategory.style.display = 'flex';
        
    
        // Hide the MCQs div
        mcqs.style.display = 'none';
    });

    // Event listener for clicking on the next button
    nextbtn.addEventListener('click', async function() {
        // Hide the category div
        showcategory.style.display = 'none';
        const response= await title_category();
        // getId = response.result[0].id
        // console.log(response.result[0].id);
        // mcqs.style.display = 'block';
        if(!response){
            console.log("response: ",response)
            return;
        }
        else{
            getId = response.result[0].id
            console.log(response.result[0].id);
            mcqs.style.display = 'block';
        }
        // Show the MCQs div
        
    });


}
showcontent();

// end


// End  
// function calll on above function


// MCQS Store in database
document.getElementById("submitBtn").addEventListener('click',function(){
    mcqsupload();
});


function mcqsupload(){
const question=document.getElementById('question').value;
const optA=document.getElementById('optA').value;
const optB=document.getElementById('optB').value;
const optC=document.getElementById('optC').value;
const optD=document.getElementById('optD').value;
console.log(question,optA,optB,optC,optD)

const questionSets = document.querySelectorAll('.questionSet');
        console.log(questionSets);
        questionSets.forEach(function(questionSet) {
            const options = questionSet.querySelectorAll('.options');
            const textInputs = questionSet.querySelectorAll('.text');
            let selectedOption = null;
            options.forEach(function(option, index) {
                // option.addEventListener('change', function() {
                    if (option.checked) {
                        selectedOption = textInputs[index].value;
                        // const questionId = questionSet.dataset.questionId;
                        console.log(question,optA,optB,optC,optD)   
                        console.log(selectedOption)
                        
                        
                        fetch('http://localhost:5000/createmcqs', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                question: question,
                                optA: optA,
                                optB: optB,
                                optC: optC,
                                optD: optD,
                                Correctopt: selectedOption,
                                category_id: getId
                            })
                        })
                        .then(response => {
                     document.getElementById('question').value='';
                     document.getElementById('optA').value='';
                     document.getElementById('optB').value='';
                     document.getElementById('optC').value='';
                    document.getElementById('optD').value='';
                    options.forEach(function (option) {
                        option.checked = false;
                    });
                 })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                    }
                // });
            });
        });
}


// end