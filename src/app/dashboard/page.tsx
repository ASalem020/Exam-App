import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-gray-500">Welcome to the dashboard</p>
      
        <Link href="/login">Login</Link>
      
    </div>
  )
}
