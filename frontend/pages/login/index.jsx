import React, {useEffect} from "react";
import UserLayout from "../layout/userLayout/index.jsx";
import styles from "@/styles/Home.module.css";
import {useSelector} from "react-redux";
import {useRouter} from "next/router.js";


export default function loginComponent(){
    const authState=useSelector((state)=>state.auth)

    const router=useRouter();
useEffect(()=>{
    if(authState.loggedIn){
        router.push("/dashboard")
    }
})
    return (
      <UserLayout>
          <div className={styles.cardContainer}>
<div className={styles.cardContainer_left}>
<p>{isLoginMethod?"Sign in":"Sign up"}</p>
</div>
              <div className={styles.cardContainer_right}>

              </div>
              
          </div>
      </UserLayout>
    )
}

