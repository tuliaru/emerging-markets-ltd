import { useState, useEffect, useRef } from "react";
//import {Link} from "react-router-dom";
import IMAGES from '../images';
import { read, utils, writeFile } from 'xlsx';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker.min";
import { axiosURL } from '../util/baseURL';
import Loader from '../assets/images/infinity-loop.gif';
import TokenModal from './TokenModal';

const AdminRateUpload = () => {
	const [uploadedLocalRateData,setUploadedLocalRateData] = useState([]);
    const [uploadedCitybankRateData,setUploadedCitybankRateData] = useState([]);
    const [listLatestRates,setListLatestRates] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [searchDate, setSearchDate] = useState(new Date());
    const [currentPage,setCurrentPage] = useState(1);
    const [error,setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pagination,setPagination] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [totalRecords,setTotalRecords] = useState(0);
    const [isEditableLocalRate,setIsEditableLocalRate] = useState(false);
    const [isEditableCityBankRate,setIsEditableCityBankRate] = useState(false);
    const [isClickedEditableLocalRate, setIsClickedEditableLocalRate] = useState(false);
    const [isClickedEditableCityBankRate, setIsClickedEditableCityBankRate] = useState(false);

    const okBtnClick = ()=>{
        setShowModal(false);
        localStorage.clear();
        window.location.pathname = '/';
    }

    const userTokenData = JSON.parse( localStorage.getItem("userToken") );
    const getListsOfLatestRates = (pg,search="")=> {
        setLoading(true);
        axiosURL.get('/get-latest-rates',{headers:{
                    'Authorization':'Bearer ' + userTokenData?.token
                  },params:{page: pg,search_date:search}}).then(res => {
                    console.log(res);
                        setListLatestRates(res?.data?.lists_of_latest_rates);
                        setPagination(res?.data?.pagination);
                        setTotalRecords(res?.data?.total_records_found);
                        setLoading(false);
                  }).catch(err => {
                        if(err?.response?.data?.code == "invalid_or_expired_token"){
                            setShowModal(true);
                            
                        }
                  });
    }
    useEffect(() => {
        console.log("Blank")
		getListsOfLatestRates(1)	;
        },[])
    
	useEffect(() => {
        console.log("Error")
            
        },[error,showModal])
   

    const handleLocalRateUploadedFile = ($event) => {
        let allowedExtensions = /(\.csv|\.xlsx|\.xls)$/i;
             
        if (!allowedExtensions.exec(document.querySelector("#browseLocalRateFile").value)) {
            document.querySelector("#browseLocalRateFile").value = "";
            setError(true);
            return false;
        }

		const files = $event.target.files;
        if (files.length) {
            setError(false);
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const wb = read(event.target.result);
                const sheets = wb.SheetNames;

                if (sheets.length) {
                    const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
					//console.log(rows);
                    const unique = rows.filter(
                      (obj, index) =>
                        rows.findIndex((item) => item['Currency Code'] === obj['Currency Code']) === index
                    );

					setUploadedLocalRateData(unique);
					
                }
            }
            reader.readAsArrayBuffer(file);
        }
	}

    const handleCitybankRateUploadedFile = ($event) => {
        let allowedExtensions = /(\.csv|\.xlsx|\.xls)$/i;
             
        if (!allowedExtensions.exec(document.querySelector("#browseCitybankRateFile").value)) {
            document.querySelector("#browseCitybankRateFile").value = "";
            setError(true);
            return false;
        }

        const files = $event.target.files;
        if (files.length) {
            setError(false);
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const wb = read(event.target.result);
                const sheets = wb.SheetNames;

                if (sheets.length) {
                    const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                    //console.log(rows);
                    const unique = rows.filter(
                      (obj, index) =>
                        rows.findIndex((item) => item['Currency Code'] === obj['Currency Code']) === index
                    );

                    setUploadedCitybankRateData(unique);
                    
                }
            }
            reader.readAsArrayBuffer(file);
        }
    }

    const handleLocalRateUpload = () => {
        if(document.getElementById('browseLocalRateFile').files.length === 0) {
            setError(true);
            return false;
        }
        
        else{
            setError(false)
            let d = new Date(startDate);
            let month = d.getMonth() + 1;
            let day = d.getDate();
            let year = d.getFullYear();
            month = month.toString();
            day = day.toString();
            if (month.length < 2) 
                month = '0' + month;
            if (day.length < 2) 
                day = '0' + day;
            let uploadDate = [year,month,day].join('-');
            
            if( userTokenData?.token != "" ){
                document.querySelector(".btn-local-rate-upload").innerHTML = "Uploading..";
                document.querySelector(".btn-local-rate-upload").disabled = true;
                axiosURL.post('/upload-local-rate',{uploadedData : uploadedLocalRateData,uploadDate },{headers:{
                    'Authorization':'Bearer ' + userTokenData?.token
                  }}).then(res => {
                        document.getElementById("browseLocalRateFile").value = "";
                        document.querySelector(".btn-local-rate-upload").innerHTML = "Upload Rate";
                        document.querySelector(".btn-local-rate-upload").disabled = false;
                        document.querySelector(".btn-close").click();
                        setStartDate(new Date());
                        getListsOfLatestRates(1);
                  }).catch(err => {
                        if(err?.response?.data?.code == "invalid_or_expired_token"){
                            document.querySelector(".btn-close").click();
                            setShowModal(true);
                            
                        }
                  });
            }
        }
    }

    const handleCitybankRateUpload = () => {
        if(document.getElementById('browseCitybankRateFile').files.length === 0) {
            setError(true);
            return false;
        }
        
        else{
            setError(false)
            let d = new Date(startDate);
            let month = d.getMonth() + 1;
            let day = d.getDate();
            let year = d.getFullYear();
            month = month.toString();
            day = day.toString();
            if (month.length < 2) 
                month = '0' + month;
            if (day.length < 2) 
                day = '0' + day;
            let uploadDate = [year,month,day].join('-');
            
            if( userTokenData?.token != "" ){
                document.querySelector(".btn-citybank-rate-upload").innerHTML = "Uploading..";
                document.querySelector(".btn-citybank-rate-upload").disabled = true;
                axiosURL.post('/upload-citybank-rate',{uploadedData : uploadedCitybankRateData,uploadDate },{headers:{
                    'Authorization':'Bearer ' + userTokenData?.token
                  }}).then(res => {
                        document.getElementById("browseCitybankRateFile").value = "";
                        document.querySelector(".btn-citybank-rate-upload").innerHTML = "Upload Rate";
                        document.querySelector(".btn-citybank-rate-upload").disabled = false;
                        document.querySelector(".btn-close-modal-citybank").click();
                        setStartDate(new Date());
                        getListsOfLatestRates(1);
                  }).catch(err => {
                        if(err?.response?.data?.code == "invalid_or_expired_token"){
                            document.querySelector(".btn-close-modal-citybank").click();
                            setShowModal(true);
                            
                        }
                  });
            }
        }
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
        getListsOfLatestRates(1,sDate);

    }

    const handlePagination = (pageNo,filterDate) => {
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
        getListsOfLatestRates(pageNo,filterDate);
    }

    const handleClickEditLocalRate = (target,rate)=> {
        target.parentNode.querySelector(".text-local-rate").setAttribute("style","display:none")
        target.parentNode.querySelector(".btn-update-localrate").removeAttribute("style");
        target.parentNode.querySelector(".input-local-rate").removeAttribute("style");
        target.parentNode.querySelector(".input-local-rate").setAttribute("value",rate);
        target.parentNode.querySelector(".img-edit-local-rate").setAttribute("style","display:none");
    }

    const handleUpdateLocalRate = (target,key,value) => {
        
        target.parentNode.querySelector(".text-local-rate").innerHTML = value;
        target.parentNode.querySelector(".text-local-rate").removeAttribute("style")
        target.parentNode.querySelector(".btn-update-localrate").setAttribute("style","display:none");
        target.parentNode.querySelector(".input-local-rate").setAttribute("style","display:none");
        target.parentNode.querySelector(".input-local-rate").removeAttribute("value");
        target.parentNode.querySelector(".img-edit-local-rate").removeAttribute("style");
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
        let uploadDate = [year,month,day].join('-');
        axiosURL.post('/update-rate',{localRate : value,cityBankRate: '',currencyId: key,uploadDate },{headers:{
                    'Authorization':'Bearer ' + userTokenData?.token
          }}).then(res => {
                
          }).catch(err => {
                if(err?.response?.data?.code == "invalid_or_expired_token"){
                    document.querySelector(".btn-close").click();
                    setShowModal(true);
                    
                }
          });
    }

    return(
    <>
         {
            showModal ? <TokenModal btnCallback={okBtnClick} /> : ''
        }
        {/*Local Market Rate Modal Start*/}
        <div className="modal fade localRateUploadModal" id="localRateUploadModal" tabIndex="-1" aria-labelledby="localRateUploadModal" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="localRateUploadModal">EMNY/Local Market Rate Upload</h1>
                    <button type="button" className="btn-close btn-close-modal-localrate" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    {/*upload cont start*/}
                        <div className="p-2">
                        
                            <div className="mb-3">
                                <label htmlFor="datepicker" className="form-label fs-4 mb-3">Select upload date</label>
                                <DatePicker
                                    dateFormat="MM/dd/yyyy"
                                    showIcon
                                    required
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    className="form-control date"
                                    showYearDropdown
                                    dateFormatCalendar="MMMM"
                                    yearDropdownItemNumber={15}
                                    scrollableYearDropdown
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="formFileSm" className="form-label fs-4 mb-3">Upload EMNY/Local Market Rate</label>
                                <input className="form-control browseLocalRateFile" id="browseLocalRateFile" type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleLocalRateUploadedFile}/>
                            { error && <p className="text-danger">Please choose csv or xlsx file.</p> }
                            </div>  

                            <div className="mb-3">
                                <button className="btn btn-secondary btn-md btn-local-rate-upload" onClick={handleLocalRateUpload}>Upload Rate</button>
                            </div> 
                            
                        </div>
                    {/*upload cont end*/}
                  </div>
                </div>
            </div>
      </div>
      {/*Local Market Rate Modal End*/}

      {/*Citybank Rate Modal Start*/}
        <div className="modal fade cityBankRateUploadModal" id="cityBankRateUploadModal" tabIndex="-1" aria-labelledby="cityBankRateUploadModal" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="localCitybankUploadModal">Citybank Rate Upload</h1>
                    <button type="button" className="btn-close btn-close-modal-citybank" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    {/*upload cont start*/}
                        <div className="p-2">
                        
                            <div className="mb-3">
                                <label htmlFor="datepicker" className="form-label fs-4 mb-3">Select upload date</label>
                                <DatePicker
                                    dateFormat="MM/dd/yyyy"
                                    showIcon
                                    required
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    className="form-control date"
                                    showYearDropdown
                                    dateFormatCalendar="MMMM"
                                    yearDropdownItemNumber={15}
                                    scrollableYearDropdown
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="formFileSm" className="form-label fs-4 mb-3">Upload Citybank Rate</label>
                                <input className="form-control browseCitybankRateFile" id="browseCitybankRateFile" type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleCitybankRateUploadedFile}/>
                            { error && <p className="text-danger">Please choose csv or xlsx file.</p> }
                            </div>  

                            <div className="mb-3">
                                <button className="btn btn-secondary btn-md btn-citybank-rate-upload" onClick={handleCitybankRateUpload}>Upload Rate</button>
                            </div> 
                            
                        </div>
                    {/*upload cont end*/}
                  </div>
                </div>
            </div>
      </div>
      {/*Citybank Rate Modal End*/}


      {/*row heading start*/}
        <div className="row mb-2 mb-lg-4">
        <div className="col-md-12 d-lg-flex align-items-center main-hdng">
        <div className="col-md-7"><h1 className="page-title">Rate Upload</h1></div>
        <div className="col-md-5 d-flex justify-content-end">
        
        </div>
        </div>
        </div>
       
        {/*row heading end*/}
        
        
        {/*row table cont start*/}
        { loading ? <><div className="loader-outer"><img src={Loader} className="loader position-absolute"/></div></> : '' }
        <div className="light-body-bg shadow-lg py-4 px-4 rounded-4">
        
            <div id="datatables-reponsive_wrapper" className="dataTables_wrapper dt-bootstrap5 no-footer">
            {/*data table header start*/}
            <div className="d-md-flex align-items-center mb-3">
            <div className="col-auto d-block"><h2 className="table-title text-white-50 fw-semibold">Currency Rate Chart</h2></div>
            <div className="col-auto d-block me-auto ms-3 ">
            <div className="text-center">
            <div className="dataTables_length"><h5 className="text-info mb-0">{totalRecords} results found</h5>
            </div>
            </div>
            </div>
            <div className="col-auto d-block ms-auto ">
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
                />
                <button className="btn btn-light rounded-0 top-0 end-0 z-9 btn-sm px-2 py-1" type="button" id="button-addon2" onClick={()=>handleSearch(searchDate)}>GO</button>
            <div className="dropdown ms-3">
              
              <button className="btn btn-secondary btn-sm dropdown-toggle" type="button" id="dropdownRateUploadButton" data-bs-toggle="dropdown" aria-expanded="false">
                Upload Rate
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownRateUploadButton">
                <li><a href="javascript:void(0)"className="dropdown-item" data-bs-toggle="modal" data-bs-target="#localRateUploadModal">EMNY/Local Market Rate</a></li>
                <li><a href="javascript:void(0)"className="dropdown-item" data-bs-toggle="modal" data-bs-target="#cityBankRateUploadModal">Citybank Rate</a></li>
              </ul>
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
            <th className="sorting align-middle">Region</th>
            <th className="sorting align-middle">Country Name</th>
            <th className="sorting align-middle">Currency</th>
            <th className="align-middle">EMNY/Local Market Rate</th>
            <th className="align-middle">Estimated ITS/Citibank Rate</th>
            
            </tr>
            </thead>

                           {/*<tfoot>
            <tr>
            <th className="align-middle"><input type="text" placeholder="Search" className="form-control input-sm w-75"/></th>
            <th className="align-middle"><input type="text" placeholder="Search" className="form-control input-sm w-75"/></th>
            <th className="align-middle"><input type="text" placeholder="Search" className="form-control input-sm w-75"/></th>
            <th className="align-middle">&nbsp;</th>
            <th className="align-middle">&nbsp;</th>
            
            </tr>
            </tfoot>*/}
            <tbody>
			
			{
				listLatestRates.map((item,i) => {
					
					return <>
					<tr role="row" className="odd" key={i} data-rowid={item?.row_id}>
						<td className="align-middle" key={Math.random()}>{item?.region}</td>
                        <td className="align-middle" key={Math.random()}>{item?.country_name}</td>
						<td className="align-middle" key={Math.random()}>{item?.currency_code}</td>
						<td className="align-middle" key={Math.random()}>
                            <span className="text-local-rate">{item?.local_market_rate}</span>
                            <img src={IMAGES.EditIcon} alt="edit" className="align-middle ms-2 img-edit-local-rate" onClick={(e)=>handleClickEditLocalRate(e.currentTarget,item?.local_market_rate)}/>
                          
                            <input type="text" className="w-25 input-local-rate" style={{display:"none"}} />
                            <input type="button" className="btn btn-sm btn-light btn-update-localrate" value="Update" onClick={(e) => handleUpdateLocalRate(e.currentTarget,item?.currency_id,e.currentTarget.parentNode.querySelector(".input-local-rate").value)} style={{display:"none"}}/>
                        </td>
						<td className="align-middle" key={Math.random()}>
                            <span className="text-citybank-rate">{item?.city_bank_rate}</span>
                            <img className="d-inline-block align-middle ms-2 img-edit-citybank-rate" src={IMAGES.EditIcon} alt="edit"/>
                        </td>
                        
					</tr>
					</>
				})
			} 
           
            
            

            
            </tbody>
            </table>
            </div>
            {/*data table end*/}
            {/*pagination start*/}
            <nav aria-label="Page navigation example">
                <ul className="pagination pagination-sm justify-content-end mt-4">
                    
                        
                             {[...Array(pagination)].map((x, i) =>
                                <li className="page-item" key={i} onClick={()=>handlePagination(i+1,searchDate)}>
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

export default AdminRateUpload;