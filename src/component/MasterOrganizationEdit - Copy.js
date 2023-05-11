import React,{ useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom';
import axios from "axios";
import IMAGES from '../images';
import { useParams } from 'react-router-dom';
import { axiosURL } from '../util/baseURL';



const MasterOrganizationEdit = () => {
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
    const [checked, setIsChecked] = useState(false);
    const [isactive, setIsActive] = useState("");
    const [organizationlist, setOrganizationList] = useState([]);
    let token = '';
    const [allEntry, setAllEntry] = useState([]);
    

    useEffect(()=>{
		const userToken = localStorage.getItem('userToken');
		 if(userToken){
			 const userType = JSON.parse(userToken);
             console.log(userType);
             token = userType.token;
         }
        
           


		axiosURL.post('/get-organization-info',{organization_id : uParam.id},
                    {headers:{
                  'Authorization':'Bearer ' + token
                  }}).then(res => {
                        console.log("User OrganizationId: -",res)
                        setOrgname(res.data.organization_name)
                        setOrgmail(res.data.organization_email)
                        setOrgphone(res.data.organization_phone)
                        setOrgaddrs(res.data.organization_address)
                        
                        setIsActive(res.data.is_active)
                        if(res.data.is_active === "1"){
                          setIsChecked(true);  
                        } else if(res.data.is_active === "0"){
                          setIsChecked(false);  
                        }
                        
                  }).catch(err => {

                  });

        
    
    console.log(uParam.id);
	},[]);


    const submitForm = (e) => {
            
        const btnPointer = document.querySelector('#profile-btn');
        btnPointer.innerHTML = 'Please wait..';
        btnPointer.setAttribute('disabled', true);
        
        e.preventDefault();
        const userTokenData = JSON.parse( localStorage.getItem("userToken") );

        if (document.getElementById("orgname").value=="" ||  document.getElementById("orgmail").value=="" || document.getElementById("orgphone").value=="" || document.getElementById("orgaddrs").value=="" || document.getElementById("isactive").value=="") {
            
            seterror("Please fill the missing fields");
            setsuccess("");
            btnPointer.innerHTML = '<img id="profile-btn-img" src="'+IMAGES.LoginIcon + '" alt="profile btn"/>Update Profile';
            document.querySelector('#profile-btn-img').setAttribute('class','d-inline-block align-middle me-2');
            btnPointer.removeAttribute('disabled');
            return false;
         } 
        
         const orgData = {
            organization_name:orgname,
            organization_email:orgmail,
            organization_phone:orgphone,  
            organization_address:orgaddrs,
            is_active:checked
        };  
           
               
    axiosURL.post('/update-organization',orgData,{headers:{
                  	'Authorization':'Bearer ' + userTokenData?.token
                  }}).then(res => {
                        console.log("User ID: -",res)
                        setOrgname(res.data.organization_name)
                        setOrgmail(res.data.organization_email)
                        setOrgphone(res.data.organization_phone)
                        setOrgaddrs(res.data.organization_address)
                        setIsChecked(res.data.is_active)
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
           
           

    console.log(orgData);
        
  

      
}

    useEffect(() => {
        console.log(organization); 
      }, [allEntry,organization]);
    
  
       
         function checkedActive(e) { 
      setIsChecked(e.target.value);
     	  
if (document.getElementById("isactive").value === "1")

 {    setIsChecked(false);
        setIsChecked(e.target.checked);
      document.getElementById("isactive").removeAttribute("checked");
      document.getElementById("isactive").removeAttribute("value"); 
      document.getElementById("isactive").setAttribute("value","abc");
        alert("if")       

 } else if (document.getElementById("isactive").value === "0"){  

       setIsChecked(true);
        document.getElementById("isactive").setAttribute("checked",true);
        document.getElementById("isactive").removeAttribute("value");
        document.getElementById("isactive").setAttribute("value","xyz");
        alert("else if") 
        
	   }

}     
 const checkbox = useRef();       
 const handleClick = (e) => {
    if (document.getElementById("isactive").value === "1") {
        setIsChecked(e.target.checked);
      alert('You know JS');
        document.getElementById("isactive").setAttribute("value","abc");
    } else if (document.getElementById("isactive").value === "0"){
      setIsChecked(!e.target.checked);
    }
  }       
        
        
        
        
        
        

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
        <div className="col-md-7"><h1 className="page-title">Edit Organization</h1></div>
    
        </div>
        </div>
        <form className='regForm' action="" onSubmit={submitForm}>
        
        <div className='input-blocks d-flex align-items-center'>
                    <span className="d-inline-block me-4 align-middle"><i className="fa-regular fa-building"></i></span>
                     <div className='d-inline-block align-middle w-100'><label htmlFor="orgname" className='input-label'>Organization Name</label>
                        
                        <input type="text" autoComplete='off' name="orgname" id="orgname" placeholder='Name' value={orgname}
                        onChange={(e) => setOrgname(e.target.value)}

                    />
                    </div>  
                </div>

        <div className='input-blocks d-flex align-items-center'>
                <span className="d-inline-block me-4 align-middle"><img src={IMAGES.LoginUser} alt="Login" /></span>
                <div className='d-inline-block align-middle w-100'><label htmlFor="orgmail" className='input-label'>Organization Email</label>
                    <input type="text" autoCapitalize='off' name="orgmail" id="orgmail" placeholder='email' value={orgmail} 
                        onChange={(e) => setOrgmail(e.target.value)} 

                    />
                </div>
                </div>
                <div className='input-blocks d-flex align-items-center'>
               <span className="d-inline-block me-4 align-middle"><img src={IMAGES.LoginUser} alt="Login" /></span>
                <div className='d-inline-block align-middle w-100'><label htmlFor="orgphone" className='input-label'>Organization Phone</label>
                    <input type="text" autoCapitalize='off' name="orgphone" id="orgphone" placeholder='Phone' value={orgphone}
                        onChange={(e) => setOrgphone(e.target.value)} 

                    />
                </div>
                </div>
                <div className='input-blocks d-flex align-items-center'>
               <span className="d-inline-block me-4 align-middle"><img src={IMAGES.LoginUser} alt="Login" /></span>
                <div className='d-inline-block align-middle w-100'><label htmlFor="orgaddrs" className='input-label'>Organization Address</label>
                    <input type="text" autoCapitalize='off' name="orgaddrs" id="orgaddrs" placeholder='Org Address' value={orgaddrs}
                        onChange={(e) => setOrgaddrs(e.target.value)} 

                    />
                </div>
                </div>
                
             <div className='input-blocks d-flex align-items-center empty-check'>   
             <div className="form-check">
            <input className="form-check-input" type="checkbox" id="isactive" name="isactive" ref={checkbox} onChange={handleClick} value={isactive} />
            <label className="form-check-label" htmlFor="isactive">Is Active</label></div>
             </div>    

                
      
                
                
                <div className='align-items-center w-100'>
                    <div className='SignBtn'>
                        <button id="profile-btn" className='btn btn-secondary' type="submit">
                        <span className="d-inline-block me-2 align-middle"><img id="profile-btn-img" src={IMAGES.LoginIcon} alt="Organization" /></span>Update Organization</button>
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

export default MasterOrganizationEdit