import {
  Favorite,
  LockOpen,
  LockOpenOutlined,
  MailOutline,
} from "@mui/icons-material";
import React, { Fragment, useEffect, useState } from "react";
import "./UpdatedProfile.css";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, loadUser, updatePassword } from "../../actions/userAction";
import { useAlert } from "react-alert";
import Loader from "../layouts/Loader/Loader";
import history from "../Product/History.js";
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstants.js";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { error, loading, isUpdated } = useSelector((state) => state.profile);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updateProfileSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("oldPassword", oldPassword);
    myForm.set("newPassword", setNewPassword);
    myForm.set("confirmPassword", setConfirmPassword);
    console.log(myForm)
    dispatch(updatePassword(myForm));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      alert.success("Password updated successfully");
      dispatch(loadUser())
      history.push("/account");

      dispatch({
        type: UPDATE_PASSWORD_RESET,
      });
    }
  }, [error, alert, dispatch, isUpdated]);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="updateProfileContainer">
            <div className="updateProfileBox">
              <h2 className="updateProfileHeading">Update Password</h2>
              <form
                className="updateProfileForm"
                encType="application/json"
                onSubmit={updateProfileSubmit}
              >
                <div className="loginPassword">
                  <LockOpen />
                  <input
                    type="password"
                    required
                    placeholder="old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <LockOpenOutlined />
                  <input
                    type="password"
                    required
                    placeholder="new Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <LockOpen />
                  <input
                    type="password"
                    required
                    placeholder="confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <input
                  type="submit"
                  value="Change "
                  className="updateProfileBtn"
                  disabled={loading ? true : false}
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default UpdatePassword;
