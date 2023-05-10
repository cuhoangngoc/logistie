import Layout from '../../../components/Layout/Layout';
import { useRouter } from 'next/router';
import Addfolder from '../../../components/Library/Addfolder';
import Folders from '../../../components/Library/Folder';
import { UseFolder } from '../../../hooks/useFolder';
import FolderBreadcrums from '../../../components/Library/FolderBreadcrums';
import File from "../../../components/Library/File";
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useState,useEffect } from 'react';
const Folder = ({user}) => {
  const router = useRouter();
  const { folder_id } = router.query;
  const { folder, childFolders, childFiles } = UseFolder(folder_id);
  const [client, setClient] = useState([]);
  const [user_role,set_userrole]=useState({role:0});
  useEffect(() => {
    async function getRole() {
      fetch(
        `http://localhost:3000/api/users/get-user-info?email=${user.email}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' } }
      ).then((response) => {
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
    getRole()
  },[]);
  return (
    <Layout user={user}>
      <div>
      
        {user_role.role===1&&(<Addfolder currentFolder={folder}/>)}
        <FolderBreadcrums currentFolder={folder}></FolderBreadcrums>
      </div>
      {childFolders.length > 0 && (
        <div className="flex flex-wrap ">
          {childFolders.map((childfolders) => (
            <div key={childfolders.id} >
              <Folders folder={childfolders} role={user_role.role}></Folders>
            </div>
          ))}
        </div>
      )}

      {childFolders.length > 0 && childFiles.length > 0 && <hr />}
      {childFiles.length > 0 && (
        <div className="flex flex-wrap">
          {childFiles.map((childfile) => (
            <div key={childfile.id} className='mt-2'>
              <File file={childfile} role={user_role.role}></File>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default withPageAuthRequired(Folder);
