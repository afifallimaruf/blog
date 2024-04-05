import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react"
import { useState } from "react"
import {  useDispatch, useSelector } from "react-redux"
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice.js"
import {Link, useNavigate} from "react-router-dom"
import GoogleAuth from "../components/GoogleAuth" 

const SignIn = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { loading, error: errorMessage } = useSelector((state) => state.user);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubmit = async(e)=> {
        e.preventDefault()

        if (!email || !password) {
            dispatch(signInFailure("Please fill out all fields"))
        }

        try {
            dispatch(signInStart())
            const res = await fetch("http://localhost:4000/api/auth/sign-in", {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email,
                password
            })
        })

        const data = await res.json()
        
        if (data.success === false) {
            dispatch(signInFailure(data.message))
        }

        if (res.ok) {
            dispatch(signInSuccess(data))
            navigate("/")
        }
        } catch (error) {
            dispatch(signInFailure(error))
        }
    }
    
    return (
        <div className="min-h-screen mt-10 mx-48">
        <form onSubmit={handleSubmit}>
        <div className="flex max-w-md flex-col gap-4 mx-14">
            <div className="mb-2">
            <Label value="Your email" />
            <TextInput
            type="email"
            placeholder="user@example.com"
            id="email"
            onChange={(e)=> setEmail(e.target.value.trim())}/>
            </div>
            <div className="mb-2">
            <Label value="Your password" />
            <TextInput
            type="password"
            placeholder="********"
            id="password"
            onChange={(e)=> setPassword(e.target.value.trim())}/>
            </div>
            <Button gradientDuoTone="greenToBlue" type="submit" disabled={loading}>
            {
                loading ? (
                    <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                    </>
                ) : "Sign In"
            }
            </Button>
            <GoogleAuth />
            <div className='flex gap-2 text-sm mt-3'>
            <span>Don't have an account?</span>
            <Link to='/sign-up' className='text-blue-500'>
            Sign Up
            </Link>
        </div>
        {
                errorMessage && (
                    <Alert className="mt-5" color="failure">
                        {errorMessage}
                    </Alert>
                )
            }
    </div>
        </form> 
        </div>
    )
}

export default SignIn