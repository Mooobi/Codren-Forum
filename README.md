# Codren Forum

- 계속 업데이트 중입니다.

<details>

<summary>

## 2023. 5. 31. 프로젝트 7일차

</summary>

### 로그인 상태에 따른 CRUD 조건부 렌더링 구현

- 로그인 시 email 제공 동의를 하지 않은 유저의 경우, mypage에서 email을 입력하면 유저 db에 email을 추가하도록 구현하였습니다.

- 로그인했을 때, db에 email이 있을 경우에만 글 작성이 가능하게끔 구현하였습니다.

- 로그인했을 경우에만 글 내용을 볼 수 있도록 구현했습니다.

- 수정, 삭제 버튼을 db의 email과 현재 로그인한 유저의 email의 일치 여부에 따라 조건부 렌더링하는 로직을 구현하는 도중, 문제가 발생했습니다. ListItem에서 db를 받아오려고 하면 dns 모듈과 fs 모듈이 없다는 에러가 뜹니다. 다른 페이지에서는 잘 받아오는데 왜 여기서만 못받아올까 생각해보니 ListItem은 클라이언트 컴포넌트로 사용하는 게 다른 컴포넌트들과의 차이점이였습니다. 따라서 onClick을 사용하는 Delete 컴포넌트만 빼주어 클라이언트 컴포넌트로 만들고, ListItem 컴포넌트는 서버 컴포넌트로 변경해주니 에러가 사라지고 정상적으로 작동했습니다.

- 메인페이지에서 내가 작성한 글이면 수정, 삭제 버튼이 함께 나타나도록 구현하였습니다.

- 마이페이지에서 내가 작성할 글 목록을 수정, 삭제 버튼과 함께 나타나도록 구현하였습니다.

### 더미데이터 생성 버튼 구현

- 기능 작동 확인을 위해 더미데이터를 생성하여 db에 저장하는 더미데이터 생성 버튼을 만들었습니다.

```TS
//DummyCreater.tsx
const DummyCreater = () => {
  const data = {
    title: `제주삼다수는 화산암반수입니다. ${Math.floor(Math.random() * 100)}`,
    email: 'antod2981@nate.com',
    date: new Date().toLocaleString(),
    author: '박무생',
    ...
  };

  return (
    <button
      onClick={() => {
        axios.post('api/post/dummy', data);
      }}
    >
      버튼
    </button>
  );
};
```

```TS
//dummy.tsx
const handler = async (req: any, res: any) => {
  try {
    const db = (await connectDB).db('forum');
    await db.collection('post').insertOne(req.body);
    return res.redirect(302, '/');
  } catch (err) {
    return res.status(500).json('error');
  }
};
```

</details>

<details>

<summary>

## 2023. 5. 30. 프로젝트 6일차

</summary>

### 로그인 상태에 따른 CRUD 조건부 렌더링 구현

- 글 작성 시, 로그인 되어 있지 않으면 로그인하라는 문구가 나타나고, 로그인 되어 있으면 글 작성이 가능토록 해야합니다. 여기서 문제가 발생하는데 카카오 OAuth로 받아올 수 있는 유저 정보 중에 필수 항목으로 체크할 수 있는게 닉네임과 프로필 사진밖에 없습니다. 닉네임은 보통 이름으로 짓는데, 이는 고유한 ID로서 사용할 수가 없습니다. 고유한 ID로 사용 가능한 것은 email인데 email은 선택적으로 받아올 수 있습니다. 즉, 유저가 동의하지 않으면 받아올 수 없습니다. 따라서 글 작성 시 로그인이 되어있지만 email 동의를 체크하지 않았다면, 회원 정보에 email을 기입하도록 해서 강제적으로 유저 식별이 가능토록 해야 합니다.

- 먼저, 회원 정보 수정을 위한 마이페이지를 만들기 전에 양 사이드를 컴포넌트화하여 각 페이지에서 재사용하도록 만들었습니다.

