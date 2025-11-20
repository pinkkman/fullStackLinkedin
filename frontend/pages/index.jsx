import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import {useRouter} from "next/router.js";
import userLayout from "./layout/userLayout/index.jsx";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"]
})

export default function Home() {
    const router =useRouter();
    return (
        <userLayout>
            <div className={styles.container}>
                <div className={styles.mainContainer}>
                    <div className={styles.mainContainer_left}>
                     <p>connect with people</p>
                        <p>a true companion</p>

                        <div onClick={()=>{
                            router.push("/login");
                        }}>
                            <button className={styles.buttonJoin}>join now</button>
                        </div>
                    </div>

<div className={styles.mainContainer_right}>
    <img className={styles.connectimg} src="/images/connect.png" alt=""/>
</div>
                </div>
            </div>

        </userLayout>

    )
}
