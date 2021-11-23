import React, { Component } from 'react';
import { Dropdown, Modal} from 'react-bootstrap';

class Todo extends Component {
    state = {
        ActionItemsList: [
            {
                ActionItem: "Textiles",
                DueDate: "2018-08-09",
                Email: 'example@gmail.com',
                Cstname : 'Dr. Jackson',
                Location : '67 St. John’s Road London',
                Amount : '$340.45',
            },
            {
                ActionItem: "Computers",
                DueDate: "2019-05-06",
                Email: 'example2@gmail.com',
                Cstname : 'Olivia Brownlee',
                Location : '67 St. John’s Road London',
                Amount : '$530.30',
            },
            {
                ActionItem: "Milk Powder",
                DueDate: "2020-03-15",
                Email: 'example3@gmail.com',
                Cstname : 'Cive Slauw',
                Location : '67 St. John’s Road London',
                Amount : '$240.10',
            },
            {
                ActionItem: "Vehicles",
                DueDate: "2021-02-31",
                Email: 'example4@gmail.com',
                Cstname : 'Andrew Stevano',
                Location : '67 St. John’s Road London',
                Amount : '$125.15',
            },
            {
                ActionItem: "Conditioner",
                DueDate: "2019-12-15",
                Email: 'example5@gmail.com',
                Cstname : 'James Roberto',
                Location : '67 St. John’s Road London',
                Amount : '$375.25',
            },
            {
                ActionItem: "Chairs",
                DueDate: "2018-08-09",
                Email: 'example6@gmail.com',
                Cstname : 'Sanuel Jakson',
                Location : '67 St. John’s Road London',
                Amount : '$725.88',
            },
            {
                ActionItem: "Boats",
                DueDate: "2018-08-09",
                Email: 'example7@gmail.com',
                Cstname : 'Bella Simatupang',
                Location : '67 St. John’s Road London',
                Amount : '$880.90',
            }
        ]
    };
    
    
    addActionItemToState = (actionItem, dueDate, email, cstname, location, amount) => { 
        let toBeAddedActionItem = {
            ActionItem: actionItem,
            DueDate: dueDate,
            Email: email,
            Cstname: cstname,
            Location: location,
            Amount: amount,
        };
        
        this.setState(prevState => ({
            ActionItemsList: prevState.ActionItemsList.concat(toBeAddedActionItem)
        }));
    };
    deleteActionItemFromState = index => {
        const ActionItemsList = [...this.state.ActionItemsList];
        ActionItemsList.splice(index, 1);
        this.setState({ ActionItemsList });
        
    };
    render() {
        return (
            <div>
                <ActionItemForum addActionItemToState={this.addActionItemToState} />
                <ActionItemList
                    actionItemsList={this.state.ActionItemsList}
                    deleteActionItemFromState={this.deleteActionItemFromState}
                />
            </div>
        );
    }
}
class ActionItemForum extends React.Component {
        
    state = {
        actionItem: "",
        dueDate: "",
        email: "",
        cstname: "",
        location: "",
        amount: "",
        
    };
    
    //Modal box
    handleClose = () => {
		this.setState({ show: false });
    };
	handleShow = () => {
		this.setState({ show: true });
	};
    
    handleChange = event => {

        event.persist();
        this.setState(prevState => ({
        actionItem:
            event.target.name === "actionItem"
              ? event.target.value
              : prevState.actionItem,
        dueDate:
            event.target.name === "dueDate" ? event.target.value : prevState.dueDate,
        email: 
            event.target.name === "email" ? event.target.value : prevState.email,
        cstname: 
            event.target.name === "cstname" ? event.target.value : prevState.cstname,   
        location: 
            event.target.name === "location" ? event.target.value : prevState.location,
        amount: 
            event.target.name === "amount" ? event.target.value : prevState.amount,    
            
    }));
    
  };
    handleSubmission = event => {
        event.preventDefault();
        this.props.addActionItemToState(this.state.actionItem, this.state.dueDate, this.state.email, this.state.cstname, this.state.location, this.state.amount, );
        this.setState(prevState => ({
            actionItem: "",
            dueDate: "",
            email:"", 
            cstname: "",
            location: "",
            amount: "",
            show:false,
        }));
     
    // alert("Action Item Added to List");
    };
    

