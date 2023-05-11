import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import {Link} from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker.min";
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import IMAGES from '../images';
import Loader from '../assets/images/infinity-loop.gif'
import axios from 'axios';
import {axiosURL} from '../util/baseURL.js';
import TokenModal from './TokenModal';


const UserDashboard = () => {
    
    const [totalRecords,setTotalRecords] = useState(0)
    const [startDate, setStartDate] = useState(new Date());
    const [searchDate, setSearchDate] = useState(new Date());
    const [currentPage,setCurrentPage] = useState(1);
    const [error,setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination,setPagination] = useState(0);
    const [ExchangeDatas, setExchangeDatas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [regionfilter, setRegionFilter] = useState('0');
    const [search, setSearch] = useState('');
    const [options, setOptions] = useState([]);
    const [select, setSelect] = useState("");
    const [searchdisable, setSearchDisable] = useState(true);
    const [latestUploadedDate, setLatestUploadedDate] = useState("");

    const orderByCountry = useRef();
    const orderByCurrency = useRef();
    const paginationRef = useRef();
    
    
    const filterBy = () => true;

    const userToken = JSON.parse( localStorage.getItem("userToken") );
    
    
    useEffect(() => {

        let d = new Date(searchDate);
        let month = d.getMonth() + 1;
        let day = d.getDate();
        let year = d.getFullYear();
        month = month.toString();
        day = day.toString();
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
        let sDate = [year,month,day].join('-');

        getListsOfLatestRates(1,sDate,regionfilter,select);
    },[]);
    
    useEffect(() => {
        
            
    },[error,showModal]);
     //let latestUploadedDate = "";
    const getListsOfLatestRates = ( pg,search="",region="",q,orderByCountry="",orderByCurrency="" )=> {
        setLoading(true);
       
        axiosURL.get('/get-latest-rates',{headers:{
        'Authorization':'Bearer ' + userToken?.token
        },params:{page: pg,search_date:search,region,q,orderByCountry,orderByCurrency}}).then(res => {
        console.log(res);
            if(res?.data?.latest_uploaded_date != ""){
                setLatestUploadedDate(res?.data?.latest_uploaded_date);
            }
            else{
                setLatestUploadedDate("");
                
            }
            
            setRegionFilter(region);
            setExchangeDatas(res?.data?.lists_of_latest_rates);
            setPagination(res?.data?.pagination);
            setTotalRecords(res?.data?.total_records_found);
            setLoading(false);
           
        }).catch(err => {
            if(err?.response?.data?.code == "invalid_or_expired_token"){
                setShowModal(true);
                
            }
        });
    }

    const handleSearchCountryOrCurrency = (queryString) => {
       
        setIsLoading(true);
         setSearchDisable(false);
        [...document.getElementsByClassName('region-btn')].forEach((el,i) => {
            console.log(el)
            if(el.classList.contains("active-region")){
                el.classList.remove("active-region");
            }
            if(i==0){
                el.classList.add("active-region");
            }
        })
        setOptions([]);
        /*getListsOfLatestRates(1,'','',queryString)
        let items = [{label:"USD"},{label:"USDM"},{label:"USDMMMMM"}];
        setOptions(items);
        setIsLoading(false);*/
        axiosURL.post('/search-by-country-or-currency',{q:queryString},{headers:{
            'Authorization':'Bearer ' + userToken?.token
        }}).then(res => {
            setOptions(res?.data);
            setIsLoading(false);
        }).catch(err => {
                if(err?.response?.data?.code == "invalid_or_expired_token"){
                            setShowModal(true);
                            
                        }
                        
        })
    }
    const handleInputChange = (selected) => {
        console.log(selected)
        if(selected[0]?.label){
            setSelect(selected[0].label);
        }
    }
    
    

    const handleClickSearch = (item) => {

        let d = new Date(searchDate);
        let month = d.getMonth() + 1;
        let day = d.getDate();
        let year = d.getFullYear();
        month = month.toString();
        day = day.toString();
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
        let filterDate = [year,month,day].join('-');

        getListsOfLatestRates(1,filterDate,"",item)
    }
    
    const okBtnClick = ()=>{
        setShowModal(false);
        localStorage.clear();
        window.location.pathname = '/';
    }

    const handleDateChange = (dt) => {
        
        let d = new Date(dt);
        let month = d.getMonth() + 1;
        let day = d.getDate();
        let year = d.getFullYear();
        month = month.toString();
        day = day.toString();
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
        let setChangedDate = [year,month,day].join('-');
       
        setSearchDate(new Date(setChangedDate));
        getListsOfLatestRates(1,setChangedDate,regionfilter,select)
        
    }

    const handleSearch = (filterDateValue) => {
        let d = new Date(filterDateValue);
        let month = d.getMonth() + 1;
        let day = d.getDate();
        let year = d.getFullYear();
        month = month.toString();
        day = day.toString();
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
        let sDate = [year,month,day].join('-');
        getListsOfLatestRates(1,sDate,regionfilter,select);

    }

    const handlePagination = (pageNo,filterDate,regionfilter,select) => {
        let d = new Date(filterDate);
        let month = d.getMonth() + 1;
        let day = d.getDate();
        let year = d.getFullYear();
        month = month.toString();
        day = day.toString();
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
        filterDate = [year,month,day].join('-');
        for(let i=0; i<document.querySelectorAll('.page-item').length;i++){
            if(document.querySelectorAll('.page-item')[i].classList.contains('active'))
            {
                document.querySelectorAll('.page-item')[i].classList.remove('active')
            }
            
        }
        document.querySelectorAll('.page-item')[pageNo-1].classList.add("active");

        if(document.querySelector('.current-select').classList.contains('country-name'))
        {
            let sortBy = document.querySelector('.country-name').getAttribute('data-sort');
            if(select !== ''){
                getListsOfLatestRates(pageNo,filterDate,'',select,sortBy,"");
            }
            else{
                getListsOfLatestRates(pageNo,filterDate,regionfilter,'',sortBy,"");
            }
        }
        else if(document.querySelector('.current-select').classList.contains('currency-name'))
        {
            let sortBy = document.querySelector('.currency-name').getAttribute('data-sort');
            if(select !== ''){
                getListsOfLatestRates(pageNo,filterDate,'',select,"",sortBy);
            }
            else{
                getListsOfLatestRates(pageNo,filterDate,regionfilter,'',"",sortBy);
            }
        }
        
    }


    const handlePaginationNext = (pageNo,filterDate,regionfilter,select) => {
        let d = new Date(filterDate);
        let month = d.getMonth() + 1;
        let day = d.getDate();
        let year = d.getFullYear();
        month = month.toString();
        day = day.toString();
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
        filterDate = [year,month,day].join('-');
        
        setCurrentPage(pageNo);

        if(document.querySelector('.current-select').classList.contains('country-name'))
        {
            let sortBy = document.querySelector('.country-name').getAttribute('data-sort');
            if(select !== ''){
                getListsOfLatestRates(pageNo,filterDate,'',select,sortBy,"");
            }
            else{
                getListsOfLatestRates(pageNo,filterDate,regionfilter,'',sortBy,"");
            }
        }
        else if(document.querySelector('.current-select').classList.contains('currency-name'))
        {
            let sortBy = document.querySelector('.currency-name').getAttribute('data-sort');
            if(select !== ''){
                getListsOfLatestRates(pageNo,filterDate,'',select,"",sortBy);
            }
            else{
                getListsOfLatestRates(pageNo,filterDate,regionfilter,'',"",sortBy);
            }
        }
        
    }

    const handlePaginationBack = (pageNo,filterDate,regionfilter,select) => {
        let d = new Date(filterDate);
        let month = d.getMonth() + 1;
        let day = d.getDate();
        let year = d.getFullYear();
        month = month.toString();
        day = day.toString();
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
        filterDate = [year,month,day].join('-');
        
        setCurrentPage(pageNo);

        if(document.querySelector('.current-select').classList.contains('country-name'))
        {
            let sortBy = document.querySelector('.country-name').getAttribute('data-sort');
            if(select !== ''){
                getListsOfLatestRates(pageNo,filterDate,'',select,sortBy,"");
            }
            else{
                getListsOfLatestRates(pageNo,filterDate,regionfilter,'',sortBy,"");
            }
        }
        else if(document.querySelector('.current-select').classList.contains('currency-name'))
        {
            let sortBy = document.querySelector('.currency-name').getAttribute('data-sort');
            if(select !== ''){
                getListsOfLatestRates(pageNo,filterDate,'',select,"",sortBy);
            }
            else{
                getListsOfLatestRates(pageNo,filterDate,regionfilter,'',"",sortBy);
            }
        }
        
    }

    const filterByRegion = (event) => {
        setSelect("");
        let region = event.getAttribute("data-region");
        let idx = event.getAttribute("data-index");
        document.querySelector(".rbt-input-main").value = "";
        document.querySelector(".country-name").setAttribute("data-sort","ASC");
        document.querySelector(".currency-name").setAttribute("data-sort","ASC");
        if(!document.querySelector(".country-name").classList.contains("current-select"))
        {
            document.querySelector(".country-name").classList.add("current-select");
        }
        if(document.querySelector(".currency-name").classList.contains("current-select"))
        {
            document.querySelector(".currency-name").classList.remove("current-select");
        }
        [...document.getElementsByClassName('region-btn')].forEach((el,i) => {
            console.log(el)
            if(el.classList.contains("active-region")){
                el.classList.remove("active-region");
            }
            if(i==idx){
                event.classList.add("active-region");
            }
        })
        let d = new Date(searchDate);
        let month = d.getMonth() + 1;
        let day = d.getDate();
        let year = d.getFullYear();
        month = month.toString();
        day = day.toString();
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
        let filterDate = [year,month,day].join('-');
        getListsOfLatestRates(1,filterDate,region);
    }

    const handleOrderByCountry = (param) => {
        let sortBy = orderByCountry.current.getAttribute('data-sort');
        let keyword = "";
        if(sortBy == 'ASC')
        {
            orderByCountry.current.setAttribute('data-sort','DESC');
        }
        else
        {
            orderByCountry.current.setAttribute('data-sort','ASC');
        }

        let d = new Date(searchDate);
        let month = d.getMonth() + 1;
        let day = d.getDate();
        let year = d.getFullYear();
        month = month.toString();
        day = day.toString();
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
        let filterDate = [year,month,day].join('-');
        
        sortBy = orderByCountry.current.getAttribute('data-sort');
        let currentPage = document.querySelector(".page-item.active").textContent;
        if(currentPage == null){
            currentPage = 1;
        }
        let activeRegion = document.querySelector(".active-region").getAttribute('data-region');
        if(document.querySelector(".currency-name").classList.contains('current-select')){
            document.querySelector(".currency-name").classList.remove('current-select');
            document.querySelector(".currency-name").setAttribute('data-sort','ASC');
        }
        if(!document.querySelector(".country-name").classList.contains('current-select')){
            document.querySelector(".country-name").classList.add('current-select');
        }
        if(document.querySelector('.rbt-input-main').value !="")
        {
            keyword = document.querySelector('.rbt-input-main').value;
        }
        getListsOfLatestRates(currentPage,filterDate,activeRegion,keyword,sortBy,"");

    }

    const handleOrderByCurrency = (param) => {
        let sortBy = orderByCurrency.current.getAttribute('data-sort');
         let keyword = "";
        if(sortBy == 'ASC')
        {
            orderByCurrency.current.setAttribute('data-sort','DESC');
        }
        else
        {
            orderByCurrency.current.setAttribute('data-sort','ASC');
        }

        let d = new Date(searchDate);
        let month = d.getMonth() + 1;
        let day = d.getDate();
        let year = d.getFullYear();
        month = month.toString();
        day = day.toString();
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
        let filterDate = [year,month,day].join('-');
        
        sortBy = orderByCurrency.current.getAttribute('data-sort');
        let currentPage = document.querySelector(".page-item.active").textContent;
        if(currentPage == null){
            currentPage = 1;
        }
        let activeRegion = document.querySelector(".active-region").getAttribute('data-region');
        if(document.querySelector(".country-name").classList.contains('current-select')){
            document.querySelector(".country-name").classList.remove('current-select');
            document.querySelector(".country-name").setAttribute('data-sort','ASC');
        }
        if(!document.querySelector(".currency-name").classList.contains('current-select')){
            document.querySelector(".currency-name").classList.add('current-select');
        }
        if(document.querySelector('.rbt-input-main').value !="")
        {
            keyword = document.querySelector('.rbt-input-main').value;
        }
        
        getListsOfLatestRates(currentPage,filterDate,activeRegion,keyword,"",sortBy);
    }
                       
                       
    /*modal*/
   const [showbuyreq, setShowBuyReq] = useState(false);                    
   const buyReqModal = (param,param1,param2,param3,param4,param5,param6) => {
    
    //alert(param);
    //alert(param1);
    //alert(param2);
    //alert(param3);
    //alert(param4);
    //alert(param5);
    document.getElementById("region").innerHTML = param1;
    document.getElementById("countryname").innerHTML = param2;
    document.getElementById("currency").innerHTML = param3;
    document.getElementById("lmr").innerHTML = param4;
    document.getElementById("cr").innerHTML = param5;
    document.getElementById("date").innerHTML = param6;
    setShowBuyReq(true);
    document.getElementById("buyReqModal").style.display = "block";
    document.querySelector(".modal-backdrop").style.display = "block";
    }
    
    
        
    const [fname, setFname] = useState("");
    const [mname, setMname] = useState("");
    const [lname, setLname] = useState("");
    
    const [organization, setOrganization] = useState("");
    const [compphone, setCompphone] = useState("");
    const [formerror,setformerror] = useState("");
    const [success,setsuccess] = useState("");
    const [usertype, setusertype] = useState("");
    const [orgname, setOrgname] = useState("");
    const [mail, setMail] = useState("");
    const [orgphone, setOrgphone] = useState("");
    const [orgaddrs, setOrgaddrs] = useState("");
    const [amount, setAmount] = useState("");
    
    
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
                        setMail(res.data.email)
                        
                  }).catch(err => {
                  });
              }
        
    console.log();
    },[]);

    

    const submitForm = (e) => {
            
        const btnPointer = document.querySelector('#profile-btn');
        btnPointer.innerHTML = 'Please wait..';
        btnPointer.setAttribute('disabled', true);
        
        e.preventDefault();
                
        if(document.getElementById("amount").value==""){
            setformerror("Please fill the missing field");
            setsuccess("");
            btnPointer.innerHTML = '<i class="fa-solid fa-cart-shopping me-2"></i> Buy Request';
            btnPointer.removeAttribute('disabled', false);
            return false;
         }        
                
                
                
                
                
        const userTokenData = JSON.parse( localStorage.getItem("userToken") );

                
         let param1 = document.getElementById("region").textContent;
         let param2 = document.getElementById("countryname").textContent;
         let param3 = document.getElementById("currency").textContent;
         let param4 = document.getElementById("lmr").textContent;
         let param5 = document.getElementById("cr").textContent;
         let param6 = document.getElementById("date").textContent;
                
        let name = fname + " " + lname;

        let d = new Date();
        let month = d.getMonth() + 1;
        let day = d.getDate();
        let year = d.getFullYear();
        month = month.toString();
        day = day.toString();
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
        let buyRequestDate = [month,day,year].join('-');

        const userData = {
                organization, name, 
                email:mail, 
                phone:compphone, 
                region:param1, 
                country:param2,
                currency:param3,
                local_market_rate:param4,
                city_bank_rate:param5,
                date:param6,
                buy_request_date: buyRequestDate,
                amount:document.getElementById("amount").value
            };
           
        
               
    axiosURL.post('/buy-request',userData,{headers:{
                    'Authorization':'Bearer ' + userTokenData?.token
                  }}).then(res => {
                        console.log("User ID: -",res)
                    console.log(res.data.sMessage);
                    setsuccess("Your Request has been received");
                    setformerror("");
                    btnPointer.innerHTML = '<i class="fa-solid fa-cart-shopping me-2"></i> Buy Request';
                    btnPointer.removeAttribute('disabled', false);
  
                  }).catch(err => {
                    
                    btnPointer.innerHTML = '<i class="fa-solid fa-cart-shopping me-2"></i> Buy Request';
                    
                    console.log(error.response.data);
                    btnPointer.removeAttribute('disabled', false);
                    //alert("Oops! Some error occured.");

                  });     
           
           

    console.log(userData)
      
}
 const btnPointer = document.querySelector('#profile-btn');
                 
