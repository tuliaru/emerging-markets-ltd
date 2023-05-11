import { useState, useEffect } from "react";
import {Link} from "react-router-dom";
import IMAGES from '../images';
import Loader from '../assets/images/infinity-loop.gif'
import axios from 'axios';
import TokenModal from './TokenModal';
//import Registration from './Registration';
import {axiosURL} from '../util/baseURL.js';
import MasterOrganizationEdit from "./MasterOrganizationEdit";

const MasterOrganization = () => {
    
    
    const [AdminUsers, setAdminUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [totalRecords,setTotalRecords] = useState(0)
    let token = '';
   
    
    const [search, setSearch] = useState('');
    
    useEffect(() => {
    const userToken = localStorage.getItem('userToken');
		 if(userToken){
			 const userType = JSON.parse(userToken);
             console.log(userType);
             token = userType.token;
         }
    setLoading(true);
    axiosURL.get('/list-organizations',
                  {headers:{
                  'Authorization':'Bearer ' + token
                  }}
         )
    .then(response => {
    console.log(response?.data)
    setAdminUsers(response?.data?.records);
    setTotalRecords(response?.data?.total_records_found);
    setLoading(false);
    })
    .catch(error => {
         console.log(error?.response?.data?.code);
         
         if (error?.response?.data?.code) {
          setShowModal(true);
          
        }
    })
    },[])

    const okBtnClick = ()=>{
        setShowModal(false);
        localStorage.clear();
        window.location.pathname = '/';
    }

    
  
    return(
         
        
    <>
    {  showModal ? <TokenModal btnCallback={okBtnClick} /> : ''  }
                     
    
      {/*row heading start*/}
        <div className="row mb-2 mb-lg-4">
        <div className="col-md-12 d-lg-flex align-items-center main-hdng">
        <div className="col-md-12"><h1 className="page-title">Master Organization</h1></div>
        
        </div>
        </div>
       
        {/*row heading end*/}
        
        { loading ? <><div className="loader-outer"><img src={Loader} className="loader position-absolute"/></div></> : '' }
        {/*row table cont start*/}
        <div className="light-body-bg shadow-lg py-4 px-4 rounded-4">
        
            <div id="datatables-reponsive_wrapper" className="dataTables_wrapper dt-bootstrap5 no-footer">
            {/*data table header start*/}
            <div className="d-md-flex align-items-center mb-3">
            <div className="col-auto d-block"><h2 className="table-title text-white-50 fw-semibold">User List</h2></div>
            <div className="col-auto d-block me-auto ms-3 ">
            <div className="text-center">
            <div className="dataTables_length"><h5 className="text-info mb-0">{totalRecords} results found</h5>
            </div>
            </div>
            </div>
            
            </div>
            {/*data table header end*/}
            {/*data table start*/}
            <div className="table-responsive">

            <table id="rowcout datatables-column-search-select-inputs" className="table table-striped dataTable" width="100%" aria-describedby="datatables-column-search-select-inputs_info">
            <thead className="thead-dark">
            <tr role="row">
            <th className="sorting align-middle">Organization Name</th>
            <th className="sorting align-middle">Organization Email</th>
            <th className="align-middle">Status</th>
            <th width="70" className="align-middle">Action</th>
            </tr>
            </thead>

            <tfoot>
            <tr>
            <th className="align-middle"><input type="text" 
         placeholder="Search" className="form-control input-sm w-75" 
         onChange ={(e) => {
             setSearch(e.target.value);
         }} /></th>
            <th className="align-middle"><input type="text" placeholder="Search" className="form-control input-sm w-75"
           onChange ={(e) => {
             setSearch(e.target.value);
         }} /></th>
            
            <th className="align-middle">
                <select className="form-select input-sm w-75">
                <option value="All">All</option>
                <option value="Admin">Active</option>
                <option value="Client">Inactive</option>
                </select>
            </th>
            <th className="align-middle">&nbsp;</th>
            
            </tr>
            </tfoot>
            <tbody>
        
        
            {AdminUsers
                     .filter((AdminUser) =>{
             if(search == "") {
                 return AdminUser;
             } else if(AdminUser.Organization.toLowerCase().includes(search.toLowerCase()) ||
               AdminUser.Username.toLowerCase().includes(search.toLowerCase())
               ) {
                 return AdminUser;
             }
         })
                     .map((AdminUser:any, index) => {
             return(
            <tr role="row" className="odd" key={index} data-active={AdminUser["OrganizationIsActive"]}>
            <td className="align-middle" key={index.OrganizationName}>{AdminUser["OrganizationName"]}</td>
            <td className="align-middle" key={index.OrganizationEmail}>{AdminUser["OrganizationEmail"]}</td>
            <td className="align-middle" key={index.OrganizationIsActive}>
                 
                 {AdminUser.OrganizationIsActive === "1" ? "Active" : "Inactive"}
                 </td>
              <td className="align-middle">
                 <Link className="d-inline-block align-middle me-2" to={"/master-edit/" + btoa(AdminUser["OrganizationId"])}>
                <img src={IMAGES.EditIcon} alt="edit"/></Link>
                <button className="d-inline-block align-middle me-1">
                <img src={IMAGES.TrashIcon} alt="trash"/></button>
                
            </td>
            </tr>
             );
            })}
            </tbody>
            </table>
            </div>
            {/*data table end*/}
            {/*pagination start*/}
            
            {/*pagination end*/}
            </div>
        
        </div>
        
        {/*row table cont end*/}
    </>
    );
}
export default MasterOrganization;