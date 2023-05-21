window.addEventListener('scroll', reveal);

function reveal() {
  let reveals = document.querySelectorAll('.reveal');

  for (let i = 0; i < reveals.length; i++) {
    let windowHeight = window.innerHeight;
    let revealTop = reveals[i].getBoundingClientRect().top;
    let revealPoint = 30;

    if (revealTop < windowHeight - revealPoint) {
      reveals[i].classList.add('active');
    } else {
      reveals[i].classList.remove('active');
    }
  }
}







/*Log In and Sign In page*/
const loginSection = document.getElementById('loginpage');
const signupSection = document.getElementById('signuppage');




function hideLogInPage(){
    loginSection.style.display = "none";
    signupSection.style.display = "block";
}

function hideSignUpPage(){
    loginSection.style.display = "block";
    signupSection.style.display = "none";
}


/*Switching between pages*/

let homePageLogInBtn = document.getElementById('loginbtnhome');
let homePageSignUpBtn = document.getElementById('signupbtnhome');


function openLogInPage(){
    window.location.href="login.html";
    loginSection.style.display="block";
    signupSection.style.display = "none";
}
function openSignUpPage(){
  window.location.href="login.html";
  loginSection.style.display="none";
  signupSection.style.display = "block";
}



let termsAndCond = document.getElementById('termscond');

function hideTerms(){
  termsAndCond.style.display="flex";
};