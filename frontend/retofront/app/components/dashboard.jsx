import React from 'react'
import axios from "axios";
export default function dashboard() {

    const getData = async () => {
        //Desarrollar la lógica para obtener los contactos del usuario
    }
    return (
        <div>
            <div>Dashboard</div>
            <button onClick={() => getData}>Retreive data</button>
        </div>
    )
}
