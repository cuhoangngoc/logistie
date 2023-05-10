import { Button } from 'flowbite-react';
import Link from 'next/link';
import { AiFillFolder } from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { db } from '../../firebase/clientApp';
import { collection, getDocs, query, where,deleteDoc,doc } from 'firebase/firestore';
import {ref, deleteObject} from 'firebase/storage';
import { storage } from '../../firebase/clientApp';
import {TiDeleteOutline} from 'react-icons/ti';
const Folder = ({ folder,role }) => {
  // Thực hiện truy vấn với điều kiện
  async function test(currentFolder) {
    console.log(currentFolder)
    //Khai báo hàm xáo
    async function deleteFolder(id) {
      await deleteDoc(doc(db, 'folders', id));
    }
    async function deleteFile(id) {
      await deleteDoc(doc(db, 'files', id));
    }
    async function deletePathStorage(path) {
      const desertRef = ref(storage, path);

      // Delete the file
      deleteObject(desertRef)
        .then(() => {
          // File deleted successfully
          console.log('deleted successfully')
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
          console.log(error)
        });
    }
    //
    //
    const usersRef = collection(db, 'folders');
    const q = query(
      usersRef,
      where('path', 'array-contains', { id: currentFolder.id, name: currentFolder.name })
    );

    // Lấy kết quả truy vấn
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(data);
    async function findFiles(id) {
      const usersRef = collection(db, 'files');
      const q = query(usersRef, where('folderId', '==', id));

      // Lấy kết quả truy vấn
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(data)
      if (data) {
        data.map(value=>{
          console.log(value.name);
          console.log(folder);
          const { path } = folder;
          const location = [];
          path.map((data) => {
            location.push(data.id);
          });
          const linkpath = location.join('/');
          // console.log(linkpath+'/'+folder.name+'/'+data.name)
          const pathStorege = '/'+linkpath + '/' + currentFolder.name + '/' + value.name;
          console.log(pathStorege)
          deletePathStorage(pathStorege);
          deleteFile(value.id);
        })
       
      }
    }
    if(data.length==0)
    {
      deleteFolder(folder.id);
    }
    data.map((value) => {
      findFiles(value.id);
      deleteFolder(value.id)
      deleteFolder(folder.id);
    });
  }
  return (
    <>
      {/* Put this part before </body> tag */}
      <input
        type="checkbox"
        id={`my-modal-for-delete-${folder.id}`}
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete folder: {folder.name}</h3>
          <p className="py-4">Are you sure to delete this folder</p>
          <div className="modal-action">
            <label htmlFor={`my-modal-for-delete-${folder.id}`} className="btn">
              Cancle
            </label>
            <label htmlFor={`my-modal-for-delete-${folder.id}`} className="btn" onClick={()=>{test(folder)}}>
              Delete
            </label>
          </div>
        </div>
      </div>
      <div className="flex flex-row border border-black rounded-xl justify-between hover:bg-slate-400 p-2 mr-10 min-w-[200px] text-black group bg-white">
        <Link href={`/library/folder/${folder.id}`} className='flex flex-row'>
          
            <AiFillFolder className="text-xl"></AiFillFolder>
            <p> {folder.name} </p>
         
        </Link>
        {role===1&&( <label htmlFor={`my-modal-for-delete-${folder.id}`}>
          <TiDeleteOutline className="text-xl hover:bg-slate-500 hover:rounded-xl hidden group-hover:block" />
        </label>)}
       
      </div>
    </>
  );
};

export default Folder;