const closebuyReqModal = () => {
    setShowBuyReq(false);
    document.getElementById("buyReqModal").style.display = "none";
    document.querySelector(".modal-backdrop").style.display = "none";
    setsuccess("");
    setformerror("");
    setAmount("");
    btnPointer.innerHTML = '<i class="fa-solid fa-cart-shopping me-2"></i> Buy Request';
    btnPointer.removeAttribute('disabled', false);
    }

    useEffect(() => {
        console.log(organization); 
      }, [allEntry,organization]);
                     
  
    return(
        
    <>
                 
                     
        {showModal ? <TokenModal btnCallback={okBtnClick} /> : ''}
      {/*row heading start*/}
        <div className="row mb-2 mb-lg-4">
        <div className="col-md-12 d-lg-flex align-items-center main-hdng">
        <div className="col-md-7"><h1 className="page-title">Spot Forex Quotations</h1></div>
        <div className="col-md-5 d-flex justify-content-end">
        <div className=" search_box w-75">
            <div className="input-group position-relative">
            {/*<input type="text" className="form-control rounded-pill border-2" placeholder="Search Country & Currency" aria-label="Recipient's username" aria-describedby="button-addon2"
            onChange ={(e) => {
             setSearch(e.target.value);
         }} />*/}
            <AsyncTypeahead
              filterBy={filterBy}
              id="async-search"
              isLoading={isLoading}
              minLength={3}
              onSearch={handleSearchCountryOrCurrency}
              onChange={handleInputChange}
              options={options}
              placeholder="Search Country & Currency"
              renderMenuItemChildren={(opt) => (
                <>
                  
                  <span>{opt.label}</span>
                </>
              )}
            />
            <button className="btn btn-secondary rounded-pill position-absolute top-0 end-0 z-9" type="button" id="button-addon2" onClick={() => handleClickSearch(select)} disabled={searchdisable}><i className="fa-solid fa-magnifying-glass"></i></button>
            </div>
        </div>
        </div>
        </div>
        </div>
       
        {/*row heading end*/}
        
        {/*row button start*/}
        <div className="row mb-2 mb-lg-4 d-flex align-items-center hdng-btm">
        <div className="col-md-12 text-start mt-n1">
        <ul className="list-inline ml-auto mt-3 mt-lg-0 mb-0">
        <li className="list-inline-item"><button className="btn btn-primary region-btn active-region" data-region="0" data-index="0" onClick={(e)=>filterByRegion(e.target)}>All</button></li>
        <li className="list-inline-item"><button className="btn btn-primary region-btn" data-region="1" data-index="1" onClick={(e)=>filterByRegion(e.target)}>Americas</button></li>
        <li className="list-inline-item"><button className="btn btn-primary region-btn" data-region="2" data-index="2" onClick={(e)=>filterByRegion(e.target)}>Europe</button></li>
        <li className="list-inline-item"><button className="btn btn-primary region-btn" data-region="4" data-index="3" onClick={(e)=>filterByRegion(e.target)}>Africa</button></li>
        <li className="list-inline-item"><button className="btn btn-primary region-btn" data-region="5" data-index="4" onClick={(e)=>filterByRegion(e.target)}>Asia Pacific</button></li>
        </ul>
        </div>
        
                           
                           
                           
                           
                           
        </div>
        {/*row button end*/}
       
        { loading ? <><div className="loader-outer"><img src={Loader} className="loader position-absolute"/></div></> : '' }
        {/*row table cont start*/}
        <div className="light-body-bg shadow-lg py-4 px-4 rounded-4">
        
            <div id="datatables-reponsive_wrapper" className="dataTables_wrapper dt-bootstrap5 no-footer ">
            {/*data table header start*/}
            <div className="d-flex justify-content-between">
            <div className="d-flex align-items-center mb-3">
            <div className="col-auto d-block"><h2 className="table-title text-white-50 fw-semibold">{regionfilter==="0"?'All' : regionfilter==="1"?'Americas' : regionfilter==="2"?'Europe' : regionfilter==="4"?'Africa' : regionfilter==="5" ? 'Asia Pacific' : ''}</h2></div>
            <div className="col-auto d-block me-auto ms-3 ">
            <div className="text-center">
            <div className="dataTables_length"><h5 className="text-info mb-0">{totalRecords} results found</h5>
            </div>
            </div>
            </div>
            </div>
            <div className="d-flex align-items-center mb-3">
            <div className="col-auto d-block ms-sm-auto ">
            <div className="text-end d-flex align-items-center">
        <DatePicker
                    dateFormat="MM/dd/yyyy"
                    showIcon
                    selected={searchDate}
                    onChange={(date) => setSearchDate(date)}
                    className="form-control date"
                    showYearDropdown
                    dateFormatCalendar="MMMM"
                    yearDropdownItemNumber={15}
                    scrollableYearDropdown
                    disabled
                />
                <button className="btn btn-light rounded-0 top-0 end-0 z-4 btn-sm px-2 py-1 goBtn d-none" type="button" id="button-addon2" onClick={()=>handleSearch(searchDate)}>GO</button>
             </div>
            </div>
            </div>
            </div>
            {/*data table header end*/}
            {/*data table start*/}
            { latestUploadedDate!="" ? <><h5 className="text-white mb-3 fs-4">No rates have been updated for this date.  For the latest update, please select {latestUploadedDate} in the date field above, or click <span className="text-info" onClick={()=>handleDateChange(latestUploadedDate)} style={{textDecoration:'underline',cursor:'pointer'}}>here</span></h5></> : 
            <><div className="table-responsive">
            
            <><h5 className="text-white mb-3 fs-4">The exchange rates displayed below pertain to EML’s sale of local currency against USD.</h5>
            <div className="tableFixHead">
            <table id="datatables-column-search-select-inputs" className="table table-striped dataTable" width="100%" aria-describedby="datatables-column-search-select-inputs_info">
            <thead className="thead-dark">
            <tr role="row">
            
            <th className="sorting align-middle country-name current-select" ref={orderByCountry} data-sort='ASC' onClick={(e)=>handleOrderByCountry(e.target)}>Country Name</th>
            <th className="sorting align-middle currency-name" ref={orderByCurrency} data-sort='ASC' onClick={(e)=>handleOrderByCurrency(e.target)}>Currency</th>
            <th className="align-middle">EMNY/Local Market Rate</th>
            <th className="align-middle">Estimated ITS/Citibank Rate</th>
            
            
            </tr>
            </thead>

    
            <tbody>
        
        
            { latestUploadedDate=="" && ExchangeDatas.length>0 && ExchangeDatas
                    .filter((ExchangeData) => {
             if(search == "") {
                 return ExchangeData
             } else if(ExchangeData.country_name.toLowerCase().includes(search.toLowerCase()) ||
               ExchangeData.currency_code.toLowerCase().includes(search.toLowerCase())
             ) {
                return ExchangeData
             }
         })
                     .map((ExchangeData:any, index) => {
             return(
            
             <tr 
                 data-region={ExchangeData["region"]}
                 data-country-name={ExchangeData["country_name"]}
                 data-currency-code={ExchangeData["currency_code"]}
                 data-local-market-rate={ExchangeData["local_market_rate"]}
                 data-city-bank-rate={ExchangeData["city_bank_rate"]}
                 
                role="row" className="odd" key={index}>
            
            <td className="align-middle" key={Math.random()}>{ExchangeData["country_name"]}</td>
            <td className="align-middle" key={Math.random()}>{ExchangeData["currency_code"]}</td>
            <td className="align-middle" key={Math.random()}>{ExchangeData["local_market_rate"]}</td>
            <td className="align-middle" key={Math.random()}>{ExchangeData["city_bank_rate"]}</td>
            
            
            </tr>
             );
            })}
            </tbody>
            </table>
            </div>
            </>
            
            </div>
            {/*data table end*/}
            
            
                {/*pagination start*/}
            <nav className="d-none" aria-label="Page navigation example">
                    <ul className="pagination pagination-sm justify-content-end mt-4" style={{display:'none'}}>
                        
                            
                                 {[...Array(pagination)].map((x, i) => 
                                    
                            i==0 ?  <li className="page-item active" key={i} onClick={(el)=>{
                                            handlePagination(i+1,searchDate,regionfilter,select)}} >
                                    <a className="page-link" href="javascript:void(0)">{i+1}</a></li> 
                                    : <li className="page-item" key={i} onClick={(el)=>{
                                            handlePagination(i+1,searchDate,regionfilter,select)}} >
                                    <a className="page-link" href="javascript:void(0)">{i+1}</a></li>
                              )}
                              
                            
                            
                        
                        
                    </ul>
<div className="pagination pagination-sm justify-content-end mt-4 back-next d-none">
    {
        currentPage==1 ? <a className="page-link" href="javascript:void(0)" onClick={(el)=>{
            handlePaginationNext(currentPage+1,searchDate,regionfilter,select)}} > Next <i class="fa-solid fa-angle-right ms-1 fa-lg"></i> </a> : currentPage==pagination ? <a className="page-link" href="javascript:void(0)" onClick={(el)=>handlePaginationBack(currentPage-1,searchDate,regionfilter,select)} >
            <i class="fa-solid fa-angle-left me-1 fa-lg"></i> Back </a> : <><a className="page-link" href="javascript:void(0)" onClick={(el)=>handlePaginationBack(currentPage-1,searchDate,regionfilter,select)} >
            <i class="fa-solid fa-angle-left me-1 fa-lg"></i> Back </a><a className="page-link" href="javascript:void(0)" onClick={(el)=>{
            handlePaginationNext(currentPage+1,searchDate,regionfilter,select)}} > Next <i class="fa-solid fa-angle-right ms-1 fa-lg"></i> </a></>
     }
</div>
                </nav> 

                </>
                }
                {/*pagination end*/}
            
            </div>
        
        </div>
        
        {/*row table cont end*/}



















 {/*modal start*/}
<div className="modal-backdrop show modal-req" style={{display: 'none'}}></div>
<div className="modal buyreqmodal" id="buyReqModal" tabIndex="-1">

        <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
       <h1 className="modal-title fs-5" id="buyReqModal">Buy Request</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closebuyReqModal}></button>
      </div>
    
        
        <form className='regForm' action="" onSubmit={submitForm}>
        <div className="modal-body">
        <div className='input-blocks d-flex align-items-center w-100'>
                    <span className="d-inline-block me-4 align-middle"><i className="fa-regular fa-building"></i></span>
                     <div className='d-inline-block align-middle w-100'><label htmlFor="compname" className='input-label'>Organization Name</label>
                        
                    <span className="form-field" id="organization">{organization}</span>
                    </div>  
                </div>

        <div className='input-blocks d-flex align-items-center w-100'>
                <span className="d-inline-block me-4 align-middle"><img src={IMAGES.LoginUser} alt="Login" /></span>
                <div className='d-inline-block align-middle w-100'><label htmlFor="fname" className='input-label'>First Name</label>
                  
                <span className="form-field" id="fname">{fname}</span>
                </div>
                </div>
                <div className='input-blocks d-flex align-items-center w-100'>
               <span className="d-inline-block me-4 align-middle"><img src={IMAGES.LoginUser} alt="Login" /></span>
                <div className='d-inline-block align-middle w-100'><label htmlFor="mname" className='input-label'>Middle Name</label>
                   
                    <span className="form-field" id="mname">{mname}</span>
                </div>
                </div>
                <div className='input-blocks d-flex align-items-center w-100'>
               <span className="d-inline-block me-4 align-middle"><img src={IMAGES.LoginUser} alt="Login" /></span>
                <div className='d-inline-block align-middle w-100'><label htmlFor="lname" className='input-label'>Last Name</label>
                 
                <span className="form-field" id="lname">{lname}</span>
                </div>
                </div>
                <div className='input-blocks d-flex align-items-center w-100'>
                <span className="d-inline-block me-4 align-middle"><i className="fa-solid fa-phone"></i></span>
                <div className='d-inline-block align-middle w-100'><label htmlFor="compphone" className='input-label'>Phone</label>

                  <span className="form-field" id="compphone">{compphone}</span>
                  </div>  
                </div>
                <div className='input-blocks d-flex align-items-center w-100'>
                <span className="d-inline-block me-4 align-middle"><i className="fa-solid fa-envelope"></i></span>
                <div className='d-inline-block align-middle w-100'><label htmlFor="orgmail" className='input-label'>Email</label>
                    
                 <span className="form-field" id="orgmail">{mail}</span>
                  </div>  
                </div>
                
                <div className='input-blocks d-flex align-items-center w-100'>
                <span className="d-inline-block me-4 align-middle"><i className="fa-solid fa-globe"></i></span>
                <div className='d-inline-block align-middle w-100'><label htmlFor="region" className='input-label'>Region</label>
                    
                    <span className="form-field" id="region"></span>
                   
                  </div>  
                </div>

            
            <div className='input-blocks d-flex align-items-center w-100'>
                <span className="d-inline-block me-4 align-middle"><i className="fa-solid fa-flag"></i></span>
                <div className='d-inline-block align-middle w-100'><label htmlFor="region" className='input-label'>Country Name</label>
                    
                    <span className="form-field" id="countryname"></span>
                   
                  </div>  
                </div>


            <div className='input-blocks d-flex align-items-center w-100'>
                <span className="d-inline-block me-4 align-middle"><i className="fa-solid fa-coins"></i></span>
                <div className='d-inline-block align-middle w-100'><label htmlFor="region" className='input-label'>Currency</label>
                    
                    <span className="form-field" id="currency"></span>
                   
                  </div>  
                </div>


        <div className='input-blocks d-flex align-items-center w-100'>
                <span className="d-inline-block me-4 align-middle"><i className="fa-solid fa-chart-line"></i></span>
                <div className='d-inline-block align-middle w-100'><label htmlFor="region" className='input-label'>Local Market Rate</label>
                    
                    <span className="form-field" id="lmr"></span>
                   
                  </div>  
                </div>

        
                <div className='input-blocks d-flex align-items-center w-100'>
                <span className="d-inline-block me-4 align-middle"><i className="fa-solid fa-money-bill-trend-up"></i></span>
                <div className='d-inline-block align-middle w-100'><label htmlFor="region" className='input-label'>Citybank Rate</label>
                    
                    <span className="form-field" id="cr"></span>
                   
                  </div>  
                </div>

            <div className='input-blocks d-flex align-items-center w-100'>
                <span className="d-inline-block me-4 align-middle"><i className="fa-solid fa-calendar-days"></i></span>
                <div className='d-inline-block align-middle w-100'><label htmlFor="region" className='input-label'>Date</label>
                    
                    <span className="form-field" id="date"></span>
                   
                  </div>  
                </div>
        
            <div className='input-blocks d-flex align-items-center w-100'>
                <span className="d-inline-block me-4 align-middle"><i className="fa-solid fa-money-bill-trend-up"></i></span>
                <div className='d-inline-block align-middle w-100'><label htmlFor="region" className='input-label'>How much dollar amount you want to transfer?</label>
                    
                    <input type="text" autoComplete='off' name="amount" id="amount" value={amount} placeholder='amount' onChange={(e) => setAmount(e.target.value)} />
                   
                  </div>  
                </div>







            </div>
                
      
                
                <div className="modal-footer">
                <div className='align-items-center w-100'>
                    <div className='SignBtn'>
                        <button id="profile-btn" className='btn btn-secondary' type="submit">
                        <span className="d-inline-block me-2 align-middle"><i className="fa-solid fa-cart-shopping me-2"></i></span>Buy Request</button>
                    </div>
                </div>

                <div className="errorMessage text-center w-100 mt-3">{formerror}</div>
                <div className="successMessage text-center w-100 mt-3">{success}</div>
                
                </div>
            </form>
            
            
            
            
            
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
    );
}
export default UserDashboard;