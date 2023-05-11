const TokenModal = (props) => {
        
    //console.log(props.stateChanger);
    return(
        <>
        <div className="overlay"></div>
     <div className="modal show" tabIndex="1" style={{display: 'block'}}>
        <div className="modal-dialog">
        <div className="modal-content">
        <div className="modal-header">
        <h5 className="modal-title mb-0">Your session expired, Please login again</h5>
        
        </div>
        
        <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={props.btnCallback}>Ok</button>
        </div>
        </div>
        </div>
        </div>
        </>
        );
}

export default TokenModal;