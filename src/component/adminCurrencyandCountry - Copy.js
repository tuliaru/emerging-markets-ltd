import { useState, useEffect } from "react";
//import IMAGES from '../images';
import Loader from '../assets/images/infinity-loop.gif';
import axios from 'axios';
import TokenModal from './TokenModal';
import {axiosURL} from '../util/baseURL.js';

const AdminCurrencyAndCountry = () => {
    const [totalRecords,setTotalRecords] = useState(0)
    const [ExchangeDatas, setExchangeDatas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pagination,setPagination] = useState(0);
    let token = '';
    const userToken = JSON.parse( localStorage.getItem("userToken") );
    const okBtnClick = ()=>{
      setShowModal(false);
      localStorage.removeItem('userToken');
      window.location.pathname = '/';
    }

    const [search, setSearch] = useState('');

    const getListsOfCountryCurrency = ( pg,country="",currency="",region="" )=> {
        setLoading(true);
        axiosURL.get('/getcountrycurrency',{headers:{
        'Authorization':'Bearer ' + userToken?.token
        },params:{page: pg, country,currency,region}}).then(res => {
        
            console.log(res?.data);
            setExchangeDatas(res?.data?.lists_of_country_currency); 
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
      
      var country = document.querySelector(".search-country").value != "" ?  
      document.querySelector(".search-org").value : "";
      var currency = document.querySelector(".search-currency").value != "" ?  
      document.querySelector(".search-name").value : "";
      var region = document.querySelector(".search-region").value != "" ? 
      document.querySelector(".search-usertype").value : "";
      getListsOfCountryCurrency(pageNo);
       
    }
    
    const handleSearch = () => {
        
      getListsOfCountryCurrency(1);
       
    }

    useEffect(() => {
        
		 /*if(userToken){
			 const userType = JSON.parse(userToken);
             console.log(userType);
             token = userType.token;
         }
        setLoading(true);
        axiosURL.get("/getcountrycurrency", 
                  {headers:{
                  'Authorization':'Bearer ' + token
                  }})
        .then((response) => {
          setExchangeDatas(response.data); 
            console.log(response);
            setPagination(res?.data?.pagination);
            setTotalRecords(res?.data?.total_records_found)
            setLoading(false);
        })
        .catch(error => {
         console.log(error?.response?.data?.code);
         
         if (error?.response?.data?.code) {
          setShowModal(true);
          
        }
    })*/
      getListsOfCountryCurrency(1);
    },[]);
        
    
           return(
                     
             <>
            {showModal ? <TokenModal btnCallback={okBtnClick} /> : ''}
            
   
          
      {/*row heading start*/}
        <div className="row mb-2 mb-lg-4">
        <div className="col-md-12 d-lg-flex align-items-center main-hdng">
        <div className="col-md-12"><h1 className="page-title">Countries &amp; Currency Master </h1></div>
        
        </div>
        </div>
       
        {/*row heading end*/}
        
        { loading ? <><div className="loader-outer"><img src={Loader} className="loader position-absolute"/></div></> : '' }
        {/*row table cont start*/}
        <div className="light-body-bg shadow-lg py-4 px-4 rounded-4">
        
            <div id="datatables-reponsive_wrapper" className="dataTables_wrapper dt-bootstrap5 no-footer">
            {/*data table header start*/}
            <div className="d-md-flex align-items-center mb-3">
            
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

            <table id="datatables-column-search-select-inputs" className="table table-striped dataTable" width="100%" aria-describedby="datatables-column-search-select-inputs_info">
            <thead className="thead-dark">
            <tr role="row">
            <th className="sorting align-middle">Country Name</th>
            <th className="sorting align-middle">Currency</th>
            <th className="align-middle">Region</th>
            <th width="60" className="align-middle">&nbsp;</th>
            
            </tr>
            </thead>

           <tfoot>
            <tr>
            <th className="align-middle"><input type="text" placeholder="Search" className="form-control input-sm w-75 search-country" onChange ={(e) => {
              if(e.target.value.length == 3){

                 getListsOfCountryCurrency(1,e.target.value,"","")
             } else if(e.target.value.length == 0){
                 
                getListsOfCountryCurrency(1,"","","");
                 
             }
         }} /></th>
            <th className="align-middle"><input type="text" placeholder="Search" className="form-control input-sm w-75 search-currency" onChange ={(e) => {
             if(e.target.value.length == 3){
                getListsOfCountryCurrency(1,"",e.target.value,"")
            }else if(e.target.value.length == 0){
                 
                getListsOfCountryCurrency(1,"","","");
                 
             }
         }} /></th>
            <th className="align-middle"><input type="text" placeholder="Search" className="form-control input-sm w-75 search-region" onChange ={(e) => {
             if(e.target.value.length == 3){
                getListsOfCountryCurrency(1,"","",e.target.value)
            }else if(e.target.value.length == 0){
                 
                getListsOfCountryCurrency(1,"","","");
                 
             }
         }} /></th>
             
             <th className="align-middle"><button className="btn btn-sm btn-primary d-none clmn-srch" onClick={handleSearch}>Search</button>
            <button className="btn btn-sm btn-primary clear-srch" 
        onClick= {() => {
                  document.querySelector(".search-country").value = "";
                  document.querySelector(".search-currency").value = "";
                  document.querySelector(".search-region").value = "";
                  getListsOfCountryCurrency(1);
                 }}>Clear Search</button></th>
            
            </tr>
            </tfoot>
            <tbody>

            
             {ExchangeDatas
                     .filter((ExchangeData) =>{
             if(search == "") {
                 return ExchangeData;
             } else if(ExchangeData.Organization.toLowerCase().includes(search.toLowerCase()) ||
               ExchangeData.Username.toLowerCase().includes(search.toLowerCase())
               ) {
                 return ExchangeData;
             }
         })
                     .map((ExchangeData:any, index) => {
             return(
            <tr role="row" className="odd" key={index}>
            <td className="align-middle" key={index.Countryname}>{ExchangeData["Countryname"]}</td>
            <td className="align-middle" key={index.Currencycode}>{ExchangeData["Currencycode"]}</td>
            <td className="align-middle" key={index.Region}>{ExchangeData["Region"]}</td>
            <td className="align-middle">&nbsp;</td>
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

export default AdminCurrencyAndCountry;