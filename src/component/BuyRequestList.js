import { useState, useEffect } from "react";
import {Link} from "react-router-dom";
import IMAGES from '../images';
import Loader from '../assets/images/infinity-loop.gif'
import axios from 'axios';
import TokenModal from './TokenModal';
//import Registration from './Registration';
import {axiosURL} from '../util/baseURL.js';


const BuyRequestList = () => {
    
    
    const [AdminUsers, setAdminUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [totalRecords,setTotalRecords] = useState(0);
    const [pagination,setPagination] = useState(0);
    let token = '';
    const userToken = JSON.parse( localStorage.getItem("userToken") );
    
    const [search, setSearch] = useState('');
    
    
    const getListsOfBuyRequest = ( pg )=> {
        setLoading(true);
        axiosURL.get('/buy-request-lists',{headers:{
        'Authorization':'Bearer ' + userToken?.token
        },params:{page: pg}}).then(res => {
        
            console.log(res?.data);
            setAdminUsers(res?.data?.lists_of_buy_request); 
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
        
      getListsOfBuyRequest(pageNo);
       
    }
    
    useEffect(() => {
    /*const userToken = localStorage.getItem('userToken');
		 if(userToken){
			 const userType = JSON.parse(userToken);
             console.log(userType);
             token = userType.token;
         }
    setLoading(true);
    axiosURL.get('/buy-request-lists',
                  {headers:{
                  'Authorization':'Bearer ' + token
                  },params:{page: pg}}).then(response => {
    console.log(response?.data)
    setAdminUsers(response?.data?.lists_of_buy_request);
    setTotalRecords(response?.data?.total_records_found);
    setLoading(false);
    })
    .catch(error => {
         console.log(error?.response?.data?.code);
         
         if (error?.response?.data?.code) {
          setShowModal(true);
          
        }
    })*/
    getListsOfBuyRequest(1);
    },[]);

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
        <div className="col-md-12"><h1 className="page-title">Buy Request Lists</h1></div>
        
        </div>
        </div>
       
        {/*row heading end*/}
        
        { loading ? <><div className="loader-outer"><img src={Loader} className="loader position-absolute"/></div></> : '' }
        {/*row table cont start*/}
        <div className="light-body-bg shadow-lg py-4 px-4 rounded-4">
        
            <div id="datatables-reponsive_wrapper" className="dataTables_wrapper dt-bootstrap5 no-footer">
            {/*data table header start*/}
            <div className="d-flex align-items-center mb-3">
            <div className="col-auto d-block"><h2 className="table-title text-white-50 fw-semibold">Buy Request List</h2></div>
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
            <th className="sorting align-middle">Request Person Name</th>
            <th className="align-middle">Request Date</th>
            <th className="align-middle">View</th>
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
            
            
            <th className="align-middle">&nbsp;</th>
            <th className="align-middle">&nbsp;</th>
            
            </tr>
            </tfoot>
            <tbody>
        
        
            {AdminUsers.map((AdminUser:any, index) => {
             return(
            <tr role="row" className="odd" key={index}>
            <td className="align-middle" key={index.organization}>{AdminUser["organization"]}</td>
            <td className="align-middle" key={index.who_request}>{AdminUser["who_request"]}</td>
            <td className="align-middle" key={index.buy_request_date}>{AdminUser["buy_request_date"]}</td>
            <td className="align-middle">
            <Link className="d-inline-block align-middle me-2" to={"/buy-request-view/" + AdminUser["row_id"]}>
                <i className="fa-solid fa-eye fa-lg text-white"></i></Link>
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
export default BuyRequestList;