- 왼쪽 사이드 컴포넌트에서 아래와 같이 usePathname을 사용하여 현재 경로에 따른 조건부 렌더링을 해주었습니다.

```TS
const LeftSide = () => {
...
  const path = usePathname();

  return (
    <>
      {path === '/' && (
        ...
      )}
      {(path === '/edit' || path === '/write') && (
        ...
      )}
    </>
  );
};
```

- write 페이지에서는 왼쪽 사이드가 제대로 렌더링 되는데 edit, detail 페이지에서는 렌더링이 되지 않아 확인해보니 url에 해당 글의 id가 parameter로 붙어있기 때문이였습니다. 이에 따라 해당 경로 뒤에 어떤 문자가 오더라도 true를 반환하게 만들기 위해 아래와 같이 와일드 카드를 사용해 보았으나, 작동하지 않았습니다.

```TS
{(path === '/write' || path === '/edit/*' || path === '/detail/*') && (
  ...
)}
```

- 고민하다가 결국 아래와 같이 정규표현식을 사용하여 모든 문자열에 대응할 수 있도록 수정하였습니다.

```TS
{(path === '/write' ||
  /^\/edit\/.+$/i.test(path) ||
  /^\/detail\/.+$/i.test(path)) && (
    ...
)}
```

- 근데 수정하고 나니 마이페이지에는 사이드바가 없다는 걸 깨달았습니다. 깔끔하게 정리한걸 위안 삼겠습니다.

- 여러 페이지에서 사용하는 Card UI 컴포넌트를 별도로 생성하여 재사용토록 하였습니다.

```TS
// Card.tsx
const Card = (props: any) => {
  const Card = tw.div`
  ml-4 flex h-8 w-24 items-center justify-center rounded-md
  `;
  return <Card className={props.className}>{props.children}</Card>;
};

//Header.tsx
...
<Card className="h-16 w-48 bg-moogray text-2xl text-mooblack">
  CodrenForum
</Card>
...
```

- 위 코드에서 Header.tsx의 Card에 트윈테일 속성이 적용이 되지 않아 고민해보다가 className도 props로 넘겨주면 되지 않나 라는 생각에 시도해보았는데 잘 되어 기분이 좋았습니다.

- Login, Logout 컴포넌트를 Sign 컴포넌트로 합쳐주었습니다. mypage 만들려고 했는데 갑자기 리팩토링하기 시작했습니다. 이제 어느정도 한 것 같으니 mypage를 만들어 보겠습니다.

- mypage를 만들고 나서 email을 입력하면 제출할 곳이 필요한데 기존의 로그인을 토큰으로 하기 때문에 DB에 추가 입력된 유저 정보를 저장할 수 없습니다. 따라서 로그인 방식을 세션으로 변경하여 유저가 로그인하면 서버에 유저 정보가 저장되게 변경하였습니다.

```TS
export const authOptions: any = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_PASSWORD!,
    }),
  ],
  secret: process.env.SECRET_KEY,
  adapter: MongoDBAdapter(connectDB), // 추가된 부분
};
```

- 이제 몽고DB에 유저 정보가 저장되었고, mypage에서 유저가 email을 입력하면 DB에서 현재 로그인한 유저 정보를 찾아 입력한 email을 추가해주도록 하겠습니다. 잠이 오니까 내일 하겠습니다.

</details>

<details>

<summary>

## 2023. 5. 29. 프로젝트 5일차

</summary>

### 카카오 로그인 구현

- Next-auth를 사용하여 카카오 로그인을 구현했습니다. 카카오 deveolpers에서 REST_API_KEY와 CLIENT_PASSWORD를 받고, redirect URL을 설정해주었습니다. 현재는 개발단계이기 때문에 localhost:3000으로 설정해놨었는데, 오류가 발생해서 보니 Next-auth로 카카오 로그인을 구현할 시 자동으로 http://localhost:3000/api/auth/callback/kakao 로 리다이렉트 되기 때문에 해당 url을 추가해주었습니다. 카카오는 국내 기업이기 때문에 Next-auth에 카카오 Provider는 없을 줄 알았는데, 혹시나 하는 마음으로 node-modules에서 찾아보니 kakao가 있어 정말 다행이였습니다. 이제 CRUD에 로그인 정보를 추가해주고, 로그인 여부에 따른 조건부 렌더링만 해주면 되겠습니다.

