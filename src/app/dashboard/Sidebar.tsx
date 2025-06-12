"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Home, 
  DollarSign, 
  Book, 
  LogOut,
  ArrowRightLeft,
  UserPlus,
  HomeIcon,
  Calendar
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';

// Define types for sidebar menu items
type SidebarMenuItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  addon?: React.ReactNode;
};

// Sidebar component with props for customization
interface SidebarProps {
  userName?: string;
  menuItems?: SidebarMenuItem[];
  onLogout?: () => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = () => {
    const {data: session} = useSession();
    let menuItems = [];

    if(session?.user?.role == "Admin"){
      menuItems = [
        {
          href: '/dashboard/',
          label: 'Home',
          icon: HomeIcon
        },
        {
          href: '/dashboard/admin/assign-tutor',
          label: 'Assign Tutors',
          icon: ArrowRightLeft
        },
        // {

        //   href: '/dashboard/admin/billing', 
        //   label: 'Billing', 
        //   icon: DollarSign 
        // },
        {

          href: '/dashboard/admin/add-user', 
          label: 'Add Users', 
          icon: UserPlus 
        },
        {

          href: '/dashboard/admin/sessions', 
          label: 'Sessions', 
          icon: Calendar 
        }
      ]
    }else{
      menuItems = [
          { 
            href: '/dashboard', 
            label: 'My Classes', 
            icon: Home 
          },
          { 
            href: './billing', 
            label: 'Billing', 
            icon: DollarSign 
          },
          { 
            href: './subjects', 
            label: 'Subjects', 
            icon: Book,
            addon: <span className="ml-auto bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">+</span>
          }
      ]
    }

  return (
    <div className={`bg-gray-900 text-white w-64 h-full flex flex-col`}>
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">Hey {session?.user?.name?.split(" ")[0]} 👋</h2>
      </div>
      
      <nav className="flex-grow">
        <ul className="space-y-2 p-4">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href} 
                className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded group relative"
              >
                <item.icon className="w-5 h-5 text-gray-400 group-hover:text-white" />
                <span className="flex-grow">{item.label}</span>
                {item.addon && item.addon}
              </Link>
            </li>
          ))}
        </ul>
      </nav>


        <div className="p-4 border-t border-gray-700">
            <div 
            onClick={()=>{signOut()}} 
            className="flex items-center cursor-default space-x-3 text-red-400 hover:text-red-300 w-full"
            >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
            </div>
        </div>
    </div>
  );
};

export default Sidebar;