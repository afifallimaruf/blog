import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table, Button, Modal } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

const DashComments = () => {
    const { currentUser } = useSelector((state)=> state.user)
    const [comments, setComments] = useState([])
    const [showMore, setShowMore] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [commentsIdToDelete, setCommentsIdToDelete] = useState('')

    useEffect(()=> {
        try {
            const fetchComments = async()=> {
                const res = await fetch(`/api/comment/getcomments`, {
                    credentials: "include"
                })
                const data = await res.json()

                if (res.ok) {
                    setComments(data.comments)
                    if (data.comments.length < 9) {
                        setShowMore(false)
                    }
                }
            }
            if (currentUser.isAdmin) {
                fetchComments()
            }
        } catch (error) {
            console.log(error.message)
        }
    }, [currentUser._id, currentUser.isAdmin])

    const handleShowMore = async()=> {
        const startIndex = comments.length

        try {
            const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`)
            const data = await res.json()
            if (res.ok) {
                setComments((prev)=> [...prev, ...data.comments])
                if (data.comments.length < 9) {
                    setShowMore(false)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteComments = async()=> {
        setShowModal(false)

        try {
            const res = await fetch(`/api/comment/deleteComment/${commentsIdToDelete}`,{
                method: "DELETE",
                credentials: "include"
            })

            const data = await res.json()

            if(!res.ok) {
                console.log(data.message)
            }else {
                setComments((prev)=> prev.filter((user)=> user._id !== commentsIdToDelete))
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {
                currentUser.isAdmin && comments.length > 0 ? (
                    <>
                        <Table hoverable className='shadow-md'>
                            <Table.Head>
                                <Table.HeadCell>Date updated</Table.HeadCell>
                                <Table.HeadCell>Comment content</Table.HeadCell>
                                <Table.HeadCell>Number of likes</Table.HeadCell>
                                <Table.HeadCell>PostId</Table.HeadCell>
                                <Table.HeadCell>UserId</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>
                            </Table.Head>
                            {
                                comments.map((comment)=> {
                                    return <>
                                    <Table.Body className='divide-y' key={comment._id}>
                                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                        <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                                        <Table.Cell>
                                        {comment.content}
                                        </Table.Cell>
                                        <Table.Cell>
                                                {comment.numberOfLikes}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {comment.postId}
                                        </Table.Cell>
                                        <Table.Cell>
                                        {comment.userId}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span onClick={()=> {
                                                setShowModal(true)
                                                setCommentsIdToDelete(comment._id)
                                            }} className='font-medium text-red-500 hover:underline cursor-pointer'>Delete</span>
                                        </Table.Cell>
                                    </Table.Row>
                                    </Table.Body>
                                    </>
                                })
                            }
                        </Table>
                        {
                            showMore && (
                                <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>
                                    Show more
                                </button>
                            )
                        }
                    </>
                ) : (
                    <p>You have no comments yet!</p>
                )
            }
            <Modal show={showModal} onClose={()=> setShowModal(false)} popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this comment?</h3>
                        <div className='flex justify-center gap-4'>
                            <Button onClick={handleDeleteComments} color='failure'>
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

export default DashComments