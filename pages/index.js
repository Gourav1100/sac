import Head from 'next/head'
import Image from 'next/image'
import Heading from '../components/Heading'
import { useUser } from '@auth0/nextjs-auth0';
export default function Home() {
  const { user, error, isLoading } = useUser();
  if (isLoading) return <div>..loading</div>
  if (error) return <div>{error.message}</div>
  if (user) {
    return (
      <>
      <div className='flex flex-col items-center justify-center min-h-screen py-2 bg-green-500'>
      <h1 className='mb-5'>Welcome {user.name}!</h1>
      <a href="/api/auth/login" className='border-2 border-gray-400 rounded-full px-10 py-2 inline-block bg-white font-semibold hover:bg-gray-100 hover:text-green-500 mr-1'>Sign In
                  </a>
      </div>
      </>
    )
  }
  return <a href="/api/auth/login" className='flex justify-center border-2 bg-green-500 text-white'>Sign In</a>

   
          
}