- 로그인을 구현하는 중 로그인 버튼 조건부 렌더링을 위해 Header 컴포넌트에서 로그인 정보를 받아오는 과정에서 Header 컴포넌트를 비동기 함수로 만들어야 하는데,

```TS
const Header = async () => {
  const Card = tw.div`
  ml-4 flex h-8 w-24 items-center justify-center rounded-md

  `;

  let session: any = await getServerSession(authOptions);

  return ( ... )
}
```

- 위와 같이 async await을 사용하게되면, 아래와 같이 Header 컴포넌트가 올바른 JSX 형식이 아니라고 나옵니다.

```TS
'Header'은(는) JSX 구성 요소로 사용할 수 없습니다.
  해당 반환 형식 'Promise<Element>'은(는) 유효한 JSX 요소가 아닙니다.
    'Promise<Element>' 형식에 'ReactElement<any, any>' 형식의 type, props, key 속성이 없습니다.ts(2786)
(alias) const Header: () => Promise<JSX.Element>
import Header
```

- 따라서, Header 컴포넌트에서 직접적으로 async await을 사용하지 않고, 아래와 같이 getInitialProps 메서드를 추가하여, Header에서는 session을 props로 받아오게 만들었습니다.

```TS
const Header = ({ session }) => {
...
}


Header.getInitialProps = async () => {
  const session = await getServerSession(authOptions);
  return { session };
};
```

- 그런데 위와 같이 수정하니, session 정보를 받아오기 전에 렌더링이 되어버립니다.
  에러 메세지가 뜨긴 하지만 작동은 하므로 일단 그대로 두겠습니다...

  - Next.js 13의 서버 컴포넌트를 async 함수로 사용하면 JSX가 아닌 Promise를 반환합니다. React 컴포넌트는 JSX만 반환하는 것으로 이해하는 Typescript가 아직 이 케이스를 커버하지 못해서 위와 같은 에러가 발생한다고 합니다. Next.js 팀에서 이미 인지하고 있는 타입스크립트 이슈이고 조만간 해결될 예정이라고 합니다. 따라서, 임시 해결법으로 아래 주석처리를 통해 해당 경고를 무시하겠습니다.

  ```TS
  export default function RootLayout({
  children,
  }: {
  children: React.ReactNode;
  }) {
  return (
    <html lang="en" className="h-screen">
      <body
        className={`flex-col justify-center text-sm font-black ${inter.className}`}
      >
        {/* @ts-expect-error Async Server Component */}
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
  };
  ```

- 로그인 성공 후 user의 image url을 받아와서 next의 Image의 src에 추가하니 아래와 같은 에러가 발생했습니다.

```
Error: Invalid src prop (http://k.kakaocdn.net/dn/cMJqw5/btrLu9LQkAb/kyBJzT0k2VKNVxlfvgFr20/img_640x640.jpg) on `next/image`, hostname "k.kakaocdn.net" is not configured under images in your `next.config.js`
See more info: https://nextjs.org/docs/messages/next-image-unconfigured-host
```

- 위의 에러는 이미지 호스팅을 위해 사용된 호스트가 next.config.js 파일의 이미지 구성에 설정되어 있지 않기 때문에 발생합니다. 따라서 아래와 같이 next.config.js에 'k.kakaocdn.net' 호스트를 추가해주었습니다.

```TS
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['k.kakaocdn.net'],
  },
};

module.exports = nextConfig;
```

