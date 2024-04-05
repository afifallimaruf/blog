import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table, Button, Modal } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

const DashPostComponent = () => {
    const { currentUser } = useSelector((state)=> state.user)
    const [userPost, setUserPost] = useState([])
    const [showMore, setShowMore] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [postIdToDelete, setPostIdToDelete] = useState('')

    useEffect(()=> {
        try {
            const fetchPost = async()=> {
                const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`, {
                    credentials: "include"
                })
                const data = await res.json()
    
                if (res.ok) {
                    setUserPost(data.posts)
                    if (data.posts.length < 9) {
                        setShowMore(false)
                    }
                }
            }
            if (currentUser.isAdmin) {
                fetchPost()
            }
        } catch (error) {
            console.log(error.message)
        }
    }, [currentUser._id, currentUser.isAdmin])

    const handleShowMore = async()=> {
        const startIndex = userPost.length

        try {
            const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`)
            const data = await res.json()
            if (res.ok) {
                setUserPost((prev)=> [...prev, ...data.posts])
                if (data.posts.length < 9) {
                    setShowMore(false)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeletePost = async()=> {
        setShowModal(false)

        try {
            const res = await fetch(`/api/post/delete/${currentUser._id}/${postIdToDelete}`,{
                method: "DELETE",
                credentials: "include"
            })

            const data = await res.json()

            if(!res.ok) {
                console.log(data.message)
            }else {
                setUserPost((prev)=> prev.filter((post)=> post._id !== postIdToDelete))
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {
                currentUser.isAdmin && userPost.length > 0 ? (
                    <>
                        <Table hoverable className='shadow-md'>
                            <Table.Head>
                                <Table.HeadCell>Date updated</Table.HeadCell>
                                <Table.HeadCell>Post image</Table.HeadCell>
                                <Table.HeadCell>Post title</Table.HeadCell>
                                <Table.HeadCell>Category</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>
                                <Table.HeadCell>
                                    <span>Edit</span>
                                </Table.HeadCell>
                            </Table.Head>
                            <Table.Body className='divide-y'>
                            {
                                userPost.map((post)=> {
                                    return <>
                                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800' key={post._id}>
                                        <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                                        <Table.Cell>
                                            <Link to={`/post/${post.slug}`}>
                                                <img 
                                                    src={post.image}
                                                    alt={post.title}
                                                    className='w-20 h-10 object-cover bg-gray-500'
                                                />
                                            </Link>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Link to={`/post/${post.slug}`} className='font-medium tex-gray-900 dark:text-white'>
                                                {post.title}
                                            </Link>
                                        </Table.Cell>
                                        <Table.Cell>
                                            {post.category}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span onClick={()=> {
                                                setShowModal(true)
                                                setPostIdToDelete(post._id)
                                            }} className='font-medium text-red-500 hover:underline cursor-pointer'>Delete</span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Link to={`/update-post/${post._id}`}>
                                                <span className='text-teal-500 hover:underline'>Edit</span>
                                            </Link>
                                        </Table.Cell>
                                    </Table.Row>
                                    </>
                                })
                            }
                            </Table.Body>
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
                    <p>You have no posts yet!</p>
                )
            }
            <Modal show={showModal} onClose={()=> setShowModal(false)} popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this post?</h3>
                        <div className='flex justify-center gap-4'>
                            <Button onClick={handleDeletePost} color='failure'>
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

export default DashPostComponent