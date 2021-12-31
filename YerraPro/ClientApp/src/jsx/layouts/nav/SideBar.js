import React, { Component, useEffect } from "react";
import { Link } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import MetisMenu from "metismenujs";
 import drump from "../../../images/sidebarIcon.png";
import { useSelector } from "react-redux"

class MM extends Component {
   componentDidMount() {
      this.$el = this.el;
      this.mm = new MetisMenu(this.$el);
   }
   componentWillUnmount() {
      // this.mm("dispose");
      // console.log(this.mm);
   }
   render() {
      return (
         <div className="mm-wrapper">
            <ul className="metismenu" ref={(el) => (this.el = el)}>
               {this.props.children}
            </ul>
         </div>
      );
   }
}

const SideBar = (props) => {

    const user = useSelector(state => state.auth.auth)
   useEffect(() => {
      var btn = document.querySelector(".nav-control");
      var aaa = document.querySelector("#main-wrapper");

      function toggleFunc() {
         return aaa.classList.toggle("menu-toggle");
      }

      btn.addEventListener("click", toggleFunc);   

   }, []);

   let path = window.location.pathname;
   path = path.split("/");
   path = path[path.length - 1];

   return (
      <div className="deznav">
         <PerfectScrollbar className="deznav-scroll">
            <MM className="metismenu" id="menu">
               <li
                  className={`${
                     path === '' ? "mm-active" : ""
                  }`}
               >
                  <Link to="/">
                     <i className="flaticon-381-networking"></i>
                     <span className="nav-text">Dashboard</span>
                  </Link>
               </li>
               <li
                  className={`${
                     path === 'admins' ? "mm-active" : ""
                  }`}
               >
                  <Link to="/admins">
                     <i className="flaticon-381-television"></i>
                     <span className="nav-text">Admins</span>
                  </Link>
                </li>
                   {
                       user.roles[0] === "SuperAdmin" &&
                       <li
                           className={`${path === 'companies' ? "mm-active" : ""
                               }`}
                       >
                           <Link to="/companies">
                               <i className="flaticon-381-television"></i>
                               <span className="nav-text">Companies</span>
                           </Link>
                       </li>
                   }
                   {
                       user.roles[0] === "CompanyAdmin" &&
                       <li
                           className={`${path === 'agents' ? "mm-active" : ""
                               }`}
                       >
                           <Link to="/agents">
                               <i className="flaticon-381-television"></i>
                               <span className="nav-text">Agents</span>
                           </Link>
                       </li>
                   }
                    <li
                        className={`${path === 'gprocesses' ? "mm-active" : ""
                            }`}
                    >
                        <Link to={`/processes/${user.roles[0] === "SuperAdmin" ? "-1" : "-2"}`}>
                            <i className="flaticon-381-layer-1"></i>
                            <span className="nav-text">Processes</span>
                        </Link>
                   </li>
                   {
                       user.roles[0] === "CompanyAdmin" &&
                       <li
                           className={`${path === 'company-profile' ? "mm-active" : ""}`}
                       >
                           <Link to={`/company-profile/${user.companyId}`}>
                               <i className="flaticon-381-layer-1"></i>
                               <span className="nav-text">Profile</span>
                           </Link>
                       </li>
                   }
            </MM>
            <div className="drum-box mt-5">
               <img src={drump} alt="" width={100}/>
               <p className="fs-18 font-w500 mb-4">
                  Start Plan Your Workout
               </p>
               
            </div>

           
         </PerfectScrollbar>
      </div>
   );
}

export default SideBar;