- 터미널에서 아래와 같은 경고가 계속 떠서 찾아본 결과, next-auth가 현재 next js 13버전과의 호환이 제대로 되지 않아 경고가 뜨는 것 같습니다. 기능은 정상적으로 작동하고 있고, 안정화되면 사라질 것으로 보입니다.

```
[next-auth][warn][EXPERIMENTAL_API]
`getServerSession` is used in a React Server Component.
```

</details>

<details>

<summary>

## 2023. 5. 28. 프로젝트 4일차

</summary>

### CRUD 구현

- 메인페이지에서 글 목록이 바로 나타날 수 있게 구현하였습니다. 추후에 상태 관리를 통한 필터링을 해주어야하므로 ListItem이라는 클라이언트 컴포넌트를 따로 만들고, 서버에서 글 목록 데이터를 받아온 후, 해당 데이터를 map 메서드를 사용하여 렌더링되게 구현하였습니다.

- 해당 글의 타이틀 클릭 시 id에 맞는 상세페이지로 라우팅하고, url의 parameter에서 글의 id를 가져와 서버에서 해당 id와 일치하는 글의 데이터를 받아와서 렌더링 되게끔 구현하였습니다.

- 글 작성 버튼 클릭 시 글 작성 페이지로 라우팅하고, Form의 내용을 서버로 보내준 다음, 알맞게 입력되었으면 db에 저장하도록 로직을 구현하였습니다.

- 글 수정 버튼 클릭 시 글 작성 페이지로 라우팅하고, 조건부 렌더링을 통해 해당 글의 id와 일치하는 데이터가 있으면 defaultValue를 db에서 받아오게끔 구현하였습니다.

- 글 삭제 버튼 클릭 시 db에서 해당 id와 일치하는 데이터를 삭제하도록 구현하였습니다.

- 현재는 로그인 기능이 없으므로, validation 과정이 빠져있습니다. 로그인 기능 구현 후에는 아래와 같은 기능을 추가할 예정입니다.
  - 글 작성 시 useremail을 데이터에 추가하여 본인이 작성한 글만 수정 및 삭제가 가능토록하여야 합니다.
  - 로그인하지 않았을 경우, 글 작성 및 상세페이지 보기가 불가능하여야 합니다.

</details>

<details>

<summary>

## 2023. 5. 27. 프로젝트 3일차

</summary>

### 카카오 로그인 구현

- 2일차에 벽에 부딪혀 찾아보니 next.js에서는 next auth라는 라이브러리로 Oauth를 통한 로그인 및 사이트 자체의 로그인까지 구현이 가능하다는 걸 알게 되었습니다. 방법은 알았으니 CRUD를 위한 페이지 및 api를 구현한 후 로그인 기능을 구현하여 적용해 보겠습니다.

</details>

<details>

<summary>

## 2023. 5. 26. 프로젝트 2일차

</summary>

### 카카오 로그인 구현

- kakao developers에서 각종 설정을 하여 로그인 버튼 클릭 시 카카오 로그인 페이지로 이동 및 로그인 후 메인페이지로 redirect 되고, qeury parameter로 인가 code를 받아오는 데까지는 성공하였습니다. 그 이후 엑세스 토큰을 받아오는 과정이 정리가 되질 않아서 서버 및 DB를 구축한 후 다시 시도해보겠습니다.

- DB는 mongodb를 사용했습니다. next js는 폴더 구조에서 자동으로 라우팅이 되고, api 라우팅도 되므로 경로만 지정해주면 해당 파일의 함수를 실행시켜 줍니다.

### 글쓰기 페이지 구현

- 글 쓰는 페이지를 구현했습니다. 메인 페이지의 내비게이션 섹션을 가져와서 글 목록으로 돌아가는 버튼을 만들고 메인 섹션에는 form 태그를 사용해서 글제목, 카테고리 radio, 글 내용 input과 전송 버튼을 만들었습니다. 여기서 신기한 점은 form 태그 자체에 flex 속성을 주면 정렬이 안되어서 해결 방법을 찾다가 아래 div 태그로 한 번 더 감싸니 정렬이 되었습니다.

