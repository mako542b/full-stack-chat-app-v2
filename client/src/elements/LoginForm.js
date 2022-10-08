import { useEffect } from "react"

export const LoginForm = ({
    loginClick,
    setLogin,
    login
}) => {

    useEffect(() => {
        const anonFun = (e) => {
            if(e.code === 'Enter'){
                document.querySelector('button').click()
            }
        }
        document.addEventListener('keydown', anonFun)
        return () => {
            document.removeEventListener('keydown', anonFun)
        }
    }, [])

    return(
        <div className="login-form">
            <label htmlFor='login'>Your login</label>&nbsp;
            <input type='text'
               required='required' 
               onChange={(e) => setLogin(e.target.value)} 
               value={login}
               maxLength={8}></input>
            <button onClick={loginClick}>Login</button>
        </div>
    )
}