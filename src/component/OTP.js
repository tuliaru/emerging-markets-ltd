import React,{ useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import IMAGES from '../images';
import { useNavigate } from "react-router-dom";
import '../assets/css/generalsection.css';

const OTP = () => {
    const [otp, setOtp] = useState();
    const [error,seterror] = useState("");
    const navigate = useNavigate();
    

    const otpToken = JSON.parse( localStorage.getItem("otpToken") );
    
    
    const submitForm = (e) => {
        e.preventDefault();
        
        const btnPointer = document.querySelector('#login-btn');
        btnPointer.innerHTML = 'Please wait..';
        btnPointer.setAttribute('disabled', true);
        
        
        
        if(document.getElementById("otp").value===""){
            seterror("Please enter the 6 digits OTP");
            btnPointer.innerHTML = '<img id="login-btn-img" src="'+IMAGES.LoginIcon + '" alt="Login btn"/>Verify OTP';
            document.querySelector('#login-btn-img').setAttribute('class','d-inline-block align-middle me-2');
            btnPointer.removeAttribute('disabled');
            return false;
         }

        const otpData = {
          otp
        };

        axios.post("https://eml.tulieservices.org/server/wp-json/eml-api/verify-otp", otpData, {headers:{
            'Authorization':'Bearer ' + otpToken?.otp_token
        }}).then((response) => {
        console.log(response.data.data);

        localStorage.removeItem("otpToken");
        
        localStorage.setItem("userToken",JSON.stringify(response.data.data));
         
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
    
    }).catch((error) => {
            seterror(error.response.data.message);
            btnPointer.innerHTML = '<img id="login-btn-img" src="'+IMAGES.LoginIcon + '" alt="Login btn"/>Verify OTP';
            document.querySelector('#login-btn-img').setAttribute('class','d-inline-block align-middle me-2');
            console.log(error.response.data);
            btnPointer.removeAttribute('disabled');
            //alert("Oops! Some error occured.");
        });
    }


    return (
        <>
         
        
        <div className='kcformBody'>

        <div className="container">
        <div className='row'>
        <div className='col-7'>

<div className='kcLeftSection'>

 <div className='kcIntro'>
     <h1>Hello</h1>
     <h2>Welcome To <span>Emerging Market Ltd.</span></h2>
     <img src={IMAGES.SignInfront} alt="SignInfront" />
 </div>
</div>
 </div>

 <div className='col-5'>
 <div className='kcRightSection'>
 
        
        <div className='kcrightcontent'>
        <h3>Authorization</h3>
       
        <form id="loginForm" className='regForm' action="" onSubmit={submitForm}>

                <div className='input-blocks d-flex align-items-center'>
                <span className="d-inline-block me-4 align-middle"><img src={IMAGES.LoginUser} alt="Login" /></span>
                <div className='d-inline-block align-middle w-100'><label htmlFor="number" className='input-label'>Please enter OTP</label>
                    <input type="number" autoCapitalize='off' className="d-block" name="otp" id="otp" placeholder='OTP' value={otp}
                        onChange={(e) => setOtp(e.target.value)} />
                    </div>
            
            
                </div>
                <small className="d-inline-block mt-3"><em>Verification Code has been sent to your registered email.</em></small> 
                <div className='SignBtn'>
                <button id="login-btn" className='btn btn-light' type="submit">
                <img src={IMAGES.LoginIcon} alt="Login btn" className='d-inline-block align-middle me-2' />Verify OTP</button>
                
                    
                </div>
                <div className="errorMessage">{error}</div>
            </form>

        </div>
    
 </div>
 </div>

        </div>

        </div>

        </div>


                </>

    )

}

export default OTP;