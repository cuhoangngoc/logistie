import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Addfolder from '../../components/Library/Addfolder';
import Layout from '../../components/Layout/Layout';
import { UseFolder } from '../../hooks/useFolder';
import Folder from '../../components/Library/Folder';
import FolderBreadcrums from '../../components/Library/FolderBreadcrums';
import File from '../../components/Library/File';
import { useEffect, useState } from 'react';
import { BsChatRightFill } from 'react-icons/bs';

const Index = ({ user }) => {
  const { folder, childFolders, childFiles } = UseFolder(null);
  const [client, setClient] = useState([]);
  const [user_role, set_userrole] = useState({ role: 0 });
  useEffect(() => {
    async function getRole() {
      fetch(
        `http://localhost:3000/api/users/get-user-info?email=${user.email}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' } }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Can not find user with email ${user.email}`);
          }
          return response.json();
        })
        .then((data) => {
          setClient(data);
          set_userrole(data.user_metadata);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    getRole();
  }, [user.email]);
  return (
    <Layout user={user}>
      <div>
        {user_role.role === 1 && <Addfolder currentFolder={folder} />}
        <FolderBreadcrums currentFolder={folder}></FolderBreadcrums>
      </div>

      {childFolders.length > 0 && (
        <div className="flex flex-wrap">
          {childFolders.map((childfolders) => (
            <div key={childfolders.id} className="mt-2">
              <Folder folder={childfolders} role={user_role.role}></Folder>
            </div>
          ))}
        </div>
      )}
      {childFolders.length > 0 && childFiles.length > 0 && <hr />}
      {childFiles.length > 0 && (
        <div className="flex flex-wrap ">
          {childFiles.map((childfile) => (
            <div key={childfile.id} className="mt-2">
              <File folder={childfile} role={user_role.role}></File>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default withPageAuthRequired(Index);
