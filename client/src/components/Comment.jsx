import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import moment from 'moment'
import { FaThumbsUp } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { Button, Textarea } from 'flowbite-react'

const Comment = ({comment, onLike, onEdit, onDelete}) => {
    const [user, setUser] = useState({})
    const { currentUser } = useSelector((state)=> state.user)
    const [isEditing, setIsEditing] = useState(false)
    const [editedComment, setEditedComment] = useState(comment.content)

    useEffect(()=>{
        const getUser = async()=> {
            try {
                const res = await fetch(`/api/user/${comment.userId}`, {
                    credentials: "include"
                })
                const data = await res.json()

                if (res.ok) {
                    setUser(data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getUser()
    }, [comment])

    const handleEdit = ()=> {
        setIsEditing(true)
        setEditedComment(comment.content)
    }

    const handleSave = async()=> {
        try {
            const res = await fetch(`/api/comment/editComment/${comment._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    content: editedComment
                })
            })

            if (res.ok) {
                setIsEditing(false)
                onEdit(comment, editedComment)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div className='flex p-4 border-b dark:border-gray-500 text-sm'>
            <div className="flex-shrink-0 mr-3">
                <img className='w-10 h-10 rounded-full bg-gray-200' src={user.profilePicture} alt={user.username} />
            </div>
            <div className='flex-1'>
                <div className='flex items-center mb-1'>
                    <span className='font-bold mr-1 text-xs truncate'>{user ? `@${user.username}` : "anonymous user"}</span>
                    <span className='text-gray-500 text-xs'>
                        {moment(comment.createdAt).fromNow()}
                    </span>
                </div>
                {
                    isEditing ? (
                        <>
                        <Textarea 
                        className=''
                        value={editedComment}
                        onChange={(e)=> setEditedComment(e.target.value)}
                        />
                        <div className='flex justify-end gap-2 mt-1 text-xs'>
                            <Button onClick={handleSave} type='button' size='sm' gradientDuoTone='greenToBlue'>
                                Save
                            </Button>
                            <Button onClick={()=> setIsEditing(false)} type='button' size='sm' gradientDuoTone='greenToBlue' outline>
                                Cancel
                            </Button>
                        </div>
                        </>
                    ): (
                        <>
                        <p className='text-gray-500 pb-2'>{comment.content}</p>
                        <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
                            <button className={`text-gray-400 hover:text-blue-500 ${currentUser && comment.likes.includes(currentUser._id)&& '!text-blue-500'}`}>
                                <FaThumbsUp type='button' onClick={()=> onLike(comment._id)} className='text-sm' />
                            </button>
                            <p className='text-gray-400'>
                            {comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (comment.numberOfLikes === 1 ? 'like':'likes')}
                            </p>
                            {
                                currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                                    <>
                                    <button onClick={handleEdit} className='text-gray-400 hover:text-blue-500'>Edit</button>
                                    <button onClick={()=> onDelete(comment._id)} className='text-gray-400 hover:text-red-500'>Delete</button>
                                    </>
                                ) 
                            }
                        </div>
                        </>
                    )
                }
            </div>
        </div>
    )
}

Comment.propTypes = {
    comment: PropTypes.object.isRequired,
    onLike: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.any.isRequired
}

export default Comment