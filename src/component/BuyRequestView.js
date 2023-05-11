import { useState, useEffect } from "react";
import {Link} from "react-router-dom";
import IMAGES from '../images';
import axios from 'axios';
import TokenModal from './TokenModal';
import { useParams } from 'react-router-dom';
import {axiosURL} from '../util/baseURL.js';


const BuyRequestView = () => {
    
    
    const [BuyRequestView, setBuyRequestView] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    let token = '';
    const uParam = useParams ();
    const [search, setSearch] = useState('');
    
    useEffect(() => {
   const userTokenData = JSON.parse( localStorage.getItem("userToken") );
    setLoading(true);
    
    axiosURL.get('/buy-request-view',
                  {headers:{
                  	'Authorization':'Bearer ' + userTokenData?.token
                  },params:{row_id: uParam.id}}
         )
    .then(response => {
    console.log(response.data)
    setBuyRequestView(response.data);
    setLoading(false);
    })
    .catch(error => {
         console.log(error?.response?.data?.code);
         
         if (error?.response?.data?.code) {
          //setShowModal(true);
          
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
                     
   
      <div className=''>

        <div className="container">
        <div className='row'>


 <div className='col-12'>
 <div className='kcRightSection kcRightSection-reg light-body-bg shadow-lg py-4 px-4 rounded-4'>

        <div className='kcrightcontent registerSection kcrightcontent-reg'>
        <div className="row mb-2 mb-lg-4">
        <div className="col-md-12 d-lg-flex align-items-center main-hdng">
        <div className="col-md-12"><h1 className="page-title mb-4">Buy Request Details</h1></div>
    
        </div>
		
<div className="row mb-2 mb-lg-4">

<div className="col-md-6 col-12">
<div className='input-blocks d-flex align-items-center w-100'>
<span className="d-inline-block me-4 align-middle"><i className="fa-regular fa-building"></i></span>
<div className='d-inline-block align-middle w-100'><label htmlFor="compname" className='input-label'>Organization Name</label>

<span className="form-field" id="organization">{BuyRequestView.organization}</span>
</div>  
</div></div>

<div className="col-md-6 col-12">
<div className='input-blocks d-flex align-items-center w-100'>
<span className="d-inline-block me-4 align-middle"><img src={IMAGES.LoginUser} alt="Login" /></span>
<div className='d-inline-block align-middle w-100'><label htmlFor="name" className='input-label'>Name</label>

<span className="form-field" id="name">{BuyRequestView.who_request}</span>
</div>
</div>
</div>



<div className="col-md-6 col-12">
<div className='input-blocks d-flex align-items-center w-100'>
<span className="d-inline-block me-4 align-middle"><i className="fa-solid fa-phone"></i></span>
<div className='d-inline-block align-middle w-100'><label htmlFor="compphone" className='input-label'>Phone</label>

<span className="form-field" id="compphone">{BuyRequestView.phone}</span>
</div>  
</div></div>

<div className="col-md-6 col-12">
<div className='input-blocks d-flex align-items-center w-100'>
<span className="d-inline-block me-4 align-middle"><i className="fa-solid fa-envelope"></i></span>
<div className='d-inline-block align-middle w-100'><label htmlFor="orgmail" className='input-label'>Email</label>

<span className="form-field" id="mail">{BuyRequestView.email}</span>
</div>  
</div></div>

<div className="col-md-6 col-12">
<div className='input-blocks d-flex align-items-center w-100'>
<span className="d-inline-block me-4 align-middle"><i className="fa-solid fa-globe"></i></span>
<div className='d-inline-block align-middle w-100'><label htmlFor="region" className='input-label'>Region</label>

<span className="form-field" id="region">{BuyRequestView.region}</span>

</div>  
</div></div>

<div className="col-md-6 col-12">
<div className='input-blocks d-flex align-items-center w-100'>
<span className="d-inline-block me-4 align-middle"><i className="fa-solid fa-flag"></i></span>
<div className='d-inline-block align-middle w-100'><label htmlFor="region" className='input-label'>Country Name</label>

<span className="form-field" id="countryname">{BuyRequestView.country}</span>

</div>  
</div></div>

<div className="col-md-6 col-12">
<div className='input-blocks d-flex align-items-center w-100'>
<span className="d-inline-block me-4 align-middle"><i className="fa-solid fa-coins"></i></span>
<div className='d-inline-block align-middle w-100'><label htmlFor="region" className='input-label'>Currency</label>

<span className="form-field" id="currency">{BuyRequestView.currency}</span>

</div>  
</div></div>

<div className="col-md-6 col-12">
<div className='input-blocks d-flex align-items-center w-100'>
<span className="d-inline-block me-4 align-middle"><i className="fa-solid fa-chart-line"></i></span>
<div className='d-inline-block align-middle w-100'><label htmlFor="region" className='input-label'>Local Market Rate</label>

<span className="form-field" id="lmr">{BuyRequestView.local_market_rate}</span>

</div>  
</div></div>

<div className="col-md-6 col-12">
<div className='input-blocks d-flex align-items-center w-100'>
<span className="d-inline-block me-4 align-middle"><i className="fa-solid fa-money-bill-trend-up"></i></span>
<div className='d-inline-block align-middle w-100'><label htmlFor="region" className='input-label'>Citybank Rate</label>

<span className="form-field" id="cr">{BuyRequestView.citybank_rate}</span>

</div>  
</div></div>
<div className="col-md-6 col-12">
<div className='input-blocks d-flex align-items-center w-100'>
<span className="d-inline-block me-4 align-middle"><i className="fa-solid fa-calendar-days"></i></span>
<div className='d-inline-block align-middle w-100'><label htmlFor="region" className='input-label'>Date</label>

<span className="form-field" id="date">{BuyRequestView.buy_request_date}</span>

</div>  
</div></div>



</div>
		
		
        </div>
		
		</div>
		
		</div>
	</div>
</div>
</div>
</div>
    </>
    );
}
export default BuyRequestView;