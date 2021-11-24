import React, { Fragment, useState, useRef, useEffect } from "react";
import {  Pagination, Badge, Dropdown, Button, Modal, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from 'axios'
import { BASE_URL } from "../../../constance/index.js";
import { useInterval } from "../UseInterval.js";

const CheckComponent = ({state}) => (
   <div className="custom-control custom-checkbox">
      <input
         type="checkbox"
         className="custom-control-input"
         id={`checkAll${state}`}
         required
      />
      <label
         className="custom-control-label"
         htmlFor={`checkAll${state}`}
      />
   </div>
)

const StatusComponent = ({state}) => {
   switch (state) {
      case 0:
         return <Badge variant="success light">
            <i className="fa fa-circle text-success mr-1"></i>
            Approve
         </Badge>
      case 1:
           return <Badge variant="warning light">
               <i className="fa fa-circle text-warning mr-1"></i>
            Accepted
         </Badge>
      case 2:
           return <Badge variant="danger light">
               <i className="fa fa-circle text-danger mr-1"></i>
            Rejected
         </Badge>
   
      default:
         return <Badge variant="success light">
            <i className="fa fa-circle text-success mr-1"></i>
            Approve
         </Badge>

   }
}

const Agents = (props) => {

    const [agents, setAgents] = useState([])
    const [filteredAgents, setFilteredAgents] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [byFilter, setByFilter] = useState(100);
    const [searchKey, setSearchKey] = useState('');
    const [paggination, setPaggination] = useState([]);

    const sort = 8;

    useInterval(() => {
        axios.get(`${BASE_URL}/api/agent`)
            .then(res => {
                setAgents(res.data);
            });
    }, 5000)
   
    useEffect(() => {

        let cnt = agents.length > sort ? sort : (agents.length - currentPage * sort);
        setFilteredAgents(agents.filter(o => byFilter === 100 ? true : o.status === byFilter).slice(currentPage * sort, currentPage * sort + cnt));

    }, [agents, currentPage, byFilter])

    useEffect(() => {
        let paggination = Array(Math.ceil(agents.filter(o => byFilter === 100 ? true : o.status === byFilter).length / sort))
            .fill()
            .map((_, i) => i + 1);
        setPaggination(paggination);
        if (paggination.length - 1 < currentPage) {
            setCurrentPage(0);
        }

    }, [filteredAgents])

    const onSetAgentState = ({ status, agent }) => {
        if (status === 100) {
            props.history.push(`/processes/${agent.id}`);
            return;
        }
        agent.status = status;
        axios.put(`${BASE_URL}/api/agent`, agent)
            .then(res => {
                let changedAgents = agents.map(a => {
                    if (a.id === res.data.id) {
                        return res.data;
                    }
                    return a;
                })
                setAgents(changedAgents);
            });
    }
   
    useEffect(() => {
        axios.get(`${BASE_URL}/api/agent`)
            .then(res => {
                setAgents(res.data);
            });
    }, [])

    const newAgent = () => {
        axios.post(`${BASE_URL}/api/agent`)
            .then(res => {
                setAgents([res.data, ...agents]);
                axios({
                    url: `${BASE_URL}/api/agent/download`,
                    method: 'GET',
                    responseType: 'blob', // important
                })
                    .then(res => {
                        const url = window.URL.createObjectURL(new Blob([res.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'archive.zip');
                        document.body.appendChild(link);
                        link.click();
                    })
            })
    }

    const deleteAgent = id => {
        axios.delete(`${BASE_URL}/api/agent/${id}`)
            .then(res => {
                setAgents(agents.filter(a => a.id !== res.data.id));
            })
    }

    const byFilterLabel = id => {
        switch (id) {
            case 0:
                return 'Approve';
            case 1:
                return 'Accepted';
            case 2:
                return 'Rejected';
            default:
                return 'All';
        }
    }
   
   return (
      <Fragment>
            <div className="row mb-3">
               <div className="col-md-12 text-right">
                     <Button variant="info btn-rounded" onClick={newAgent}>
                        <span className="btn-icon-left text-info">
                           <i className="fa fa-plus color-info" />
                        </span>
                        Create
                     </Button>

               </div>
            </div>
         <div className="row">
         <div className="col-12">
         <div className="card">
            <div className="card-header">
                <h4 className="card-title">Agents</h4>
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
               <Dropdown className="dropdown mt-sm-0 mt-3">
                  <Dropdown.Toggle
                     as="button"
                     variant=""
                     className="btn rounded border border-light dropdown-toggle"
                  >
                    {byFilterLabel(byFilter)}
                  </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                    <Dropdown.Item onClick={ () => setByFilter(100)}>All</Dropdown.Item>
                    <Dropdown.Item onClick={() => setByFilter(0)}>Approve</Dropdown.Item>
                    <Dropdown.Item onClick={() => setByFilter(1)}>Accepted</Dropdown.Item>
                    <Dropdown.Item onClick={() => setByFilter(2)}>Rejected</Dropdown.Item>
                  </Dropdown.Menu>
               </Dropdown>
            </div>
            <div className="card-body">
               <Table responsive className="w-100">
                  <div id="example_wrapper" className="dataTables_wrapper">
                     <table id="example" className="display w-100 dataTable">
                        <thead>
                           <tr role="row">
                                 <th >
                                    <CheckComponent sate={0}/>
                                 </th>
                                 <th >
                                    Liecense
                                 </th>
                                <th>
                                    Machine ID
                                 </th>
                                 <th>
                                    System Name
                                 </th>
                                 <th>
                                    Windows Version
                                 </th>
                                 <th>
                                    Created At
                                 </th>
                                 <th className="text-center">
                                    Status
                                 </th>
                                 <th>
                                    Actions
                                 </th>
                           </tr>
                        </thead>
                        <tbody>
                            {
                                filteredAgents.map(a => (
                                <tr key={a.id}>
                                    <td>
                                        <CheckComponent state={a.id} />
                                     </td>
                                    <td>
                                        {a.id}
                                    </td>
                                    <td>
                                            {a.machineID}
                                    </td>
                                    <td className="text-center">
                                            {a.systemName}
                                    </td>
                                    <td>
                                            {a.winVersion}
                                    </td>
                                    <td className="text-center">
                                            {a.createdDate}
                                    </td>
                                    <td className="text-center">
                                        <StatusComponent state={a.status} />
                                    </td>
                                    <td>
                                        <Dropdown>
                                            <Dropdown.Toggle
                                                variant
                                                className="icon-false table-dropdown"
                                            >
                                                <svg
                                                    width="24px"
                                                    height="24px"
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
                                                <Dropdown.Menu>
                                                    <Dropdown.Item to="#" onClick={() => onSetAgentState({ status: 1, agent: a })}>
                                                    Accept
                                                </Dropdown.Item>
                                                <Dropdown.Item to="#" onClick={() => onSetAgentState({ status: 2, agent: a })}>
                                                    Reject
                                                </Dropdown.Item>
                                                    <Dropdown.Item to="#" onClick={() => deleteAgent(a.id)}>
                                                    Delete
                                                </Dropdown.Item>
                                                <Dropdown.Item to="#" onClick={() => onSetAgentState({ status: 100, agent: a })}>
                                                    View Details
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </td>
                                    </tr>

                                    ))
                            }
                            </tbody>
                     </table>
                     <div className="d-flex justify-content-between align-items-center mt-3">
                        <div className="dataTables_info">
                            Showing {currentPage * sort + 1} to 
                            {filteredAgents.length >
                                (currentPage + 1) * sort
                                ? filteredAgents.length
                                : (currentPage + 1) * sort}
                            of {agents.length} entries
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
                                        filteredAgents &&
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

export default Agents;
