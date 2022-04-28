import React, {ChangeEvent, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import Loading from "../Loading/Loading";
import {ErrorLabel, InputField, SpecialButton} from "./AuthenticationComponents";
import {Hover} from "../Dashboard/Components";
import {APIError, fetchLogin} from "../APIRequests";

function Header() {
    const navigate = useNavigate();

    function signUpButtonClick() {
        navigate('/register');
    }

    return <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative',
        alignItems: 'center',
    }}>
        <div style={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'right',
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: 32,
                margin: 16,
                background: '#27293D',
                color: 'white',
                fontSize: 20,
                userSelect: 'none',
            }} onClick={signUpButtonClick}>
                <Hover style={{padding: 19.5, borderRadius: 32}}>SIGN UP</Hover>
            </div>
        </div>
    </header>
}

function Login() {
    const navigate = useNavigate();
    const form = useRef<HTMLFormElement>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [errorVisible, setErrorVisible] = useState(false);
    const [loadingVisible, setLoadingVisible] = useState(false);

    async function submit() {
        setLoadingVisible(true);
        try {
            const data = await fetchLogin(email, password);
            if (data.token_type === 'bearer' && data.access_token) {
                localStorage.setItem("user", JSON.stringify(data));
                navigate('/');
            } else {
                setError('Unexpected Error');
                setErrorVisible(true);
            }
        } catch (e) {
            if (e instanceof APIError) {
                setError(e.message);
                setErrorVisible(true);
            } else {
                setError('Unexpected Error');
                setErrorVisible(true);
            }
        } finally {
            setLoadingVisible(false);
        }
    }

    function handleChange(valueSetter: (value: string) => void, event: ChangeEvent<HTMLInputElement>) {
        valueSetter(event.target.value);
    }

    return <>
        <Loading visible={loadingVisible}/>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            minHeight: '100vh',
            background: '#1E1E26',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
        }}>
            <Header/>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                flexGrow: 1,
                padding: 10,
            }}>
                <form ref={form} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 20,
                }}>
                    <span style={{
                        fontSize: 36,
                        color: 'white',
                        margin: '0 10px 0 10px',
                    }}>Welcome back!</span>
                    <span style={{
                        fontSize: 24,
                        color: '#BFBFBF',
                        margin: '0 10px 0 10px',
                    }}>Please login to your account</span>
                    <ErrorLabel visible={errorVisible}>{error}</ErrorLabel>
                    <InputField label='Email' onChange={event => handleChange(setEmail, event)} type='email' required/>
                    <InputField label='Password' minLength={8} type="password"
                                onChange={event => handleChange(setPassword, event)} required/>
                    <SpecialButton onClick={() => {
                        submit();
                    }}>LOGIN</SpecialButton>
                </form>
            </div>
        </div>
    </>
}


export default Login;