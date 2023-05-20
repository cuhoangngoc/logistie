import { useReducer, useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { db } from '../firebase/clientApp';
import { firestore } from 'firebase/app';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
const ACTION = {
  SELECT_FOLDER: 'select-folder',
  UPDATE_FOLDER: 'update-folder',
  SET_CHILD_FOLDERS: 'set-child-folders',
  SET_CHILD_FILES: 'set_child_files',
};

export const ROOT_FOLDER = { name: 'Root', id: null, path: [] };
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTION.SELECT_FOLDER:
      return {
        folderID: payload.folderID,
        folder: payload.folder,
        childFiles: [],
        childFolders: [],
      };
    case ACTION.UPDATE_FOLDER:
      return {
        ...state,
        folder: payload.folder,
      };
    case ACTION.SET_CHILD_FOLDERS:
      return {
        ...state,
        childFolders: payload.childFolders,
      };
    case ACTION.SET_CHILD_FILES:
      return {
        ...state,
        childFiles: payload.childFiles,
      };
    default:
      return state;
  }
}

export function UseFolder(folderId = null, folder = null) {
  const [state, dispatch] = useReducer(reducer, {
    folderId,
    folder,
    childFolders: [],
    childFiles: [],
  });

  const { user, error, isLoading } = useUser();
  const [client, setClient] = useState([]);
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
  }, []);
  useEffect(() => {
    dispatch({ type: ACTION.SELECT_FOLDER, payload: { folderId, folder } });
  }, [folderId, folder]);

  useEffect(() => {
    if (folderId == null) {
      return dispatch({
        type: ACTION.UPDATE_FOLDER,
        payload: { folder: ROOT_FOLDER },
      });
    }

    async function findFolder() {
      const docRef = doc(db, 'folders', folderId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const formattedDoc = {
          id: docSnap.id,
          ...docSnap.data(),
        };
        dispatch({
          type: ACTION.UPDATE_FOLDER,
          payload: { folder: formattedDoc },
        });
      } else {
        // docSnap.data() will be undefined in this case
        dispatch({
          type: ACTION.UPDATE_FOLDER,
          payload: { folder: ROOT_FOLDER },
        });
        console.log('No such document!');
      }
    }
    findFolder();
  }, [folderId]);
  useEffect(() => {
    async function child() {
      const q = query(
        collection(db, 'folders'),
        where('parentID', '==', folderId)
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
          //
          const cities = [];
          querySnapshot.forEach((doc) => {
            cities.push(doc.data().name);
          });
          // console.log("Current cities in CA: ", cities.join(", "));

          dispatch({
            type: ACTION.SET_CHILD_FOLDERS,
            payload: { childFolders: snapshot.docs.map(formattedDoc) },
          });
        });
        unsubcribe;
      });
    }
    child();
  }, [folderId, user]);

  useEffect(() => {
    async function child() {
      const q = query(
        collection(db, 'files'),
        where('folderId', '==', folderId)
        // where('userId', '==','UEsNPNa2hARtXooYkMvRsoFHh3nFrTAC')
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
          dispatch({
            type: ACTION.SET_CHILD_FILES,
            payload: { childFiles: snapshot.docs.map(formattedDoc) },
          });
        });
        unsubcribe;
        console.log(unsubcribe);
      });
    }
    child();
  }, [folderId, user]);
  return state;
}
