import { useEffect, useRef, useState } from "react";
import { useFirebase } from "../store/firebase";

export const Dashboard = () => {
    const [weatherData, setWeatherData] = useState({});
    const [currCity, setCurrCity] = useState();
    const city = useRef();
    const firebase = useFirebase();
    const [users, setUsers] = useState([]);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");

    useEffect(() => {
        const apiKey = "03f7c2d4680e71c9b1e2996aaf085764";
        const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
        fetch(apiUrl + currCity + `&appid=${apiKey}`)
            .then((res) => res.json())
            .then((data) => setWeatherData(data))
            .catch((err) => console.log(err.message));
    }, [currCity]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await firebase.listAllUsers();
                setUsers(usersData);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, [firebase]);

    const handleSort = (column) => {
        setSortBy(column);
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    };

    const sortedUsers = users.slice().sort((a, b) => {
        if (sortOrder === "asc") {
            if (sortBy === "email") {
                return a.email.localeCompare(b.email);
            } else if (sortBy === "createdAt") {
                return a.createdAt - b.createdAt;
            } else if (sortBy === "status") {
                return a.status.localeCompare(b.status);
            }
        } else {
            if (sortBy === "email") {
                return b.email.localeCompare(a.email);
            } else if (sortBy === "createdAt") {
                return b.createdAt - a.createdAt;
            } else if (sortBy === "status") {
                return b.status.localeCompare(a.status);
            }
        }
    });

    const handleDelete = async (userId) => {
        try {
            await firebase.deleteUserFromFirestore(userId);
            setUsers(users.filter(user => user.id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleStatusChange = async (userId) => {
        try {

            const user = users.find(user => user.id === userId);

            const newStatus = user.status === "active" ? "inactive" : "active";
            await firebase.updateUserStatusInFirestore(userId, newStatus);

            setUsers(users.map(user =>
                user.id === userId ? { ...user, status: newStatus } : user
            ));
        } catch (error) {
            console.error("Error changing user status:", error);
        }
    };

    return (
        <>
            <header className="p-3 text-bg-dark">
                <div className="container">

                    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">

                        <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                            <div className="weather-info">

                                <>
                                    <img src="/sun-behind-cloud.svg" alt="Weather Icon" className="me-2" style={{ width: '60px', height: '60px' }} />
                                    <h2 className="text-white fs-4 mb-0">Weather</h2>
                                </>

                            </div>
                            <div>
                                {weatherData.main &&
                                    <>
                                        <p className="text-white fs-4 mb-0">Temperature: {weatherData.main.temp}°C</p>
                                        <p className="text-white fs-4 mb-0">Location: {weatherData.name}</p>
                                    </>
                                }
                            </div>
                        </ul>

                        <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search" onSubmit={(e) => {
                            e.preventDefault()
                        }}>
                            <input type="search" className="form-control form-control-dark text-bg-light" placeholder="Enter your location" aria-label="Search" ref={city} />
                        </form>

                        <div className="text-end">
                            <button type="button" className="btn btn-warning" onClick={(e) => {
                                e.preventDefault();
                                setCurrCity(city.current.value);
                                city.current.value = ""
                            }}>Search</button>
                        </div>
                    </div>

                </div>
            </header>
            <table className="table user-data">
                <thead>
                    <tr>
                        <th scope="col" onClick={() => handleSort("email")}>
                            User name {sortBy === "email" && sortOrder === "asc" && "▲"}
                            {sortBy === "email" && sortOrder === "desc" && "▼"}
                        </th>
                        <th scope="col" onClick={() => handleSort("createdAt")}>
                            Added date {sortBy === "createdAt" && sortOrder === "asc" && "▲"}
                            {sortBy === "createdAt" && sortOrder === "desc" && "▼"}
                        </th>
                        <th scope="col" onClick={() => handleSort("status")}>
                            Status {sortBy === "status" && sortOrder === "asc" && "▲"}
                            {sortBy === "status" && sortOrder === "desc" && "▼"}
                        </th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {sortedUsers.map((user, index) => (
                        <tr key={index}>
                            <td>{user.email}</td>
                            <td>{firebase.formatTimestamp(user.createdAt)}</td>
                            <td>{user.status}</td>
                            <td>
                                <button
                                    type="button"
                                    className="btn btn-danger buton"
                                    onClick={() => handleDelete(user.id)}
                                >
                                    Delete
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary buton"
                                    onClick={() => handleStatusChange(user.id)}
                                >
                                    Change Status
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}