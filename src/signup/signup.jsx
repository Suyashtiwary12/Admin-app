import { useRef, useState } from "react";
import { useFirebase } from "../store/firebase";

export function SignUp({ onSwitchMode }) {
    const Email = useRef();
    const pass = useRef();
    const [error, setError] = useState(false);
    const firebase = useFirebase();
    const handleSignUp = async (e) => {
        e.preventDefault();
        const email = Email.current.value;
        const password = pass.current.value;
        try {

            if (!email) {
                console.error("Email is required");
                setError(true);
                return;
            }


            if (!password) {
                console.error("Password is required");
                setError(true);
                return;
            }


            await firebase.signupUserWithEmailAndPassword(email, password);
            alert("User registred now login to continue");
        } catch (error) {
            console.error("Error signing up:", error);
            setError(true);
        }
        Email.current.value = "";
        pass.current.value = "";

    };
    return (

        <>
            <main className="form-signin w-100 m-auto">
                <form>
                
                    <h1 className="h3 mb-3 fw-normal">Please sign up</h1>

                    <div className={`form-floating ${error ? 'has-danger' : ''}`}>
                        <input type="email" required className={`form-control ${error ? 'is-invalid' : ''}`} id="floatingInput" placeholder="name@example.com" ref={Email} />
                        <label htmlFor="floatingInput">Email address</label>
                    </div>
                    <div className={`form-floating ${error ? 'has-danger' : ''}`}>
                        <input type="password" required className={`form-control ${error ? 'is-invalid' : ''}`} id="floatingPassword" placeholder="Password" ref={pass} />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>

                    <div className="form-check text-start my-3">

                    </div>
                    <button className="btn btn-primary w-100 py-2" type="submit" onClick={handleSignUp}>Sign up</button>
                    <p className="mt-5 mb-3 text-body-secondary">
                        Already Registered <a href="#" onClick={onSwitchMode}>Click here</a> to login</p>
                </form>
            </main>
        </>
    );
}