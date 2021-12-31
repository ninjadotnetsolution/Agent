import React from "react";
import LogoutPage from './Logout';
import { useSelector } from "react-redux"

const Header = () => {
	const user = useSelector(state => state.auth.auth)
  
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
							  {user.email}
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
