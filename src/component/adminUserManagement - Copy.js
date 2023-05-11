import { useState, useEffect } from "react";
import {Link} from "react-router-dom";
import IMAGES from '../images';
import Loader from '../assets/images/infinity-loop.gif'
import axios from 'axios';
import TokenModal from './TokenModal';
//import Registration from './Registration';
import {axiosURL} from '../util/baseURL.js';
import RegistrationModalUser from "./RegistrationModalUser";

const AdminUserManagement = () => {
    
    
    const [AdminUsers, setAdminUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pagination,setPagination] = useState(0);
    const [totalRecords,setTotalRecords] = useState(0);
    const [sorganization, setSearchOrganization]=useState("");
    const [sname, setSearchName]=useState("");
    const [susertype, setSearchUsertype]=useState("");
    const [suserstatus, setSearchUserstatus]=useState("");
    let token = '';
    const userToken = JSON.parse( localStorage.getItem("userToken") );
    const okBtnClick = ()=>{
      setShowModal(false);
      localStorage.removeItem('userToken');
      window.location.pathname = '/';
    }
    const [search, setSearch] = useState('');
    
    
     const getListsOfUsers = ( pg, organization="",username="",usertype="",status="")=> {
        setLoading(true);
        axiosURL.get('/getusers',{headers:{
        'Authorization':'Bearer ' + userToken?.token
        },params:{page: pg,
                 organization:sorganization,
                  username:sname,
                  usertype:susertype,
                  status:suserstatus}})
                  .then(res => {
            console.log(res?.data);
            setAdminUsers(res?.data?.listsofusers); 
            setPagination(res?.data?.pagination);
            setTotalRecords(res?.data?.total_records_found)
            setLoading(false);
        }).catch(err => {
            if(err?.res?.data?.code == "invalid_or_expired_token"){
                setShowModal(true);
                
            }
        });
    }
    
    const handlePagination = (pageNo) => {
        
      getListsOfUsers(pageNo);
       
    }
               
    const handleSearch = () => {
        
      getListsOfUsers(1);
       
    }
    
    const handleSearchUsertype = (param) =>{
     getListsOfUsers(1,"","",param,"")
      
    }
    
    useEffect(() => {
    getListsOfUsers(1);
    },[])

   
  
    return(
         
        
    <>
    {  showModal ? <TokenModal btnCallback={okBtnClick} /> : ''  }
                     
    <RegistrationModalUser/>
      {/*row heading start*/}
        <div className="row mb-2 mb-lg-4">
        <div className="col-md-12 d-lg-flex align-items-center main-hdng">
        <div className="col-md-7"><h1 className="page-title">User Management</h1></div>
        <div className="col-md-5 d-flex justify-content-end">
        <button type="button" className="btn btn-secondary me-3" data-bs-toggle="modal" data-bs-target="#addOrgModal">Add Organization <i className="ms-2 fa-solid fa-plus"></i></button>
        <a className="btn btn-secondary" href="/registration">Add User <i className="ms-2 fa-solid fa-plus"></i></a>
        </div>
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
            <th className="sorting align-middle">Organization</th>
            <th className="sorting align-middle">User Name</th>
            <th className="align-middle">User Type</th>
            <th className="align-middle">Status</th>
            <th className="align-middle">Last Login</th>
            <th className="align-middle">Register type</th>
            <th className="align-middle">Last modified</th>
            <th className="align-middle">Action</th>
            </tr>
            </thead>

            <tfoot>
            <tr>
            <th className="align-middle"><input type="text" 
         placeholder="Search" className="form-control input-sm w-75" 
         onChange ={(e) => {
             setSearchOrganization(e.target.value);
             if(e.target.value.length == 3){
                 document.querySelector(".clmn-srch").click();
             } else if(e.target.value.length == 0){
                 setSearchOrganization("");
                 document.querySelector(".clmn-srch").click();
                 
             }else if(e.target.value.length == 1){
                 setSearchOrganization("");
                
                 
             }
         }} />
                 </th>
            <th className="align-middle"><input type="text" placeholder="Search" className="form-control input-sm w-75"
           onChange ={(e) => {
             setSearchName(e.target.value);
         }} /></th>
            <th className="align-middle">
                <select className="form-select input-sm user_select" onChange ={(e) => {
             handleSearchUsertype(e.target.value);
         }}>
                <option value="All">All</option>
                <option value="2">Admin</option>
                <option value="0">User</option>
                </select>
            </th>
            <th className="align-middle">
                <select className="form-select input-sm w-75">
                <option value="All">All</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
                </select>
            </th>
            <th className="align-middle"><button className="btn btn-sm btn-primary d-none clmn-srch" onClick={handleSearch}>Search</button></th>
            <th className="align-middle">&nbsp;</th>
            <th className="align-middle">&nbsp;</th>
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
            <tr role="row" className="odd" key={index}>
            <td className="align-middle" key={index.Organization}>{AdminUser["Organization"]}</td>
            <td className="align-middle" key={index.Username}>{AdminUser["Username"]}</td>
            <td className="align-middle" key={index.UserType}>{AdminUser["UserType"]}</td>
            <td className="align-middle" key={index.Status}>{AdminUser["Status"]}</td>
            <td className="align-middle" key={index.Lastlogin}>{AdminUser["Lastlogin"]}</td>
            <td className="align-middle">Register Type</td>
            <td className="align-middle">Last modified</td>
              <td className="align-middle">
                 <Link className="d-inline-block align-middle me-2" to={"/user-profile/" + AdminUser["ID"]}>
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
             <nav aria-label="Page navigation example">
                <ul className="pagination pagination-sm justify-content-end mt-4">
                    
                        
                             {[...Array(pagination)].map((x, i) =>
                                <li className="page-item" key={i} onClick={()=>handlePagination(i+1)}>
                                <a className="page-link" href="javascript:void(0)">{i+1}</a>
                            </li>
                          )}

                </ul>
            </nav>
            {/*pagination end*/}
            </div>
        
        </div>
        
        {/*row table cont end*/}
    </>
    );
}
export default AdminUserManagement;