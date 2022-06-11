import React, {ChangeEvent, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import Loading from "../Components/Loading/Loading";
import {BackButton, ErrorLabel, InputField, SpecialButton} from "../Components/AuthenticationComponents";
import {APIError, fetchRegister} from "../APIRequests";


function Header() {
    const navigate = useNavigate();

    function backButtonClick() {
        navigate('/login');
    }

    return <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative',
        alignItems: 'center',
    }}>
        <BackButton outerStyle={{margin: 16}} onClick={backButtonClick}>
            chevron_left
        </BackButton>
    </header>
}

function SignUp() {
    const navigate = useNavigate();
    const form = useRef<HTMLFormElement>(null);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [errorVisible, setErrorVisible] = useState(false);
    const [loadingVisible, setLoadingVisible] = useState(false);

    async function submit() {
        setLoadingVisible(true);
        try {
            const data = await fetchRegister(fullName, email, password);
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
                    }}>Create account</span>
                    <span style={{
                        fontSize: 24,
                        color: '#BFBFBF',
                        margin: '0 10px 0 10px',
                    }}>Sign up and start the journey</span>
                    <ErrorLabel visible={errorVisible}>{error}</ErrorLabel>
                    <InputField label='Full name' type="text" autoComplete="name"
                                onChange={event => handleChange(setFullName, event)} required/>
                    <InputField label='Email' type="email"
                                onChange={event => handleChange(setEmail, event)} required/>
                    <InputField label='Password' minLength={8} type="password" autoComplete="new-password"
                                onChange={event => handleChange(setPassword, event)} required/>
                    <SpecialButton onClick={() => {
                        if (form && form.current) {
                            form.current.reportValidity();
                            if (form.current.checkValidity()) {
                                submit();
                            }
                        }
                    }}>SIGN UP</SpecialButton>
                </form>
            </div>
        </div>
    </>
}


export default SignUp;