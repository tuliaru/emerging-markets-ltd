import React,{ useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import axios from "axios";
import IMAGES from '../images';
//import { BiLogIn } from "react-icons/bi";
//import { AiOutlineUser } from "react-icons/ai";
//import { HiOutlineKey } from "react-icons/hi";
import '../assets/css/generalsection.css';

const Forgotpassword = () => {
    const [email, setEmail] = useState("");
    const [allEntry, setAllEntry] = useState([]);
    const [error,seterror] = useState("");
    const [success,setsuccess] = useState("");

    const submitForm = (e) => {
        e.preventDefault();

        if(document.getElementById("email").value==""){
            seterror("Email fields are required")
            return false;
         }
        
        else {
            if (isValidEmailAddress(document.getElementById("email").value)) {
                seterror("")
            }
            else {
                seterror("Please enter your valid email")
                setsuccess("")
           
                return false;
            }
        }
        
        function isValidEmailAddress(emailAddress) {
            var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
            return pattern.test(emailAddress);
        };
         

        const userData = {
          email:email,

        };
        axios.post("https://eml.tulieservices.org/server/wp-json/wp/v2/forgot-password", userData).then((response) => {
        console.log(response.data.sStatus);
        if (response.data.sStatus=="0") {
           
         seterror(response.data.sMessage);
        }
        else {
            console.log(response.data.sMessage);
            setsuccess("An email with a temporary password has been sent to your email address on record.");
        }
        }
    
        );
}

    useEffect(() => {
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
        <h3>Forgot Password ?</h3>
        <form className='regForm' action="" onSubmit={submitForm}>

                <div className='input-blocks d-flex align-items-center'>
                <span className="d-inline-block me-4 align-middle "><img src={IMAGES.LoginUser} alt="Login" /></span>
                <div className='d-inline-block align-middle w-100'><label htmlFor="email" className='input-label'>Email</label>
                    <input type="email" autoCapitalize='off' className="d-block" name="email" id="email" placeholder='Email' value={email}
                        onChange={(e) => setEmail(e.target.value)} 

                    />
                </div>
                </div>
                <div className='SignBtn'>
                <button className='btn btn-light' type="submit"><img src={IMAGES.LoginIcon} alt="Login btn" className='d-inline-block align-middle me-2' />Submit</button>
                <div class="FgPass"><a href="/">Login</a></div>
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

export default Forgotpassword