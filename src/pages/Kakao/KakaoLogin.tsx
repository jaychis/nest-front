import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { UsersKakaoOAuthRedirectAPI } from "../api/OAuthApi";

const KakaoLogin = () => {
  const [params, setParams] = useSearchParams();
  useEffect(() => {
    console.log("params : ", params);
    const CODE: string = params.get("code") as string;
    console.log("CODE : ", CODE);

    UsersKakaoOAuthRedirectAPI({ code: CODE })
      .then((res) => {
        if (!res) return;
        console.log("res : ", res.data.response);
        alert(res.data.response);
      })
      .catch((err) => console.log("UsersKakaoOAuthRedirectAPI error : ", err));
  }, []);

  return <>{"Kakao Login"}</>;
};

export default KakaoLogin;
