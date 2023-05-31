import NextAuth from 'next-auth/next';
import KakaoProvider from 'next-auth/providers/kakao';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { connectDB } from '../../../../util/database';

export const authOptions: any = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_PASSWORD!,
    }),
  ],
  secret: process.env.SECRET_KEY,
  adapter: MongoDBAdapter(connectDB),
};

export default NextAuth(authOptions);
