import {axiosURL} from '../util/baseURL.js';
import { useState, useEffect } from "react";

export const AjaxHelper = () => {
    let url = '';
    const [ExchangeDatas, setExchangeDatas] = useState([]);
    const [showModal, setshowModal] = useState(false);
    let token = '';
    return (
    
    
    useEffect(() => {
        const userToken = localStorage.getItem('userToken');
		 if(userToken){
			 const userType = JSON.parse(userToken);
             console.log(userType);
             token = userType.token;
         }
        axiosURL.get(url, 
                  {headers:{
                  'Authorization':'Bearer ' + token
                  }})
        .then((response) => {
          setExchangeDatas(response.data); 
            console.log(response);
        })
        .catch(error => {
         console.log(error?.response?.data?.code);
         
         if (error?.response?.data?.code) {
          setshowModal(true);
          
        }
    })
    },[])
                     

    );
}