import React, { Fragment, useState, useEffect } from "react";
import {  Pagination, Badge, Dropdown, Button, Modal, Table } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { BASE_URL, storage } from "../../constance/index.js";
import axios from 'axios'
import { useInterval } from "../components/UseInterval.js";
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import authHeader from "../components/AuthHeader.js";
import swal from "sweetalert";
import profile from "../../images/sidebarIcon.png";
import { useSelector } from "react-redux"

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
    const [name, setName] = useState("");
    const [label, setLabel] = useState("");
    const [file, setFile] = useState("")
    const params = useParams();
    const user = useSelector(state => state.auth.auth);

    const sort = 8;

    useEffect(() => {
        if (params.agentId === "-2") {
            axios.get(`${BASE_URL}/api/process/bycompanyid/${user.companyId}`, { headers: authHeader() })
                .then(res => {
                    setProcesses(res.data);
                });
            return;
        }

        axios.get(`${BASE_URL}/api/process/${params.agentId}`, { headers: authHeader() })
            .then(res => {
                setProcesses(res.data);
            });
    }, [])

    useInterval(() => {
        if (params.agentId === "-1" || params.agentId === "-2") return;
        axios.get(`${BASE_URL}/api/process/${params.agentId}`, { headers: authHeader() })
            .then(res => {
                console.log(res.data)
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

    const onDelete = (id) => {
        axios.delete(`${BASE_URL}/api/process/${id}`, { headers: authHeader() })
            .then(res => {
                let changedProcess = processes.filter(p => p.id != id)
                setProcesses(changedProcess);
            });
    }


    const onSaveNewProcesse = () => {

        let companyId = null;
        let target = 1;
        let agentId = params.agentId;
        if (params.agentId === "-1") {
            target = 2;
            agentId = null;
        }
        if (params.agentId === "-2") {
            target = 3;
            agentId = null;
            companyId = user.companyId;
        }
        const storageRef = ref(storage, `job-site-files/${file.name}`);

		uploadBytes(storageRef, file).then((snapshot) => {
			getDownloadURL(snapshot.ref).then(url => {
                let newProgram = {
                    agentId, 
                    label,
                    name,
                    url,
                    target,
                    companyId,
                    action: false
                }

                console.log(newProgram)
                axios.post(`${BASE_URL}/api/process`, newProgram)
                    .then(res => {
                        swal("Process has been successfully created!", "", "success");
                        setProcesses([...processes, res.data]);
                    });
                setModalCentered(false)
			})
		})
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
                           <Modal.Title>New Program</Modal.Title>
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
                                <label className="mb-3 col-form-label">
                                    Label
                                </label>
                                <div>
                                    <input
                                        type="text"
                                        value={label}
                                        className="form-control"
                                        placeholder="Enter program label"
                                        onChange={e => setLabel(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="mb-3 col-form-label">
                                    Program name
                                </label>
                                <div>
                                    <input
                                        type="text"
                                        value={name}
                                        className="form-control"
                                        placeholder="Enter program name"
                                        onChange={e => setName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="mb-3 col-form-label">
                                    Image
                                </label>
                                <div className="input-group">
                              <div className="custom-file">
                                 <input
                                    type="file"
                                    className="custom-file-input"
                                    onChange={e => setFile(e.target.files[0])}
                                 />
                                 <label className="custom-file-label">
                                    Choose file
                                 </label>
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
                           <Button variant="primary" onClick={onSaveNewProcesse}>Save</Button>
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
                                        Label
                                    </th>
                                    <th>
                                        Program name
                                    </th>
                                    <th>
                                        Status
                                    </th>
                                    <th>
                                        Type
                                    </th>
                                    <th>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                     filteredProcesses
                                    .map((a, i) => (
                                        <tr key={i}>
                                            <td>
                                                <div className="media pt-3 pb-3">
                                                    <img
                                                        src={a.url ? a.url : profile}
                                                        alt=""
                                                        className="mr-3 rounded"
                                                        width={45}
                                                    />
                                                    <div className="media-body">
                                                        <h5 className="m-b-5">
                                                            <Link
                                                                to="#"
                                                                className="text-black"
                                                            >
                                                                {a.label}
                                                            </Link>
                                                        </h5>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                {a.name}
                                            </td>
                                            <td>
                                                {a.action ? 'Hide' : 'Show'}
                                            </td>
                                            <td >
                                                <StatusComponent state={ a.target }/>
                                            </td>
                                            <td>
                                            <Link
                                                to="#"
                                                style={{margin: "5px"}}
                                                className="btn btn-primary shadow btn-xs sharp"
                                            >
                                                <i className="fa fa-pencil"></i>
                                                </Link>
                                                {
                                                    a.action ?
                                                        <Link
                                                            to="#"
                                                            style={{ margin: "5px" }}
                                                            className="btn btn-success shadow btn-xs sharp"
                                                            onClick={() => onSetProcessState(false, a)}
                                                        >
                                                            <i className="fa fa-check"></i>
                                                        </Link> :
                                                        <Link
                                                            to="#"
                                                            style={{ margin: "5px" }}
                                                            className="btn btn-warning shadow btn-xs sharp"
                                                            onClick={() => onSetProcessState(true, a)}
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
