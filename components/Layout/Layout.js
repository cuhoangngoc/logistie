import Logo from '../../public/imgs/logo/drop-shipping/drop-shipping-100.png';
import Image from 'next/image';
import Link from 'next/link';
import ReqIcon from '../../public/imgs/requests/request.png';
import {
  FcNews,
  FcPortraitMode,
  FcLibrary,
  FcImport,
  FcDocument,
  FcOrganization,
} from 'react-icons/fc';

const Layout = ({ user, children }) => {
  const navLinks = [
    {
      name: 'Bản tin',
      href: '/',
      icon: <FcNews size={32} />,
    },
    {
      name: 'Hồ sơ',
      href: `/employees/${user.email}`,
      icon: <FcDocument size={32} />,
    },
    {
      name: 'Nhân viên',
      href: '/employees',
      icon: <FcPortraitMode size={32} />,
    },
    {
      name: 'Thư viện',
      href: '/library',
      icon: <FcLibrary size={32} />,
    },
    {
      name: 'Phòng họp',
      href: '/resources',
      icon: <FcOrganization size={32} />,
    },
    {
      name: 'Yêu cầu',
      href: '/requests',
      icon: (
        <Image src={ReqIcon} alt="" className="h-8 w-8 object-scale-down" />
      ),
    },
    {
      name: 'Đăng xuất',
      href: '/api/auth/logout',
      icon: <FcImport size={32} />,
    },
  ];

  const toggleSidebar = () => {
    const sidebar = document.getElementById('logo-sidebar');
    sidebar.classList.toggle('-translate-x-full');
    sidebar.classList.toggle('translate-x-0');
  };

  return (
    <>
      {/* Toggle sidebar button */}
      <button
        data-drawer-target="logo-sidebar"
        data-drawer-toggle="logo-sidebar"
        aria-controls="logo-sidebar"
        type="button"
        className="ml-auto mr-1 mt-2 block rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
        onClick={toggleSidebar}
      >
        <svg
          className="h-6 w-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="logo-sidebar"
        className="fixed left-0 top-0 z-10 h-screen w-64 -translate-x-full transition-transform sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full overflow-y-auto bg-gray-50 px-3 py-4 dark:bg-gray-800">
          {/* Logo */}
          <Link href="/" className="mb-5 flex items-center pl-2.5">
            <Image
              src={Logo}
              className="mr-3 h-16 w-16"
              alt="IE tutor Logo"
              priority
            />
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
              Logistie
            </span>
          </Link>

          <ul className="space-y-2 font-medium">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                >
                  {link.icon}
                  <span className="ml-3 flex-1 whitespace-nowrap">
                    {link.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className="p-4 sm:ml-64">
        <div className="rounded-lg border-2 border-dashed border-gray-200 p-4 dark:border-gray-700">
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
