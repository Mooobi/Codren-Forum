import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { connectDB } from '../../../util/database';
import Item from './Item';

const ListItem = async ({ result }: any) => {
  let session: any = await getServerSession(authOptions);

  return (
    <ul className="flex-col">
      {result?.map((item: any) => {
        return (
          <>
            {/* @ts-expect-error Async Server Component */}
            <Item item={item} session={session} />
          </>
        );
      })}
    </ul>
  );
};

export default ListItem;
