import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { ProfileAPI } from "../api/UserApi";

const Profile = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    console.log("user : ", user);
  }, [user]);

  useEffect(() => {
    dispatch(ProfileAPI({ id: "54870c90-ab34-4555-ad44-338c0478670b" }));
    //   ProfileAPI({ id: "54870c90-ab34-4555-ad44-338c0478670b" })
    //     .then((res) => {
    //       const response = res.data.response;
    //       console.log("response : ", response);
    //     })
    //     .catch((err) => console.error(err));
  }, [dispatch]);
  return (
    <>
      <div>방가</div>
      <div>email : {user.email ? user.email : "email please"}</div>
      <div>password: {user.password ? user.password : "password please"}</div>
    </>
  );
};

export default Profile;
