import React from "react";
import styles from "@/styles/Home.module.css";
import {useRouter} from "next/router.js";


export default function NavbarComponent(){
const router =useRouter();
    return(
    <div className={styles.container}>
        <nav className={styles.navBar}>
            <h2 onClick={ ()=>{
                router.push("/")
            }}>Pro Connect</h2>
            <div className={styles.navbarOptionContainer}></div>
<div onClick={ ()=>{
    router.push("/login")
}
} className={styles.navButtonJoin}>
be a part
</div>

        </nav>

    </div>
)
}