import { db, storage } from '../../firebase/clientApp';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { ROOT_FOLDER, UseFolder } from '../../hooks/useFolder';
import { useState, useEffect } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
const Library = ({ currentFolder, user }) => {
  const [nameFolder, setnameFolder] = useState('Untitled folder');
  const [fileName, setFileName] = useState(null);
  const [client, setClient] = useState([]);
  const [checkFolder, setCheckFolder] = useState([]);
  async function getChildFolder() {
    if (currentFolder == null) {
      return;
    }
    const q = query(
      collection(db, 'folders'),
      where('parentID', '==', currentFolder.id)
      // where('userID', '==', 'UEsNPNa2hARtXooYkMvRsoFHh3nFrTAC')
      // orderBy('createAt'),
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      function formattedDoc(doc) {
        return {
          id: doc.id,
          ...doc.data(),
        };
      }

      const unsubcribe = onSnapshot(q, (snapshot) => {
        console.log(snapshot);
        //
        // const cities = [];
        querySnapshot.forEach((doc) => {
          // setChildFolder().push(doc.data().name);
          // setChildFolder(doc.data().name)
        });
      });
      unsubcribe;
    });
  }
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
        })
        .catch((err) => {
          console.log(err);
        });
    }
    getRole();
  }, [user.email]);
  async function postdata() {
    try {
      const path = [...currentFolder.path];
      if (currentFolder !== ROOT_FOLDER) {
        path.push({ name: currentFolder.name, id: currentFolder.id });
      }
      const docRef = await addDoc(collection(db, 'folders'), {
        name: nameFolder,
        userID: client.client_id,
        parentID: currentFolder.id,
        path: path,
        createAt: new Date(),
      });

      console.log('Document written with ID: ', docRef.id);
      setnameFolder('Untitled folder');
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }
  // postdata();
  async function handleSubmit(e) {
    if (currentFolder == null) return;
    const getChildfolder = [];
    const q = query(
      collection(db, 'folders'),
      where('parentID', '==', currentFolder.id)
    );
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);
    querySnapshot.forEach((value) => {
      getChildfolder.push(value.data().name);
    });
    console.log(getChildfolder.includes(nameFolder));
    if (!getChildfolder.includes(nameFolder)) {
      postdata();
    }
  }
  async function handleUpload() {
    // const file = e.target.files[0];
    console.log(nameFolder.name);
    console.log(fileName);
    if (currentFolder == null || fileName == null) return;

    const getChildfile = [];
    const q = query(
      collection(db, 'files'),
      where('folderId', '==', currentFolder.id)
    );
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);
    querySnapshot.forEach((value) => {
      getChildfile.push(value.data().name);
    });
    console.log(getChildfile);
    const state = getChildfile.includes(fileName.name);
    if (!state) {
      const { path } = currentFolder;
      const location = [];
      path.map((data) => {
        location.push(data.id);
      });
      const linkpath = location.join('/');
      const filePath =
        currentFolder === ROOT_FOLDER
          ? `${linkpath}/${fileName.name}`
          : `${linkpath}/${currentFolder.name}/${fileName.name}`;
      console.log(filePath);
      // const filePath =
      //   currentFolder === ROOT_FOLDER
      //     ? `${currentFolder.path[0].id}/${fileName.name}`
      //     : `${currentFolder.path[0].id}/${currentFolder.name}/${fileName.name}`;
      const storageRef = ref(storage, `files/${client.client_id}/${filePath}`);
      const snapshot = await uploadBytes(storageRef, fileName);
      console.log(snapshot);

      const storageRe = ref(storage, currentFolder.id);

      const uploadTask = uploadBytesResumable(storageRe, fileName);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Handle progress
        },
        (error) => {
          console.log(error);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, 'files'), {
            url: url,
            name: fileName.name,
            createAt: new Date(),
            folderId: currentFolder.id,
            userID: client.client_id,
          });
        }
      );
    }
  }

  return (
    <div>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Thư mục mới</h3>
          <input
            className="border border-black w-full p-5 rounded-md"
            value={nameFolder}
            onChange={(e) => {
              setnameFolder(e.target.value);
            }}
          ></input>
          <div className="modal-action">
            <label htmlFor="my-modal" className="btn">
              Hủy
            </label>
            <label
              htmlFor="my-modal"
              className="btn btn-success"
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              Thêm
            </label>
          </div>
        </div>
      </div>

      <input type="checkbox" id="my-modal1" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Upload file</h3>
          <input
            className="border border-black w-full p-5 rounded-md"
            type="file"
            onChange={(e) => {
              setFileName(e.target.files[0]);
            }}
          ></input>
          <div className="modal-action">
            <label htmlFor="my-modal1" className="btn">
              Hủy
            </label>
            <label
              htmlFor="my-modal1"
              className="btn btn-success"
              onClick={handleUpload}
            >
              Thêm
            </label>
          </div>
        </div>
      </div>
      <div className="dropdown">
        <label tabIndex={0} className="btn btn-primary m-1">
          Thư viện tài liệu
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <label htmlFor="my-modal">Thư mục mới</label>
          </li>
          <li>
            <label htmlFor="my-modal1">Upload file</label>
          </li>
          <li>
            <a>Upload thư mục</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default withPageAuthRequired(Library);
