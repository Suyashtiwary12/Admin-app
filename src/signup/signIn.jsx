import { useFirebase } from "../store/firebase";
import { useRef,useState } from "react";


export function SignIn({ onSwitchMode , toRenderdash}) {
    const firebase = useFirebase();
    const Email = useRef();
    const pass = useRef();
    const [error, setError] = useState(false);

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


            await firebase.loginWithEmailAndPassword(email, password).then(() => {
                toRenderdash(true);
            }).catch((err) => {
                console.log(err);
                setError(true);
            })
        } catch (error) {
            console.error("Error signing up:", error);
        }
        Email.current.value = "";
        pass.current.value = "";
    };

    return (
        <>
            <main className="form-signin w-100 m-auto">
                <form>
              
                    <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

                    <div className={`form-floating ${error ? 'has-danger' : ''}`}>
                        <input type="email" required className={`form-control ${error ? 'is-invalid' : ''}`} id="floatingInput" placeholder="name@example.com" ref={Email} />
                        <label htmlFor="floatingInput">Email address</label>
                    </div>
                    <div className={`form-floating ${error ? 'has-danger' : ''}`}>
                        <input type="password" required className={`form-control ${error ? 'is-invalid' : ''}`} id="floatingPassword" placeholder="Password" ref={pass} />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>

                    <div className="form-check text-start my-3">
                        <input className="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault" />
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                            Remember me
                        </label>
                    </div>
                    <button className="btn btn-primary w-100 py-2" type="submit" onClick={handleSignUp}>Sign in</button>
                    <p className="mt-5 mb-3 text-body-secondary">
                        Haven't Registered <a href="#" onClick={onSwitchMode}>Sign up</a></p>
                </form>
            </main>
        </>
    );
}