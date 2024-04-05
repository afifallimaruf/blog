import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react"
import { useState } from "react"
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { app } from "../firebase"
import { CircularProgressbar } from "react-circular-progressbar"
import { useNavigate } from "react-router-dom"

function CreatePost() {
    const [file, setFile] = useState(null)
    const [imageUploadProgress, setImageUploadProgress] = useState(null)
    const [imageUploadError, setImageUploadError] = useState(null)
    const [formData, setFormData] = useState({})
    const [publishError, setPublishError] = useState(null)
    const navigate = useNavigate()

    const handleImageFile = async ()=> {
        if (!file) {
            setImageUploadError("Please select an image")
            return
        }

        try {
            setImageUploadError(null)
            const storage = getStorage(app)
            const fileName = new Date().getTime() + '-' + file.name
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on(
                "state_changed",
                (snapshot)=> {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    setImageUploadProgress(progress.toFixed(0))
                },
                (error)=> {
                    setImageUploadError("Image upload failed")
                    console.log(error)
                    setImageUploadProgress(null)
                },
                ()=> {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=> {
                        setImageUploadProgress(null)
                        setImageUploadError(null)
                        setFormData({...formData, image: downloadURL})
                    })
                }
            )
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async(e)=> {
        e.preventDefault()

        try {
            const res = await fetch("http://localhost:4000/api/post/create", {
                method: "POST",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (!res.ok) {
                setPublishError(data.message)
                return
            }

            if (res.ok) {
                setPublishError(null)
                navigate(`/post/${data.slug}`)
            }
        } catch (error) {
            setPublishError(error)
        }
    }

    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            <h3 className="text-center text-3xl my-7 font-semibold">Create a post</h3>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <TextInput type="text" placeholder="Title" required id="title" className="flex-1" onChange={(e)=> setFormData({...formData, title: e.target.value})} />
                    <Select onChange={(e)=> setFormData({...formData, category: e.target.value})}>
                        <option value='uncategorized'>Select a category</option>
                        <option value='javascript'>Javascript</option>
                        <option value='reactjs'>React.js</option>
                        <option value='nodejs'>Nodejs</option>
                    </Select>
                </div>
                <div className="flex gap-4 justify-between items-center border-4 border-teal-500 border-dotted p-3">
                    <FileInput type="file" accept="image/*" onChange={(e)=> {
                        setFile(e.target.files[0])
                        setImageUploadError(null)
                    }} />
                    <Button type="button" gradientDuoTone="greenToBlue" size="sm" outline onClick={handleImageFile} disabled={imageUploadProgress}>
                        {
                            imageUploadProgress ? (
                                <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} className="w-12 h-12" />
                            ): (
                                'Upload image'
                            )
                        }
                    </Button>
                </div>
                {
                    imageUploadError && (
                        <Alert color="failure">
                            {imageUploadError}
                        </Alert>
                    )
                }
                {
                    formData.image && (
                        <img 
                            src={formData.image}
                            alt="Upload"
                            className="w-full h-72 object-cover"
                        />
                    )
                }
                <ReactQuill theme="snow" placeholder="Write something" className="h-72 mb-12" onChange={(value)=> {
                    setFormData({...formData, content: value})
                }} />
                <Button type="submit" gradientDuoTone="greenToBlue">Publish</Button>
            </form>
            {
                publishError && (
                    <Alert color="failure" className="mt-5">
                        {publishError}
                    </Alert>
                )
            }
        </div>
    )
}

export default CreatePost