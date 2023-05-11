import React,{ useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import axios from "axios";
import IMAGES from '../images';
import { useNavigate } from "react-router-dom";
import '../assets/css/generalsection.css';

const Signin = () => {
    const [email, setEmail] = useState("");
    //const [password, setPassword] = useState("");
    const [allEntry, setAllEntry] = useState([]);
    const [error,seterror] = useState("");
    let navigate = useNavigate();
    
    const [password, setPassword] = useState("password");
    const [passwordInput, setPasswordInput] = useState("");
    const handlePasswordChange =(e)=>{
        setPasswordInput(e.target.value);
    }
    const togglePassword =()=>{
      if(password==="password")
      {
       setPassword("text")
       return;
      }
      setPassword("password")
    }
    

    const submitForm = (e) => {
        e.preventDefault();
        
        const formElement = document.querySelector('#loginForm');
        const formData = new FormData(formElement);
        const formDataJSON = Object.fromEntries(formData);
        const btnPointer = document.querySelector('#login-btn');
        btnPointer.innerHTML = 'Please wait..';
        btnPointer.setAttribute('disabled', true);
        
        
        
        if(document.getElementById("email").value==="" ||  document.getElementById('password').value===""){
            seterror("Email & Password both fields are required");
            btnPointer.innerHTML = '<img id="login-btn-img" src="'+IMAGES.LoginIcon + '" alt="Login btn"/>Login';
			document.querySelector('#login-btn-img').setAttribute('class','d-inline-block align-middle me-2');
            btnPointer.removeAttribute('disabled');
            return false;
         }

         let rememberMe = document.getElementById("rememberme").checked == true ? 1 : 0;
        
        const userData = {
          email:email,
          password:passwordInput,
          rememberMe

        };

        axios.post("https://eml.tulieservices.org/server/wp-json/eml-api/login", userData, formDataJSON).then((response) => {
        console.log(response.data.data);
        //alert(response.data.Sstatus)
        //if (response.Status=="0") {
        localStorage.setItem("userToken",JSON.stringify(response.data.data));
        //localStorage.setItem("otpToken",JSON.stringify(response.data.data));
        //return navigate("/verify-otp");
            
			//seterror(response.data.sMessage);
        //}
        if (response.data.data.user_type_id==="1") {
            return navigate("/admindashboard");
           
        }

        else if (response.data.data.user_type_id==="2") {
            return navigate("/admindashboard");
           
        }

        else if (response.data.data.user_type_id==="3") {
            return navigate("/userdashboard");
           
        }

        else
        {
            return navigate("/userdashboard");
        }
            
        btnPointer.innerHTML = 'Login';
            btnPointer.removeAttribute('disabled');
            const data = response.data;
            const token = data.token;
            if (!token) {
                //alert('Unable to login. Please try after some time.');
                return;
            }
            localStorage.clear();
            localStorage.setItem('user-token', token);
            setTimeout(() => {
                navigate('/');
            }, 500);
        
    }).catch((error) => {
            seterror(error.response.data.message);
            btnPointer.innerHTML = '<img id="login-btn-img" src="'+IMAGES.LoginIcon + '" alt="Login btn"/>Login';
			document.querySelector('#login-btn-img').setAttribute('class','d-inline-block align-middle me-2');
            console.log(error.response.data);
            btnPointer.removeAttribute('disabled');
            //alert("Oops! Some error occured.");
        });
    
}


    useEffect(() => {
		 const userToken = localStorage.getItem('userToken');
		 if(userToken){
			 const userType = JSON.parse(userToken);
			 if(userType.user_type_id==="1" || userType.user_type_id==="2"){
                navigate('/admindashboard');
             }  
			 else if(userType.user_type_id==="3"){
                navigate('/userdashboard');
             }  
             else{
                navigate('/userdashboard');
             } 
		 }
        console.log(allEntry); 
      }, [allEntry]);
    


    return (
        <>
         
        
        <div className='kcformBody'>

        <div className="container">
        <div className='row'>
        <div className='col-7'>

<div className='kcLeftSection'>

 <div className='kcIntro'>
     
     <h2>Welcome to <span>EMERGING MARKETS, LTD.</span> , Exchange Rates Portal.</h2>
     <img src={IMAGES.SignInfront} alt="SignInfront" />
 </div>
</div>
 </div>

 <div className='col-5'>
 <div className='kcRightSection'>
 
        
        <div className='kcrightcontent'>
        <h3>Login With Your Account</h3>
       
        <form id="loginForm" className='regForm' action="" onSubmit={submitForm}>

                <div className='input-blocks d-flex align-items-center'>
                <span className="d-inline-block me-4 align-middle"><img src={IMAGES.LoginUser} alt="Login" /></span>
                <div className='d-inline-block align-middle w-100'><label htmlFor="email" className='input-label'>Email</label>
                    <input type="email" autoCapitalize='off' className="d-block" name="email" id="email" placeholder='Email' value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>
                <div className='input-blocks d-flex align-items-center'>
                <span className="d-inline-block me-4 align-middle"><img src={IMAGES.LockIcon} alt="Password" /></span>
                <div className='d-inline-block align-middle w-100'><label htmlFor="password" className='input-label d-inline-block'>Password</label>
                    
                            
                <input type={password} onChange={handlePasswordChange} value={passwordInput} name="password" className="d-block" placeholder="***********" id="password" />
                    
                </div>
                    <div className="input-group-btn d-inline-block">
                     <span className="py-1 px-2 border border-primary cursor-pointer" onClick={togglePassword}>
                     { password==="password"? <i className="fa-solid fa-eye-slash"></i> :<i className="fa-solid fa-eye"></i> }
                     </span>
                    </div>
                </div>

            <div className='input-blocks d-flex align-items-center empty-check'>   
             <div className="form-check">
            <input className="form-check-input" type="checkbox" id="rememberme" name="rememberme" />
            <label className="form-check-label" htmlFor="rememberme">Remember Me?</label></div>
             </div>    

                <div className='SignBtn'>
                <button id="login-btn" className='btn btn-light' type="submit">
                <img src={IMAGES.LoginIcon} alt="Login btn" className='d-inline-block align-middle me-2' />Login</button>
                <div className="FgPass">
                    <Link to="/Forgotpassword">Forgot Password ?</Link>
                    </div>
                    
                </div>
                <div className="errorMessage">{error}</div>
            </form>

        </div>
    
 </div>
 </div>

        </div>

        </div>

        </div>


                <div className='none'>
                    {
                        allEntry.map((curElem,i) => {
                            return (
                                <div key={i} className="showData">
                    <div key={i+1} className='dataBlock'>{curElem.email}</div>
                    <div key={i+2} className='dataBlock'>{curElem.password}</div>
                    
                    </div>
                            )

                        }

                        )
                    }
                </div>
                </>

    )

}

export default Signin;