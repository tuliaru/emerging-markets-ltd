import {Link} from "react-router-dom";
import IMAGES from '../images';

const AdminDashboard = () => {
    return(
    <>
        
{/*row heading start*/}
        <div className="row mb-2 mb-lg-4">
        <div className="col-md-12 d-lg-flex align-items-center main-hdng">
        <div className="col-md-7"><h1 className="page-title">Dashboard</h1></div>
        
        </div>
        </div>
       
{/*row heading end*/}
<div className="row">
  <div className="col-sm-4">
    <div className="card light-body-bg rounded-3">
      <Link to="/adminusermanagement">
      <div className="card-body">
        <img src={IMAGES.UserManagement} className="card-img-top db-card-img mx-auto mb-4" alt="User Management"/>
        <h5 className="card-title text-white-50 text-center fs-4">User Management</h5>
      </div>
      </Link>
    </div>
  </div>
  <div className="col-sm-4">
    <div className="card light-body-bg rounded-3">
      <Link to="/adminrateupload">
      <div className="card-body">
        <img src={IMAGES.RateUpload} className="card-img-top db-card-img mx-auto mb-4" alt="Rate Upload"/>
        <h5 className="card-title text-white-50 text-center fs-4">Rate Upload</h5>
      </div>
      </Link>
    </div>
  </div>
  <div className="col-sm-4">
    <div className="card light-body-bg rounded-3">
      <Link to="/admincurrencyandcountry">
      <div className="card-body">
        <img src={IMAGES.MasterData} className="card-img-top db-card-img mx-auto mb-4" alt="Master Data"/>
        <h5 className="card-title text-white-50 text-center fs-4">Master Data</h5>
      </div>
      </Link>
    </div>
  </div>
  <div className="col-sm-4">
    <div className="card light-body-bg rounded-3">
      <Link to="/adminreport">
      <div className="card-body">
        <img src={IMAGES.Report} className="card-img-top db-card-img mx-auto mb-4" alt="Report"/>
        <h5 className="card-title text-white-50 text-center fs-4">Report</h5>
      </div>
      </Link>
    </div>
  </div>

</div>
    </>
    );
}

export default AdminDashboard;