    render() {
       
        return (
            <div>
                <div className="row mb-5 align-items-center">
                    <div className="col-xl-9">
                        <div className="card m-0 ">
                            <div className="card-body px-4 py-3 py-lg-2">
                                <div className="row align-items-center">
                                    <div className="col-xl-3 col-xxl-12 col-lg-12 my-2">
                                        <p className="mb-0 fs-14">Lorem Ipsum is simply dummy text of the printing and</p>
                                    </div>
                                    <div className="col-xl-7 col-xxl-12 col-lg-12">
                                        <div className="row align-items-center">
                                            <div className="col-xl-4 col-md-4 col-sm-4 my-2">
                                                <div className="media align-items-center">
                                                    <span className="mr-3">
                                                        <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <rect width="3.54545" height="26" rx="1.77273" transform="matrix(-1 0 0 1 24.8181 0)" fill="#fff"></rect>
                                                        <rect width="3.54545" height="18.9091" rx="1.77273" transform="matrix(-1 0 0 1 17.7271 7.09088)" fill="#fff"></rect>
                                                        <rect width="3.54545" height="8.27273" rx="1.77273" transform="matrix(-1 0 0 1 10.6362 17.7273)" fill="#fff"></rect>
                                                        <rect width="4" height="16" rx="2" transform="matrix(-1 0 0 1 4 10)" fill="#fff"></rect>
                                                        </svg>
                                                    </span>
                                                    <div className="media-body ml-1">
                                                        <p className="mb-0 fs-12">Income</p>
                                                        <h4 className="mb-0 font-w600  fs-22">$126,000</h4>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xl-4 col-md-4 col-sm-4 my-2">
                                                <div className="media align-items-center">
                                                    <span className="mr-3">
                                                        <svg width="30" height="19" viewBox="0 0 30 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M29.3124 0.990819C30.1459 1.71561 30.234 2.97887 29.5092 3.81239L20.7578 13.8765C19.359 15.4851 16.9444 15.7141 15.2681 14.397L11.1176 11.1359L3.87074 17.9564C3.06639 18.7135 1.80064 18.6751 1.04361 17.8708C0.286573 17.0664 0.324929 15.8007 1.12928 15.0436L8.3761 8.22309C9.817 6.86695 12.0329 6.76812 13.5888 7.99062L17.7394 11.2518L26.4908 1.18767C27.2156 0.354158 28.4788 0.266024 29.3124 0.990819Z" fill="#fff"></path>
                                                        </svg>
                                                    </span>
                                                    <div className="media-body ml-1">
                                                        <p className="mb-0 fs-12">Customer</p>
                                                        <h4 className="mb-0 font-w600  fs-22">765 Person</h4>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xl-4 col-md-4 col-sm-4 my-2">
                                                <div className="media align-items-center">
                                                    <span className="mr-3">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="white" fillOpacity="0.18"></path>
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M15.9999 0.686289C14.7205 0.233951 13.3682 0 11.9999 0V3.93696C13.4442 3.93696 14.8619 4.32489 16.105 5.06021C17.3481 5.79553 18.3708 6.85124 19.0664 8.117C19.7619 9.38277 20.1047 10.8121 20.0589 12.2557C20.0131 13.6992 19.5804 15.104 18.806 16.3231C18.0317 17.5422 16.9441 18.531 15.6569 19.186C14.3697 19.8411 12.9302 20.1384 11.4888 20.0468C10.0475 19.9553 8.65715 19.4783 7.46319 18.6656C6.26922 17.853 5.31544 16.7346 4.70154 15.4273L1.13794 17.1007C1.71955 18.3393 2.50612 19.4639 3.45939 20.4297C4.00364 20.9811 4.60223 21.4807 5.24803 21.9203C7.02498 23.1297 9.09416 23.8396 11.2393 23.9759C13.3845 24.1121 15.5268 23.6697 17.4425 22.6948C19.3582 21.7199 20.9768 20.2483 22.1293 18.4339C23.2818 16.6195 23.9257 14.5289 23.9939 12.3805C24.062 10.2321 23.5519 8.10484 22.5167 6.22104C21.4816 4.33724 19.9595 2.76605 18.1094 1.6717C17.4371 1.27398 16.7304 0.944541 15.9999 0.686289Z" fill="#fff"></path>
                                                        </svg>
                                                    </span>
                                                    <div className="media-body ml-1">
                                                        <p className="mb-0 fs-12">Than last week</p>
                                                        <h4 className="mb-0 font-w600 fs-22">72%
                                                            <svg className="ml-2" width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M0 6L6 2.62268e-07L12 6" fill="#13B497"></path>
                                                            </svg>
                                                        </h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-2 col-xxl-12 mt-2">
                                        <Dropdown className="d-inline-block">
                                            <Dropdown.Toggle variant="" as="div" className="btn-link text-white mb-0 fs-18">
                                                <span className="font-w300 mr-1">This Week</span>
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu alignLeft={true} className="dropdown-menu-left">
                                                <Dropdown.Item>Newest</Dropdown.Item>
                                                <Dropdown.Item>Old</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </div>							
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 mb-4 mb-lg-0">
                        <button  onClick={this.handleShow} className="btn btn-primary light  btn-lg btn-block rounded mt-3 mt-sm-0">+ Add Data</button> 
                    </div>
                </div>
                <Modal className="modal fade" id="addContactModal"  show={this.state.show} onHide={this.handleClose}>
					<div className="" role="document">
						<div className="">
							<form id="addContactModalTitle" onSubmit={this.handleSubmission}>
								<div className="modal-header">
									<h4 className="modal-title fs-20">Add Contact</h4>
									<button type="button" className="close"   onClick={this.handleClose} data-dismiss="modal"><span>&times;</span>
									</button>
								</div>
								<div className="modal-body">
									<i className="flaticon-cancel-12 close" data-dismiss="modal"></i>
									<div className="add-contact-box">
										<div className="add-contact-content">
											<div className="form-group">
												<label className="text-black font-w500">Item:</label>
												<div className="contact-occupation">
                                                    <input type="text" className="form-control" id="actionItem" autocomplete="off"
                                                        onChange={this.handleChange} value={this.state.actionItem} name="actionItem" required
                                                    />
													<span className="validation-text"></span>
												</div>
											</div>
											<div className="form-group">
												<label className="text-black font-w500">Due Date:</label>
												<div className="contact-occupation">
                                                    <input type="Date" className="form-control" id="dueDate" autocomplete="off"
                                                      name="dueDate" onChange={this.handleChange} value={this.state.dueDate}
                                                      required
                                                    />
												</div>
											</div>
                                            <div className="form-group">
												<label className="text-black font-w500">Email:</label>
												<div className="contact-occupation">
                                                    <input type="text" className="form-control" id="email" autocomplete="off"
                                                      name="email" onChange={this.handleChange} value={this.state.email}
                                                      required
                                                    />
												</div>
											</div>
                                            <div className="form-group">
												<label className="text-black font-w500">Cust Name:</label>
												<div className="contact-occupation">
                                                    <input type="text" className="form-control" id="cstname" autocomplete="off"
                                                      name="cstname" onChange={this.handleChange} value={this.state.cstname}
                                                      required
                                                    />
												</div>
											</div> 
                                            <div className="form-group">
												<label className="text-black font-w500">Location:</label>
												<div className="contact-occupation">
                                                    <input type="text" className="form-control" id="location" autocomplete="off"
                                                      name="location" onChange={this.handleChange} value={this.state.location}
                                                      required
                                                    />
												</div>
											</div> 
                                            <div className="form-group">
												<label className="text-black font-w500">Amount:</label>
												<div className="contact-occupation">
                                                    <input type="text" className="form-control" id="amount" autocomplete="off"
                                                      name="amount" onChange={this.handleChange} value={this.state.amount}
                                                      required
                                                    />
												</div>
											</div>
											
										</div>
									</div>
								</div>
								<div className="modal-footer">
									<button type="button"  className="btn btn-danger" onClick={this.handleClose}> <i className="flaticon-delete-1"></i> Discard</button>
									<button type="submit" id="btn-add" className="btn btn-primary">Add</button> 
								</div>
							</form>
						</div>
					</div>
				</Modal>	
                
            </div>
        );
    }
}
const ActionItemList = props => {
    const emptyList = length => {
        if (length === 0) {
            return (
                <tr style={{ "text-align": "center" }}>
                    <td colSpan="3">No Record</td>
                </tr>
            );
        }
    };  
    
    const deleteActionItemFromState = index => () => {
        props.deleteActionItemFromState(index);
    };
    
    return (
        <>
            <div className="col-12">
                <div className="card">
                    <div className="card-header">
                      <h4 className="card-title">React Datatable</h4>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <div id="job_data" className="dataTables_wrapper ">
                                <table className="display w-100 dataTable ">
                                    <thead>
                                        <tr>
                                            <th>Sr</th>
                                            <th>Item</th>
                                            <th>Date</th>
                                            <th>Email</th>
                                            <th>Customer Name</th>
                                            <th>Location</th>
                                            <th>Amount</th>
                                            <th> Delete </th>
                                            
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {emptyList(props.actionItemsList.length)}
                                        {props.actionItemsList.map((actionItem, i) => (
                                            <tr key={i + 1}>
                                                <td>{i + 1}</td>
                                                <td>{actionItem.ActionItem}</td>
                                                <td>{actionItem.DueDate}</td>
                                                <td>{actionItem.Email}</td>
                                                <td>{actionItem.Cstname}</td>
                                                <td>{actionItem.Location}</td>
                                                <td>{actionItem.Amount}</td>
                                                <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger rounded btn-sm px-4"
                                                    onClick={deleteActionItemFromState(i)}
                                                >
                                                    Delete
                                                </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>    
            </div>
            
        </>
    );
};
export default Todo;