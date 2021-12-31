import React, { Fragment, useState, useEffect } from "react";
import {  Pagination, Button, Modal, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from 'axios'
import { BASE_URL } from "../../constance/index.js";
import MetarialDate from "../components/MetarialDate";
import swal from "sweetalert";
import authHeader from "../components/AuthHeader.js";

export default () => {

    const [companies, setCompanies] = useState([])
    const [filteredcompanies, setFilteredcompanies] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchKey, setSearchKey] = useState('');
    const [paggination, setPaggination] = useState([]);
    const [modalCentered, setModalCentered] = useState(false);
    const [companyShortName, setCompanyShortName] = useState('');
    const [address, setAddress] = useState('');
    const [companyName, setCompanyName] = useState('')
    const [ licenseIssueDate, setLicenseIssueDate ] = useState(new Date());
    const [ numberOfLicenses, setNumberOfLicenses ] = useState(0);
    const [ companyId, setCompanyId] = useState("");
    const [licenseExpireDate, setLicenseExpireDate] = useState(new Date());
    const [type, setType] = useState(0);
    const [description, setDescription] = useState("")

    const sort = 8;

    useEffect(() => {

        let cnt = companies.length > sort ? sort : (companies.length - currentPage * sort);
        setFilteredcompanies(companies.filter(o => o.companyShortName.includes(searchKey)).slice(currentPage * sort, currentPage * sort + cnt));

    }, [companies, currentPage])

    useEffect(() => {
        let paggination = Array(Math.ceil(companies.filter(o => o.companyShortName.includes(searchKey)).length / sort))
            .fill()
            .map((_, i) => i + 1);
        setPaggination(paggination);
        if (paggination.length - 1 < currentPage) {
            setCurrentPage(0);
        }

    }, [filteredcompanies])
   
    useEffect(() => {
        axios.get(`${BASE_URL}/api/companies`, { headers: authHeader()})
            .then(res => {
                setCompanies(res.data);
            });
    }, [])

    const onCreateCompany = () => {
        const newCompany = {
            id: companyId,
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
                setModalCentered(false)
                swal("Company details has been successfully captured!", "", "success");
                setCompanies([...companies, res.data])
            })
    }

    const onDeleteCompany = id => {
        axios.delete(`${BASE_URL}/api/companies/${id}`, { headers: authHeader() })
            .then(res => {
                setCompanies(companies.filter(a => a.id !== id));
            })
    }

    const onIDGenerate = () => {

        let _companyId = "";
        for(let i=0 ; i<12 ; i++) {
            if(i !== 0 && i%4 === 0) _companyId += "-";
            _companyId += Math.floor(Math.random() * 10 );
        }
        setCompanyId(_companyId)
    }
    
   return (
      <Fragment>
            <div className="row mb-3">
               <div className="col-md-12 text-right">
                   <Button variant="info btn-rounded" onClick={() => setModalCentered(true)}>
                        <span className="btn-icon-left text-info">
                           <i className="fa fa-plus color-info" />
                        </span>
                        Create a company
                   </Button>

                   <Modal className="fade bd-example-modal-lg" show={modalCentered} size="lg">
                       <Modal.Header>
                           <Modal.Title>Create A Company</Modal.Title>
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
                                                <MetarialDate value={licenseIssueDate} onChange={setLicenseIssueDate}/>
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
                                            <label className="col-form-label">
                                                Company ID
                                            </label>
                                            <div className="input-group">
                                                    <input type="text" className="form-control" disabled value={companyId} placeholder={"Ex: 4953-3270-3463"}/>
                                                    <div className="input-group-append">
                                                        <button
                                                            className="btn btn-primary"
                                                            type="button"
                                                            onClick={onIDGenerate}
                                                        >
                                                            Generate
                                                        </button>
                                                    </div>
                                                </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-form-label">
                                                <label>License expire date</label>
                                                <MetarialDate value={licenseExpireDate} onChange={setLicenseExpireDate}/>
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
                                       onChange={ e => setDescription(e.target.value)}
                                   ></textarea>
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
                           <Button variant="primary" onClick={onCreateCompany}>Create Company</Button>
                       </Modal.Footer>
                   </Modal>

               </div>
            </div>
         <div className="row">
         <div className="col-12">
         <div className="card">
            <div className="card-header">
                <h4 className="card-title">Companies</h4>
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
               <Table responsive className="w-100">
                  <div id="example_wrapper" className="dataTables_wrapper">
                     <table id="example" className="display w-100 dataTable">
                        <thead>
                           <tr role="row">
                                 <th >
                                    #
                                </th>
                                <th >
                                    Name
                                </th>
                                <th>
                                    Issued
                                 </th>
                                 <th>
                                    Expired
                                 </th>
                                 <th>
                                    Type
                                 </th>
                                 <th>
                                    Count
                                 </th>
                                 <th>
                                    Actions
                                 </th>
                           </tr>
                        </thead>
                        <tbody>
                            {
                                filteredcompanies
                                .map(a => (
                                <tr key={a.id}>
                                    <td>
                                            {a.id}
                                    </td>
                                    <td>
                                        {a.companyName}
                                    </td>
                                    <td>
                                            {a.licenseIssueDate}
                                    </td>
                                    <td>
                                            {a.licenseExpireDate}
                                    </td>
                                    <td>
                                            {a.type === 0 ? "Trail" : "Paid"}
                                    </td>
                                    <td>
                                            {a.numberOfLicenses}
                                    </td>
                                    <td >
                                            <Link
                                                to={`/company-profile/${a.id}`}
                                                className="btn btn-success shadow btn-xs sharp "
                                                style={{ margin: "5px" }}
                                            >
                                                <i className="fa fa-eye"></i>
                                            </Link>
                                            <Link
                                                to="#"
                                                className="btn btn-danger shadow btn-xs sharp "
                                                onClick={e => onDeleteCompany(a.id)}
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
                            {filteredcompanies.length >
                                (currentPage + 1) * sort
                                ? filteredcompanies.length
                                : (currentPage + 1) * sort}
                            of {companies.length} entries
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
                                        filteredcompanies &&
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
               </Table>
            </div>
         </div>
      </div>
         </div>
      </Fragment>
   );
};

