import { ObjectId } from 'mongodb';
import { connectDB } from '../../../../util/database';
import Form from '@/components/client/Form';
import LeftSide from '@/components/client/LeftSide';
import RightSide from '@/components/server/RightSide';

const Edit = async (props: any) => {
  const db = (await connectDB).db('forum');
  let result = await db
    .collection('post')
    .findOne({ _id: new ObjectId(props.params.id) });

  return (
    <main className="mt-20 flex h-[85vh] items-center justify-center">
      <div className="flex h-full max-w-[1440px] justify-between">
        <LeftSide />
        <section className="m-2 w-[736px] flex-col items-center justify-center">
          <Form result={result} />
        </section>
        <RightSide />
      </div>
    </main>
  );
};

export default Edit;
