"use client"
import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HomeHeaderProps {
  text: string;
  icon: React.ReactNode;
  back: boolean;
  breadcrumbs?: BreadcrumbItem[];
}

export default function HomeHeader({ text, icon, back, breadcrumbs = [] }: HomeHeaderProps) {
  /* -------------------------------------------------------------------------- */
  /*                                   NAVIGATION                               */
  /* -------------------------------------------------------------------------- */
  const router = useRouter()

  /* -------------------------------------------------------------------------- */
  /*                                   FUNCTIONS                                */
  /* -------------------------------------------------------------------------- */



  // Default breadcrumbs if not provided
  const defaultBreadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/diplomas" },
    { label: text }
  ];

  const breadcrumbItems = breadcrumbs.length > 0 ? breadcrumbs : defaultBreadcrumbs;

  return (
    <div className='flex flex-col gap-4 mb-5'>
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {item.href && index !== breadcrumbItems.length - 1 ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="text-blue-600">{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index < breadcrumbItems.length - 1 && (
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Bar */}
      <div className='flex gap-2'>
        {back && (
          <button
            onClick={() => router.back()}
            className="text-gray-700 flex border-2 border-gray-200 rounded-md p-2 items-center hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className='flex bg-blue-600 w-full gap-3 h-12 px-4 items-center rounded-md'>
          {icon}
          <h1 className="text-2xl font-semibold text-white">{text}</h1>
        </div>
      </div>
    </div>
  )
}
