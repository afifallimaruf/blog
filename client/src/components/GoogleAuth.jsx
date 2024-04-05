import { Button } from "flowbite-react"
import { AiFillGoogleCircle } from "react-icons/ai"
import {useDispatch} from 'react-redux'
import {signInSuccess} from '../redux/user/userSlice.js'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from "../firebase"
import {useNavigate} from 'react-router-dom'

const GoogleAuth = () => {
    const auth = getAuth(app)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleGoogleAuth = async()=> {
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({prompt: 'select_account'})

        try {
            const results = await signInWithPopup(auth, provider)
            const res = await fetch("http://localhost:4000/api/auth/google-auth", {
                method: "POST",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    name: results.user.displayName,
                    email: results.user.email,
                    photoUrl: results.user.photoURL
                })
            })

            const data = await res.json()
            if (res.ok) {
                dispatch(signInSuccess(data))
                navigate("/")
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
    <Button type="button" gradientDuoTone="greenToBlue" outline onClick={handleGoogleAuth}>
    <AiFillGoogleCircle className="w-6 h-6 mr-2" />
    Continue with Google
    </Button>
    )
}

export default GoogleAuth