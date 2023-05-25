import React from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { db } from '../../firebase/clientApp';
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '../../firebase/clientApp';
import { TiDeleteOutline } from 'react-icons/ti';
const File = ({ file, role }) => {
  async function test(currenFile) {
    await deleteDoc(doc(db, 'files', currenFile.id));
  }
  return (
    <>
      <input
        type="checkbox"
        id={`my-modal-for-delete-${file.id}`}
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Xóa file: {file.name}</h3>
          <p className="py-4">Bạn có chắc muốn xóa file này không?</p>
          <div className="modal-action">
            <label htmlFor={`my-modal-for-delete-${file.id}`} className="btn">
              Cancle
            </label>
            <label
              htmlFor={`my-modal-for-delete-${file.id}`}
              className="btn"
              onClick={() => {
                test(file);
              }}
            >
              Delete
            </label>
          </div>
        </div>
      </div>
      <div className="flex flex-row border border-black rounded-xl justify-between hover:bg-slate-400 p-2 mr-10 min-w-[200px] group items-center">
        <a href={file.url} target="_blank">
          {file.name}
        </a>
        {role === 1 && (
          <label htmlFor={`my-modal-for-delete-${file.id}`}>
            <TiDeleteOutline className="text-xl hover:text-red-700 hover:rounded-xl hidden group-hover:block" />
          </label>
        )}
      </div>
    </>
  );
};

export default File;
