import React,{ useState, useEffect } from 'react';
import axios from "axios";
import {axiosURL} from '../util/baseURL.js';

const RegistrationModal = () => {
    
    const [orgname, setOrgname] = useState("");
    const [orgmail, setOrgmail] = useState("");
    const [orgphone, setOrgphone] = useState("");
    const [orgaddrs, setOrgaddrs] = useState("");
    const [error,seterror] = useState("");
    const [success,setsuccess] = useState("");
    const [usertype, setusertype] = useState("");
    
    const [allEntry, setAllEntry] = useState([]);
    
    const [token, setToken] = useState('');
    
    
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
        console.log(token)
        axiosURL.post("/organization", orgData,
                  {headers:{
                  'Authorization':'Bearer ' + token
                  }})
            .then((response) => {
            console.log(response);
        console.log(response.data.sStatus);
        
        
            
        let optionText = response.data.OrganizationName;
        console.log(optionText);
        let optionValue = response.data.OrganizationId;
        console.log(optionValue);
            
        let x = document.getElementById("organization");
        let option = document.createElement("option");
        option.text = optionText;
        option.value= optionValue;
        x.add(option);
            
        if(response?.data?.error){
           seterror(response?.data?.error);
           return false;
        }
        
        if (response.data.sStatus=="0") {
            seterror(response.data.sMessage);
            
        }
        else {
            console.log(response.data.sMessage);
            setsuccess("Organization successfully added");
            
            seterror("");
            setOrgname ("");
            setOrgmail ("");
            setOrgphone ("");
            setOrgaddrs ("");
            
           
            
           
        }
        }).catch(error => {
         console.log(error?.response?.data?.code);
    });
}
                     
                     
  useEffect(() => {
        console.log(allEntry); 
      }, [allEntry]);                   
       
    useEffect(() => {
      }, [error]);
      
    useEffect(() => {
      }, [success]);
  
   useEffect(() => {
        const userToken = localStorage.getItem('userToken');
		 if(userToken){
			 const userType = JSON.parse(userToken);
             console.log(userType);
             setToken(userType.token);
            
         }
      }, []);                    
                     
                    
     const closebuyReqModal = () => {
        setsuccess("");
     }
                     
                     
                     
    
    return(
            
         <div className="modal fade addorgModal" id="addOrgModal" tabIndex="-1" aria-labelledby="addOrgModal" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="addOrgModal">Add Organization</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closebuyReqModal}></button>
      </div>
      <div className="modal-body">
       <form className="org_modal" onSubmit={submitOrgForm}>
        <div className="input-blocks full-blocks d-flex align-items-center w-100"><span className="d-inline-block me-4 align-middle"><i className="fa-regular fa-building"></i></span><div className="d-inline-block align-middle w-100"><label htmlFor="orgname" className="input-label">Organization Name</label><input type="text" autoCapitalize="off" name="orgname" id="orgname" placeholder="Organization Name" 
        value={orgname} 
        onChange={(e) => setOrgname(e.target.value)} /></div></div>
        
        <div className="input-blocks full-blocks d-flex align-items-center w-100"><span className="d-inline-block me-4 align-middle"><i className="fa-solid fa-envelope"></i></span><div className="d-inline-block align-middle w-100"><label htmlFor="orgmail" className="input-label">Organization Email</label><input type="text" autoCapitalize="off" name="orgmail" id="orgmail" placeholder="Organization Email" 
        value={orgmail} 
        onChange={(e) => setOrgmail(e.target.value)} /></div></div>
        
        
        <div className="input-blocks full-blocks d-flex align-items-center w-100"><span className="d-inline-block me-4 align-middle"><i className="fa-solid fa-phone"></i></span><div className="d-inline-block align-middle w-100"><label htmlFor="orgphone" className="input-label">Organization Phone</label><input type="text" autoCapitalize="off" name="orgphone" id="orgphone" placeholder="Organization Phone" 
        value={orgphone} 
        onChange={(e) => setOrgphone(e.target.value)} /></div></div>
        
        <div className="input-blocks full-blocks d-flex align-items-center w-100"><span className="d-inline-block me-4 align-middle"><i className="fa-solid fa-location-dot"></i></span><div className="d-inline-block align-middle w-100"><label htmlFor="orgaddrs" className="input-label">Organization Address</label><input type="text" autoCapitalize="off" name="orgaddrs" id="orgaddrs" placeholder="Organization Address" 
        value={orgaddrs} 
        onChange={(e) => setOrgaddrs(e.target.value)} /></div></div>
        
        <div className="modal-footer">
        <button type="submit" className="btn btn-secondary" >Add Organization</button>
        
      </div>
            
        <div className="errorMessage">{error}</div>
         <div className="successMessage">{success}</div>    
        </form>
      </div>
      
    </div>
  </div>
</div> 
        
    );
}

export default RegistrationModal;