import React,{ useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import axios from "axios";
import {axiosURL} from '../util/baseURL.js';
import IMAGES from '../images';
import RegistrationModal from "./RegistrationModal";



const Registration = () => {
    const [fname, setFname] = useState("");
    const [mname, setMname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");
   
    const [organization, setOrganization] = useState("");
     const [selectedOrganization, setSelectedOrganization] = useState("");
    const [phone, setPhone] = useState("");
    const [error,seterror] = useState("");
    const [success,setsuccess] = useState("");
    
    const [usertype, setusertype] = useState("");

    const [showModal, setshowModal] = useState(false);
    
    
    const [password, setPassword]=useState("");
    const [passwordfield, setPasswordField] = useState("");
    const [passwordError, setPasswordErr] = useState("");
    const [passwordInput, setPasswordInput]= useState({
    password:'',
    })  
    
    
    let token = '';

    const [allEntry, setAllEntry] = useState([]);
    
    
    const submitForm = (e) => {
        e.preventDefault();

        if(document.getElementById("fname").value=="" || document.getElementById("lname").value=="" || document.getElementById("email").value=="" ||  document.getElementById('password').value=="" ||  document.getElementById("organization").value=="" || document.getElementById("phone").value==""){
            seterror("Please fill the missing fields");
            
            setsuccess("");
            return false;
         }



        const userData = {
            first_name:fname,
            middle_name:mname,
            last_name:lname,  
            email:email,
            password:password,
            organization_id:selectedOrganization,
            phone:phone,
            user_type_id:usertype,
        };


    
        

    console.log(userData)
        axiosURL.post("/registration", userData,
                     {headers:{
                  'Authorization':'Bearer ' + token
                  }})
            .then((response) => {
        console.log(response.data.sStatus);
        if (response.data.sStatus=="0") {
            seterror(response.data.sMessage);
            
            
        }
        else {
            console.log(response.data.sMessage);
            setsuccess(response.data.sMessage);
            seterror("");
            setFname ("");
            setMname ("");
            setLname ("");
            setEmail ("");
            setPassword("");
            setPasswordInput("");
            setOrganization ("");
            setPhone ("");
            document.getElementById("password").value = "";
            
            
        }
        })
        .catch(error => {
         console.log(error?.response?.data?.code);
         
         if (error?.response?.data?.code) {
          setshowModal(true);
          
        }
    });
}

    useEffect(() => {
        console.log(allEntry); 
      }, [allEntry]);
    

                     
 

 useEffect(() => {
        
        const userToken = localStorage.getItem('userToken');
		 if(userToken){
			 const tokenType = JSON.parse(userToken);
             console.log(tokenType);
             token = tokenType.token;
         }

        axiosURL.get("/getorganizations", 
                  {headers:{
                  'Authorization':'Bearer ' + token
                  }})
        .then((response) => {
          setOrganization(response.data);
           console.log(response.data);
          
         let createOptions = (arr, targetSelector) => document.querySelector("#organization").insertAdjacentHTML("beforeend",arr.map(o => `<option value="${o.OrganizationId}">${o.OrganizationName}</option>`));
         createOptions(response.data, 'select.data');
             
        
        
        

        })
        .catch(error => {
         console.log(error?.response?.data?.code);
         

    })
    },[])                   
                     
                     
                     
         
                     
    const [disabled, setDisabled] = useState(true)                
                     
      function changeOrg(e) { 
      setSelectedOrganization(e.target.value);
     //alert(document.getElementById("organization").value);  	  
if (document.getElementById("organization").value === "0")

 {    setDisabled(true);

 } else {  

       setDisabled(false);
	   }

}

                     
  const handlePasswordChange =(evnt)=>{
    const passwordInputValue = evnt.target.value.trim();
    const passwordInputFieldName = evnt.target.name;
    const NewPasswordInput = {...passwordInput,[passwordInputFieldName]:passwordInputValue}
    setPasswordInput(NewPasswordInput);
    setPassword(passwordInputValue)
    
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

}                     
const [passwordisVisible, setPasswordVisible] = useState(false);                     
const Passwordtoggle = (e) => {
      e.stopPropagation();
    setPasswordVisible(!passwordisVisible);
  };                    
                     

            
            
            
            
            
            
            
            
            
            
            
            
            
            
        
            
var el_down = document.getElementById("password");

const gfg_Run = () => {
setPasswordErr("");
let randomPassword = Math.random().toString(36).slice(2) +
Math.random().toString(36)
.toUpperCase().slice(2);
setPassword(randomPassword);
}     

            
            
            
            
                     
                     
      return (
        <>

        <RegistrationModal/>

        <div className=''>

        <div className="container">
        <div className='row'>


 <div className='col-12'>
 <div className='kcRightSection kcRightSection-reg light-body-bg shadow-lg py-4 px-4 rounded-4'>

        <div className='kcrightcontent registerSection kcrightcontent-reg'>
        <div className="row mb-2 mb-lg-4">
        <div className="col-md-12 d-lg-flex align-items-center main-hdng">
        <div className="col-md-12"><h1 className="page-title">Register</h1></div>
        
        </div>
        </div>
        <form className='regForm' action="" onSubmit={submitForm}>
        <div className="row align-items-center mb-3">
                <div className="col-md-9 col-12">
                <div className='input-blocks d-flex align-items-center mb-0'>
                    <span className="d-inline-block me-4 align-middle"><i className="fa-regular fa-building"></i></span>
                     <div className='d-inline-block align-middle w-100'><label htmlFor="compname" className='input-label'>Organization Name</label>
                        <select id="organization" name="organization"  onChange={changeOrg}>
                            <option value="0" defaultValue="selected" >Select an Organization</option>
                            
                        </select>
                    </div>  
                </div>
                
                </div>
                <div className="col-md-3 col-12 d-flex justify-content-end">
                    <div>
                    
        <button type="button" className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#addOrgModal">Add Organization <i className="ms-2 fa-solid fa-plus"></i></button>
        
        </div>     
                </div>
                    <small className="d-inline-block mt-3"><em>[Note: If your organization name not listed in the dropdown Please click on add organization.]</em></small> 
                </div>
        <div className="row">
          <div className="col-md-6 col-12">          
        <div className='input-blocks d-flex align-items-center'>
                <span className="d-inline-block me-4 align-middle"><img src={IMAGES.LoginUser} alt="Login" /></span>
                <div className='d-inline-block align-middle w-100'><label htmlFor="fname" className='input-label'>First Name</label>
                    <input type="text" autoCapitalize='off' name="fname" id="fname"  placeholder='FirstName' value={fname}
                        onChange={(e) => setFname(e.target.value)} disabled={disabled}

                    />
                </div>
                </div>
                </div>
                <div className="col-md-6 col-12">
                <div className='input-blocks d-flex align-items-center'>
               <span className="d-inline-block me-4 align-middle"><img src={IMAGES.LoginUser} alt="Login" /></span>
                <div className='d-inline-block align-middle w-100'><label htmlFor="mname" className='input-label'>Middle Name</label>
                    <input type="text" autoCapitalize='off' name="mname" id="mname" placeholder='Middle Name' value={mname}
                        onChange={(e) => setMname(e.target.value)} disabled={disabled}

                    />
                </div>
                </div>
                 </div>
                </div>
                <div className="row">
                <div className="col-md-6 col-12">
                <div className='input-blocks d-flex align-items-center'>
               <span className="d-inline-block me-4 align-middle"><img src={IMAGES.LoginUser} alt="Login" /></span>
                <div className='d-inline-block align-middle w-100'><label htmlFor="lname" className='input-label'>Last Name</label>
                    <input type="text" autoCapitalize='off' name="lname" id="lname" placeholder='Last Name' value={lname}
                        onChange={(e) => setLname(e.target.value)} disabled={disabled}

                    />
                </div>
                </div>
                </div>
                <div className="col-md-6 col-12">
                <div className='input-blocks d-flex align-items-center'>
                <span className="d-inline-block me-4 align-middle"><i className="fa-solid fa-envelope"></i></span>
                <div className='d-inline-block align-middle w-100'><label htmlFor="email" className='input-label'>Email</label>
                    <input type="email" autoCapitalize='off' name="email" id="email" placeholder='Email' value={email}
                        onChange={(e) => setEmail(e.target.value)} disabled={disabled}

                    />
                </div>
                </div>
                </div>
                </div>
                
                <div className="row">
                <div className="col-md-6 col-12">
                <div className='input-blocks d-flex align-items-center'>
                <span className="d-inline-block me-4 align-middle"><img src={IMAGES.LockIcon} alt="Login" /></span>
                <div className='d-inline-block align-middle w-100'><label htmlFor="password" className='input-label'>Password</label>
                    <input type={!passwordisVisible ? "password" : "text"}
        value={password}  
        onChange={handlePasswordChange} 
        onKeyUp={handleValidation} placeholder='***********' autoComplete='off' name="password" id="password" disabled={disabled} />
             
    
                  </div>
    <span className="btn btn-sm btn-primary me-3 gnrt_pass" onClick={gfg_Run}><i className="fa-solid fa-lock me-1"></i> Generate Password</span>
                <div className="input-group-btn d-inline-block eye_pass">
        <span className="py-1 px-2 border border-primary cursor-pointer" onClick={Passwordtoggle}>
        { passwordisVisible ? <i className="fa-solid fa-eye-slash"></i> :<i className="fa-solid fa-eye"></i> }
        </span>
        </div>
   
      
    
                </div>
    
     
    <p className="errorMessage pt-0 fs-6">{passwordError}</p>
                </div>
                
                
                <div className="col-md-6 col-12">
                <div className='input-blocks d-flex align-items-center'>
                <span className="d-inline-block me-4 align-middle"><i className="fa-solid fa-phone"></i></span>
                <div className='d-inline-block align-middle w-100'><label htmlFor="compphone" className='input-label'>Phone</label>
                    <input type="text" autoComplete='off' name="phone" id="phone" placeholder='Phone' value={phone}
                        onChange={(e) => setPhone(e.target.value)} disabled={disabled}

                    />
                  </div>  
                </div>
                </div>
                </div>
                
                <div className='w-100 d-block'>
                    <div className='SignBtn'>
                        <button className='btn btn-secondary float-none' type="submit" disabled={disabled}>
                        <span className="d-inline-block me-2 align-middle"><img src={IMAGES.LoginIcon} alt="Register" /></span>Register</button>
                    </div>
                </div>

                <div className="errorMessage">{error}</div>
                <div className="successMessage">{success}</div>
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

export default Registration