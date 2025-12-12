import React from 'react'
import HomeHeader from '@/components/layout/home-header'
import { GraduationCap } from 'lucide-react'
import Diplomas from './_components/diplomas'

const breadcrumbs = [
  { label: "Home", href: "/diplomas" },
  { label: "Diplomas" }
];
  
export default async function Dashboard() {
  return (
    <div className='flex flex-col'>
      <HomeHeader 
        text="Diplomas" 
        icon={<GraduationCap className='text-white' />} 
        back={false} 
        breadcrumbs={breadcrumbs}
      />
      <Diplomas />
    </div>
  )
}
