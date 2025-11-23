import React from "react";
import NavbarComponent from "../../components/navbar/index.jsx";


export default function UserLayout({children}){
    return ( <>
         <NavbarComponent/>
            {children}
         </>
    )
}