import { ROOT_FOLDER } from '../../hooks/useFolder';
import Link from 'next/link';
const FolderBreadcrums = ({ currentFolder }) => {
  let path = currentFolder === ROOT_FOLDER ? [] : [ROOT_FOLDER];
  if (currentFolder) {
    path = [...path, ...currentFolder.path];
  }
  return (
    <div className="text-sm breadcrumbs">
      <ul>
        {path.map((folder, index) => (      
              <li key={folder.id}>
                 <Link href={folder.id?`/Library/folder/${folder.id}`:`/Library`}>
                     {folder.name}
                 </Link>           
              </li>         
        ))}
        {currentFolder && (
          <li>
            <a>{currentFolder.name}</a>
          </li>
        )}
      </ul>
    </div>
  );
};

export default FolderBreadcrums;
