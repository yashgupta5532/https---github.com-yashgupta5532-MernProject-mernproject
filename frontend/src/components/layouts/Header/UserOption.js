import React, { Fragment, useState } from "react";
import Backdrop from '@material-ui/core/Backdrop'
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";
import { Dashboard, Person, ExitToApp, ListAlt } from "@material-ui/icons";
import history from "../../Product/History";
import { useAlert } from "react-alert";
import { useDispatch } from "react-redux";
import { logout } from "../../../actions/userAction";
import './Header.css'

const UserOption = ({ user }) => {
  const [open, setOpen] = useState(false);
  const alert = useAlert();
  const dispatch = useDispatch();

  const dashboard = () => {
    history.push("/dashboard");
  };
  const orders = () => {
    history.push("/orders");
  };
  const account = () => {
    history.push("/account");
  };
  const logoutUser = () => {
    dispatch(logout());
    alert.success("Logout successfully");
  };

  const options = [
    { icon: <Person />, name: "Profile", func: account },
    { icon: <ListAlt />, name: "Orders", func: orders },
    { icon: <ExitToApp />, name: "Logout", func: logoutUser },
  ];
  if (user.role === "admin") {
    options.unshift({
      icon: <Dashboard />,
      name: "Dashboard",
      func: dashboard,
    });
  }

  return (
    <Fragment>
      <Backdrop open={open} style={{zIndex:"10"}}/>
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        style={{zIndex:"11"}}
        open={open}
        direction="down"
        className="speedDial"
        icon={
          <img
            className="speedDialIcon"
            src={user.avatar.url ? user.avatar.url : "/profile.png"}
            alt="Profile"
          />
        }
      >
        {options.map((item) => (
          <SpeedDialAction
            icon={item.icon}
            tooltipTitle={item.name}
            onClick={item.func}
            key={item.name}
          />
        ))}
      </SpeedDial>
    </Fragment>
  );
};

export default UserOption;
