import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import { BASE_URL } from "../../constance/index.js";
import { Pagination, Button, Modal, Table, Badge } from "react-bootstrap";
import authHeader from "../components/AuthHeader.js";
import { useSelector } from "react-redux"

const StatusComponent = ({ state }) => {
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

export default () => {

    const [users, setUsers] = useState([])
    const [filteredusers, setFilteredusers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchKey, setSearchKey] = useState('');
    const [paggination, setPaggination] = useState([]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const user = useSelector(state => state.auth.auth);
    const [ modalCentered, setModalCentered ] = useState(false);

    const sort = 8;

    useEffect(() => {
        let _companyId = "-1";
        if (user.companyId !== null) {
            _companyId = user.companyId;
        }
        axios.get(`${BASE_URL}/api/users/bycompanyId/${_companyId}`, { headers: authHeader() })
            .then(res => {
                setUsers(res.data);
            });
    }, [])
   
    useEffect(() => {

        let cnt = users.length > sort ? sort : (users.length - currentPage * sort);
        setFilteredusers(users.filter(o => o.email.includes(searchKey)).slice(currentPage * sort, currentPage * sort + cnt));

    }, [users, currentPage])

    useEffect(() => {
        let paggination = Array(Math.ceil(users.filter(o => o.email.includes(searchKey)).length / sort))
            .fill()
            .map((_, i) => i + 1);
        setPaggination(paggination);
        if (paggination.length - 1 < currentPage) {
            setCurrentPage(0);
        }

    }, [filteredusers])
   
    const onDeleteUser = id => {
        axios.delete(`${BASE_URL}/api/users/${id}`, { headers: authHeader() })
            .then(res => {
                setUsers(users.filter(a => a.id !== res.data.id));
            })
    }

    const onPassGenerate = () => {

      let _password = "";
      for(let i=0 ; i<5 ; i++) {
          _password += Math.floor(Math.random() * 10);
      }
      setPassword(_password)
  }

  const onCreateAdmin = () => {
   const newAdmin = {
      firstName,
      lastName,
      email,
      password,
      address,
      phone
   }

   axios.post(`${BASE_URL}/api/users`, newAdmin, { headers: authHeader() })
            .then(res => {
                setUsers([...users, res.data]);
            })
  }

   return (
      <Fragment>
            <div className="row mb-3">
               <div className="col-md-12 text-right">
                 
                  <Button variant="info btn-rounded" onClick={() => setModalCentered(true)}>
                     <span className="btn-icon-left text-info">
                        <i className="fa fa-plus color-info" />
                     </span>
                     Add
                  </Button>

                  <Modal className="fade bd-example-modal-lg" show={modalCentered} size="lg">
                       <Modal.Header>
                           <Modal.Title>Create An Admin</Modal.Title>
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
                                            <label className="mb-3 col-form-label">
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
                                                Phone
                                            </label>
                                            <div>
                                                <input
                                                    type="text"
                                                    value={phone}
                                                    className="form-control"
                                                    placeholder="Enter phone number of the suer"
                                                    onChange={e => setPhone(e.target.value)}
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
                           <Button variant="primary" onClick={onCreateAdmin}>Create Company</Button>
                       </Modal.Footer>
                   </Modal>

               </div>
            </div>
         <div className="row">
         <div className="col-12">
         <div className="card">
            <div className="card-header">
                <h4 className="card-title">Admins</h4>
                <div className="input-group search-area d-lg-inline-flex d-none mr-5">
                    <input
                        type="text"
                        value={searchKey}
                        className="form-control"
                        placeholder="Search here"
                        onChange={e => setSearchKey(e.target.value)}
                    />
                    <div className="input-group-append">
                        <span className="input-group-text">
                            <svg
                                width={20}
                                height={20}
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M23.7871 22.7761L17.9548 16.9437C19.5193 15.145 20.4665 12.7982 20.4665 10.2333C20.4665 4.58714 15.8741 0 10.2333 0C4.58714 0 0 4.59246 0 10.2333C0 15.8741 4.59246 20.4665 10.2333 20.4665C12.7982 20.4665 15.145 19.5193 16.9437 17.9548L22.7761 23.7871C22.9144 23.9255 23.1007 24 23.2816 24C23.4625 24 23.6488 23.9308 23.7871 23.7871C24.0639 23.5104 24.0639 23.0528 23.7871 22.7761ZM1.43149 10.2333C1.43149 5.38004 5.38004 1.43681 10.2279 1.43681C15.0812 1.43681 19.0244 5.38537 19.0244 10.2333C19.0244 15.0812 15.0812 19.035 10.2279 19.035C5.38004 19.035 1.43149 15.0865 1.43149 10.2333Z"
                                    fill="#A4A4A4"
                                />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <div id="example_wrapper" className="dataTables_wrapper">
                    <table id="example" className="display w-100 dataTable">
                    <thead>
                        <tr role="row">
                                <th >
                                Full Name
                                </th>
                            <th>
                                Email
                                </th>
                                <th>
                                Phone
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
                        filteredusers
                            .map(a => (
                            <tr key={a.id}>
                                    <td>
                                        {`${a.firstName} ${a.lastName}`}
                                </td>
                                <td>
                                        {a.email}
                                </td>
                                <td>
                                        {a.phoneNumber}
                                </td>
                                   
                                    <td>
                                        <StatusComponent state={ a.status} />
                                </td>
                                <td>
                                    <Link
                                        to="#"
                                        style={{margin: "5px"}}
                                        className="btn btn-primary shadow btn-xs sharp"
                                            onClick={e => onDeleteUser(a.id)}
                                    >
                                        <i className="fa fa-pencil"></i>
                                        </Link>
                                        {
                                            user.roles[0] === "SuperAdmin" &&
                                        (a.status ?
                                            <Link
                                                to="#"
                                                style={{ margin: "5px" }}
                                                className="btn btn-warning shadow btn-xs sharp"
                                                onClick={e => onDeleteUser(a.id)}
                                            >
                                                <i className="fa fa-ban"></i>
                                            </Link> :
                                            <Link
                                                to="#"
                                                style={{ margin: "5px" }}
                                                className="btn btn-success shadow btn-xs sharp"
                                                onClick={e => onDeleteUser(a.id)}
                                            >
                                                <i className="fa fa-check"></i>
                                            </Link>)
                                        }
                                        
                                    <Link
                                        to="#"
                                        style={{margin: "5px"}}
                                        className="btn btn-danger shadow btn-xs sharp"
                                            onClick={e => onDeleteUser(a.id)}
                                    >
                                        <i className="fa fa-trash"></i>
                                    </Link>
                                </td>
                            </tr>
                            ))
                        }
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="dataTables_info">
                        Showing {currentPage * sort + 1} to 
                        {filteredusers.length >
                            (currentPage + 1) * sort
                            ? filteredusers.length
                            : (currentPage + 1) * sort}
                        of {users.length} entries
                    </div>
                    <div className="dataTables_paginate paging_simple_numbers">
                        <Pagination
                            className="pagination-primary pagination-circle"
                            size="lg"
                        >
                            <li
                                className="page-item page-indicator "
                                onClick={() =>
                                    currentPage > 0 &&
                                    setCurrentPage(currentPage - 1)
                                }
                            >
                                <Link className="page-link" to="#">
                                <i className="la la-angle-left" />
                                </Link>
                            </li>
                        {
                            paggination.map((number, i) => (
                                <Pagination.Item 
                                    className={
                                        currentPage === i ? "active" : ""
                                    }
                                    onClick={() => setCurrentPage(i)}
                                    key={i}
                                >
                                    {number}
                                </Pagination.Item>
                                ))
                            }
                            <li
                                className="page-item page-indicator"
                                onClick={() =>
                                    currentPage + 1 <
                                    filteredusers &&
                                    setCurrentPage(currentPage + 1)
                                }
                            >
                                <Link className="page-link" to="#">
                                <i className="la la-angle-right" />
                                </Link>
                            </li>
                        </Pagination>
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

