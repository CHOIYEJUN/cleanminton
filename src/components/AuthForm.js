import React, {useState} from "react";

const AuthForm = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");

    const [newAccount, setNewAccount] = useState(true);
    const toggleAccount = () => setNewAccount((prev) => !prev);

    const onChange = (event) =>{
        const {target: {name, value}} = event;
        if(name === "email"){
            setEmail(value);
        }else if(name === "password"){
            setPassword(value);
        }else if(name === "passwordCheck"){
            if (password !== value) {
                setError("비밀번호가 일치하지 않습니다.");
            } else {
                setPasswordCheck(value);
            }
        }
    }

    const onsubmit = async (event) => {
        event.preventDefault();
        try {
            let data;
            if (newAccount) {
                // create account
                console.log(data);

            } else {
                // log in
                console.log(data);
            }
            console.log(data);
        } catch (error) {
            console.log(error.message);
            setError(error.message);
            alert(error.message);
        }
    }

        return (
            <form onSubmit={onsubmit} className="container">
                <input
                    name="email"
                    type="text"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={onChange}
                    className="authInput"
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={onChange}
                    className="authInput"
                />

                {newAccount && (
                    <input
                        name="passwordCheck"
                        type="password"
                        placeholder="passwordCheck"
                        required
                        value={passwordCheck}
                        onChange={onChange}
                        className="authInput"
                    />
                )}

                <input
                    name="submit"
                    type="submit"
                    value={newAccount ? "Create Account" : "Log In"}
                    onClick={onsubmit}
                    className="authInput authSubmit"
                />
                {error && <span className="authError">{error}</span>}
                <span className="authSwitch" onClick={toggleAccount}>{newAccount ? "log in " : "Create Account"}</span>
            </form>
        );
}

export default AuthForm;