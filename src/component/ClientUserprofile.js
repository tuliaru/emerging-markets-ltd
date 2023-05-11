import React,{ useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import axios from "axios";
import IMAGES from '../images';
import { useParams } from 'react-router-dom';
import { axiosURL } from '../util/baseURL';



const ClientUserprofile = () => {
    const [fname, setFname] = useState("");
    const [mname, setMname] = useState("");
    const [lname, setLname] = useState("");
    const uParam = useParams ();
    const [organization, setOrganization] = useState("");
    const [compphone, setCompphone] = useState("");
    const [error,seterror] = useState("");
    const [success,setsuccess] = useState("");
    const [usertype, setusertype] = useState("");
    const [orgname, setOrgname] = useState("");
    const [orgmail, setOrgmail] = useState("");
    const [orgphone, setOrgphone] = useState("");
    const [orgaddrs, setOrgaddrs] = useState("");
    const [organizationlist, setOrganizationList] = useState([]);
    
    const [allEntry, setAllEntry] = useState([]);
    

    useEffect(()=>{
		const userTokenData = JSON.parse( localStorage.getItem("userToken") );
		if( userTokenData?.token != "" ){
        
           


		axiosURL.post('/profile',{},{headers:{
                  	'Authorization':'Bearer ' + userTokenData?.token
                  }}).then(res => {
                        console.log("User ID: -",res)
                        setFname(res.data.first_name)
                        setMname(res.data.middle_name)
                        setLname(res.data.last_name)
                        setCompphone(res.data.phone)
                        setOrganization(res.data.organization_name)
                        setOrgmail(res.data.email)
                        
                  }).catch(err => {
                  });
              }
        
    console.log(uParam.id);
	},[]);


    const submitForm = (e) => {
            
        const btnPointer = document.querySelector('#profile-btn');
        btnPointer.innerHTML = 'Please wait..';
        btnPointer.setAttribute('disabled', true);
        
        e.preventDefault();
        const userTokenData = JSON.parse( localStorage.getItem("userToken") );

        if (document.getElementById("fname").value=="" ||  document.getElementById("lname").value=="" || document.getElementById("compphone").value==""){
            seterror("Please fill the missing fields");
            setsuccess("");
            btnPointer.innerHTML = '<img id="profile-btn-img" src="'+IMAGES.LoginIcon + '" alt="profile btn"/>Update Profile';
            document.querySelector('#profile-btn-img').setAttribute('class','d-inline-block align-middle me-2');
            btnPointer.removeAttribute('disabled');
            return false;
         } 

        const userData = {fname, mname, lname, compphone};
           
           
               
    axiosURL.post('/profile/update',userData,{headers:{
                  	'Authorization':'Bearer ' + userTokenData?.token
                  }}).then(res => {
                        console.log("User ID: -",res)
                        setFname(res.data.fname)
                        setMname(res.data.mname)
                        setLname(res.data.lname)
                        setCompphone(res.data.compphone)
                        if (res.data.sStatus=="0") {
                        seterror(res.data.sMessage);
                        }
                    else {
                    console.log(res.data.sMessage);
                    setsuccess(res.data.sMessage);
                    seterror("");
                    btnPointer.innerHTML = '<img id="profile-btn-img" src="'+IMAGES.LoginIcon + '" alt="profile btn"/>Update Profile';
                    document.querySelector('#profile-btn-img').setAttribute('class','d-inline-block align-middle me-2');
                    btnPointer.removeAttribute('disabled');
                    }
                        
                  }).catch(err => {
                    seterror(error.response.data.message);
                    btnPointer.innerHTML = '<img id="profile-btn-img" src="'+IMAGES.LoginIcon + '" alt="profile btn"/>Update Profile';
                    document.querySelector('#profile-btn-img').setAttribute('class','d-inline-block align-middle me-2');
                    console.log(error.response.data);
                    btnPointer.removeAttribute('disabled');
                    //alert("Oops! Some error occured.");

                  });     
           
           

    console.log(userData)
      
}

    useEffect(() => {
        console.log(organization); 
      }, [allEntry,organization]);
    
    

    return (
        <>
    
        <div className=''>

        <div className="container">
        <div className='row'>


 <div className='col-12'>
 <div className='kcRightSection kcRightSection-reg light-body-bg shadow-lg py-4 px-4 rounded-4'>

        <div className='kcrightcontent registerSection kcrightcontent-reg'>
        <div className="row mb-2 mb-lg-4">
        <div className="col-md-12 d-lg-flex align-items-center main-hdng">
        <div className="col-md-7"><h1 className="page-title">Edit User Profile</h1></div>
    
        </div>
        </div>
        <form className='regForm' action="" onSubmit={submitForm}>
        
        <div className='input-blocks d-flex align-items-center read-only'>
                    <span className="d-inline-block me-4 align-middle"><i className="fa-regular fa-building"></i></span>
                     <div className='d-inline-block align-middle w-100'><label htmlFor="compname" className='input-label'>Organization Name</label>
                        
                        <input type="text" autoComplete='off' name="organization" id="organization" placeholder='organization' value={organization} readOnly
                        onChange={(e) => setOrganization(e.target.value)}

                    />
                    </div>  
                </div>

        <div className='input-blocks d-flex align-items-center'>
                <span className="d-inline-block me-4 align-middle"><img src={IMAGES.LoginUser} alt="Login" /></span>
                <div className='d-inline-block align-middle w-100'><label htmlFor="fname" className='input-label'>First Name</label>
                    <input type="text" autoCapitalize='off' name="fname" id="fname" placeholder='FirstName' value={fname} 
                        onChange={(e) => setFname(e.target.value)} 

                    />
                </div>
                </div>
                <div className='input-blocks d-flex align-items-center'>
               <span className="d-inline-block me-4 align-middle"><img src={IMAGES.LoginUser} alt="Login" /></span>
                <div className='d-inline-block align-middle w-100'><label htmlFor="mname" className='input-label'>Middle Name</label>
                    <input type="text" autoCapitalize='off' name="mname" id="mname" placeholder='Middle Name' value={mname}
                        onChange={(e) => setMname(e.target.value)} 

                    />
                </div>
                </div>
                <div className='input-blocks d-flex align-items-center'>
               <span className="d-inline-block me-4 align-middle"><img src={IMAGES.LoginUser} alt="Login" /></span>
                <div className='d-inline-block align-middle w-100'><label htmlFor="lname" className='input-label'>Last Name</label>
                    <input type="text" autoCapitalize='off' name="lname" id="lname" placeholder='Last Name' value={lname}
                        onChange={(e) => setLname(e.target.value)} 

                    />
                </div>
                </div>
                <div className='input-blocks d-flex align-items-center'>
                <span className="d-inline-block me-4 align-middle"><i className="fa-solid fa-phone"></i></span>
                <div className='d-inline-block align-middle w-100'><label htmlFor="compphone" className='input-label'>Phone</label>
                    <input type="text" autoComplete='off' name="compphone" id="compphone" placeholder='Phone' value={compphone}
                        onChange={(e) => setCompphone(e.target.value)}

                    />
                  </div>  
                </div>
                <div className='input-blocks d-flex align-items-center read-only'>
                <span className="d-inline-block me-4 align-middle"><i className="fa-solid fa-envelope"></i></span>
                <div className='d-inline-block align-middle w-100'><label htmlFor="orgmail" className='input-label'>Email</label>
                    <input type="email" autoComplete='off' name="orgmail" id="orgmail" placeholder='email' value={orgmail} readOnly
                        onChange={(e) => setOrgmail(e.target.value)}

                    />
                  </div>  
                </div>
                
                

                
      
                
                
                <div className='align-items-center w-100'>
                    <div className='SignBtn'>
                        <button id="profile-btn" className='btn btn-secondary' type="submit">
                        <span className="d-inline-block me-2 align-middle"><img id="profile-btn-img" src={IMAGES.LoginIcon} alt="Register" /></span>Update Profile</button>
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

export default ClientUserprofile