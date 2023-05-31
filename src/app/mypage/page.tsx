import Card from '@/components/UI/Card';
import ListItem from '@/components/server/ListItem';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { connectDB } from '../../../util/database';

const MyPage = async () => {
  const session: any = await getServerSession(authOptions);

  const db = (await connectDB).db('forum');
  let result = await db
    .collection('post')
    .find({ email: session.user.email })
    .toArray();

  result = result.map((item: any) => {
    item._id = item._id.toString();
    return item;
  });

  return (
    <main className="mt-20 flex h-[85vh] items-center justify-center">
      <section className="flex h-full max-w-[1440px] flex-col items-center justify-start p-4">
        <Image
          src={session.user.image}
          alt="profile"
          className="mb-4 ml-2 h-64 w-64 rounded-[50%] object-cover"
          width={160}
          height={160}
        />
        <Card className="h-auto w-[640px] flex-col border p-2">
          name : {session.user.name}
          <br />
          email :
          {session.user.email
            ? session.user.email
            : ' 등록된 email이 없습니다.'}
          {!session.user.email && (
            <form action="api/post/user_edit" method="POST">
              <input
                required
                name="email"
                placeholder="email을 입력하세요."
                className="mt-2 border"
              />
              <input
                name="name"
                defaultValue={session.user.name}
                className="hidden"
              />
              <input
                name="image"
                defaultValue={session.user.image}
                className="hidden"
              />
              <button type="submit" className="border px-2">
                수정하기
              </button>
            </form>
          )}
        </Card>
        {/* @ts-expect-error Async Server Component */}
        <ListItem result={result} />
      </section>
    </main>
  );
};

export default MyPage;
