import React, { useState, useEffect, useContext, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const toast = useRef(null);

  useEffect(() => {
    checkPasswords();
  }, [password, checkPassword]);

  const checkPasswords = () => {
    console.log('password', password);
    console.log('checkPassword', checkPassword);

    if (
      password === checkPassword &&
      password.length !== 0 &&
      checkPassword.length !== 0
    ) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  };

  const handleSubmit = () => {
    let inputs = {
      username: username,
      password: password,
    };
    fetch(`http://localhost:3000/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    })
      .then((response) => response.json())
      .then((dataBack) => {
        console.log('dataBack', dataBack);
        if (dataBack.message === 'User registered successfully') {
          toast.current.show({
            severity: 'success',
            summary: 'Info',
            detail: `Account successfully registered`,
          });
        } else {
          toast.current.show({
            severity: 'error',
            summary: 'Warning!',
            detail: `${dataBack.message}`,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <Toast ref={toast} />
      <InputText
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      ></InputText>
      <Password
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        feedback={false}
      ></Password>
      <Password
        value={checkPassword}
        onChange={(e) => setCheckPassword(e.target.value)}
        placeholder="Confirm Password"
        feedback={false}
      ></Password>
      <Button
        label="Register"
        icon="pi pi-check"
        disabled={submitDisabled}
        onClick={handleSubmit}
      />
    </div>
  );
}
