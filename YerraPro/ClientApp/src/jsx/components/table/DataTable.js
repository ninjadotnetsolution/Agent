import React, { Fragment, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import PatientTable from "./PatientTable";

const DataTable = () => {

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
                              />
                           </div>
                           <Table responsive>
                              <thead>
                                 <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Status</th>
                                    <th>Price</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 <tr>
                                    <th>1</th>
                                    <td>Kolor Tea Shirt For Man</td>
                                 
                                    <td>January 22</td>
                                    <td className="color-primary">$21.56</td>
                                 </tr>
                                 <tr>
                                    <th>2</th>
                                    <td>Kolor Tea Shirt For Women</td>
                                 
                                    <td>January 30</td>
                                    <td className="color-success">$55.32</td>
                                 </tr>
                                 <tr>
                                    <th>3</th>
                                    <td>Blue Backpack For Baby</td>
                                 
                                    <td>January 25</td>
                                    <td className="color-danger">$14.85</td>
                                 </tr>
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
                           <Button variant="primary">Save changes</Button>
                        </Modal.Footer>
                     </Modal>

               </div>
            </div>
         <div className="row">
            <PatientTable></PatientTable>
         </div>
      </Fragment>
   );
};

export default DataTable;
