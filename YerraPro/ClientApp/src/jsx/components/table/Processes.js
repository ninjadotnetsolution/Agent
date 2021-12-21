import React, { Fragment, useState, useEffect } from "react";
import {  Pagination, Badge, Dropdown, Button, Modal, Table } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { BASE_URL } from "../../../constance/index.js";
import axios from 'axios'
import { useInterval } from "../UseInterval.js";

const StatusComponent = ({state}) => {
   switch (state) {
      case 0:
         return <Badge variant="success light">
            <i className="fa fa-circle text-success mr-1"></i>
            Current
         </Badge>
      case 1:
         return <Badge variant="danger light">
            <i className="fa fa-circle text-danger mrmr-1"></i>
            Always
         </Badge>
      case 2:
         return <Badge variant="warning light">
            <i className="fa fa-circle text-warning mr-1"></i>
            Global
         </Badge>
   
      default:
           return <Badge variant="success light">
               <i className="fa fa-circle text-success mr-1"></i>
               Current
           </Badge>
   }
}
const Processes = () => {

    const [ processes, setProcesses ] = useState([])
    const [ filteredProcesses, setFilteredProcesses ] = useState([]);
    const [ currentPage, setCurrentPage ] = useState(0);
    const [ byFilter, setByFilter ] = useState(100);
    const [paggination, setPaggination] = useState([]);
    const [newProcesses, setNewProcesses] = useState([]);
    const params = useParams();

    const sort = 8;

    useEffect(() => {
        axios.get(`${BASE_URL}/api/process/${params.agentId}`)
            .then(res => {
                setProcesses(res.data);
            });
    }, [])

    useInterval(() => {
        axios.get(`${BASE_URL}/api/process/${params.agentId}`)
            .then(res => {
                setProcesses(res.data);
            });
    }, 5000)

    useEffect(() => {

        let cnt = processes.length > sort ? sort : (processes.length - currentPage * sort);
        setFilteredProcesses(processes.filter(o => byFilter === 100 ? true : byFilter === 2 ? o.target === byFilter : o.target === byFilter && o.agentId === params.agentId).slice(currentPage * sort, currentPage * sort + cnt));

    }, [processes, currentPage, byFilter])

    useEffect(() => {
        let paggination = Array(Math.ceil(processes.filter(o => byFilter === 100 ? true : byFilter === 2 ? o.target === byFilter : o.target === byFilter && o.agentId === params.agentId).length / sort))
            .fill()
            .map((_, i) => i + 1);
        setPaggination(paggination);

    }, [filteredProcesses])

    const onKeyDown = event => {
        if (event.key === 'Enter') {
            setNewProcesses([...newProcesses, event.target.value]);
            event.target.value = ''
        }
    }

    const onSetProcessState = (action, process) => {
        process.action = action;

        axios.put(`${BASE_URL}/api/process`, process)
            .then(res => {
                let changedProcess = processes.map(a => {
                    if (a.id === res.data.id) {
                        return res.data;
                    }
                    return a;
                })
                setProcesses(changedProcess);
            });
    }

    const onSetProcessTarget = (target, process) => {
        process.target = target;

        axios.put(`${BASE_URL}/api/process`, process)
            .then(res => {
                let changedProcess = processes.map(a => {
                    if (a.id === res.data.id) {
                        return res.data;
                    }
                    return a;
                })
                setProcesses(changedProcess);
            });
    }

    const onDelete = (process) => {
        axios.delete(`${BASE_URL}/api/process/${process.id}`)
            .then(res => {
                let changedProcess = processes.filter(p => p.id != process.id)
                setProcesses(changedProcess);
            });
    }

    const onRemove = id => {
        setNewProcesses(newProcesses.filter((p, i) => i !== id))
    }

    const onSaveNewProcesses = () => {
        let sendProcess = []
        if (params.agentId === "-1") {
            sendProcess = newProcesses.map(p => ({
                Name: p,
                Action: false,
                Target: 2,
            }))
        } else {
            sendProcess = newProcesses.map(p => ({
                Id: 0,
                Name: p,
                Action: false,
                Target: 1,
                AgentId: params.agentId
            }))
        }

        axios.post(`${BASE_URL}/api/process`, sendProcess)
            .then(res => {
                setProcesses([...processes, ...res.data]);
            });
    }

    const byFilterLabel = id => {
        switch (id) {
            case 0:
                return 'Current';
            case 1:
                return 'Always';
            case 2:
                return 'Global';
            default:
                return 'All';
        }
    }

   const [ modalCentered, setModalCentered ] = useState(false);
   
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

                     <Modal className="fade" show={modalCentered}>
                        <Modal.Header>
                           <Modal.Title>Modal title</Modal.Title>
                           <Button
                              onClick={() => setModalCentered(false)}
                              variant=""
                              className="close"
                           >
                              <span>&times;</span>
                           </Button>
                        </Modal.Header>
                        <Modal.Body>
                           <div className="form-group">
                              <input
                                   type="text"
                                   className="form-control input-rounded"
                                   placeholder="input-rounded"
                                   onKeyUp={onKeyDown}
                              />
                           </div>
                           <Table responsive>
                              <thead>
                                 <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Action</th>
                                 </tr>
                              </thead>
                               <tbody>
                                   {
                                       newProcesses.map((p, i) => (
                                           <tr key={ i}>
                                               <th>{ i+1}</th>
                                               <td>{p}</td>
                                               <td><Button variant="danger" onClick={() => onRemove(i)}>Delete</Button></td>
                                           </tr>
                                           ))
                                   }
                              </tbody>
                           </Table>
                        </Modal.Body>
                        <Modal.Footer>
                           <Button
                              onClick={() => setModalCentered(false)}
                              variant="danger light"
                           >
                              Close
                           </Button>
                           <Button variant="primary" onClick={onSaveNewProcesses}>Save changes</Button>
                        </Modal.Footer>
                     </Modal>

               </div>
            </div>
         <div className="row">
         <div className="col-12">
         <div className="card">
            <div className="card-header">
                <h4 className="card-title">Processes</h4>
                {
                    params.agentId !== '-1' &&
                    <Dropdown className="dropdown mt-sm-0 mt-3">
                        <Dropdown.Toggle
                            as="button"
                            variant=""
                            className="btn rounded border border-light dropdown-toggle"
                        >
                            {byFilterLabel(byFilter)}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                            <Dropdown.Item onClick={() => setByFilter(100)}>All</Dropdown.Item>
                            <Dropdown.Item onClick={() => setByFilter(0)}>Current</Dropdown.Item>
                            <Dropdown.Item onClick={() => setByFilter(1)}>Always</Dropdown.Item>
                            <Dropdown.Item onClick={() => setByFilter(2)}>Global</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                }
            </div>
            <div className="card-body">
               <Table responsive className="w-100">
                  <div id="example_wrapper" className="dataTables_wrapper">
                            <table id="example" className="display w-100 dataTable">
                                <thead>
                                    <tr role="row">
                                        <th >
                                            Name
                                        </th>
                                        <th>
                                            Status
                                        </th>
                                        <th>
                                            Category
                                        </th>
                                        <th>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        filteredProcesses.map((a, i) => (
                                            <tr key={i}>
                                                <td>
                                                    {a.name}
                                                </td>
                                                <td>
                                                    {a.action ? 'Hide' : 'Show'}
                                                </td>
                                                <td className="text-center">
                                                    <StatusComponent state={ a.target }/>
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
                                                            <Dropdown.Item to="#" onClick={() => onSetProcessState(false, a) } >
                                                                Show
                                                            </Dropdown.Item>
                                                            <Dropdown.Item to="#" onClick={() => onSetProcessState(true, a)} >
                                                                Hide
                                                            </Dropdown.Item>
                                                            {
                                                                params.agentId !== '-1' &&
                                                                <Dropdown.Item to="#" onClick={() => onSetProcessTarget(1, a)}>
                                                                    Always
                                                                </Dropdown.Item>
                                                            }
                                                            {
                                                                params.agentId === '-1' &&
                                                                <Dropdown.Item to="#" onClick={() => onDelete(a)}>
                                                                    Delete
                                                                </Dropdown.Item>
                                                            }
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
                                           {filteredProcesses.length >
                                               (currentPage + 1) * sort
                                               ? filteredProcesses.length
                                               : (currentPage + 1) * sort}
                                           of {processes.length} entries
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
                                                       filteredProcesses &&
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

export default Processes;
