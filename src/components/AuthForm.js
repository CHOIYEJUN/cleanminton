import React, {useState} from "react";
import {gql, useMutation, useQuery} from "@apollo/client";
import client from "../client";
import { useNavigate  } from "react-router-dom";



const LOGIN_USER = gql`
    query LoginUser($userId: String, $password: String, $seq: Int) {
        loginUser(userId: $userId, password: $password, seq: $seq) {
            userId
            password
            seq
            name
        }
    }
`;

const LOGIN_MUTATION = gql`
    mutation Login($userId: String!, $seq: Int!, $password: String!) {
        login(userId: $userId, seq: $seq, password: $password) {
            token
            ok
            error
            userID
        }
    }
`;


const AuthForm = () => {

    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate ();
    let UserData = null;
    const [loginMutation] = useMutation(LOGIN_MUTATION);


    const [newAccount, setNewAccount] = useState(true);
    const toggleAccount = () => setNewAccount((prev) => !prev);

    const onChange = (event) =>{
        const {target: {name, value}} = event;
        if(name === "userId"){
            setUserId(value);
        }else if(name === "password"){
            setPassword(value);
        }else if(name === "passwordCheck"){
            if (password !== value) {
                setPasswordCheck(value);
                setError("비밀번호가 일치하지 않습니다.");
            }else {
                setPasswordCheck(value);
                setError("");
            }
        } else if(name === "name"){
            setName(value);
        }
    }

    const onsubmit = async (event) => {
        event.preventDefault();
        if(newAccount){
            if(password !== passwordCheck){
                setError("비밀번호가 일치하지 않습니다.");
                return;
            }

        }else {
            try{
                const loginInfo  = await loginMutation({
                    variables: {
                        userId,
                        password,
                        seq: 1,
                    },
                });

                UserData = loginInfo.data.login;
                console.log(UserData);

                if(!UserData.ok){
                    setError("아이디 혹은 비밀번호가 일치하지 않습니다.");
                    return;
                }else if (UserData.ok){
                    localStorage.setItem("token", UserData.token);
                    navigate("/home");

                }

            }catch(e){
                console.log(e.message);
            }
        }

    }

        return (
            <form onSubmit={onsubmit} className="container">
                <input
                    name="userId"
                    type="text"
                    placeholder="ID"
                    required
                    value={userId}
                    onChange={onChange}
                    className="authInput"
                />

                {newAccount && (
                    <input
                        name="name"
                        type="text"
                        placeholder="name"
                        required
                        value={name}
                        onChange={onChange}
                        className="authInput"
                    />
                )}

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