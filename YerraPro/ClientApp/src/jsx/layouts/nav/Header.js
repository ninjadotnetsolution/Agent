import React from "react";
import LogoutPage from './Logout';


const Header = () => {
  var path = window.location.pathname.split("/");
  var name = path[1];
  
  return (
    <div className="header">
		<div className="header-content">
			<nav className="navbar navbar-expand">
				<div className="collapse navbar-collapse justify-content-between">
					<div className="header-left">
						<div
							className="dashboard_bar"
							style={{ textTransform: "capitalize" }}
						  >
							  {name.length === 0
							  ? "Dashboard"
								  : name}
						</div>
					</div> 	
					<ul className="navbar-nav header-right">
						<div className="nav-item header-profile ">
							  <LogoutPage />
						</div>
					</ul>
				</div>
			</nav>
		</div>
    </div>
  );
};

export default Header;
