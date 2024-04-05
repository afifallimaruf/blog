import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react"
import { useState } from "react"
import {Link, useNavigate} from "react-router-dom"
import GoogleAuth from "../components/GoogleAuth"

const Signup = () => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async(e)=> {
        e.preventDefault()

        if (!username || !email || !password) {
            return setErrorMessage("Please fill out all fields")
        }

        try {
            setLoading(true)
            setErrorMessage(null)
            const res = await fetch("http://localhost:4000/api/auth/sign-up", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                username,
                email,
                password
            })
        })

        const data = await res.json()
        
        if (data.success === false) {
            setErrorMessage(data.message)
            setLoading(false)
        }

        if (res.ok) {
            navigate("/sign-in")
        }
        } catch (error) {
            setErrorMessage(error)
            setLoading(false)
        }
    }
    
    return (
        <div className="min-h-screen mt-10 mx-48">
        <form onSubmit={handleSubmit}>
        <div className="flex max-w-md flex-col gap-4 mx-14">
            <div className="mb-2">
            <Label value="Your username" />
            <TextInput
            type="text"
            placeholder="Username"
            id="username"
            onChange={(e)=> setUsername(e.target.value.trim())}/>
            </div>
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
            placeholder="Password"
            id="password"
            onChange={(e)=> setPassword(e.target.value.trim())}/>
            </div>
            <Button gradientDuoTone="greenToBlue" type="submit">
            {
                loading ? (
                    <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                    </>
                ) : "Sign Up"
            }
            </Button>
            <GoogleAuth />
            <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
            <Link to='/sign-in' className='text-blue-500'>
            Sign In
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

export default Signup