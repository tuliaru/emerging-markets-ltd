import React,{ useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import axios from "axios";
import IMAGES from '../images';
import { useParams } from 'react-router-dom';
import { axiosURL } from '../util/baseURL';



const ChangePassword = () => {
    
    const uParam = useParams ();
    const [OldPassword, setOldPassword]=useState("");
    const [password, setNewPassword]=useState("");
    const [ConfirmPassword, setConfirmPassword]=useState("");
    const [error,seterror] = useState("");
    const [success,setsuccess] = useState("");
    const [usertype, setusertype] = useState("");
    
    const [oldpasswordError, setOldPasswordErr] = useState("");
    const [passwordError, setPasswordErr] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [passwordInput, setPasswordInput]= useState({
        OldPassword:'',
        password:'',
        confirmPassword:''
    })
 

    
    const [allEntry, setAllEntry] = useState([]);
    



    const submitForm = (e) => {
            
        const btnPointer = document.querySelector('#profile-btn');
        btnPointer.innerHTML = 'Please wait..';
        btnPointer.setAttribute('disabled', true);
        
        e.preventDefault();
        const userTokenData = JSON.parse( localStorage.getItem("userToken") );

        if (document.getElementById("old_password").value=="" || document.getElementById("new_password").value==""){
            seterror("Please fill the missing fields");
            setsuccess("");
            btnPointer.innerHTML = '<img id="profile-btn-img" src="'+IMAGES.LoginIcon + '" alt="profile btn"/>Update Password';
            document.querySelector('#profile-btn-img').setAttribute('class','d-inline-block align-middle me-2');
            btnPointer.removeAttribute('disabled');
            return false;
         }
        
        if (document.getElementById("new_password").value!= document.getElementById("confirmPassword").value){
            setConfirmPasswordError("Confirm password is not matched");
            setsuccess("");
            btnPointer.innerHTML = '<img id="profile-btn-img" src="'+IMAGES.LoginIcon + '" alt="profile btn"/>Update Password';
            document.querySelector('#profile-btn-img').setAttribute('class','d-inline-block align-middle me-2');
            btnPointer.removeAttribute('disabled');
            return false;
         }

        const userData = {old_password:OldPassword, new_password:password};
           
           
               
    axiosURL.post('/update-password',userData,{headers:{
                  	'Authorization':'Bearer ' + userTokenData?.token
                  }}).then(res => {
                        console.log("User ID: -",res)
                        setOldPassword(res.data.old_password)
                        setNewPassword(res.data.new_password)
                        
                        if (res.data.code=="0") {
                        seterror(res.data.sMessage);
                        btnPointer.innerHTML = '<img id="profile-btn-img" src="'+IMAGES.LoginIcon + '" alt="profile btn"/>Update Password';
                    document.querySelector('#profile-btn-img').setAttribute('class','d-inline-block align-middle me-2');
                    btnPointer.removeAttribute('disabled');
                        }
                    else {
                    console.log(res.data.sMessage);
                    setsuccess(res.data.sMessage);
                    seterror("");
                    setOldPassword("");
                    setNewPassword("");
                    setPasswordInput("");
                    document.getElementById("confirmPassword").value = "";
                    btnPointer.innerHTML = '<img id="profile-btn-img" src="'+IMAGES.LoginIcon + '" alt="profile btn"/>Update Password';
                    document.querySelector('#profile-btn-img').setAttribute('class','d-inline-block align-middle me-2');
                    btnPointer.removeAttribute('disabled');
                    document.querySelector(".goHome").setAttribute('class','d-block mt-2');
                    }
                        
                  }).catch(err => {
                    seterror(error.response.data.message);
                    btnPointer.innerHTML = '<img id="profile-btn-img" src="'+IMAGES.LoginIcon + '" alt="profile btn"/>Update Password';
                    document.querySelector('#profile-btn-img').setAttribute('class','d-inline-block align-middle me-2');
                    console.log(error.response.data);
                    btnPointer.removeAttribute('disabled');

                  });     
           
           

    console.log(userData)
      
}

    useEffect(() => {
        
      }, [allEntry]);
    
    const handlePasswordChange =(evnt)=>{
    const passwordInputValue = evnt.target.value.trim();
    const passwordInputFieldName = evnt.target.name;
    const NewPasswordInput = {...passwordInput,[passwordInputFieldName]:passwordInputValue}
    setPasswordInput(NewPasswordInput);
    setNewPassword(passwordInputValue)
    
}
    const oldhandlePasswordChange =(evnt)=>{
    const passwordInputValue = evnt.target.value.trim();
    const passwordInputFieldName = evnt.target.name;
    const NewPasswordInput = {...passwordInput,[passwordInputFieldName]:passwordInputValue}
    setPasswordInput(NewPasswordInput);
    setOldPassword(passwordInputValue)
    
}
    
    const confirmhandlePasswordChange =(evnt)=>{
    const passwordInputValue = evnt.target.value.trim();
    const passwordInputFieldName = evnt.target.name;
    const NewPasswordInput = {...passwordInput,[passwordInputFieldName]:passwordInputValue}
    setPasswordInput(NewPasswordInput);
    setConfirmPassword(passwordInputValue)
    
}
    
const handleValidation= (evnt)=>{
    const passwordInputValue = evnt.target.value.trim();
    const passwordInputFieldName = evnt.target.name;
        //for password 
if(passwordInputFieldName==='password'){
    const uppercaseRegExp   = /(?=.*?[A-Z])/;
    const lowercaseRegExp   = /(?=.*?[a-z])/;
    const digitsRegExp      = /(?=.*?[0-9])/;
    const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
    const minLengthRegExp   = /.{8,}/;
    const passwordLength =      passwordInputValue.length;
    const uppercasePassword =   uppercaseRegExp.test(passwordInputValue);
    const lowercasePassword =   lowercaseRegExp.test(passwordInputValue);
    const digitsPassword =      digitsRegExp.test(passwordInputValue);
    const specialCharPassword = specialCharRegExp.test(passwordInputValue);
    const minLengthPassword =   minLengthRegExp.test(passwordInputValue);
    let errMsg ="";
    if(passwordLength===0){
            errMsg="Password is empty";
    }else if(!uppercasePassword){
            errMsg="At least one Uppercase";
    }else if(!lowercasePassword){
            errMsg="At least one Lowercase";
    }else if(!digitsPassword){
            errMsg="At least one digit";
    }else if(!specialCharPassword){
            errMsg="At least one Special Characters";
    }else if(!minLengthPassword){
            errMsg="At least minumum 8 characters";
    }else{
        errMsg="";
    }
    setPasswordErr(errMsg);
    //setOldPasswordErr(errMsg);
    }
    // for confirm password
    if(passwordInputFieldName=== "confirmPassword" || (passwordInputFieldName==="password" && passwordInput.confirmPassword.length>0) ){
            
        if(passwordInput.confirmPassword!==password)
        {
        setConfirmPasswordError("Confirm password is not matched");
        }else{
        setConfirmPasswordError("");
        }
        
    }
}
        
const [OldisVisible, setOldVisible] = useState(false);
const [NewisVisible, setNewVisible] = useState(false);
const [ConfirmisVisible, setConfirmVisible] = useState(false);

  const Oldtoggle = (e) => {
      e.stopPropagation();
    setOldVisible(!OldisVisible);
  };
  const Newtoggle = (e) => {
      e.stopPropagation();
    setNewVisible(!NewisVisible);
  };
  const Confirmtoggle = (e) => {
      e.stopPropagation();
    setConfirmVisible(!ConfirmisVisible);
  };
        
        

        
        
        
        
        
        
        
        
        
        
        
        
        
        

function generateP() {
            var pass = '';
            var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
                    'abcdefghijklmnopqrstuvwxyz' + '0123456789' + '#?!@$%^&*-';
              
            for (let i = 1; i <= 8; i++) {
                var char = Math.floor(Math.random()
                            * str.length + 1);
                  
                pass += str.charAt(char)
            }
              
            return pass;
        }      
        
        
        
        
        
        
        
        
        
        
        
var el_down = document.getElementById("new_password");


const gfg_Run = () => {
setPasswordErr("");
let randomPassword = generateP();
setNewPassword(randomPassword);
}         
        
        
        
 

    return (
        <>
    
        <div className=''>

        <div className="container">
        <div className='row'>


 <div className='col-12'>
 <div className='kcRightSection kcRightSection-reg changepass light-body-bg shadow-lg py-4 px-4 rounded-4'>

        <div className='kcrightcontent registerSection kcrightcontent-reg'>
        <div className="row mb-2 mb-lg-4">
        <div className="col-md-12 d-lg-flex align-items-center main-hdng">
        <div className="col-md-7"><h1 className="page-title">Change Password</h1></div>
    
        </div>
        </div>
        <form className='regForm' action="" onSubmit={submitForm}>
        
        
        
        <div className='input-blocks d-flex align-items-center'>
        <span className="d-inline-block me-4 align-middle"><img src={IMAGES.LockIcon} alt="Login" /></span>
        <div className='d-inline-block align-middle w-100'><label htmlFor="OldPassword" className='input-label'>Old Password</label>
        <input type={!OldisVisible ? "password" : "text"} 
        value={passwordInput.OldPassword}  
        onChange={oldhandlePasswordChange} 
        onKeyUp={handleValidation} 
        name="OldPassword"
        id="old_password"
        placeholder="Old Password" 
        className="d-block" />
        </div>
        <div className="input-group-btn d-inline-block eye_pass">
        <span className="py-1 px-2 border border-primary cursor-pointer" onClick={Oldtoggle}>
        { OldisVisible ? <i className="fa-solid fa-eye-slash"></i> :<i className="fa-solid fa-eye"></i> }
        </span>
        </div>
        
   </div>
      <p className="errorMessage pt-0 fs-6">{oldpasswordError}</p> 

        
             <div className='input-blocks d-flex align-items-center'>
        <span className="d-inline-block me-4 align-middle"><img src={IMAGES.LockIcon} alt="Login" /></span>
        <div className='d-inline-block align-middle w-100'><label htmlFor="password" className='input-label'>New Password</label>
        <input type={!NewisVisible ? "password" : "text"}
        value={password}  
        onChange={handlePasswordChange} 
        onKeyUp={handleValidation} 
        name="password"
        id="new_password"
        placeholder="New Password" 
        className="d-block" />
        </div>
        <span className="btn btn-sm btn-primary me-3 gnrt_pass" onClick={gfg_Run}><i className="fa-solid fa-lock me-1"></i> Generate Password</span>
        <div className="input-group-btn d-inline-block eye_pass">
        
        <span className="py-1 px-2 border border-primary cursor-pointer" onClick={Newtoggle}>
        { NewisVisible ? <i className="fa-solid fa-eye-slash"></i> :<i className="fa-solid fa-eye"></i> }
        </span>
        </div>
        
   </div>
        
      <p className="errorMessage pt-0 fs-6">{passwordError}</p>  
        <div className='input-blocks d-flex align-items-center'>
        <span className="d-inline-block me-4 align-middle"><img src={IMAGES.LockIcon} alt="Login" /></span>
        <div className='d-inline-block align-middle w-100'><label htmlFor="confirmPassword" className='input-label'>Confirm Password</label>
        <input type={!ConfirmisVisible ? "password" : "text"} 
        value={passwordInput.confirmPassword}  
        onChange={confirmhandlePasswordChange} 
        onKeyUp={handleValidation} 
        name="confirmPassword"
        id="confirmPassword"
        placeholder="confirm Password" className="d-block" />
        </div>
        <div className="input-group-btn d-inline-block eye_pass">
        <span className="py-1 px-2 border border-primary cursor-pointer" onClick={Confirmtoggle}>
        { ConfirmisVisible ? <i className="fa-solid fa-eye-slash"></i> :<i className="fa-solid fa-eye"></i> }
        </span>
        </div>
        
   </div>
<p className="errorMessage pt-0 fs-6">{confirmPasswordError}</p>
                
      
                
                
                <div className='align-items-center w-100'>
                    <div className='SignBtn'>
                        <button id="profile-btn" className='btn btn-secondary' type="submit">
                        <span className="d-inline-block me-2 align-middle"><img id="profile-btn-img" src={IMAGES.LoginIcon} alt="Register" /></span>Update Password</button>
                    </div>
                </div>

                <div className="errorMessage">{error}</div>
                <div className="successMessage">{success}</div>
                <div className="goHome d-none">Click here to return to <Link to="/userdashboard">Home Page.</Link></div>
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

export default ChangePassword;