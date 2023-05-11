import React,{ useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import axios from "axios";
import IMAGES from '../images';
import { useParams } from 'react-router-dom';
import { axiosURL } from '../util/baseURL';



const Userprofile = () => {
    const [fname, setFname] = useState("");
    const [mname, setMname] = useState("");
    const [lname, setLname] = useState("");
    const qParam = useParams ();
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
        
            axiosURL.get('/getorganizations',{headers:{
                'Authorization':'Bearer ' + userTokenData?.token
            }}).then(res => {
                  console.log("organizationlist: -",res.data)
                  setOrganizationList(res.data)
                  
            }).catch(err => {

            });


		axiosURL.post('/user-profile',{profile_id : qParam.id },{headers:{
                  	'Authorization':'Bearer ' + userTokenData?.token
                  }}).then(res => {
                        console.log("User ID: -",res)
                        setFname(res.data.first_name)
                        setMname(res.data.middle_name)
                        setLname(res.data.last_name)
                        setCompphone(res.data.phone)
                        setOrganization(res.data.organization_id)
                        
                  }).catch(err => {

                  });
              }

    console.log(qParam.id);
	},[]);


    const submitForm = (e) => {
        e.preventDefault();

        if (document.getElementById("fname").value=="" || document.getElementById("mname").value=="" ||  document.getElementById("organization").value=="" || document.getElementById("compphone").value==""){
            seterror("Please fill the missing fields")
            setsuccess("")
            return false;
         }

        const userData = {
            first_name:fname,
            middle_name:mname,
            last_name:lname,  
          
           
            organization_id:organization,
            company_phone:compphone,
            user_type_id:usertype,
        };

    console.log(userData)
        axios.post("https://eml.tulieservices.org/server/wp-json/wp/v2/registration", userData).then((response) => {
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
            setLname ("")
           
            setOrganization ("");
            setCompphone ("")
            
        }
        }

        );
}

    useEffect(() => {
        console.log(organization); 
      }, [allEntry,organization]);
    
    const submitOrgForm = (e) => {
        e.preventDefault();

        if(document.getElementById("orgname").value=="" || document.getElementById("orgmail").value=="" || document.getElementById("orgphone").value=="" || document.getElementById("orgaddrs").value==""){
            seterror("Please fill the missing fields")
            setsuccess("")
            return false;
         }




        const orgData = {
            organization_name:orgname,
            organization_email:orgmail,
            organization_phone:orgphone,  
            organization_address:orgaddrs
        };


    
        

    console.log(orgData)
        axios.get("https://eml.tulieservices.org/server/wp-json/wp/v2/organization", orgData).then((response) => {
        console.log(response.data.sStatus);
        if (response.data.sStatus=="0") {
            seterror(response.data.sMessage);
        }
        else {
            console.log(response.data.sMessage);
            setsuccess(response.data.sMessage);
            seterror("");
            setOrgname ("");
            setOrgmail ("");
            setOrgphone ("");
            setOrgaddrs ("");
            
        }
        }

        );
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
        <div className="col-md-7"><h1 className="page-title">User Profile</h1></div>
    
        </div>
        </div>
        <form className='regForm' action="" onSubmit={submitForm}>

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
                <div className='input-blocks d-flex align-items-center'>
                    <span className="d-inline-block me-4 align-middle"><i className="fa-regular fa-building"></i></span>
                     <div className='d-inline-block align-middle w-100'><label htmlFor="compname" className='input-label'>Organization Name</label>
                        <select id="organization" name="organization" value={organization} onChange={(e) => setOrganization(e.target.value)}>
                            <option value="">Select an Organization</option>
                            {
                                organizationlist.map((item,i) => {
                                    return (<option value={item.OrganizationId} key={i}>{item.OrganizationName}</option>)
                                })
                            }
                        </select>
                    </div>  
                </div>
                

                
      
                
                <div className='d-flex w-100'>&nbsp;</div>
                <div className='align-items-center w-100'>
                    <div className='SignBtn'>
                        <button className='btn btn-secondary' type="submit">
                        <span className="d-inline-block me-2 align-middle"><img src={IMAGES.LoginIcon} alt="Register" /></span>Update Profile</button>
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

export default Userprofile