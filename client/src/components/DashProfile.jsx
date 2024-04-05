import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutSuccess } from '../redux/user/userSlice.js'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase.js'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { Link } from 'react-router-dom'

function DashProfile() {
    const { currentUser, error, loading } = useSelector((state)=> state.user)
    const [imageFile, setImageFile] = useState(null)
    const [formData, setFormData] = useState({})
    const [imageFileUrl, setImageFileUrl] = useState(null)
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
    const [imageFileUploadError, setImageFileUploadError] = useState(null)
    const [imageFileUploading, setImageFileUploading] = useState(false)
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
    const [updateUserError, setUpdateUserError] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const uploadImgRef = useRef()
    const dispatch = useDispatch()

    const handleFileChange = (e)=> {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            setImageFileUrl(URL.createObjectURL(file))
        }
    }
    
    useEffect(()=> {
        if (imageFile) {
            uploadFile()
        }
    }, [imageFile])

    const uploadFile = async()=> {
        // service firebase.storage {
        //     match /b/{bucket}/o {
        //     match /{allPaths=**} {
        //         allow read;
        //         allow write: if
        //         request.resource.size < 2 * 1024 * 1024 &&
        //         request.resource.contentType.matches('image/.*')
        //     }
        //     }
        // }

        setImageFileUploading(true)
        setImageFileUploadError(null)
        const storage = getStorage(app)
        const fileName = new Date().getTime() + imageFile.name
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, imageFile)
        uploadTask.on(
            "state_changed",
            (snapshot)=> {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setImageFileUploadProgress(progress.toFixed(0))
            },
            (error)=> {
                setImageFileUploadError('Could not upload image (File must be less than 2MB)' + error)
                setImageFileUploadProgress(null);
                setImageFile(null);
                setImageFileUrl(null);
                setImageFileUploading(false);
            },
            ()=> {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                    setImageFileUrl(downloadURL)
                    setFormData({ ...formData, profilePicture: downloadURL })
                    setImageFileUploading(false)
                })
            }
        )
    }

    const handleChange = (e)=> {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async(e)=> {
        e.preventDefault()
        setUpdateUserError(null);
        setUpdateUserSuccess(null);

        if (Object.keys(formData).length === 0) {
            setUpdateUserError('No changes made');
            return;
        }

        if (imageFileUploading) {
            setUpdateUserError('Please wait for image to upload');
            return
        }
        try {
            dispatch(updateStart())
            const res = await fetch(`http://localhost:4000/api/user/update/${currentUser._id}`, {
                method: "PUT",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (!res.ok) {
                dispatch(updateFailure(data.message))
                setUpdateUserError(data.message);
            } else {
                dispatch(updateSuccess(data))
                setUpdateUserSuccess("User's profile updated successfully");
            }
        } catch (error) {
            setUpdateUserError(error.message);
            dispatch(updateFailure(error.message))
        }
    }

    const handleDeleteUser = async()=> {
        setShowModal(false)
        try {
            dispatch(deleteUserStart())
            const res = await fetch(`http://localhost:4000/api/user/delete/${currentUser._id}`,{
                method: "DELETE",
                credentials: "include"
            })
            const data = await res.json()

            if (!res.ok) {
                dispatch(deleteUserFailure(data.message))
            } else {
                dispatch(deleteUserSuccess(data))
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message))
        }
    }

    const handleSignOut = async()=> {
        try {
            const res = await fetch("http://localhost:4000/api/user/sign-out", {
                method: "POST",
                credentials: "include"
            })

            const data = await res.json()

            if (!res.ok) {
                console.log(data.message)
            } else {
                dispatch(signOutSuccess())
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input type='file' accept='image/*' onChange={handleFileChange} ref={uploadImgRef} hidden />
                <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={()=> uploadImgRef.current.click()} >
                {imageFileUploadProgress && (
            <CircularProgressbar
                value={imageFileUploadProgress || 0}
                text={`${imageFileUploadProgress}%`}
                strokeWidth={5}
                styles={{
                root: {
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                },
                path: {
                    stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                    })`,
                    },
                }}
            />
            )}
                <img src={imageFileUrl ? imageFileUrl : currentUser.profilePicture} alt='User' className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
                imageFileUploadProgress &&
                imageFileUploadProgress < 100 &&
                'opacity-60'}`} />
                </div>
                {
                    imageFileUploadError && <Alert color='failure'>
                        {imageFileUploadError}
                    </Alert>
                }
                <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange} />
                <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChange} />
                <TextInput type='password' id='password' placeholder='password' onChange={handleChange} />
                <Button type='submit' gradientDuoTone='greenToBlue' outline disabled={loading || imageFileUploading}>
                    {
                        loading ? 'loading...': 'Update'
                    }
                </Button>
                {
                    currentUser.isAdmin && (
                        <Link to='/create-post'>
                            <Button gradientDuoTone='greenToBlue' className='w-full'>
                            Create a post
                            </Button>
                        </Link>
                    )
                }
            </form>
            <div className='text-red-500 flex justify-between mt-4'>
                <span onClick={()=> setShowModal(true)} className='cursor-pointer'>Delete Account</span>
                <span onClick={handleSignOut} className='cursor-pointer'>Sign Out</span>
            </div>
            {
                updateUserSuccess && (
                    <Alert color='success' className='mt-5'>
                        {updateUserSuccess}
                    </Alert>
                )
            }
            {
                updateUserError && (
                    <Alert color='failure'>
                        {updateUserError}
                    </Alert>
                )
            }
            {
                error && (
                    <Alert color='failure'>
                        {error}
                    </Alert>
                )
            }
            <Modal show={showModal} onClose={()=> setShowModal(false)} popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account?</h3>
                        <div className='flex justify-center gap-4'>
                            <Button onClick={handleDeleteUser} color='failure'>
                                Yes, I'm sure
                            </Button>
                            <Button color='gray' onClick={()=> setShowModal(false)}>No, cancel</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default DashProfile