'use client';

import axios from 'axios';

const DummyCreater = () => {
  //! 각 키값쌍은 본인 데이터형식에 알맞게 수정하시면 됩니다.
  const data = {
    title: `제주삼다수는 화산암반수입니다. ${Math.floor(Math.random() * 100)}`,
    email: 'antod2981@nate.com', // email은 안쓰시면 삭제하시면 됩니다.
    date: new Date().toLocaleString(),
    author: '박무생',
    stack: 'frontend',
    content:
      '인간이 바이며, 피가 심장은 것이다. 같은 청춘의 할지니, 귀는 내려온 봄바람을 그들은 앞이 설산에서 봄바람이다. 무엇을 되는 용감하고 관현악이며, 때문이다. 못할 끝에 싹이 웅대한 우리는 안고, 투명하되 품고 이상의 이것이다. 가장 너의 있는 있으며, 낙원을 시들어 열락의 교향악이다. 관현악이며, 사랑의 하는 힘차게 놀이 있으랴? 기관과 갑 품에 미묘한 끝에 대고, 보배를 위하여서. 가는 바이며, 이상의 커다란 하는 끝에 희망의 말이다. 이 행복스럽고 생명을 이상의 이것을 이상이 듣는다.',
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

export default DummyCreater;
