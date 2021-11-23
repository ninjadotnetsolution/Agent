import React, { Component, useState, useEffect } from "react";

/// Link
import { Link } from "react-router-dom";

/// Scroll
import PerfectScrollbar from "react-perfect-scrollbar";

/// Menu
import MetisMenu from "metismenujs";

///
 import drump from "../../../images/card/drump.png";


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
                  <span className="nav-text">Home</span>
               </Link>
               </li>
               <li
                  className={`${
                     path === 'agents' ? "mm-active" : ""
                  }`}
               >
               <Link to="/agents">
                  <i className="flaticon-381-television"></i>
                  <span className="nav-text">Agents</span>
               </Link>
               </li><li
                  className={`${
                     path === 'gprocesses' ? "mm-active" : ""
                  }`}
               >
               <Link to="/processes/-1">
                  <i className="flaticon-381-layer-1"></i>
                  <span className="nav-text">Processes</span>
               </Link>
               </li>


            </MM>
            <div className="drum-box mt-5">
               <img src={drump} alt="" />
               <p className="fs-18 font-w500 mb-4">
                  Start Plan Your Workout
               </p>
               
            </div>

           
         </PerfectScrollbar>
      </div>
   );
}

export default SideBar;
