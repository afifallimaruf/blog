import { useState, useEffect } from 'react'
import PostCartd from '../components/PostCard'
import { Link } from 'react-router-dom'

const Home = () => {
    const [posts, setPosts] = useState([])

    useEffect(()=> {
        const fetchPosts = async()=> {
            const res = await fetch("/api/post/getposts")
            const data = await res.json()

            if(res.ok) {
                setPosts(data.posts)
            }
        }
        fetchPosts()
    },[])

    return (
        <div>
            <div className='my-20 mx-2'>
                <h1 className='text-3xl text-center font-bold lg:text-6xl uppercase'>Welcome to my Blog</h1>
            </div>
            <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
                {
                    posts && posts.length > 0 && (
                        <div className='flex flex-col gap-6'>
                            <h1 className='text-2xl font-semibold text-center'>Recent Posts</h1>
                            <div className='flex flex-wrap gap-4'>
                                {
                                    posts.map((post)=> (
                                        <PostCartd key={post._id} post={post} />
                                    ))
                                }
                            </div>
                            <Link to={'/search'} className='text-lg text-teal-500 hover:underline text-center'>
                                View all posts
                            </Link>
                        </div>
                    ) 
                }
            </div>
        </div>
    )
}

export default Home