// STEPS
//  1. Create Event listener for form
//  2. Create log in function

const loginForm = document.querySelector('#form');
const signupForm = document.querySelector('#signupForm');
const logoutBtn = document.querySelector('#logoutBtn');



const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
const showAlert = (type, msg, time = 7) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  if (document.querySelector('.menu')){
    document.querySelector('.menu').insertAdjacentHTML('afterend', markup);

  }
  window.setTimeout(hideAlert, time * 1000);
};

const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login', 
            data: {
                email,
                password
            }
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully!');
            // alert("success!");
            window.setTimeout(() => {
              location.assign('/');
            }, 1500);
          }
    } catch (err) {
        console.log(err.response.data);
    }
}
const signup = async (name, email, password, passwordConfirm) => {
  try {
      const res = await axios({
          method: 'POST',
          url: 'http://127.0.0.1:3000/api/v1/users/signup', 
          data: {
              name,
              email,
              password,
              passwordConfirm,
              image
          }
      });
      if (res.data.status === 'success') {
          // showAlert('success', 'Logged in successfully!');
          alert('success');
          window.setTimeout(() => {
            location.assign('/');
          }, 1500);
        }
  } catch (err) {
      console.log(err.response.data);
  }
}
if (loginForm){
    loginForm.addEventListener('submit', e => {
        // prevents form from loading anyother page
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        login(email, password);
    });
}
if (signupForm){
  signupForm.addEventListener('submit', e => {
      // prevents form from loading anyother page
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const passwordConfirm = document.getElementById("passwordConfirm").value;
      signup(name,email, password, passwordConfirm);
  });
}
const logout = async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: '/api/v1/users/logout'
      });
      if ((res.data.status = 'success')) location.reload(true);
    } catch (err) {
      console.log(err.response);
      showAlert('error', 'Error logging out! Try again.');
    }
  };

  if (logoutBtn) logoutBtn.addEventListener('click', logout);
