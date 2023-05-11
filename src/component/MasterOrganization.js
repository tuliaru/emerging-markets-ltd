import { useState, useEffect } from "react";
import { Modal } from 'bootstrap'
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
    const [totalRecords,setTotalRecords] = useState(0);
    const [pagination,setPagination] = useState(0);
    const [smasterorgname, setSearchMasterOrgName]=useState("");
    const [smasterorgid, setSearchMasterOrgId]=useState("");
    const [smasterorgmail, setSearchMasterOrgMail]=useState("");
    const [smasteroractive, setSearchMasterOrgActive]=useState("");
    
    let token = '';
    const userToken = JSON.parse( localStorage.getItem("userToken") );
    const okBtnClick = ()=>{
      setShowModal(false);
      localStorage.removeItem('userToken');
      window.location.pathname = '/';
    }
    
    const [search, setSearch] = useState('');
    
    const getListsOfMasterOrg = ( pg, organizationname="",organizationid="",organizationemail="",status="")=> {
        setLoading(true);
        axiosURL.get('/list-organizations',{headers:{
        'Authorization':'Bearer ' + userToken?.token
        },params:{page: pg,
                 organizationname,
                  organizationid,
                  organizationemail,
                  status}})
                  .then(res => {
            console.log(res?.data);
            setAdminUsers(res?.data?.records); 
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
        
      var organizationname = document.querySelector(".search-orgname").value != "" ?  document.querySelector(".search-orgname").value : "";
      
      var organizationemail = document.querySelector(".search-orgmail").value != "" ?  document.querySelector(".search-orgmail").value : "";
      var status = document.querySelector(".search-orgstatus").value != "All" ?  document.querySelector(".search-orgstatus").value : "";
      getListsOfMasterOrg(pageNo,organizationname,organizationemail,status);
      
       
    }
               
    const handleSearch = () => {
        
      getListsOfMasterOrg(1);
       
    }

    const confirmModal = (organizationId) => {
        document.getElementById("ok-btn").setAttribute("data-id",organizationId);
        let modalBox = new Modal(document.getElementById('deleteOrganizationModal'));
        modalBox.show();
    }

    const deleteOrganization = (param) => {
        param.setAttribute("disabled",true);
        let organizationId = param.getAttribute('data-id');
        
        axiosURL.post('/users-under-organization',{organizationId},{headers:{
        'Authorization':'Bearer ' + userToken?.token
        }})
                  .then(res => {
            document.querySelector(".cancel-confirm-btn").click();
            if(res.data.status=="0"){
                 param.removeAttribute("disabled",false);
                 document.querySelector(".deleted-organization-name").innerHTML = 'Organization "' + res.data.organization + '" has been deleted successfully';
                 new Modal(document.getElementById("successOrganizationDeleteModal")).show();
            }
            else{
                new Modal(document.getElementById("showOrganizationUserModal")).show();
                        
                let listsHTML = '<h4 style="color:#ffffff;">Before delete the organization "' + res.data.organization +'" delete all the users listed below</h4><table class="table mx-3 text-start text-white" style="width: 90%; margin: 0 auto;">';
                for(var i=0; i<res.data.lists_of_users.length; i++)
                {
                    listsHTML += '<tr><td className="align-left">'+ res.data.lists_of_users[i].first_name +" " + res.data.lists_of_users[i].last_name +'</td><td><img src="' + IMAGES.TrashIcon + '" alt="trash"/></td></tr>';
                }
                /*listsHTML += res.data.lists_of_users.map(function(user){
                    return '<tr><td className="align-left">'+ user.first_name +" " + user.last_name +'</td><td><img src="' + IMAGES.TrashIcon + '" alt="trash"/></td></tr>';
                });*/
                listsHTML += '</table>';
                document.querySelector(".show-lists").innerHTML = listsHTML;
                document.querySelector(".delete-all").setAttribute("data-id",organizationId);
                document.querySelector(".delete-all").setAttribute("data-name",res.data.organization);
                param.removeAttribute("disabled",false);
            }
            
                        
        }).catch(err => {
            if(err?.res?.data?.code == "invalid_or_expired_token"){
                setShowModal(true);
                
            }
        });
    }

    const handleDeleteAll = (param) => {
        param.setAttribute("disabled",true);
        let organizationId = param.getAttribute('data-id');
        let organizationName = param.getAttribute('data-name');
        axiosURL.post('/delete-users-with-organization',{organizationId},{headers:{
        'Authorization':'Bearer ' + userToken?.token
        }})
        .then(res => {
            document.querySelector(".delete-modal-close").click();
            document.querySelector(".deleted-organization-name").innerHTML = 'Organization "' + organizationName + '" has been deleted successfully with all the users under this';
            new Modal(document.getElementById("successOrganizationDeleteModal")).show();
            param.removeAttribute("disabled",false);
                        
        })
        .catch(err => {
            if(err?.res?.data?.code == "invalid_or_expired_token"){
                setShowModal(true);
                
            }
        });
    }

    
    useEffect(() => {
    getListsOfMasterOrg(1);
    },[])



    
  
    return(
         
        
    <>
    {  showModal ? <TokenModal btnCallback={okBtnClick} /> : ''  }
                     
    
        <div className="modal fade" id="deleteOrganizationModal" tabIndex="-1">
            <div className="modal-dialog ">
                <div className="modal-content">
            <div className="modal-header">
            <h1 className="modal-title fs-5 text-start" id="deleteOrganizationModal">Are you sure you want to delete this organization?</h1>
            <button type="button" className="btn-close btn-pos" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            
                   
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary cancel-confirm-btn me-2" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" id="ok-btn" data-id="" className="btn btn-primary" onClick={(e)=>deleteOrganization(e.target)}>Ok</button>
                        {/*<button type="button" id="ok-btn" data-id="" class="btn btn-primary">Ok</button>*/}
                    </div>
                </div>
            </div>
        </div>

        <div className="modal fade deleteTableModal" id="showOrganizationUserModal" tabIndex="-1">
            <div className="modal-dialog modal-large modal-dialog-centered modal-dialog-scrollable ">
                <div className="modal-content">
              
                    <div className="modal-body show-lists p-0"></div>
                    <div className="modal-footer border-top border-info">            
                        <button type="button" className="btn btn-secondary delete-modal-close" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary ms-3 delete-all" onClick={(e)=>handleDeleteAll(e.target)} data-id="" data-name="">Delete All Users</button>
                        
                    </div>
                </div>
            </div>
        </div>

        <div className="modal fade deleteTableModal" id="successOrganizationDeleteModal" tabIndex="-1">
            <div className="modal-dialog modal-large modal-dialog-centered modal-dialog-scrollable ">
                <div className="modal-content">
                
                    <div className="modal-body show-lists p-0 deleted-organization-name p-3">
                            
                    </div>
                    <div className="modal-footer border-top border-info">            
                        <button type="button" className="btn btn-secondary delete-modal-close" data-bs-dismiss="modal" onClick={ (e)=> getListsOfMasterOrg(1) }>Close</button>
                        
                        
                    </div>
                </div>
            </div>
        </div>

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
            <div className="d-flex align-items-center mb-3">
            <div className="col-auto d-block"><h2 className="table-title text-white-50 fw-semibold">Organization List</h2></div>
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
            <th width="120" className="align-middle">Action</th>
            </tr>
            </thead>

            <tfoot>
            <tr>
            <th className="align-middle"><input type="text" 
         placeholder="Search" className="form-control input-sm w-75 search-orgname" 
         onChange ={(e) => {
              if(e.target.value.length == 3){

                 getListsOfMasterOrg(1,e.target.value,"","","")
             } else if(e.target.value.length == 0){
                 
                getListsOfMasterOrg(1,"","","","");
                 
             }
         }} /></th>
           
            <th className="align-middle"><input type="text" placeholder="Search" className="form-control input-sm w-75 search-orgmail"
           onChange ={(e) => {
             if(e.target.value.length == 3){
                getListsOfMasterOrg(1,"","",e.target.value,"")
            }else if(e.target.value.length == 0){
                 
                getListsOfMasterOrg(1,"","","","");
                 
             }
         }} /></th>
            
            <th className="align-middle">
                <select className="form-select input-sm w-75 search-orgstatus" onChange={(e)=>{
                    e.target.value == "" ? getListsOfMasterOrg(1,"","","","") : getListsOfMasterOrg(1,"","","",e.target.value);
                    
                }}>
                <option value="">All</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
                </select>
            </th>
            <th className="align-middle"><button className="btn btn-sm btn-primary d-none clmn-srch" onClick={handleSearch}>Search</button>
            <button className="btn btn-sm btn-primary clear-srch" 
        onClick= {() => {
                  document.querySelector(".search-orgname").value = "";
                  document.querySelector(".search-orgmail").value = "";
                  document.querySelector(".search-orgmail").value = "";
                  document.querySelector(".search-orgstatus").value = "";
                  getListsOfMasterOrg(1);
                 }}>Clear Search</button></th>
            
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
            <tr role="row" className="odd" key={index} data-active={AdminUser["OrganizationIsActive"]} data-organization-id={btoa(AdminUser["OrganizationId"])}>
            <td className="align-middle" key={index.OrganizationName}>{AdminUser["OrganizationName"]}</td>
            
            <td className="align-middle" key={index.OrganizationEmail}>{AdminUser["OrganizationEmail"]}</td>
            <td className="align-middle" key={index.OrganizationIsActive}>
                 
                 {AdminUser.OrganizationIsActive === "1" ? "Active" : "Inactive"}
                 </td>
              <td className="align-middle text-center">
                 <Link className="d-inline-block align-middle me-2" to={"/master-edit/" + btoa(AdminUser["OrganizationId"])}>
                <img src={IMAGES.EditIcon} alt="edit"/></Link>
                {
                    AdminUser["OrganizationId"] != 49 ? <button className="d-inline-block align-middle me-1" onClick={(e)=>confirmModal(btoa(AdminUser["OrganizationId"]))}>
                <img src={IMAGES.TrashIcon} alt="trash"/></button> : ''
                }
                
                
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
export default MasterOrganization;