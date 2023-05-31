import Link from 'next/link';
import Delete from '../client/Delete';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const Item = async ({ item, session }: any) => {
  return (
    <li
      className="m-2 flex h-[85px] w-[720px] flex-col justify-center rounded-md border p-2"
      key={item._id.toString()}
    >
      <div className="flex justify-between">
        <Link prefetch={false} href={`/detail/${item._id.toString()}`}>
          <h4 className="text-xl">{item.title}</h4>
        </Link>
        <div className="flex">
          <p>{item.stack}</p>
          {item.email === session.user.email && (
            <Link
              className="mx-2"
              prefetch={false}
              href={`/edit/${item._id.toString()}`}
            >
              ✏️
            </Link>
          )}
          {item.email === session.user.email && <Delete item={item} />}
        </div>
      </div>
      <div className="mt-2 flex justify-between">
        <p className="h-4 max-w-[35vw] font-normal">
          {item.content.length > 45
            ? item.content.slice(0, 46) + '...'
            : item.content}
        </p>
        <div className="flex-col justify-end">
          <p className="font-normal">{item.date}</p>
        </div>
      </div>
    </li>
  );
};

export default Item;
