import { Sidebar } from 'flowbite-react'
import { HiAnnotation, HiArrowSmRight, HiChartPie, HiDocumentText, HiOutlineUserGroup, HiUser } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { signOutSuccess } from '../redux/user/userSlice'

function DashSidebar() {
    const location = useLocation()
    const [tab, setTab] = useState('')
    const dispatch = useDispatch()
    const { currentUser } = useSelector((state)=> state.user)

    useEffect(()=> {
        const urlParams = new URLSearchParams(location.search)
        const urlTabParam = urlParams.get('tab')
        
        if (urlTabParam) {
            setTab(urlTabParam)
        }
    }, [location.search])

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
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup className='flex flex-col gap-1'>
                {
                    currentUser.isAdmin && (
                        <Link to="/dashboard?tab=dash">
                            <Sidebar.Item active={tab === 'dash'} icon={HiChartPie} labelColor= 'dark' as='div'>
                            Dashboard
                            </Sidebar.Item>
                        </Link>
                    )
                }
                <Link to="/dashboard?tab=profile">
                    <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? 'Admin': 'User'} labelColor= 'dark' as='div'>
                        Profile
                    </Sidebar.Item>
                </Link>
                {
                    currentUser.isAdmin && (
                        <Link to="/dashboard?tab=posts">
                            <Sidebar.Item active={tab === 'posts'} icon={HiDocumentText} labelColor= 'dark' as='div'>
                            Posts
                            </Sidebar.Item>
                        </Link>
                    )
                }
                {
                    currentUser.isAdmin && (
                        <Link to="/dashboard?tab=users">
                            <Sidebar.Item active={tab === 'users'} icon={HiOutlineUserGroup} labelColor= 'dark' as='div'>
                            Users
                            </Sidebar.Item>
                        </Link>
                    )
                }
                {
                    currentUser.isAdmin && (
                        <Link to="/dashboard?tab=comments">
                            <Sidebar.Item active={tab === 'comments'} icon={HiAnnotation} labelColor= 'dark' as='div'>
                            Comments
                            </Sidebar.Item>
                        </Link>
                    )
                }
                    <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer" onClick={handleSignOut}>
                        Sign Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}

export default DashSidebar