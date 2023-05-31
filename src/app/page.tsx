import { connectDB } from '../../util/database';
import ListItem from '@/components/server/ListItem';
import LeftSide from '@/components/client/LeftSide';
import RightSide from '@/components/server/RightSide';

const Home = async () => {
  const db = (await connectDB).db('forum');
  let result = await db.collection('post').find().toArray();

  result = result.map((item: any) => {
    item._id = item._id.toString();
    return item;
  });

  return (
    <main className="mt-20 flex h-[85vh] items-center justify-center">
      <div className="flex h-full max-w-[1440px] justify-between">
        <LeftSide />
        <section className="m-2 flex-col items-center justify-center">
          {/* @ts-expect-error Async Server Component */}
          <ListItem result={result} />
        </section>
        <RightSide />
      </div>
    </main>
  );
};

export default Home;
