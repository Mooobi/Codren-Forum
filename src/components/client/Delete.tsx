'use client';

import axios from 'axios';

const Delete = ({ item }: any) => {
  return (
    <span
      onClick={(e: any) => {
        axios
          .post('api/post/delete', item._id)
          .then((res) => {
            if (res.status === 200) {
              return res.data;
            } else {
              console.log('삭제안됨');
            }
          })
          // .then(() => {
          //   console.log(e.target.parenteElement.parenteElement);
          //   e.target.parentElement.parenteElement.style.opacity = 0;
          //   setTimeout(() => {
          //     e.target.parentElement.parenteElement.style.display =
          //       'none';
          //   }, 1000);
          // })
          .then((data) => {
            console.log(data);
          })
          .catch((err) => {
            console.log(err);
          });
      }}
    >
      🗑️
    </span>
  );
};

export default Delete;