```TS
 <form action="/api/post/create" method="POST">
          <div className="flex flex-col items-center justify-center">
            <input name="title" placeholder="글제목" />
            ...
            <textarea name="content" placeholder="글내용" />
            <button type="submit">제출</button>
          </div>
        </form>
```

</details>

<details>

<summary>

## 2023. 5. 25. 프로젝트 1일차

</summary>

### Header 구현

- 색 조합
  - 애플리케이션의 전체 색상에 일관성을 주기 위해 아래 5개 색상만 사용합니다.
  - <span style="color:#ffffff background: #1976d2">#1976d2</span>
  - <span style="color:#000000 background: #ffffff">#ffffff</span>
  - <span style="color:#000000 background: #e0e0e0">#e0e0e0</span>
  - <span style="color:#ffffff background: #d33131">#d33131</span>
  - <span style="color:#ffffff background: #0a1929">#0a1929</span>
  - 위 색상들을 테일윈드에서 편리하게 사용하기 위해 tailwind.config에 아래와 같이 적용했습니다.
  ```TS
    theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        mooblue: '#1976d2',
        moowhite: '#ffffff',
        moogray: '#e0e0e0',
        moored: '#d33131',
        mooblack: '#0a1929',
      },
    },
  },
  ```
- 테일윈드를 처음으로 사용해보고 있는데 동적 css 적용하기가 너무 복잡해서 포기했습니다. 기존의 css(css module, styled components 포함)에서는 개별 속성별로 props로 내려줄 수 있는데, 테일윈드에서는 그게 불가능합니다. 따라서 전체 css 속성을 객체의 키값쌍으로 저장하고, 저장된 속성을 꺼내서 사용하는데, 이런 방식은 동적으로 사용하는 의미가 많이 퇴색된다고 생각되어서 각각의 요소에 css를 적용하기로 했습니다. _그런데_

  - tailwind-styled-components라는 라이브러리를 통해 테일윈드 css를 styled-components 형식으로 사용할 수 있다는 것을 알았습니다. 따라서 공통 css는 styled-componenets 안에, 개별 css는 tailwind로 사용하였습니다.

  ```TS
  const Card = tw.div`
  ml-4 flex h-8 w-24 items-center justify-center rounded-md
  `;

  <Card className="border border-moogray text-mooblack">어바웃</Card>
  ```

- Header는 View 컴포넌트의 역할을 하기 때문에 서버 컴포넌트로 사용을 하고 싶은데, 로그인 상태에 따라 우측 섹션의 요소들을 조건부 렌더링 해야합니다. 조건부 렌더링을 하려면 useState를 사용해서 상태에 따라 렌더링을 해야할 것 같은데 서버 컴포넌트에서는 useState를 사용할 수 없습니다. 일단 넘어가고 해결하면 다시 작성하겠습니다.
- 로고, 어바웃, 로그인, 로그아웃 버튼에 각각 Link로 알맞은 경로에 라우팅해주었습니다. 후원하기 버튼은 클릭 시 모달을 띄우게 만들 것이므로, 모달 컴포넌트를 만든 후에 연결해주겠습니다.

### Footer 구현

- 기술할만한 것이 없습니다. 어느 페이지에서나 보여야 하므로 Header와 함께 layout에 넣어주었습니다.

### Main 페이지 구현

- 내비게이션 섹션, 메인(게시글 목록) 섹션, 사이드바 섹션으로 구분하였습니다.
- 내비게이션 섹션에는 글 작성 페이지로 라우팅 되는 글쓰기 버튼과, 글 목록을 필터링할 수 있는 버튼이 있습니다.
- 현재는 게시글 데이터가 없으므로 추후 더미 데이터 작성 후 게시글 목록 구현 예정입니다.
- 우측 사이드바에는 배너가 들어갈 예정입니다.

</details>
