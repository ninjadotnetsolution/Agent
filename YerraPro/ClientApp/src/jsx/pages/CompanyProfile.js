import React, { Fragment, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
//** Import Image */
import profile05 from "../../images/1.jpg";
import profile from "../../images/sidebarIcon.png";
import { Dropdown, Badge, Button, Modal, Table } from "react-bootstrap";
import axios from "axios";
import { BASE_URL } from "../../constance";
import authHeader from "../components/AuthHeader";
import swal from "sweetalert";
import { useSelector } from "react-redux"
import MetarialDate from "../components/MetarialDate";

const StatusComponent = ({state}) => {
   switch (state) {
      case true:
         return <Badge variant="success light">
            <i className="fa fa-circle text-success mr-1"></i>
            Active
         </Badge>
      case false:
         return <Badge variant="danger light">
            <i className="fa fa-circle text-danger mrmr-1"></i>
            Inactive
         </Badge>
      
      default:
         return <Badge variant="success light">
         <i className="fa fa-circle text-success mr-1"></i>
         Active
      </Badge>
   }
}
const CompanyProfile = () => {
    const [activeToggle, setActiveToggle] = useState("posts");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setphoneNumber] = useState("");
    const [company, setCompany] = useState({});
    const params = useParams();
    const [ modalCentered, setModalCentered ] = useState(false);
    const [editProfileModal, setEditProfileModal ] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState({});
    const user = useSelector(s => s.auth.auth)

    const [companyShortName, setCompanyShortName] = useState('');
    const [companyName, setCompanyName] = useState('')
    const [licenseIssueDate, setLicenseIssueDate] = useState(new Date());
    const [numberOfLicenses, setNumberOfLicenses] = useState(0);
    const [licenseExpireDate, setLicenseExpireDate] = useState(new Date());
    const [type, setType] = useState(0);
    const [description, setDescription] = useState("")

    useEffect(() => {
        axios.get(`${BASE_URL}/api/companies/${params.companyId}`)
            .then(res => {
                setCompany(res.data)
                console.log(res.data)
            })
    }, [])

    const onPassGenerate = () => {

        let _password = "";
        for(let i=0 ; i<5 ; i++) {
            _password += Math.floor(Math.random() * (10 - 0) ) + 0;
        }

        setPassword(_password)
    }

    const onCreateAdmin = () => {
        const newCompany = {
            firstName,
            lastName,
            email,
            password,
            address,
            phoneNumber,
            companyId: company.id
        }
        axios.post(`${BASE_URL}/api/users`, newCompany, { Headers: authHeader() })
            .then(res => {
                swal("Company admin has been successfully created!", "", "success");
                let newCompany = company;
                newCompany.admins = [...newCompany.admins, res.data];
                setCompany(newCompany)
            });
    }

   const onDelete = id => {
       axios.delete(`${BASE_URL}/api/users/${id}`, { headers: authHeader() })
           .then(res => {
               company.admins = company.admins.filter(a => a.id !== id);
               setCompany(company);
           })
   }

   const onSetState = (admin, status) => {
       admin.status = status;
       console.log(admin)
       axios.put(`${BASE_URL}/api/users`, admin, { headers: authHeader() })
           .then(res => {
               company.admins = company.admins.map(a => {
                   if (a.id === selectedAdmin.id) return res.data;
                   return a;
               });
               setCompany(company)
           })
   }

    const onEdit = admin => {
        setFirstName(admin.firstName);
        setLastName(admin.lastName);
        setEmail(admin.email);
        setAddress(admin.address);
        setphoneNumber(admin.phoneNumber)
        setModalCentered(true)
   }

    const editProcess = () => {
        const newAdmin = {
            firstName,
            lastName,
            email,
            address,
            phoneNumber
        }

        axios.put(`${BASE_URL}/api/users`, newAdmin, { headers: authHeader() })
            .then(res => {
                company.admins = company.admins.map(a => {
                    if (a.id === selectedAdmin.id) return res.data;
                    return a;
                });
                setCompany(company)
            })
    }

    const onEditCompany = () => {
        const newCompany = {
            companyName,
            companyShortName,
            address,
            description,
            licenseIssueDate,
            licenseExpireDate,
            numberOfLicenses: Number.parseInt(numberOfLicenses),
            type: Number.parseInt(type)
        }

        console.log(newCompany)

        axios.post(`${BASE_URL}/api/companies`, newCompany, { headers: authHeader() })
            .then(res => {
                setEditProfileModal(false)
                swal("Company details has been successfully captured!", "", "success");
            })
    }

   return (
      <Fragment>

           <Modal className="fade bd-example-modal-lg" show={modalCentered} size="lg">
               <Modal.Header>
                   <Modal.Title>Update An Admin</Modal.Title>
                   <Button
                       onClick={() => setModalCentered(false)}
                       variant=""
                       className="close"
                   >
                       <span>&times;</span>
                   </Button>
               </Modal.Header>
               <Modal.Body>
                   <div className="row">
                       <div className="col-lg-6 col-sm-12">
                           <div className="form-group">
                               <div className="form-group">
                                   <label className="col-form-label">
                                       First name
                                   </label>
                                   <div>
                                       <input
                                           type="text"
                                           value={firstName}
                                           className="form-control"
                                           placeholder="First name"
                                           onChange={e => setFirstName(e.target.value)}
                                       />
                                   </div>
                               </div>
                               <div className="form-group">
                                   <label className="col-form-label">
                                       Email
                                   </label>
                                   <div>
                                       <input
                                           type="email"
                                           value={email}
                                           className="form-control"
                                           placeholder="Enter valid email"
                                           onChange={e => setEmail(e.target.value)}
                                       />
                                   </div>
                               </div>
                               <div className="form-group">
                                   <label className="col-form-label">
                                       Address
                                   </label>
                                   <div>
                                       <input
                                           type="text"
                                           value={address}
                                           className="form-control"
                                           placeholder="Enter valid address"
                                           onChange={e => setAddress(e.target.value)}
                                       />
                                   </div>
                               </div>


                           </div>
                       </div>
                       <div className="col-lg-6 col-sm-12">
                           <div className="form-group">
                               <div className="form-group">
                                   <label className="col-form-label">
                                       Last name
                                   </label>
                                   <div>
                                       <input
                                           type="text"
                                           value={lastName}
                                           className="form-control"
                                           placeholder="Last name"
                                           onChange={e => setLastName(e.target.value)}
                                       />
                                   </div>
                               </div>
                               
                               <div className="form-group">
                                   <label className="col-form-label">
                                       phoneNumber
                                   </label>
                                   <div>
                                       <input
                                           type="text"
                                           value={phoneNumber}
                                           className="form-control"
                                           placeholder="Enter phoneNumber number of the suer"
                                           onChange={e => setphoneNumber(e.target.value)}
                                       />
                                   </div>
                               </div>
                           </div>
                       </div>

                   </div>

               </Modal.Body>
               <Modal.Footer>
                   <Button
                       onClick={() => setModalCentered(false)}
                       variant="danger light"
                   >
                       Close
                   </Button>
                   <Button variant="primary" onClick={editProcess}>Create Company</Button>
               </Modal.Footer>
           </Modal>

           <Modal className="fade bd-example-modal-lg" show={editProfileModal} size="lg">
               <Modal.Header>
                   <Modal.Title>Create A Company</Modal.Title>
                   <Button
                       onClick={() => setEditProfileModal(false)}
                       variant=""
                       className="close"
                   >
                       <span>&times;</span>
                   </Button>
               </Modal.Header>
               <Modal.Body>
                   <div className="row">
                       <div className="col-lg-6 col-sm-12">
                           <div className="form-group">
                               <div className="form-group">
                                   <label className="col-form-label">
                                       Company name
                                   </label>
                                   <div>
                                       <input
                                           type="text"
                                           value={companyName}
                                           className="form-control"
                                           placeholder="Enter company name"
                                           onChange={e => setCompanyName(e.target.value)}
                                       />
                                   </div>
                               </div>
                               <div className="form-group">
                                   <label className="col-form-label">
                                       Company short name
                                   </label>
                                   <div>
                                       <input
                                           type="text"
                                           value={companyShortName}
                                           className="form-control"
                                           placeholder="Ex: APPLE"
                                           onChange={e => setCompanyShortName(e.target.value)}
                                       />
                                   </div>
                               </div>
                               <div className="form-group">
                                   <div className="col-form-label">
                                       <label>License issue date</label>
                                       <MetarialDate value={licenseIssueDate} onChange={setLicenseIssueDate} />
                                   </div>
                               </div>
                               <div className="form-group">
                                   <label className="col-form-label">
                                       Number of licenses
                                   </label>
                                   <div>
                                       <input
                                           type="number"
                                           value={numberOfLicenses}
                                           className="form-control"
                                           placeholder="Enter the number of licenses"
                                           onChange={e => setNumberOfLicenses(e.target.value)}
                                       />
                                   </div>
                               </div>
                           </div>
                       </div>
                       <div className="col-lg-6 col-sm-12">
                           <div className="form-group">
                               <div className="form-group">
                                   <label className="col-form-label">
                                       Address
                                   </label>
                                   <div>
                                       <input
                                           type="text"
                                           value={address}
                                           className="form-control"
                                           placeholder="Enter company address"
                                           onChange={e => setAddress(e.target.value)}
                                       />
                                   </div>
                               </div>
                               <div className="form-group">
                                   <div className="col-form-label">
                                       <label>License expire date</label>
                                       <MetarialDate value={licenseExpireDate} onChange={setLicenseExpireDate} />
                                   </div>
                               </div>
                               <div className="form-group">
                                   <div className="col-form-label">
                                       <label>Select the type</label>
                                       <select className="form-control" onChange={e => setType(e.target.value)}>
                                           <option value={0}>Trail</option>
                                           <option value={1}>Paid</option>
                                       </select>
                                   </div>
                               </div>
                           </div>
                       </div>

                   </div>

                   <div className="form-group">
                       <label className="col-form-label">
                           Description
                       </label>
                       <div>
                           <textarea
                               className="form-control"
                               rows="4"
                               value={description}
                               onChange={e => setDescription(e.target.value)}
                           ></textarea>
                       </div>
                   </div>
               </Modal.Body>
               <Modal.Footer>
                   <Button
                       onClick={() => setEditProfileModal(false)}
                       variant="danger light"
                   >
                       Close
                   </Button>
                   <Button variant="primary" onClick={onEditCompany}>Create Company</Button>
               </Modal.Footer>
           </Modal>


         <div className="row">
            <div className="col-lg-12">
               <div className="profile card card-body px-3 pt-3 pb-0">
                  <div className="profile-head">
                     <div className="photo-content">
                        <div className="cover-photo"></div>
                     </div>
                     <div className="profile-info">
                        <div className="profile-photo">
                           <img
                              src={profile}
                              className="img-fluid rounded-circle"
                              alt="profile"
                           />
                        </div>
                        <div className="profile-details">
                           <div className="profile-name px-3 pt-2">
                              <h4 className="text-primary mb-0">
                                           { company.companyShortName}
                              </h4>
                                       <p>
                                           {company.companyName}
                                       </p>
                           </div>
                           <div className="profile-email px-2 pt-2">
                              <h4 className="text-muted mb-0">
                                           { user.email }
                              </h4>
                              <p>Email</p>
                           </div>
                           <Dropdown className="dropdown ml-auto">
                              <Dropdown.Toggle
                                 variant="primary"
                                 className="btn btn-primary light sharp icon-false"
                                 data-toggle="dropdown"
                                 aria-expanded="true"
                              >
                                 <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    //    xmlns:xlink="http://www.w3.org/1999/xlink"
                                    width="18px"
                                    height="18px"
                                    viewBox="0 0 24 24"
                                    version="1.1"
                                 >
                                    <g
                                       stroke="none"
                                       strokeWidth="1"
                                       fill="none"
                                       fillRule="evenodd"
                                    >
                                       <rect
                                          x="0"
                                          y="0"
                                          width="24"
                                          height="24"
                                       ></rect>
                                       <circle
                                          fill="#000000"
                                          cx="5"
                                          cy="12"
                                          r="2"
                                       ></circle>
                                       <circle
                                          fill="#000000"
                                          cx="12"
                                          cy="12"
                                          r="2"
                                       ></circle>
                                       <circle
                                          fill="#000000"
                                          cx="19"
                                          cy="12"
                                          r="2"
                                       ></circle>
                                    </g>
                                 </svg>
                              </Dropdown.Toggle>
                                       <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                                           <Dropdown.Item className="dropdown-item" onClick={() => setEditProfileModal(true)}>
                                        <i className="fa fa-pencil text-primary mr-2" />
                                        Edit profile
                                     </Dropdown.Item>
                                     <Dropdown.Item className="dropdown-item">
                                               <Link to="#add-admin"
                                                   data-toggle="tab"
                                                   onClick={() => setActiveToggle("setting")}>
                                        <i className="fa fa-plus text-primary mr-2" />
                                            Add an admin
                                        </Link>
                                    </Dropdown.Item>
                                    {
                                        user.roles[0] === "SuperAdmin" &&
                                        <Dropdown.Item className="dropdown-item">
                                            <i className="fa fa-ban text-primary mr-2" />
                                            Block
                                        </Dropdown.Item>
                                    }
                                 
                                 
                              </Dropdown.Menu>
                           </Dropdown>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div className="row">
            <div className="col-xl-4">
               <div className="card">
                  <div className="card-body">
                     <div className="profile-statistics mb-5">
                        <div className="text-center">
                           <div className="row">
                              <div className="col">
                                           <h3 className="m-b-0">
                                               {company.numberOfLicenses}
                                           </h3>
                                 <span>Total Agents</span>
                              </div>
                              <div className="col">
                                           <h3 className="m-b-0">
                                               {company.agents?.length}
                                           </h3>
                                 <span>Available Agents</span>
                              </div>
                              <div className="col">
                                           <h3 className="m-b-0">
                                               {company.admins?.length}
                                           </h3>
                                 <span>Total Admins</span>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="profile-blog mb-5">
                        <h3 className="text-primary d-inline">
                           Description
                        </h3>
                        <p className="mb-0">
                                   {
                                       company.description
                                   }
                        </p>
                     </div>
                      
                  </div>
               </div>
            </div>
            <div className="col-xl-8">
               <div className="card">
                  <div className="card-body">
                     <div className="profile-tab">
                        <div className="custom-tab-1">
                           <ul className="nav nav-tabs">
                              <li
                                 className="nav-item"
                                 onClick={() => setActiveToggle("posts")}
                              >
                                 <Link
                                    to="#details"
                                    data-toggle="tab"
                                    className={`nav-link ${
                                       activeToggle === "posts"
                                          ? "active show"
                                          : ""
                                    }`}
                                 >
                                    Details
                                 </Link>
                              </li>
                              <li
                                 className="nav-item"
                                 onClick={() => setActiveToggle("aboutMe")}
                              >
                                 <Link
                                    to="#admin-list"
                                    data-toggle="tab"
                                    className={`nav-link ${
                                       activeToggle === "aboutMe"
                                          ? "active show"
                                          : ""
                                    }`}
                                 >
                                    Admin list
                                 </Link>
                              </li>
                              <li className="nav-item">
                                 <Link
                                    to="#add-admin"
                                    data-toggle="tab"
                                    onClick={() => setActiveToggle("setting")}
                                    className={`nav-link ${
                                       activeToggle === "setting"
                                          ? "active show"
                                          : ""
                                    }`}
                                 >
                                    Add an admin
                                 </Link>
                              </li>
                           </ul>
                           <div className="tab-content">
                              <div
                                 id="details"
                                 className={`tab-pane fade ${
                                    activeToggle === "posts"
                                       ? "active show"
                                       : ""
                                 }`}
                              >
                                <div className="profile-personal-info container">
                                    <div className="row mb-2">
                                        <div className="col-sm-3">
                                            <h5 className="f-w-500">
                                                ID
                                                <span className="pull-right d-none d-sm-block">
                                                    :
                                                </span>
                                            </h5>
                                        </div>
                                        <div className="col-sm-9">
                                            <span>
                                                {company.id}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                       <div className="col-sm-3">
                                          <h5 className="f-w-500">
                                             Name
                                             <span className="pull-right d-none d-sm-block">
                                                :
                                             </span>
                                          </h5>
                                       </div>
                                       <div className="col-sm-9">
                                                       <span>
                                                           {company.companyName}
                                                       </span>
                                       </div>
                                    </div>
                                    <div className="row mb-2">
                                       <div className="col-sm-3">
                                          <h5 className="f-w-500">
                                             Short name
                                             <span className="pull-right d-none d-sm-block">
                                                :
                                             </span>
                                          </h5>
                                       </div>
                                       <div className="col-sm-9">
                                                       <span>
                                                           {company.companyShortName}
                                                       </span>
                                       </div>
                                    </div>
                                    <div className="row mb-2">
                                       <div className="col-sm-3">
                                          <h5 className="f-w-500">
                                             Address
                                             <span className="pull-right d-none d-sm-block">
                                                :
                                             </span>
                                          </h5>
                                       </div>
                                       <div className="col-sm-9">
                                                       <span>
                                                           {company.address}
                                                       </span>
                                       </div>
                                    </div>
                                   
                                    <div className="row mb-2">
                                       <div className="col-sm-3">
                                          <h5 className="f-w-500">
                                             Issue date
                                             <span className="pull-right d-none d-sm-block">
                                                :
                                             </span>
                                          </h5>
                                       </div>
                                       <div className="col-sm-9">
                                          <span>
                                                           {company.licenseIssueDate}
                                          </span>
                                       </div>
                                    </div>
                                    <div className="row mb-2">
                                       <div className="col-sm-3">
                                          <h5 className="f-w-500">
                                             Expire date
                                             <span className="pull-right d-none d-sm-block">
                                                :
                                             </span>
                                          </h5>
                                       </div>
                                       <div className="col-sm-9">
                                                       <span>
                                                           {company.licenseExpireDate}
                                                       </span>
                                       </div>
                                    </div>
                                    <div className="row mb-2">
                                       <div className="col-sm-3">
                                          <h5 className="f-w-500">
                                             Type
                                             <span className="pull-right d-none d-sm-block">
                                                :
                                             </span>
                                          </h5>
                                       </div>
                                       <div className="col-sm-9">
                                                       <span>
                                                           {company.type === 0 ? "Trail" : "Paid"}
                                                       </span>
                                       </div>
                                    </div>
                                 </div>

                                 
                              </div>
                              <div
                                 id="admin-list"
                                 className={`tab-pane fade ${
                                    activeToggle === "aboutMe"
                                       ? "active show"
                                       : ""
                                 }`}
                              >
                                <div className="profile-news container">

                                               
                                     <table className="display w-100 dataTable">
                                       <thead>
                                          <tr role="row">
                                                <th >
                                                   
                                                </th>
                                                <th >
                                                   Name
                                                </th>
                                                <th>
                                                   Email
                                                </th>
                                                <th>
                                                   phoneNumber
                                                </th>
                                                <th>
                                                   Status
                                                </th>
                                                <th>
                                                   Actions
                                                </th>
                                          </tr>
                                       </thead>
                                       <tbody>
                                          {
                                                    company.admins?.map((a, i) => (
                                                   <tr key={i}>
                                                      <td>
                                                            <div className="media pt-3 pb-3">
                                                               <img
                                                                  src={a.url ? a.url : profile}
                                                                  alt=""
                                                                  className="mr-3 rounded"
                                                                  width={45}
                                                               />
                                                            </div>
                                                      </td>
                                                      <td>
                                                                {`${a.firstName} ${a.lastName}`}
                                                      </td>
                                                      <td>
                                                            {a.email}
                                                      </td>
                                                      <td>
                                                            {a.phoneNumber}
                                                      </td>
                                                      <td >
                                                            <StatusComponent state={ a.status }/>
                                                      </td>
                                                      <td>
                                                         <Link
                                                               to="#"
                                                               style={{margin: "5px"}}
                                                               className="btn btn-primary shadow btn-xs sharp"
                                                               onClick={() => onEdit(a)}
                                                         >
                                                            <i className="fa fa-pencil"></i>
                                                            </Link>
                                                            {
                                                               a.status ?
                                                                  <Link
                                                                        to="#"
                                                                        style={{ margin: "5px" }}
                                                                        className="btn btn-success shadow btn-xs sharp"
                                                                        onClick={() => onSetState(a, false)}
                                                                  >
                                                                        <i className="fa fa-check"></i>
                                                                  </Link> :
                                                                  <Link
                                                                        to="#"
                                                                        style={{ margin: "5px" }}
                                                                        className="btn btn-warning shadow btn-xs sharp"
                                                                        onClick={() => onSetState(a, true)}
                                                                  >
                                                                        <i className="fa fa-ban"></i>
                                                                  </Link>

                                                            }
                                                      <Link
                                                            to="#"
                                                            style={{margin: "5px"}}
                                                            className="btn btn-danger shadow btn-xs sharp"
                                                               onClick={e => onDelete(a.id)}
                                                      >
                                                            <i className="fa fa-trash"></i>
                                                      </Link>
                                                      </td>
                                                   </tr>

                                                ))
                                          }
                                       </tbody>
                                    </table>
                                    
                                </div>
                              </div>
                              <div  id="add-admin"
                                 className={`tab-pane fade ${
                                    activeToggle === "setting"
                                       ? "active show"
                                       : ""
                                 }`}>

                                <div className="row container">
                                    <div className="col-lg-6 col-sm-12">
                                        <div className="form-group">
                                            <div className="form-group">
                                                <label className="col-form-label">
                                                    First name
                                                </label>
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={firstName}
                                                        className="form-control"
                                                        placeholder="First name"
                                                        onChange={e => setFirstName(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="col-form-label">
                                                    Email
                                                </label>
                                                <div>
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        className="form-control"
                                                        placeholder="Enter valid email"
                                                        onChange={e => setEmail(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="col-form-label">
                                                    Address
                                                </label>
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={address}
                                                        className="form-control"
                                                        placeholder="Enter valid address"
                                                        onChange={e => setAddress(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            
                                            
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-sm-12">
                                        <div className="form-group">
                                            <div className="form-group">
                                                <label className="col-form-label">
                                                    Last name
                                                </label>
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={lastName}
                                                        className="form-control"
                                                        placeholder="Last name"
                                                        onChange={e => setLastName(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="col-form-label">
                                                    Password
                                                </label>
                                                <div className="input-group mb-3">
                                                        <input type="text" className="form-control" disabled value={password} placeholder={"Click on generate password"}/>
                                                        <div className="input-group-append">
                                                            <button
                                                                className="btn btn-primary"
                                                                type="button"
                                                                onClick={onPassGenerate}
                                                            >
                                                                Generate
                                                            </button>
                                                        </div>
                                                    </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="col-form-label">
                                                    phoneNumber
                                                </label>
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={phoneNumber}
                                                        className="form-control"
                                                        placeholder="Enter phoneNumber number of the suer"
                                                        onChange={e => setphoneNumber(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        className="btn btn-primary"
                                        type="submit"
                                        onClick={onCreateAdmin}
                                    >
                                        ADD
                                    </button>
                                </div>

                                
                              </div>
                               

                          
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </Fragment>
   );
};

export default CompanyProfile;
